import { SITE_NAME, SITE_URL, fbCompany } from '~/data/company'
import type { FbFaqItem } from '~/data/faq'
import type { FbSolution } from '~/data/solutions'

type JsonLdNode = Record<string, unknown>

/**
 * JSON-LD(검색엔진이 읽는 기계용 요약 데이터. 사람 눈에는 보이지 않습니다)를
 * <head> 에 <script type="application/ld+json"> 로 심습니다.
 *
 * 한 페이지에 여러 번 호출해도 됩니다 (Organization + BreadcrumbList 처럼).
 * key 를 주지 않으므로 unhead 가 합치지 않고 각각 출력합니다.
 */
export const useFbJsonLd = (nodes: JsonLdNode | JsonLdNode[]) => {
    const list = Array.isArray(nodes) ? nodes : [nodes]
    useHead({
        script: list.map(node => ({
            type: 'application/ld+json',
            // '<' 를 이스케이프해 본문에 </script> 가 섞여도 태그가 조기 종료되지 않게 합니다.
            innerHTML: JSON.stringify(node).replace(/</g, '\\u003C'),
        })),
    })
}

/** 회사 정보. 모든 페이지 공통(layouts/default.vue)에 심습니다. */
export const orgJsonLd = (): JsonLdNode => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: fbCompany.brandName,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    image: `${SITE_URL}/og/cover.jpg`,
    email: fbCompany.email,
    telephone: fbCompany.tel,
    foundingDate: fbCompany.foundingDate,
    founder: { '@type': 'Person', name: fbCompany.ceo },
    address: {
        '@type': 'PostalAddress',
        addressCountry: 'KR',
        addressRegion: fbCompany.address.region,
        addressLocality: fbCompany.address.locality,
        streetAddress: fbCompany.address.street,
        postalCode: fbCompany.address.postalCode,
    },
    // Google 비즈니스 프로필에 등록한 주소와 위 address 를 철자까지 맞춰야
    // 두 정보가 같은 업체로 묶입니다.
    geo: {
        '@type': 'GeoCoordinates',
        latitude: fbCompany.geo.lat,
        longitude: fbCompany.geo.lng,
    },
    contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: fbCompany.tel,
        email: fbCompany.email,
        areaServed: 'KR',
        availableLanguage: ['Korean'],
    },
})

/** 사이트 자체. 홈에만 심습니다. */
export const webSiteJsonLd = (): JsonLdNode => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'ko-KR',
    publisher: { '@id': `${SITE_URL}/#organization` },
})

/**
 * 자주 묻는 질문.
 *
 * ⚠️ 기대치: FAQ 리치 결과(검색 결과에 질문이 펼쳐 보이는 것)는 구글이 2023년에
 * 정부·의료 사이트로 제한해서 일반 기업 사이트에는 거의 표시되지 않습니다.
 * 그래도 페이지 주제를 정확히 전달하는 값어치가 있어 넣습니다.
 * 반드시 화면에 실제로 보이는 질문/답변과 같아야 합니다(다르면 스팸으로 판단됩니다).
 */
export const faqJsonLd = (items: FbFaqItem[]): JsonLdNode => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
})

/** 빵부스러기 경로(홈 > 솔루션 > COCONUT). items 의 path 는 슬래시로 시작 */
export const breadcrumbJsonLd = (items: { name: string; path: string }[]): JsonLdNode => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: item.path === '/' ? SITE_URL : SITE_URL + item.path,
    })),
})

/** 자체 솔루션(소프트웨어 제품) */
export const solutionJsonLd = (s: FbSolution): JsonLdNode => ({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: s.name,
    alternateName: s.ko,
    applicationCategory: s.category,
    operatingSystem: 'Web',
    description: s.seoDescription,
    url: `${SITE_URL}/solutions/${s.slug}`,
    image: SITE_URL + s.image,
    featureList: s.feats.map(f => `${f.t}: ${f.d}`),
    provider: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'ko-KR',
})

/** 제공 서비스(SI 구축 · SM 운영 등) */
export const serviceJsonLd = (opts: { name: string; description: string; path: string; serviceType: string }): JsonLdNode => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    serviceType: opts.serviceType,
    url: SITE_URL + opts.path,
    areaServed: { '@type': 'Country', name: '대한민국' },
    provider: { '@id': `${SITE_URL}/#organization` },
})
