// 회사 기본 정보 단일 출처.
//  - 푸터(AppFooter), 지도(FbMap), 구조화 데이터(useFbJsonLd), nuxt.config 가 모두 이 파일을 참조합니다.
//  - nuxt.config.ts 에서도 import 하므로 Nuxt 전용 API(useRuntimeConfig 등)를 쓰면 안 됩니다.
//    순수 상수만 두세요.

/** 운영 도메인. canonical · og:url · sitemap 의 기준값입니다. */
export const SITE_URL = 'https://www.fourberry.co.kr'

/** 검색결과·OG 에 노출되는 사이트명 */
export const SITE_NAME = '(주)포베리'

/** <title> 뒤에 붙는 공통 접미사 (nuxt.config 의 titleTemplate 과 동일) */
export const SITE_TITLE_SUFFIX = 'AI 솔루션 & SI 전문 기업 (주)포베리'

/** OG 이미지 기본값 */
export const SITE_OG_IMAGE = '/og/cover.jpg'

export const fbCompany = {
    legalName: '(주)포베리',
    brandName: 'FOURBERRY',
    ceo: '우대식',
    bizNo: '562-88-02654',
    /** 구조화 데이터의 foundingDate 는 ISO 8601. 히어로 섹션의 'Since 2023' 과 같은 값입니다. */
    foundingDate: '2023',
    tel: '010-2755-0650',
    telHref: 'tel:01027550650',
    email: 'fourberry@fourberry.co.kr',
    /** 채용 문의 전용 주소 (FAQ 참조) */
    recruitEmail: 'fourberry@fourberry.co.kr',
    address: {
        postalCode: '07205',
        region: '서울특별시',
        locality: '영등포구',
        street: '양평로 22길 21 코오롱디지털타워 1409호',
        /**
         * Google 비즈니스 프로필에 등록할 주소와 이 문자열을 철자까지 일치시켜야
         * 구조화 데이터와 지역 검색 정보가 같은 업체로 묶입니다.
         */
        full: '서울특별시 영등포구 양평로 22길 21 코오롱디지털타워 1409호',
    },
    /** 사무실 좌표 (선유도 인근). 지도 핀과 구조화 데이터가 같은 값을 씁니다. */
    geo: { lat: 37.5372, lng: 126.8933 },
} as const
