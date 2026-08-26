/**
 * 문의 전송 프록시 (Nitro 서버 라우트)
 *
 * ⚠️ 이 라우트는 "서버가 있는" 배포에서만 동작합니다.
 *    - 동작함: nuxt dev / nuxt build + node .output/server/index.mjs / Vercel / Netlify / Cloudflare Pages(Nitro preset)
 *    - 동작 안 함: nuxt generate → GitHub Pages (정적 파일만 올라가므로 /api/contact 가 없음)
 *    현재 저장소의 .github/workflows/deploy.yml 은 GitHub Pages 정적 배포입니다.
 *    자세한 선택지는 nuxt/APPLY-GUIDE.md 의 "문의 전송 경로" 항목을 보세요.
 *
 * 역할
 *  1. 브라우저 → (https, 동일 출처) → Nitro → (http) → 메시지 발송 API
 *     : 브라우저 mixed content 차단을 우회하고
 *  2. X-API-Key 를 클라이언트 번들에서 제거 (서버 전용 환경변수로 이동)
 *  3. 수신자 주소를 서버에서 고정 (프론트에서 임의 변경 불가)
 */

interface Attachment {
    filename: string
    mimeType: string
    content: string // base64
}

interface ContactPayload {
    /** 라임 템플릿 ID. 있으면 템플릿 경로로 보낸다 (제목·본문은 라임에 있음). */
    templateId?: string
    /** 템플릿 변수. templateId 와 짝으로 쓴다. */
    data?: Record<string, unknown>
    /** 구버전 경로: 폼이 HTML 을 직접 만들어 보내던 방식 */
    subject?: string
    content?: string
    attachments?: Attachment[]
}

const MAX_FILES = 5
const MAX_FILE_BYTES = 10 * 1024 * 1024 // 10MB (base64 디코딩 기준 근사)
const MAX_TOTAL_BYTES = 25 * 1024 * 1024

export default defineEventHandler(async event => {
    const config = useRuntimeConfig()
    const body = await readBody<ContactPayload>(event)

    // --- 기본 검증 ---
    //
    // 두 가지 요청 형태를 모두 받는다.
    //  - 템플릿 방식(현재): templateId + data → 제목·본문·레이아웃은 라임이 만든다
    //  - 직접 방식(구버전): subject + content
    //
    // 구버전을 남겨 두는 이유: 정적 사이트라 배포 후에도 브라우저에 옛 JS 가 캐시돼 있을 수
    // 있다. 그때 400 을 내면 그 문의는 그대로 유실된다.
    const useTemplate = Boolean(body?.templateId)
    if (!useTemplate && (!body?.subject || !body?.content)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'templateId 또는 subject+content 가 필요합니다.',
        })
    }

    const attachments = Array.isArray(body.attachments) ? body.attachments : []

    if (attachments.length > MAX_FILES) {
        throw createError({ statusCode: 400, statusMessage: `첨부파일은 최대 ${MAX_FILES}개입니다.` })
    }

    let total = 0
    for (const a of attachments) {
        if (!a?.filename || typeof a.content !== 'string') {
            throw createError({ statusCode: 400, statusMessage: '첨부파일 형식이 올바르지 않습니다.' })
        }
        const bytes = Math.floor((a.content.length * 3) / 4)
        if (bytes > MAX_FILE_BYTES) {
            throw createError({ statusCode: 413, statusMessage: `${a.filename} 이 10MB를 초과합니다.` })
        }
        total += bytes
    }
    if (total > MAX_TOTAL_BYTES) {
        throw createError({ statusCode: 413, statusMessage: '첨부파일 총 용량이 너무 큽니다.' })
    }

    // --- 상위 API 호출 ---
    try {
        const result = await $fetch(`${config.messageApiBase}/api/v1/messages/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': config.messageApiKey,
            },
            body: {
                channel: 'email',
                to: config.contactRecipients, // 서버에서 고정
                ...(useTemplate ? { templateId: body.templateId, data: body.data ?? {} } : { subject: body.subject, content: body.content, data: body.data ?? {} }),
                attachments,
            },
            timeout: 30_000,
        })

        return { ok: true, result }
    } catch (error: any) {
        console.error('[api/contact] 발송 실패:', error?.data ?? error?.message ?? error)
        throw createError({
            statusCode: 502,
            statusMessage: '메일 발송 서버에 전달하지 못했습니다.',
        })
    }
})
