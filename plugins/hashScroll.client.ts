/**
 * 다른 페이지에서 '/#about' 같은 앵커로 이동했을 때 해당 섹션까지 스크롤합니다.
 *
 * 같은 페이지 안에서의 해시 이동('/' 에서 '/#work')은 Nuxt 기본 동작이 처리합니다.
 * 하지만 하위 페이지(/solutions/coconut 등)에서 홈의 앵커로 넘어갈 때는
 * 스크롤 시점에 홈 페이지가 아직 그려지지 않아 대상 요소를 찾지 못하고, 맨 위에 그대로 멈춥니다.
 * (헤더·푸터 메뉴가 전부 '/#...' 형태이므로 이 보정이 없으면 메뉴가 동작하지 않는 것처럼 보입니다)
 *
 * page:finish 는 페이지 컴포넌트 전환이 끝났을 때만 불리므로,
 * 같은 페이지 안에서의 해시 이동과는 겹치지 않습니다.
 *
 * ⚠️ plugins/reveal.ts · countup.ts 와 달리 이 플러그인은 디렉티브가 아니라서
 *    .client 접미사를 붙여도 프리렌더에 영향이 없습니다.
 */
export default defineNuxtPlugin(nuxtApp => {
    const MAX_FRAMES = 30 // 약 0.5초. 이 안에 못 찾으면 포기하고 맨 위에 둡니다.

    const scrollToHash = (hash: string, frame = 0) => {
        let el: Element | null = null
        try {
            el = document.querySelector(hash)
        } catch {
            return // 선택자로 쓸 수 없는 해시는 무시
        }

        if (el) {
            // 사이트 어디에도 부드러운 스크롤을 쓰지 않으므로 기존 앵커 이동과 같이 즉시 이동합니다.
            el.scrollIntoView({ block: 'start', behavior: 'auto' })
            return
        }
        if (frame < MAX_FRAMES) requestAnimationFrame(() => scrollToHash(hash, frame + 1))
    }

    nuxtApp.hook('page:finish', () => {
        const hash = window.location.hash
        if (hash.length > 1) scrollToHash(hash)
    })
})
