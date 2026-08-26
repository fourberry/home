/**
 * 문의 전송 프록시 — Node.js (Express) 버전
 *
 * 카페24 등 자체 https 리눅스 서버에 올려서, GitHub Pages(정적 배포)의 문의 폼이
 * 이 서버를 경유해 발송 API 를 호출하게 합니다.
 *
 *   브라우저(https) → 이 프록시(https) → 발송 API(http)
 *
 * 목적:
 *  - https 사이트에서 http API 직접 호출 시 발생하는 mixed content 차단 해소
 *  - API 키를 서버 환경변수에 두어 클라이언트 번들에서 제거
 *
 * 필요 환경: Node.js 18 이상 (전역 fetch 사용). 배포 절차는 같은 폴더 README.md 참고.
 */

const express = require('express')

const {
    PORT = 8787,
    MESSAGE_API_BASE = 'http://59.15.89.190:8061',
    MESSAGE_API_KEY = '',
    CONTACT_RECIPIENTS = '',
    ALLOWED_ORIGIN = '', // 예: https://www.fourberry.co.kr  (비우면 모든 origin 허용 — 운영 비권장)
} = process.env

const MAX_FILES = 5
const MAX_FILE_BYTES = 10 * 1024 * 1024
const MAX_TOTAL_BYTES = 25 * 1024 * 1024

const app = express()
app.disable('x-powered-by')

// 첨부파일이 base64 로 JSON 에 담겨 오므로 본문 한도를 넉넉히 잡습니다.
app.use(express.json({ limit: '30mb' }))

// ---- CORS ----
app.use((req, res, next) => {
    const origin = req.headers.origin
    const allow = ALLOWED_ORIGIN || '*'
    // ALLOWED_ORIGIN 을 지정했으면 그 origin 만, 아니면 전부 허용
    if (!ALLOWED_ORIGIN || origin === ALLOWED_ORIGIN) {
        res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN || '*')
    }
    res.setHeader('Vary', 'Origin')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Access-Control-Max-Age', '86400')
    if (req.method === 'OPTIONS') return res.status(204).end()
    next()
})

// 헬스체크 (GET) — 브라우저로 열었을 때 살아있는지 확인용
app.get(['/', '/api/contact'], (_req, res) => {
    res.json({ ok: true, service: 'contact-proxy', method: 'POST only for sending' })
})

async function handleContact(req, res) {
    // origin 검증
    if (ALLOWED_ORIGIN) {
        const origin = req.headers.origin
        if (origin && origin !== ALLOWED_ORIGIN) {
            return res.status(403).json({ ok: false, message: 'Forbidden origin' })
        }
    }

    const body = req.body || {}

    // 템플릿 방식(templateId + data)과 구버전 직접 방식(subject + content)을 모두 받는다.
    // 구버전을 남기는 이유: 정적 사이트라 배포 후에도 브라우저에 옛 JS 가 캐시돼 있을 수
    // 있고, 그때 400 을 내면 그 문의가 유실된다.
    const useTemplate = Boolean(body.templateId)
    if (!useTemplate && (!body.subject || !body.content)) {
        return res.status(400).json({ ok: false, message: 'templateId 또는 subject+content 가 필요합니다.' })
    }

    const attachments = Array.isArray(body.attachments) ? body.attachments : []
    if (attachments.length > MAX_FILES) {
        return res.status(400).json({ ok: false, message: `첨부파일은 최대 ${MAX_FILES}개입니다.` })
    }

    let total = 0
    for (const a of attachments) {
        if (!a || !a.filename || typeof a.content !== 'string') {
            return res.status(400).json({ ok: false, message: '첨부파일 형식이 올바르지 않습니다.' })
        }
        const bytes = Math.floor((a.content.length * 3) / 4) // base64 → 대략 바이트
        if (bytes > MAX_FILE_BYTES) {
            return res.status(413).json({ ok: false, message: `${a.filename} 이 10MB를 초과합니다.` })
        }
        total += bytes
    }
    if (total > MAX_TOTAL_BYTES) {
        return res.status(413).json({ ok: false, message: '첨부파일 총 용량이 너무 큽니다.' })
    }

    try {
        const upstream = await fetch(`${MESSAGE_API_BASE}/api/v1/messages/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': MESSAGE_API_KEY,
            },
            body: JSON.stringify({
                channel: 'email',
                to: CONTACT_RECIPIENTS,
                ...(useTemplate ? { templateId: body.templateId, data: body.data ?? {} } : { subject: body.subject, content: body.content, data: body.data ?? {} }),
                attachments,
            }),
        })

        if (!upstream.ok) {
            const text = await upstream.text().catch(() => '')
            console.error('[contact-proxy] upstream error', upstream.status, text)
            return res.status(502).json({ ok: false, message: '메일 발송 서버 오류' })
        }
        return res.json({ ok: true })
    } catch (e) {
        console.error('[contact-proxy] fetch failed', e)
        return res.status(502).json({ ok: false, message: '메일 발송 서버에 전달하지 못했습니다.' })
    }
}

// 프론트가 어느 경로로 붙든 대응되도록 두 경로 모두 받습니다.
app.post(['/', '/api/contact'], handleContact)

app.listen(PORT, () => {
    console.log(`[contact-proxy] listening on :${PORT}`)
    if (!MESSAGE_API_KEY) console.warn('[contact-proxy] 경고: MESSAGE_API_KEY 가 비어 있습니다.')
    if (!CONTACT_RECIPIENTS) console.warn('[contact-proxy] 경고: CONTACT_RECIPIENTS 가 비어 있습니다.')
    if (!ALLOWED_ORIGIN) console.warn('[contact-proxy] 경고: ALLOWED_ORIGIN 미설정 — 모든 origin 허용 상태입니다.')
})
