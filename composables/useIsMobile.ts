import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 모바일 폭 여부. 브랜드 페이지가 "PC 는 그대로, 모바일만 접기·탭 전환" 을 할 때 씁니다.
 *
 *  - SSR 과 첫 렌더에서는 항상 false 입니다. 그래서 정적 HTML 에는 내용이 전부 펼쳐진 채로 들어가고,
 *    JS 가 실패한 브라우저에서도 그대로 보입니다(검색엔진도 같은 HTML 을 봅니다).
 *  - 마운트 뒤 matchMedia 로 판정하고, 창 폭이 바뀌면 다시 계산합니다.
 *
 * ⚠️ 기본값 920px 은 fb-design.css / fb-brand.css 의 모바일 미디어쿼리, useSiteHeader 의
 *    데스크톱 판정 폭과 같은 값이어야 합니다. 한쪽만 바꾸면 접힘 상태와 화면 배치가 어긋납니다.
 */
export const useIsMobile = (query = '(max-width: 920px)') => {
    const isMobile = ref(false)
    let mq: MediaQueryList | null = null
    const update = () => {
        isMobile.value = !!mq?.matches
    }
    onMounted(() => {
        mq = window.matchMedia(query)
        update()
        mq.addEventListener('change', update)
        // 일부 환경(뷰포트 에뮬레이션 등)에서 change 가 오지 않는 경우를 대비한 보조 경로
        window.addEventListener('resize', update, { passive: true })
    })
    onUnmounted(() => {
        mq?.removeEventListener('change', update)
        window.removeEventListener('resize', update)
    })
    return isMobile
}
