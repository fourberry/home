import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 상단 헤더 공통 동작. AppHeader(회사)와 BrandHeader(솔루션 브랜드 페이지)가 같이 씁니다.
 *
 *  - open     : 모바일 메뉴 열림
 *  - scrolled : 8px 이상 스크롤되면 true (헤더 하단선 표시)
 *  - close    : 메뉴 닫기. 메뉴 항목 클릭·ESC·데스크톱 폭 복귀 시 호출
 *
 * ⚠️ 데스크톱 판정 폭(920px)은 fb-design.css 의 미디어쿼리와 같은 값이어야 합니다.
 */
export const useSiteHeader = () => {
    const open = ref(false)
    const scrolled = ref(false)
    const close = () => (open.value = false)

    const onScroll = () => (scrolled.value = window.scrollY > 8)
    const onResize = () => {
        if (window.innerWidth > 920) close()
    }
    const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') close()
    }

    onMounted(() => {
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onResize)
        document.addEventListener('keydown', onKey)
    })
    onUnmounted(() => {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onResize)
        document.removeEventListener('keydown', onKey)
    })

    return { open, scrolled, close }
}
