// v-reveal : 스크롤 진입 시 .in 을 붙여 페이드업. IntersectionObserver 미지원 시 즉시 노출.
//
// 주의: 이 플러그인은 반드시 유니버설(.client 접미사 없음)이어야 합니다.
// 클라이언트 전용으로 두면 프리렌더(npm run generate) 중 v-reveal 이 등록되지 않아
// Vue SSR 이 getSSRProps 를 읽지 못하고 500 으로 죽습니다.
export default defineNuxtPlugin(nuxtApp => {
    let io: IntersectionObserver | null = null
    if (typeof IntersectionObserver !== 'undefined') {
        io = new IntersectionObserver(
            entries => {
                entries.forEach(e => {
                    if (e.isIntersecting) {
                        e.target.classList.add('in')
                        io?.unobserve(e.target)
                    }
                })
            },
            { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
        )
    }

    nuxtApp.vueApp.directive('reveal', {
        // SSR 에서는 아무 속성도 덧붙이지 않습니다.
        // (reveal 클래스를 여기서 심으면 JS 실패 시 opacity:0 으로 영구히 가려집니다)
        getSSRProps() {
            return {}
        },
        mounted(el: HTMLElement) {
            el.classList.add('reveal')
            if (!io) {
                el.classList.add('in')
                return
            }
            io.observe(el)
            // 안전장치: 1.2초 뒤에도 안 보였는데 이미 뷰포트 안이면 강제 노출
            setTimeout(() => {
                if (!el.classList.contains('in') && el.getBoundingClientRect().top < window.innerHeight) {
                    el.classList.add('in')
                }
            }, 1200)
        },
        unmounted(el: HTMLElement) {
            io?.unobserve(el)
        },
    })
})
