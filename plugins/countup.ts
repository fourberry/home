// v-countup : 스크롤 진입 시 숫자가 0에서 최종값까지 올라갑니다.
//
// 주의 1: reveal.ts 와 같은 이유로 반드시 유니버설(.client 접미사 없음)이어야 합니다.
//         클라이언트 전용으로 두면 프리렌더에서 디렉티브가 없어 getSSRProps 로 죽습니다.
//
// 주의 2: 엘리먼트의 첫 숫자 텍스트 노드만 바꿔 씁니다. 덕분에 `15<em>+</em>` 처럼
//         자식 엘리먼트가 섞여 있어도 마크업이 보존됩니다. 대신 Vue 가 소유한
//         보간 텍스트({{ }})를 직접 건드리므로, 대상 값은 재렌더되지 않는
//         정적 데이터여야 합니다(현재 stats 는 모듈 상수라 안전).
//
// SSR HTML 에는 최종값이 들어 있어 JS 가 없거나 실패해도 숫자는 그대로 보입니다.
const DURATION = 1400

export default defineNuxtPlugin(nuxtApp => {
    const reduceMotion =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // 숫자가 들어 있는 첫 번째 직속 텍스트 노드
    function findNumberNode(el: HTMLElement): Text | null {
        for (const node of Array.from(el.childNodes)) {
            if (node.nodeType === Node.TEXT_NODE && /\d/.test(node.nodeValue || '')) {
                return node as Text
            }
        }
        return null
    }

    function run(el: HTMLElement) {
        const node = findNumberNode(el)
        if (!node) return

        const original = node.nodeValue as string
        const match = original.match(/-?\d+(?:\.\d+)?/)
        if (!match) return

        const numText = match[0]
        const target = parseFloat(numText)
        if (!isFinite(target)) return

        const decimals = numText.includes('.') ? numText.split('.')[1].length : 0
        const before = original.slice(0, match.index)
        const after = original.slice((match.index as number) + numText.length)
        const write = (v: number) => {
            node.nodeValue = before + v.toFixed(decimals) + after
        }

        let done = false
        const finish = () => {
            done = true
            node.nodeValue = original // 부동소수 오차 없이 원본 문자열로 복원
        }
        const start = performance.now()

        const step = (now: number) => {
            if (done) return
            const t = Math.min(1, (now - start) / DURATION)
            // easeOutCubic — 끝에서 부드럽게 감속
            write(target * (1 - Math.pow(1 - t, 3)))
            if (t < 1) requestAnimationFrame(step)
            else finish()
        }

        write(0)
        requestAnimationFrame(step)

        // 안전장치: 탭이 백그라운드거나 rAF 가 굶어서 애니메이션이 끝나지 않아도
        // 숫자가 0 으로 남는 일은 없어야 합니다.
        setTimeout(() => {
            if (!done) finish()
        }, DURATION + 400)
    }

    const started = new WeakSet<HTMLElement>()
    let io: IntersectionObserver | null = null
    if (typeof IntersectionObserver !== 'undefined') {
        io = new IntersectionObserver(
            entries => {
                entries.forEach(e => {
                    if (!e.isIntersecting) return
                    const el = e.target as HTMLElement
                    io?.unobserve(el)
                    if (started.has(el)) return
                    started.add(el)
                    run(el)
                })
            },
            { threshold: 0.4 }
        )
    }

    nuxtApp.vueApp.directive('countup', {
        getSSRProps() {
            return {}
        },
        mounted(el: HTMLElement, binding) {
            // v-countup="false" 로 개별 비활성화 (연도·날짜처럼 세면 안 되는 값)
            if (binding.value === false) return
            if (reduceMotion || !io) return // 최종값 그대로 둠

            io.observe(el)

            // 안전장치(reveal.ts 와 동일): IntersectionObserver 가 콜백을 놓치는 환경이
            // 있어서, 1.2초 뒤에도 시작 안 됐는데 이미 화면 안이면 직접 실행합니다.
            setTimeout(() => {
                if (started.has(el)) return
                const r = el.getBoundingClientRect()
                if (r.top < window.innerHeight && r.bottom > 0) {
                    started.add(el)
                    io?.unobserve(el)
                    run(el)
                }
            }, 1200)
        },
        unmounted(el: HTMLElement) {
            io?.unobserve(el)
        },
    })
})
