import { createApp, ref } from 'vue'
import { CHAT_HOST, chatInquiryHref, normalizeChatEndpoint, type ChatHost } from '~/utils/chatHost'

/**
 * 홈페이지 채팅 창(plum 공개 채팅 /webchat/v1)을 띄웁니다.
 *
 * 정적 HTML·SEO 에 아무 흔적도 남기지 않는 것이 원칙입니다(GEO·AEO: 생성 HTML 이 채팅 전과 같아야 함).
 *  - .client 플러그인이라 프리렌더에서는 돌지 않고, 창은 #__nuxt 밖(body 끝)의 별도 Vue 앱으로 그립니다.
 *    레이아웃에 컴포넌트를 넣으면 SSR 이 빈 주석이라도 남기므로 이렇게 둡니다.
 *  - 채팅 주소(runtimeConfig.public.chatEndpoint)가 비면 아무것도 하지 않습니다.
 *  - 페이지를 열 때는 plum 을 부르지 않습니다. 한도 조회는 창을 처음 열 때입니다.
 *  - 버튼 코드는 버튼을 보여 줄 때, 창 코드는 버튼을 처음 누를 때 내려받습니다.
 *    이 파일은 모든 방문자의 첫 화면 번들에 들어가므로 창 쪽 모듈(utils/webchat.ts, useTrackEvent 등)을 import 하지 않습니다.
 *    nuxt.config.ts 의 build:manifest 훅이 채팅 조각을 prefetch 힌트에서 뺍니다.
 *    창 코드(components/chat/)도 페이지와 함께 쓰는 모듈(inquiryAnalytics, useIsMobile 등)을 import 하지 않습니다.
 *    함께 쓰면 그 모듈이 별도 조각으로 갈라져 페이지 HTML 의 modulepreload 가 바뀝니다.
 *
 * ⚠️ 지금은 숨긴 채 내보내는 판입니다. 주소에 chat_preview=1 이 있을 때만 버튼이 보이고,
 *    한 번 보이면 그 탭에서는 페이지를 옮겨도 켜진 채로 둡니다(이 파일의 메모리에만. storage·쿠키 금지).
 *    모두에게 공개할 때는 아래 isPreview 조건만 빼는 작은 PR 로 합니다.
 */
export default defineNuxtPlugin(nuxtApp => {
    const endpoint = normalizeChatEndpoint(useRuntimeConfig().public.chatEndpoint)
    if (!endpoint) return

    const router = useRouter()
    let started = false

    const isPreview = (query: Record<string, unknown>) => query.chat_preview === '1'

    /** 문의 폼 영역에 포커스를 둡니다. 다른 페이지에서 왔으면 홈이 그려질 때까지 잠깐 기다립니다. */
    const focusContact = (scroll: boolean, frame = 0) => {
        const el = document.getElementById('contact')
        if (!el) {
            if (frame < 60) requestAnimationFrame(() => focusContact(scroll, frame + 1))
            return
        }
        // 같은 주소로 다시 누르면 라우터가 움직이지 않으므로 그때만 직접 스크롤합니다.
        if (scroll) el.scrollIntoView({ block: 'start', behavior: 'auto' })
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
        el.focus({ preventScroll: true })
    }

    const openContact = async () => {
        const before = router.currentRoute.value.fullPath
        try {
            await router.push(chatInquiryHref)
        } catch {
            // 이동이 막혀도 아래에서 같은 페이지의 문의 폼을 찾습니다.
        }
        focusContact(router.currentRoute.value.fullPath === before)
    }

    const start = () => {
        started = true
        const brandPage = ref(router.currentRoute.value.meta.layout === 'brand')
        router.afterEach(to => {
            brandPage.value = to.meta.layout === 'brand'
        })
        const host: ChatHost = {
            endpoint,
            brandPage,
            runInNuxt: fn => nuxtApp.runWithContext(fn),
            openContact,
        }
        import('~/components/chat/ChatLauncher.vue')
            .then(({ default: ChatLauncher }) => {
                const el = document.createElement('div')
                el.id = 'fb-chat'
                document.body.appendChild(el)
                createApp(ChatLauncher).provide(CHAT_HOST, host).mount(el)
            })
            .catch(error => console.error('[chat] 채팅 버튼을 불러오지 못했습니다.', error))
    }

    nuxtApp.hook('app:mounted', () => {
        if (isPreview(router.currentRoute.value.query)) start()
        router.afterEach(to => {
            if (!started && isPreview(to.query)) start()
        })
    })
})
