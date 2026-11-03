import { useTrackEvent } from '#imports'
import type { ChatHost } from './chatHost'

/**
 * 채팅 창의 GA 이벤트(docs/ga4-guide.md "채팅 창 이벤트").
 * 매개변수는 고정 값만 넘깁니다. 질문·답 글, IP, 채팅 공개 ID 를 넣지 마세요.
 * 창은 별도 Vue 앱이라 Nuxt 문맥 밖이므로 host.runInNuxt 로 감싸 부릅니다. 창 조각에만 들어갑니다.
 */
type ChatEvent =
    | ['chat_open', { link_location: 'launcher' }]
    | ['chat_message_sent', { turn: number }]
    | ['chat_answer_failed', { error_code: string }]
    | ['chat_contact_click', { link_location: 'chat_panel' }]

export const trackChat = (host: ChatHost, ...[name, params]: ChatEvent) => host.runInNuxt(() => useTrackEvent(name, params))
