import type { InjectionKey, Ref } from 'vue'

/**
 * 채팅 창(components/chat/)이 바깥 페이지에서 받는 것.
 *
 * 창은 정적 HTML 에 흔적을 남기지 않도록 plugins/chat.client.ts 가 body 끝의 별도 Vue 앱으로 띄웁니다.
 * 그래서 창 안에서는 Nuxt 의 useRoute·useTrackEvent·NuxtLink 를 쓰지 못하고, 필요한 것은 이 객체로만 받습니다.
 * 이 파일은 첫 화면 번들에 들어가므로 작게 둡니다(창의 코드는 utils/webchat.ts 와 components/chat/).
 */
export interface ChatHost {
    /** plum 공개 입구 주소: `<plum 공개 주소>/webchat/v1/<공개 ID>` */
    endpoint: string
    /** 지금 페이지가 브랜드 레이아웃인지. 모바일 하단 고정 바를 피해 버튼을 올립니다 */
    brandPage: Ref<boolean>
    /**
     * Nuxt 앱 문맥에서 함수를 돌립니다(nuxtApp.runWithContext). GA 는 utils/chatTrack.ts 가 이것으로 useTrackEvent 를 부릅니다.
     * 플러그인이 useTrackEvent 를 직접 부르면 nuxt-gtag 조각이 첫 화면 번들로 들어가므로 창 쪽에서 부릅니다.
     */
    runInNuxt: <T>(fn: () => T) => T
    /** chatInquiryHref 로 이동하고 문의 폼 영역에 포커스를 둡니다(대화 내용은 옮기지 않음) */
    openContact: () => void
}

export const CHAT_HOST: InjectionKey<ChatHost> = Symbol('fb-chat-host')

/**
 * 채팅 창의 "문의 폼으로" 주소. 내부 이동이라 UTM 없이 고정 값만 붙이고, 제출 시점의 출처 해석은
 * utils/inquiryAnalytics.ts 의 inquiryAttribution 이 합니다(chat / chat_panel). 값을 바꾸면 두 곳을 함께 고칩니다.
 * 여기 두는 까닭: 창 코드가 inquiryAnalytics.ts 를 import 하면 그 파일이 별도 조각으로 갈라져 페이지 HTML 의 preload 가 바뀝니다.
 */
export const chatInquiryHref = '/?inquiry_source=chat&inquiry_location=chat_panel#contact'

/** 끝의 '/' 를 떼고, 쓸 수 없는 값이면 빈 문자열. 빈 문자열이면 채팅을 그리지 않습니다. */
export const normalizeChatEndpoint = (raw: unknown) => {
    const value = typeof raw === 'string' ? raw.trim().replace(/\/+$/, '') : ''
    // 운영은 https 주소, 로컬 시험은 http://localhost·127.0.0.1 이나 같은 사이트의 경로(/dev-webchat/…)만 받습니다.
    if (/^https:\/\/[^/]+\/.+/.test(value) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/.+/.test(value) || /^\/[^/]/.test(value)) return value
    return ''
}
