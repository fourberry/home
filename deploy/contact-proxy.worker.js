/**
 * 문의 전송 프록시 — Cloudflare Worker 버전
 *
 * GitHub Pages(정적 배포)를 그대로 쓰면서 https → http mixed content 문제를 해결하는 방법입니다.
 * Worker 가 브라우저에게는 https 로 응답하고, 내부적으로 http API 를 호출합니다.
 *
 * ── 배포 순서 ─────────────────────────────────────────────
 * 1) https://dash.cloudflare.com → Workers & Pages → Create Worker
 * 2) 이 파일 내용을 붙여넣고 Deploy
 * 3) Settings → Variables and Secrets 에 추가 (Secret 으로)
 *      MESSAGE_API_BASE   = http://59.15.89.190:8061
 *      MESSAGE_API_KEY    = lm_homepage_...(기존 키)
 *      CONTACT_RECIPIENTS = briskly0415@fourberry.co.kr,won567567@fourberry.co.kr,lsj8376@fourberry.co.kr
 *      ALLOWED_ORIGIN     = https://www.fourberry.co.kr
 * 4) 발급된 주소(예: https://fb-contact.<계정>.workers.dev)를
 *    nuxt.config.ts 의 runtimeConfig.public.contactEndpoint 에 넣으세요.
 * ─────────────────────────────────────────────────────────
 */

const MAX_FILES = 5
const MAX_FILE_BYTES = 10 * 1024 * 1024
const MAX_TOTAL_BYTES = 25 * 1024 * 1024

function corsHeaders(origin) {
    return {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
        Vary: 'Origin',
    }
}

function json(data, status, origin) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    })
}

export default {
    async fetch(request, env) {
        const allowed = env.ALLOWED_ORIGIN || '*'

        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: corsHeaders(allowed) })
        }
        if (request.method !== 'POST') {
            return json({ ok: false, message: 'POST only' }, 405, allowed)
        }

        const origin = request.headers.get('Origin')
        if (allowed !== '*' && origin && origin !== allowed) {
            return json({ ok: false, message: 'Forbidden origin' }, 403, allowed)
        }

        let body
        try {
            body = await request.json()
        } catch {
            return json({ ok: false, message: 'Invalid JSON' }, 400, allowed)
        }

        // 템플릿 방식(templateId + data)과 구버전 직접 방식(subject + content)을 모두 받는다.
        // 구버전을 남기는 이유: 정적 사이트라 배포 후에도 브라우저에 옛 JS 가 캐시돼 있을 수
        // 있고, 그때 400 을 내면 그 문의가 유실된다.
        const useTemplate = Boolean(body?.templateId)
        if (!useTemplate && (!body?.subject || !body?.content)) {
            return json({ ok: false, message: 'templateId 또는 subject+content 가 필요합니다.' }, 400, allowed)
        }

        const attachments = Array.isArray(body.attachments) ? body.attachments : []
        if (attachments.length > MAX_FILES) {
            return json({ ok: false, message: `첨부파일은 최대 ${MAX_FILES}개입니다.` }, 400, allowed)
        }

        let total = 0
        for (const a of attachments) {
            if (!a?.filename || typeof a.content !== 'string') {
                return json({ ok: false, message: '첨부파일 형식이 올바르지 않습니다.' }, 400, allowed)
            }
            const bytes = Math.floor((a.content.length * 3) / 4)
            if (bytes > MAX_FILE_BYTES) {
                return json({ ok: false, message: `${a.filename} 이 10MB를 초과합니다.` }, 413, allowed)
            }
            total += bytes
        }
        if (total > MAX_TOTAL_BYTES) {
            return json({ ok: false, message: '첨부파일 총 용량이 너무 큽니다.' }, 413, allowed)
        }

        try {
            const upstream = await fetch(`${env.MESSAGE_API_BASE}/api/v1/messages/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': env.MESSAGE_API_KEY,
                },
                body: JSON.stringify({
                    channel: 'email',
                    to: env.CONTACT_RECIPIENTS,
                    ...(useTemplate ? { templateId: body.templateId, data: body.data ?? {} } : { subject: body.subject, content: body.content, data: body.data ?? {} }),
                    attachments,
                }),
            })

            if (!upstream.ok) {
                const text = await upstream.text()
                console.error('[contact-proxy] upstream error', upstream.status, text)
                return json({ ok: false, message: '메일 발송 서버 오류' }, 502, allowed)
            }

            return json({ ok: true }, 200, allowed)
        } catch (e) {
            console.error('[contact-proxy] fetch failed', e)
            return json({ ok: false, message: '메일 발송 서버에 전달하지 못했습니다.' }, 502, allowed)
        }
    },
}
