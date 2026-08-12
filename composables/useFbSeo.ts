import { SITE_NAME, SITE_OG_IMAGE, SITE_TITLE_SUFFIX, SITE_URL, withSlash } from '~/data/company'

export interface FbSeoOptions {
    /** <title> 앞부분. 뒤에 SITE_TITLE_SUFFIX 가 자동으로 붙습니다. 25~35자 권장 */
    title: string
    /** 검색결과에 그대로 노출되는 요약문. 80~120자 권장 */
    description: string
    /** 슬래시로 시작하는 경로. 홈은 '/'. canonical · og:url 이 여기서 만들어집니다 */
    path: string
    /** OG 이미지 경로. 생략하면 기본 커버 이미지 */
    image?: string
}

/**
 * 페이지별 SEO 메타를 한 번에 설정합니다.
 *
 * canonical(정규 주소 — "이 페이지의 진짜 주소는 여기다"라고 검색엔진에 알리는 태그)을
 * 반드시 페이지마다 다르게 넣어야 합니다. nuxt.config 에 전역으로 두면
 * 모든 페이지가 홈을 가리켜 하위 페이지가 색인에서 통째로 빠집니다.
 */
export const useFbSeo = (opts: FbSeoOptions) => {
    // GitHub Pages 가 실제로 200 을 주는 주소(끝에 슬래시)로 맞춥니다.
    // 슬래시를 빼면 canonical 이 301 되는 주소를 가리키게 되어 신호가 충돌합니다.
    const url = SITE_URL + withSlash(opts.path)
    const image = SITE_URL + (opts.image || SITE_OG_IMAGE)
    const fullTitle = `${opts.title} | ${SITE_TITLE_SUFFIX}`

    useHead({
        title: opts.title,
        link: [{ rel: 'canonical', href: url }],
        meta: [
            { name: 'description', content: opts.description },
            { property: 'og:title', content: fullTitle },
            { property: 'og:description', content: opts.description },
            { property: 'og:url', content: url },
            { property: 'og:image', content: image },
            { property: 'og:site_name', content: SITE_NAME },
            // 트위터/X 카드. og 값을 그대로 재사용합니다.
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: fullTitle },
            { name: 'twitter:description', content: opts.description },
            { name: 'twitter:image', content: image },
        ],
    })
}
