import { createHash, createHmac } from 'node:crypto'
import { defineEventHandler, getMethod, readRawBody, sendStream, setResponseHeaders, setResponseStatus, type H3Event } from 'h3'

/**
 * 로컬 개발(npm run dev)에서만 쓰는 plum /webchat/v1 가짜 응답.
 *
 * nuxt.config.ts 의 $development.serverHandlers 로만 등록되므로 npm run generate·build 결과와 배포에는 들어가지 않습니다.
 * 실제 plum 과 같은 모양(한도 GET, POST …/chat 의 SSE, 오류 JSON, 대화 서명 확인)을 흉내 내 창을 손으로 확인하는 용도입니다.
 * 모델은 부르지 않고 정해진 글을 조각으로 흘려보냅니다. 실제 확인은 plum 의 시험용 웹 채팅 설정으로 합니다(CLAUDE.md "채팅 창").
 *
 * 사용: .env 에 NUXT_PUBLIC_CHAT_ENDPOINT=/dev-webchat/v1/wc_dev00000000000000000 을 넣고 npm run dev,
 *       http://localhost:4000/?chat_preview=1
 *
 * 질문에 아래 표시를 넣으면 그 경우를 흉내 냅니다.
 *   [mock:rate] 429 rate_limit_exceeded(Retry-After 10)   [mock:day] 429 IP 하루 한도(Retry-After 5시간)
 *   [mock:budget] 429 budget_exceeded                      [mock:busy] 503 busy(Retry-After 5)
 *   [mock:model] 503 model_unavailable                     [mock:guardrail] 400 guardrail_blocked
 *   [mock:signature] 400 invalid_signature                 [mock:origin] 403 origin_not_allowed
 *   [mock:notfound] 404 webchat_not_found                  [mock:masked] start 의 masked: true
 *   [mock:error] 답 도중 error 이벤트(model_error)          [mock:cut] 답 도중 done 없이 끊김
 *   [mock:long] finish: length                             [mock:html] HTML·마크다운이 섞인 답(글로만 보이는지 확인)
 *   [mock:wait] 모델 자리 기다림 15초(응답 머리도 오지 않음)   [mock:slow] start 뒤 첫 글자 전 16초(ping 확인)
 *
 * plum 과 같게: start 는 모델 자리를 잡은 뒤에 오고 그 전에는 아무것도 오지 않습니다. ping 은 start 뒤 15초 넘게 비면 옵니다.
 * 글자 수는 NFKC 로 바꾼 글로 셉니다(plum 은 보이지 않는 글자도 빼고 셉니다).
 */

const LIMITS = { max_message_chars: 500, max_turns: 10, max_conversation_chars: 8000 }
const MAX_BODY_BYTES = 128 * 1024
const SIGNATURE_TTL_SECONDS = 24 * 60 * 60
// 가짜 서명용 고정 값입니다. 비밀이 아니며 실제 plum 의 키와 관계없습니다.
const DEV_SIGNING_KEY = 'fourberry-home-dev-mock'

type Message = { role: 'user' | 'assistant'; content: string }

const fail = (event: H3Event, status: number, code: string, message: string, retryAfter?: number) => {
    setResponseStatus(event, status)
    setResponseHeaders(event, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...(retryAfter ? { 'Retry-After': String(retryAfter) } : {}) })
    return { error: { code, message } }
}

const conversationHash = (messages: Message[]) =>
    createHash('sha256')
        .update(JSON.stringify(messages.map(m => ({ content: m.content, role: m.role }))))
        .digest('hex')

const sign = (id: string, messages: Message[], issuedAt = Math.floor(Date.now() / 1000)) => {
    const mac = createHmac('sha256', DEV_SIGNING_KEY)
        .update(`${id}\n${issuedAt}\n${conversationHash(messages)}`)
        .digest('base64url')
    return `${issuedAt}.${mac}`
}

const verify = (id: string, messages: Message[], signature: unknown) => {
    if (typeof signature !== 'string') return false
    const issuedAt = Number(signature.split('.')[0])
    if (!Number.isInteger(issuedAt) || Date.now() / 1000 - issuedAt > SIGNATURE_TTL_SECONDS) return false
    return sign(id, messages, issuedAt) === signature
}

const chatLength = (text: string) => [...text.normalize('NFKC')].length

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const answerFor = (question: string, turn: number) => {
    if (question.includes('[mock:html]')) return '<img src=x onerror="alert(1)"> **굵게** [링크](https://example.com)\n이 줄이 글자 그대로 보이면 정상입니다.'
    return [
        '로컬 개발용 가짜 답입니다. 실제 답은 plum 의 사내 모델이 만듭니다.',
        `받은 질문은 ${chatLength(question)}자이고, 이 대화의 ${turn}번째 질문입니다.`,
        '문의가 필요하면 아래 "문의 폼으로" 버튼을 눌러 주세요.',
    ].join('\n')
}

export default defineEventHandler(async event => {
    const path = new URL(event.path, 'http://dev').pathname
    const match = path.match(/^\/dev-webchat\/v1\/([^/]+)(\/chat)?\/?$/)
    if (!match) return fail(event, 404, 'webchat_not_found', '없는 웹 채팅입니다.')
    const [, id, chat] = match as unknown as [string, string, string | undefined]
    if (!/^wc_[a-z0-9]{20}$/.test(id)) return fail(event, 404, 'webchat_not_found', '없는 웹 채팅입니다.')

    const method = getMethod(event)
    if (method === 'OPTIONS') {
        setResponseStatus(event, 204)
        return ''
    }
    if (!chat) {
        if (method !== 'GET') return fail(event, 405, 'invalid_request', 'GET 만 받습니다.')
        setResponseHeaders(event, { 'Cache-Control': 'max-age=300' })
        return LIMITS
    }
    if (method !== 'POST') return fail(event, 405, 'invalid_request', 'POST 만 받습니다.')
    if (event.headers.get('authorization') || event.headers.get('x-api-key')) return fail(event, 400, 'invalid_request', '키 머리를 보내지 마세요.')

    const raw = (await readRawBody(event, false)) as Buffer | undefined
    if (raw && raw.length > MAX_BODY_BYTES) return fail(event, 413, 'request_too_large', '본문이 너무 큽니다.')
    let body: Record<string, unknown>
    try {
        body = JSON.parse(raw?.toString('utf8') || '')
    } catch {
        return fail(event, 400, 'invalid_request', 'JSON 이 아닙니다.')
    }
    const extra = Object.keys(body ?? {}).filter(key => key !== 'messages' && key !== 'signature')
    if (extra.length) return fail(event, 400, 'invalid_request', `받지 않는 칸: ${extra.join(', ')}`)

    const messages = body.messages as Message[]
    const shapeOk =
        Array.isArray(messages) &&
        messages.length % 2 === 1 &&
        messages.every(
            (m, i) =>
                m && typeof m === 'object' && Object.keys(m).sort().join() === 'content,role' && m.role === (i % 2 ? 'assistant' : 'user') && typeof m.content === 'string' && m.content.trim() !== ''
        )
    if (!shapeOk) return fail(event, 400, 'invalid_request', 'messages 모양이 맞지 않습니다.')

    const userMessages = messages.filter(m => m.role === 'user')
    // plum 처럼 메시지 하나의 길이는 새 질문만 봅니다(앞 질문은 그때 봤고 서명이 지킵니다).
    if (chatLength(messages[messages.length - 1]!.content) > LIMITS.max_message_chars) return fail(event, 400, 'message_too_long', '메시지가 깁니다.')
    if (userMessages.length > LIMITS.max_turns || messages.reduce((sum, m) => sum + chatLength(m.content), 0) > LIMITS.max_conversation_chars) {
        return fail(event, 400, 'conversation_too_long', '대화가 깁니다.')
    }

    const question = messages[messages.length - 1]!.content
    if (messages.length > 1 && (question.includes('[mock:signature]') || !verify(id, messages.slice(0, -1), body.signature))) {
        return fail(event, 400, 'invalid_signature', '대화 서명이 맞지 않습니다.')
    }
    if (question.includes('[mock:notfound]')) return fail(event, 404, 'webchat_not_found', '없는 웹 채팅입니다.')
    if (question.includes('[mock:origin]')) return fail(event, 403, 'origin_not_allowed', '허용하지 않은 origin 입니다.')
    if (question.includes('[mock:rate]')) return fail(event, 429, 'rate_limit_exceeded', '잠시 뒤 다시 보내 주세요.', 10)
    if (question.includes('[mock:day]')) return fail(event, 429, 'rate_limit_exceeded', '오늘 보낼 수 있는 질문을 다 보냈습니다.', 5 * 60 * 60)
    if (question.includes('[mock:budget]')) return fail(event, 429, 'budget_exceeded', '오늘 토큰을 다 썼습니다.', 3 * 60 * 60)
    if (question.includes('[mock:busy]')) return fail(event, 503, 'busy', '자리가 없습니다.', 5)
    if (question.includes('[mock:model]')) return fail(event, 503, 'model_unavailable', '모델 서버에 닿지 않습니다.', 5)
    if (question.includes('[mock:guardrail]')) return fail(event, 400, 'guardrail_blocked', '답할 수 없는 내용입니다.')

    // plum 은 모델 자리를 잡을 때까지(최대 약 40초) 응답 머리도 보내지 않습니다. 자리가 끝내 없으면 503 busy 입니다.
    if (question.includes('[mock:wait]')) await sleep(15_000)
    const answer = answerFor(question, userMessages.length)
    let cancelled = false
    const encoder = new TextEncoder()
    const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
            const write = (text: string) => !cancelled && controller.enqueue(encoder.encode(text))
            const emit = (name: string, data: unknown) => write(`event: ${name}\ndata: ${JSON.stringify(data)}\n\n`)
            emit('start', { masked: question.includes('[mock:masked]') })
            // ping 은 start 뒤 15초 넘게 비면 옵니다(plum 계약).
            await sleep(question.includes('[mock:slow]') ? 16_000 : 400)
            if (question.includes('[mock:slow]')) write(': ping\n\n')
            const pieces = [...answer]
            let sent = ''
            for (let i = 0; i < pieces.length && !cancelled; i += 4) {
                const piece = pieces.slice(i, i + 4).join('')
                sent += piece
                emit('delta', { text: piece })
                await sleep(35)
                if (i > 20 && question.includes('[mock:error]')) {
                    emit('error', { code: 'model_error', message: '모델이 답하지 못했습니다.' })
                    return controller.close()
                }
                if (i > 20 && question.includes('[mock:cut]')) return controller.close()
            }
            if (cancelled) return
            emit('done', { finish: question.includes('[mock:long]') ? 'length' : 'stop', signature: sign(id, [...messages, { role: 'assistant', content: sent }]) })
            controller.close()
        },
        cancel() {
            cancelled = true
        },
    })
    setResponseStatus(event, 200)
    setResponseHeaders(event, { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no' })
    return sendStream(event, stream)
})
