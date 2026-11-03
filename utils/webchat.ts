/**
 * plum 공개 채팅 입구(/webchat/v1)와 주고받는 코드.
 *
 * 계약의 정본은 plum 저장소 docs/plans/iteration-18-public-chat.md 의
 * "공개 입구 /webchat/v1"·"대화 서명"·"홈페이지 채팅 창 계약" 절입니다. 모양을 바꾸려면 그쪽이 먼저입니다.
 *
 *  - 늘 스트림이고 요청의 맨 위 칸은 messages 와 signature 뿐입니다(다른 칸은 400).
 *  - 쿠키·인증 머리를 보내지 않습니다(credentials: 'omit'). 키를 브라우저에 넣지 않습니다.
 *  - 대화는 부르는 쪽이 페이지 메모리에만 둡니다. 이 파일은 아무것도 저장하지 않습니다.
 *
 * ChatPanel 만 이 파일을 씁니다. 창을 처음 열 때 함께 내려받으므로 첫 화면 번들에는 들어가지 않습니다.
 */

export interface ChatLimits {
    max_message_chars: number
    max_turns: number
    max_conversation_chars: number
}

export interface ChatMessage {
    role: 'user' | 'assistant'
    content: string
}

export interface ChatAnswer {
    text: string
    finish: 'stop' | 'length'
    signature: string
}

/** 계약의 오류 표와 error 이벤트의 코드 */
const CONTRACT_CODES = [
    'webchat_not_found',
    'origin_not_allowed',
    'invalid_request',
    'message_too_long',
    'conversation_too_long',
    'invalid_signature',
    'guardrail_blocked',
    'request_too_large',
    'rate_limit_exceeded',
    'budget_exceeded',
    'busy',
    'model_unavailable',
    'model_error',
    'timeout',
] as const

/**
 * 창이 붙이는 코드. 계약 표에 없는 실패를 GA 에 고정 값으로 남기기 위한 것입니다.
 *  - network_error: fetch 자체가 실패(네트워크, CORS 머리 없는 404 포함 — 브라우저는 둘을 구분하지 못합니다)
 *  - incomplete: 200 으로 시작했지만 done 없이 끝났거나 오래 아무것도 오지 않음
 *  - unknown: 모르는 코드나 모양
 */
export type ChatErrorCode = (typeof CONTRACT_CODES)[number] | 'network_error' | 'incomplete' | 'unknown'

export class ChatError extends Error {
    constructor(
        public code: ChatErrorCode,
        /** Retry-After(초). 없으면 0 */
        public retryAfter = 0
    ) {
        super(code)
        this.name = 'ChatError'
    }
}

/** 길이는 유니코드 코드 포인트로 셉니다(계약). 한글·이모지가 UTF-16 길이와 다르게 세지지 않도록. */
export const codePoints = (text: string) => [...text].length

const IDLE_TIMEOUT_MS = 60_000 // ping 이 15초마다 오므로 60초 동안 아무것도 없으면 끊긴 것으로 봅니다.

const isContractCode = (code: unknown): code is (typeof CONTRACT_CODES)[number] => typeof code === 'string' && (CONTRACT_CODES as readonly string[]).includes(code)

const parseRetryAfter = (value: string | null) => {
    if (!value) return 0
    const seconds = Number(value)
    if (Number.isFinite(seconds)) return Math.max(0, Math.ceil(seconds))
    const date = Date.parse(value)
    return Number.isNaN(date) ? 0 : Math.max(0, Math.ceil((date - Date.now()) / 1000))
}

/** 시작 전 오류(JSON `{"error": {"code", "message"}}`)를 코드로. 본문을 읽지 못하면 HTTP 상태로 짐작합니다. */
const errorFromResponse = async (res: Response) => {
    const retryAfter = parseRetryAfter(res.headers.get('Retry-After'))
    let code: unknown
    try {
        code = ((await res.json()) as { error?: { code?: unknown } })?.error?.code
    } catch {
        code = undefined
    }
    if (isContractCode(code)) return new ChatError(code, retryAfter)
    const byStatus: Record<number, ChatErrorCode> = { 404: 'webchat_not_found', 403: 'origin_not_allowed', 413: 'request_too_large', 429: 'rate_limit_exceeded', 503: 'busy' }
    return new ChatError(byStatus[res.status] ?? 'unknown', retryAfter)
}

const isAbort = (error: unknown) => error instanceof DOMException && error.name === 'AbortError'

const isLimit = (value: unknown) => Number.isInteger(value) && (value as number) > 0

/** 창을 열 때 한 번. 한도만 돌려받습니다(IP 한도에 세지 않음). */
export const fetchChatLimits = async (endpoint: string, signal?: AbortSignal): Promise<ChatLimits> => {
    let res: Response
    try {
        res = await fetch(endpoint, { method: 'GET', mode: 'cors', credentials: 'omit', signal })
    } catch (error) {
        if (isAbort(error)) throw error
        throw new ChatError('network_error')
    }
    if (!res.ok) throw await errorFromResponse(res)
    let body: Partial<ChatLimits>
    try {
        body = await res.json()
    } catch {
        throw new ChatError('unknown')
    }
    if (!isLimit(body.max_message_chars) || !isLimit(body.max_turns) || !isLimit(body.max_conversation_chars)) throw new ChatError('unknown')
    return { max_message_chars: body.max_message_chars!, max_turns: body.max_turns!, max_conversation_chars: body.max_conversation_chars! }
}

interface SseEvent {
    event: string
    data: string
}

/** SSE 한 덩어리(빈 줄로 나뉜 부분)를 읽습니다. ':' 로 시작하는 줄(ping)은 버립니다. */
const parseSseBlock = (block: string): SseEvent | null => {
    let event = 'message'
    const data: string[] = []
    for (const line of block.split('\n')) {
        if (!line || line.startsWith(':')) continue
        const colon = line.indexOf(':')
        const field = colon < 0 ? line : line.slice(0, colon)
        const value = colon < 0 ? '' : line.slice(colon + 1).replace(/^ /, '')
        if (field === 'event') event = value
        else if (field === 'data') data.push(value)
    }
    return data.length ? { event, data: data.join('\n') } : null
}

export interface ChatStreamHandlers {
    /** start 이벤트. masked 가 true 면 가드레일이 방문자 글의 일부를 가렸습니다 */
    onStart?: (masked: boolean) => void
    /** 답 조각. 받은 순서대로 이어 붙입니다 */
    onDelta?: (text: string) => void
}

/**
 * 질문 하나를 보내고 답을 스트림으로 받습니다.
 * done 을 받아야만 성공입니다. error 이벤트나 done 없는 끝은 ChatError 로 던지고, 받은 조각은 부르는 쪽이 버립니다.
 */
export const sendChatMessage = async (endpoint: string, messages: ChatMessage[], signature: string, handlers: ChatStreamHandlers, signal: AbortSignal): Promise<ChatAnswer> => {
    // 첫 질문에는 signature 칸이 없습니다. 그 뒤로는 바로 앞 done 의 값입니다.
    const body = signature ? { messages, signature } : { messages }
    let res: Response
    try {
        res = await fetch(`${endpoint}/chat`, {
            method: 'POST',
            mode: 'cors',
            credentials: 'omit',
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            signal,
        })
    } catch (error) {
        if (isAbort(error)) throw error
        throw new ChatError('network_error')
    }
    if (!res.ok) throw await errorFromResponse(res)
    if (!res.body) throw new ChatError('incomplete')

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let text = ''
    let idleTimer: ReturnType<typeof setTimeout> | undefined
    let idle = false
    const armIdle = () => {
        clearTimeout(idleTimer)
        idleTimer = setTimeout(() => {
            idle = true
            reader.cancel().catch(() => {})
        }, IDLE_TIMEOUT_MS)
    }

    const handle = (evt: SseEvent): ChatAnswer | null => {
        let data: Record<string, unknown>
        try {
            data = JSON.parse(evt.data)
        } catch {
            if (['start', 'delta', 'done', 'error'].includes(evt.event)) throw new ChatError('unknown')
            return null
        }
        if (evt.event === 'start') handlers.onStart?.(data.masked === true)
        else if (evt.event === 'delta') {
            if (typeof data.text !== 'string') throw new ChatError('unknown')
            text += data.text
            handlers.onDelta?.(data.text)
        } else if (evt.event === 'done') {
            if (typeof data.signature !== 'string' || !data.signature) throw new ChatError('unknown')
            return { text, finish: data.finish === 'length' ? 'length' : 'stop', signature: data.signature }
        } else if (evt.event === 'error') {
            const code = data.code
            throw new ChatError(code === 'busy' || code === 'model_error' || code === 'timeout' ? code : 'unknown')
        }
        // 모르는 이벤트는 무시합니다(계약이 더해질 때 옛 창이 깨지지 않도록).
        return null
    }

    try {
        armIdle()
        for (;;) {
            let chunk: ReadableStreamReadResult<Uint8Array>
            try {
                chunk = await reader.read()
            } catch (error) {
                if (signal.aborted) throw new DOMException('Aborted', 'AbortError')
                throw new ChatError(idle ? 'incomplete' : 'network_error')
            }
            if (chunk.done) break
            armIdle()
            buffer += decoder.decode(chunk.value, { stream: true })
            // 줄 끝은 \r\n, \r, \n 모두 올 수 있습니다. 조각 끝의 \r 은 다음 조각의 \n 과 짝일 수 있어 남겨 둡니다.
            const tail = buffer.endsWith('\r') ? '\r' : ''
            buffer = (tail ? buffer.slice(0, -1) : buffer).replace(/\r\n?/g, '\n') + tail
            let at: number
            while ((at = buffer.indexOf('\n\n')) >= 0) {
                const block = buffer.slice(0, at)
                buffer = buffer.slice(at + 2)
                const evt = parseSseBlock(block)
                const answer = evt && handle(evt)
                if (answer) {
                    reader.cancel().catch(() => {})
                    return answer
                }
            }
        }
        if (signal.aborted) throw new DOMException('Aborted', 'AbortError')
        throw new ChatError('incomplete')
    } finally {
        clearTimeout(idleTimer)
    }
}
