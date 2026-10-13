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
 *      CONTACT_RECIPIENTS = damon@fourberry.co.kr,briskly0415@fourberry.co.kr,dodam@fourberry.co.kr,hjyoon@fourberry.co.kr,hahahagh@fourberry.co.kr,jmchoi@fourberry.co.kr,won567567@fourberry.co.kr,lsj8376@fourberry.co.kr
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

/**
 * 라임 v2 발송 요청 본문을 만든다.
 *
 * 프론트가 보내는 형식(templateId+data / subject+content)은 그대로 받고, 여기서만 v2 로 바꾼다.
 * v2 는 정의되지 않은 필드가 하나라도 있으면 400 이므로 옛 필드(templateId·data·subject)를 그대로 넘기면 안 된다.
 * 문의 메일은 회사 담당자에게 가는 업무 알림이라 발송 목적은 항상 transactional 이다.
 */
function buildLimeRequest(body, useTemplate, to, attachments) {
    return {
        channel: 'email',
        to,
        messagePurpose: 'transactional',
        ...(useTemplate ? { template: { id: body.templateId, variables: body.data ?? {} } } : { content: { subject: body.subject, body: body.content } }),
        // 첨부도 정의된 필드만 넘긴다 (모르는 필드가 섞이면 400).
        attachments: attachments.map(a => ({ filename: a.filename, mimeType: a.mimeType, content: a.content })),
    }
}

/** v2 오류 봉투 { success:false, error:{ code, message } } 에서 코드·메시지를 꺼낸다. message 는 문자열 배열일 수 있다. */
function limeError(envelope) {
    const error = envelope?.error ?? {}
    const message = Array.isArray(error.message) ? error.message.join('; ') : error.message
    return { code: error.code ?? 'UNKNOWN', message: message ?? '응답 본문 없음' }
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
            const upstream = await fetch(`${env.MESSAGE_API_BASE}/api/v2/messages/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': env.MESSAGE_API_KEY,
                },
                body: JSON.stringify(buildLimeRequest(body, useTemplate, env.CONTACT_RECIPIENTS, attachments)),
            })

            const envelope = await upstream.json().catch(() => null)
            if (!upstream.ok || envelope?.success !== true) {
                const { code, message } = limeError(envelope)
                console.error('[contact-proxy] upstream error', upstream.status, code, message)
                // 503 은 라임이 큐에 넣지 못한 경우라 다시 시도하면 될 수 있다.
                if (upstream.status === 503) return json({ ok: false, message: '메일 발송 서버가 잠시 응답하지 않습니다. 잠시 후 다시 시도해 주세요.' }, 503, allowed)
                return json({ ok: false, message: '메일 발송 서버 오류' }, 502, allowed)
            }

            return json({ ok: true, messageId: envelope.data?.messageId }, 200, allowed)
        } catch (e) {
            console.error('[contact-proxy] fetch failed', e)
            return json({ ok: false, message: '메일 발송 서버에 전달하지 못했습니다.' }, 502, allowed)
        }
    },
}
