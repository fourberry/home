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

    // --- 상위 API 호출 (라임 v2) ---
    let response
    try {
        response = await $fetch.raw<LimeEnvelope>(`${config.messageApiBase}/api/v2/messages/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': config.messageApiKey,
            },
            body: buildLimeRequest(body, useTemplate, config.contactRecipients, attachments), // 수신자는 서버에서 고정
            timeout: 30_000,
            // 4xx/5xx 도 v2 오류 봉투를 읽어야 하므로 예외로 바꾸지 않는다.
            ignoreResponseError: true,
        })
    } catch (error: any) {
        console.error('[api/contact] 발송 서버 연결 실패:', error?.message ?? error)
        throw createError({
            statusCode: 502,
            statusMessage: '메일 발송 서버에 전달하지 못했습니다.',
        })
    }

    const envelope = response._data
    if (!response.ok || envelope?.success !== true) {
        const { code, message } = limeError(envelope)
        console.error('[api/contact] 발송 실패:', response.status, code, message)
        // 503 은 라임이 큐에 넣지 못한 경우라 다시 시도하면 될 수 있다.
        throw createError(
            response.status === 503
                ? { statusCode: 503, statusMessage: '메일 발송 서버가 잠시 응답하지 않습니다. 잠시 후 다시 시도해 주세요.' }
                : { statusCode: 502, statusMessage: '메일 발송 서버 오류' }
        )
    }

    return { ok: true, messageId: envelope.data?.messageId }
})

/** 라임 v2 응답 봉투. 성공은 { success:true, data }, 실패는 { success:false, error:{ code, message } } */
interface LimeEnvelope {
    success?: boolean
    data?: { messageId?: string; status?: string }
    error?: { code?: string; message?: string | string[] }
}

/**
 * 라임 v2 발송 요청 본문을 만든다.
 *
 * 프론트가 보내는 형식(templateId+data / subject+content)은 그대로 받고, 여기서만 v2 로 바꾼다.
 * v2 는 정의되지 않은 필드가 하나라도 있으면 400 이므로 옛 필드(templateId·data·subject)를 그대로 넘기면 안 된다.
 * 문의 메일은 회사 담당자에게 가는 업무 알림이라 발송 목적은 항상 transactional 이다.
 */
function buildLimeRequest(body: ContactPayload, useTemplate: boolean, to: string, attachments: Attachment[]) {
    return {
        channel: 'email',
        to,
        messagePurpose: 'transactional',
        ...(useTemplate ? { template: { id: body.templateId, variables: body.data ?? {} } } : { content: { subject: body.subject, body: body.content } }),
        // 첨부도 정의된 필드만 넘긴다 (모르는 필드가 섞이면 400).
        attachments: attachments.map(a => ({ filename: a.filename, mimeType: a.mimeType, content: a.content })),
    }
}

/** v2 오류 봉투에서 코드·메시지를 꺼낸다. message 는 문자열 배열일 수 있다. */
function limeError(envelope: LimeEnvelope | string | undefined) {
    const error = typeof envelope === 'object' ? (envelope?.error ?? {}) : {}
    const message = Array.isArray(error.message) ? error.message.join('; ') : error.message
    return { code: error.code ?? 'UNKNOWN', message: message ?? '응답 본문 없음' }
}
