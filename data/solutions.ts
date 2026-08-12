import type { FbFaqItem } from './faq'

// 자체 솔루션 단일 출처.
//  - 원페이지 카드: components/fb/FbSolutions.vue
//  - 상세 페이지: pages/solutions/[slug].vue (검색 노출의 핵심)
//  - 구조화 데이터(SoftwareApplication): composables/useFbJsonLd.ts
//
// ⚠️ 상세 페이지는 본문이 얇으면 구글이 색인조차 하지 않습니다.
//    솔루션을 추가할 때 problems / sections / faq 를 반드시 채워 주세요.
//
// ⚠️ nuxt.config.ts 가 prerender 경로를 만들려고 이 파일을 import 합니다.
//    Nuxt 전용 API 를 쓰면 안 됩니다. 순수 데이터만 두세요.

export interface FbSolutionFeature {
    t: string
    d: string
}

export interface FbSolutionSection {
    h: string
    body: string
}

export interface FbSolution {
    /** URL 경로가 됩니다: /solutions/{slug} */
    slug: string
    name: string
    ko: string
    tag: string
    image: string
    /** 원페이지 카드에 쓰는 짧은 소개 */
    desc: string
    feats: FbSolutionFeature[]

    // ── 상세 페이지 전용 ──
    /** <title> 앞부분. 노리는 검색어를 자연스럽게 포함시킵니다 */
    seoTitle: string
    /** 검색결과에 그대로 노출되는 요약문 (80~120자) */
    seoDescription: string
    /** 상세 페이지 h1 */
    headline: string
    /** SoftwareApplication 구조화 데이터의 applicationCategory */
    category: string
    /** "이런 상황에 필요합니다" — 고객이 검색하게 되는 문제 상황 */
    problems: string[]
    sections: FbSolutionSection[]
    faq: FbFaqItem[]
    /**
     * 구현 기술. 도입 검토 시 "우리 환경에 붙일 수 있나"(필요한 DB·런타임)를 판단하는 근거가 됩니다.
     * 자사 제품이라 실적(data/projects.ts)과 달리 버전 노출 제약은 없지만,
     * 표기를 통일하기 위해 기술명 위주로 적습니다. 비워 두면 섹션이 렌더링되지 않습니다.
     */
    stack?: string[]
    /**
     * 같은 분야의 수행 실적(data/projects.ts 의 id).
     * "이 솔루션을 그 프로젝트에 납품했다"는 뜻이 아니라 "관련 분야 실적"으로 표기합니다.
     */
    relatedProjects?: string[]
}

export const fbSolutions: FbSolution[] = [
    {
        slug: 'coconut',
        name: 'COCONUT',
        ko: '코코넛',
        tag: 'IAM · SSO · OAuth2 / OIDC',
        image: '/images/SSO.png',
        desc: '하나의 계정으로 여러 서비스를 안전하게 이용하는 통합 인증(SSO) 솔루션. OAuth2·OIDC 표준을 준수하며, 멀티테넌트 환경과 2단계 인증(MFA)을 지원합니다.',
        feats: [
            { t: '멀티테넌트', d: '여러 조직을 단일 시스템에서' },
            { t: '표준 인증', d: 'OAuth2 · OIDC 기반 인가 서버' },
            { t: '2단계 인증', d: 'SMS · 이메일 · OTP 앱(TOTP)' },
            { t: '관리자 콘솔', d: '테넌트·클라이언트·이용자 관리' },
        ],
        seoTitle: 'SSO 통합 인증 솔루션 COCONUT (코코넛)',
        seoDescription: 'OAuth2·OIDC 표준을 준수하는 SSO 통합 인증 솔루션 코코넛. 멀티테넌트와 2단계 인증(MFA)을 기본 제공해 여러 서비스에 흩어진 계정을 하나로 묶습니다. 도입 상담 문의를 받습니다.',
        headline: '흩어진 계정을 하나로.\nSSO 통합 인증 솔루션 COCONUT',
        category: 'SecurityApplication',
        problems: [
            '서비스마다 회원 테이블이 따로 있어, 같은 고객이 계정을 여러 개 들고 있습니다.',
            '신규 서비스를 붙일 때마다 로그인·비밀번호 찾기·세션 관리를 처음부터 다시 만듭니다.',
            '보안 요건 때문에 2단계 인증을 넣어야 하는데 서비스별로 각각 구현해야 합니다.',
            '어떤 계정이 어떤 서비스에 접근할 수 있는지 한눈에 파악할 방법이 없습니다.',
        ],
        sections: [
            {
                h: '표준을 지키는 인가 서버',
                body: 'COCONUT은 OAuth2와 OIDC(OpenID Connect — OAuth2 위에 "이 사용자가 누구인지"를 표준화해 얹은 규격)를 준수하는 인가 서버입니다. 표준을 따르기 때문에 이미 검증된 클라이언트 라이브러리를 그대로 쓸 수 있고, 각 서비스는 인증 로직을 직접 구현하는 대신 표준 흐름에 연결만 하면 됩니다. 웹, 모바일 앱, 서버 간 통신 어디에나 같은 방식으로 붙습니다.',
            },
            {
                h: '하나의 시스템에서 여러 조직을 — 멀티테넌트',
                body: '멀티테넌트(하나의 시스템 안에서 여러 조직·브랜드의 데이터를 분리해 운영하는 구조)를 기본 지원합니다. 계열사나 브랜드가 늘어나도 인증 시스템을 새로 구축할 필요 없이 테넌트만 추가하면 됩니다. 테넌트마다 연동 서비스와 정책을 따로 둘 수 있어, 조직별로 다른 로그인 요건을 하나의 시스템에서 수용합니다.',
            },
            {
                h: '2단계 인증(MFA)을 서비스 코드 수정 없이',
                body: 'SMS, 이메일, OTP 앱(TOTP — 30초마다 숫자가 바뀌는 그 인증 앱 방식) 세 가지 2단계 인증을 기본 제공합니다. 각 서비스가 인증 단계를 직접 구현하는 것이 아니라 인가 서버 쪽에서 처리하므로, 보안 요건이 생겼을 때 대응에 드는 개발 기간을 크게 줄일 수 있습니다.',
            },
            {
                h: '관리자 콘솔에서 접근 권한을 한눈에',
                body: '테넌트, 클라이언트(연동된 서비스), 이용자를 한 화면에서 관리합니다. 어떤 서비스가 어떤 권한 범위로 연동돼 있는지, 특정 계정이 어디까지 접근할 수 있는지 확인하고 필요할 때 즉시 차단할 수 있습니다. 계정 관리 업무가 개발 요청 없이 운영 담당자 선에서 끝납니다.',
            },
        ],
        faq: [
            {
                q: '이미 운영 중인 서비스에도 붙일 수 있나요?',
                a: '네. 표준 OAuth2·OIDC 흐름을 따르므로 기존 서비스의 로그인 부분만 교체하는 방식으로 단계적 전환이 가능합니다. 기존 회원 데이터를 어떻게 옮길지는 현재 회원 구조를 확인한 뒤 제안드립니다.',
            },
            {
                q: '2단계 인증은 어떤 방식을 지원하나요?',
                a: 'SMS, 이메일, OTP 앱(TOTP) 세 가지를 지원합니다. 서비스나 테넌트 단위로 적용 여부를 설정할 수 있습니다.',
            },
            {
                q: 'COCONUT만 단독으로 도입할 수 있나요?',
                a: '네. 자체 솔루션은 단독 도입이 가능하며 기존 서비스 구조에 맞춰 연동합니다. 도입 규모와 환경에 따라 맞춤 구성을 안내드립니다.',
            },
        ],
        // 출처: C:\project\coconut (oidc-provider 기반 인가 서버, Prisma + MySQL)
        stack: ['Node.js', 'Express', 'oidc-provider', 'Prisma ORM', 'MySQL', 'bcrypt', 'Swagger (OpenAPI)'],
        relatedProjects: ['withfresh'],
    },
    {
        slug: 'lime',
        name: 'LIME',
        ko: '라임',
        tag: 'Message · Notification · Integration',
        image: '/images/solutions/lime.png',
        desc: 'SMS·알림톡·이메일·푸시를 하나의 API로 통합 발송하는 메시징 플랫폼. 채널마다 따로 연동하지 않고 한 번의 요청으로 처리합니다.',
        feats: [
            { t: '통합 채널', d: 'SMS · LMS · MMS · 알림톡 · 이메일 · 푸시' },
            { t: '단일 API', d: 'API Key 하나로 전 채널 연동' },
            { t: '대량 발송', d: '워커 기반 큐 처리로 안정적' },
            { t: '발송 관리', d: '프로젝트별 채널 설정·발송 이력' },
        ],
        seoTitle: '알림톡·SMS 통합 발송 API 솔루션 LIME (라임)',
        seoDescription:
            'SMS·LMS·MMS·카카오 알림톡·이메일·푸시를 단일 API로 통합 발송하는 메시징 플랫폼 라임. 채널별 개별 연동 없이 API Key 하나로 처리하고, 큐 기반 구조로 대량 발송을 안정적으로 소화합니다.',
        headline: '채널마다 따로 연동하지 마세요.\n통합 메시징 솔루션 LIME',
        category: 'BusinessApplication',
        problems: [
            'SMS 업체, 알림톡 대행사, 이메일 서비스를 각각 연동하느라 개발 기간이 늘어납니다.',
            '채널마다 요청 규격과 응답 형식이 달라 발송 결과를 한 곳에서 볼 수 없습니다.',
            '대량 발송을 시작하면 요청이 몰려 서비스 본체까지 느려집니다.',
            '프로젝트가 늘어날 때마다 같은 발송 코드를 복사해 붙여 쓰고 있습니다.',
        ],
        sections: [
            {
                h: '단일 API로 전 채널 발송',
                body: 'SMS·LMS·MMS, 카카오 알림톡, 이메일, 푸시를 하나의 요청 규격으로 처리합니다. 채널을 바꾸거나 추가할 때 호출하는 쪽 코드는 그대로 두고 설정만 조정하면 됩니다. API Key 하나로 모든 채널이 연결되므로, 신규 프로젝트에 메시징을 붙이는 데 드는 시간이 채널 수와 무관하게 일정합니다.',
            },
            {
                h: '큐 기반 대량 발송 — 서비스 본체에 부하를 주지 않습니다',
                body: '워커(발송 작업을 뒤에서 순서대로 처리하는 별도 프로세스) 기반 큐 구조로 동작합니다. 발송 요청은 즉시 접수 응답을 받고 실제 전송은 워커가 나눠 처리하므로, 대량 발송이 진행되는 동안에도 사용자가 쓰는 화면의 응답 속도가 영향을 받지 않습니다.',
            },
            {
                h: '프로젝트별 채널 설정과 발송 이력',
                body: '프로젝트 단위로 사용할 채널과 발신 정보를 따로 설정합니다. 언제, 어떤 채널로, 어떤 결과로 나갔는지 이력이 남기 때문에 "고객이 문자를 못 받았다"는 문의가 들어왔을 때 채널 단위로 원인을 좁힐 수 있습니다. 여러 서비스를 운영하더라도 발송 현황은 한 곳에서 봅니다.',
            },
            {
                h: '이런 곳에 씁니다',
                body: '주문·배송 상태 알림, 회원가입 및 로그인 인증번호, 예약 확인과 리마인드, 정기 안내 메일처럼 서비스 운영에 반드시 따라붙는 발송을 한 번에 처리합니다. 인증 시스템(COCONUT)과 함께 도입하면 인증번호 발송까지 같은 경로로 이어집니다.',
            },
        ],
        faq: [
            {
                q: '어떤 채널을 지원하나요?',
                a: 'SMS·LMS·MMS 문자, 카카오 알림톡, 이메일, 앱 푸시를 지원합니다. 모두 동일한 API 규격으로 호출합니다.',
            },
            {
                q: '대량으로 보내면 서비스가 느려지지 않나요?',
                a: '워커 기반 큐 구조라 발송 요청과 실제 전송이 분리되어 있습니다. 요청은 즉시 접수 처리되고 전송은 뒤에서 나눠 진행되므로 서비스 응답 속도에 영향을 주지 않습니다.',
            },
            {
                q: 'LIME만 단독으로 도입할 수 있나요?',
                a: '네. 단독 도입이 가능하며 기존 서비스에서 API를 호출하는 방식으로 연동합니다. 도입 규모와 사용할 채널에 따라 구성을 안내드립니다.',
            },
        ],
        // 출처: C:\project\lime (BullMQ + Redis 큐, Knex/Objection + MariaDB, 발송 채널별 어댑터)
        //       및 C:\project\lime\admin-ui (Vue 3 + Element Plus 관리 콘솔)
        stack: [
            'Node.js',
            'Express',
            'BullMQ · Redis (큐)',
            'Knex · Objection.js',
            'MySQL · MariaDB',
            'Firebase Cloud Messaging',
            'Nodemailer',
            'Handlebars',
            'JWT',
            'Vue.js · Element Plus',
            'Docker',
        ],
    },
    {
        slug: 'muscat',
        name: 'MUSCAT',
        ko: '머스캣',
        tag: 'Web Automation · Scraping · Data',
        image: '/images/auto.png',
        desc: 'API를 제공하지 않는 웹사이트의 데이터를 안정적으로 수집하는 웹 스크래핑 솔루션. 모듈화된 아키텍처로 OMS·SCM 연동과 반복 업무를 자동화합니다.',
        feats: [
            { t: '실제 브라우저 기반', d: 'Playwright 엔진으로 안정 수집' },
            { t: '자동 수집', d: '검색결과·상품정보·파일 추출' },
            { t: '프로세스 자동화', d: '로그인부터 다운로드까지' },
            { t: '시스템 연동', d: 'OMS · SCM 데이터 파이프라인' },
        ],
        seoTitle: '웹 스크래핑 · 업무 자동화 솔루션 MUSCAT (머스캣)',
        seoDescription: 'API가 없는 웹사이트의 데이터를 실제 브라우저 기반으로 안정 수집하는 웹 스크래핑 솔루션 머스캣. 로그인부터 파일 다운로드까지 반복 업무를 자동화하고 OMS·SCM으로 연결합니다.',
        headline: 'API가 없어도 데이터는 가져옵니다.\n웹 스크래핑 솔루션 MUSCAT',
        category: 'BusinessApplication',
        problems: [
            '거래처 시스템에 API가 없어 담당자가 매일 로그인해 엑셀을 내려받고 있습니다.',
            '화면 구조가 조금만 바뀌어도 기존 수집 스크립트가 통째로 멈춥니다.',
            '자바스크립트로 그려지는 화면이라 단순 HTML 요청으로는 데이터가 나오지 않습니다.',
            '수집한 데이터를 사내 OMS·SCM에 옮기는 과정이 아직 수작업입니다.',
        ],
        sections: [
            {
                h: '실제 브라우저로 수집합니다',
                body: 'MUSCAT은 Playwright 엔진 기반으로 실제 브라우저를 띄워 동작합니다. 자바스크립트로 그려지는 화면, 로그인이 필요한 페이지, 여러 단계를 거쳐야 나오는 데이터도 사람이 직접 클릭하는 것과 같은 순서로 접근합니다. HTML만 긁어오는 방식보다 대상 사이트의 구현 방식에 덜 흔들립니다.',
            },
            {
                h: '로그인부터 다운로드까지 한 번에',
                body: '로그인, 검색 조건 입력, 결과 조회, 파일 다운로드로 이어지는 절차를 하나의 작업으로 정의해 자동 실행합니다. 검색결과, 상품정보, 첨부파일 추출처럼 매일 반복되는 일을 사람 손을 거치지 않고 정해진 시각에 처리할 수 있습니다.',
            },
            {
                h: '모듈화된 구조 — 한 사이트가 바뀌어도 전체가 멈추지 않습니다',
                body: '대상 사이트별 수집 로직을 모듈로 분리했습니다. 어느 한 곳의 화면이 개편되어도 해당 모듈만 고치면 되고 나머지 수집은 그대로 돌아갑니다. 수집 대상이 늘어날 때도 기존 구조를 건드리지 않고 모듈만 추가합니다. 스크래핑에서 유지보수 비용이 가장 크게 발생하는 지점을 구조로 막아둔 것입니다.',
            },
            {
                h: '수집에서 끝나지 않고 시스템으로 연결합니다',
                body: '수집한 데이터를 OMS·SCM 등 사내 시스템으로 넘기는 파이프라인까지 함께 구성합니다. 수집 — 가공 — 적재가 한 흐름으로 이어지므로 담당자가 중간에 파일을 열어 옮기는 단계가 사라집니다.',
            },
        ],
        faq: [
            {
                q: '로그인이 필요한 사이트도 수집할 수 있나요?',
                a: '네. 실제 브라우저를 사용하므로 로그인 후에만 보이는 화면과 다운로드까지 하나의 작업으로 자동화할 수 있습니다.',
            },
            {
                q: '대상 사이트 화면이 바뀌면 어떻게 되나요?',
                a: '사이트별 수집 로직이 모듈로 분리되어 있어 해당 모듈만 수정하면 됩니다. 다른 사이트 수집은 영향을 받지 않습니다.',
            },
            {
                q: '수집한 데이터를 기존 시스템에 넣는 것까지 가능한가요?',
                a: '네. OMS·SCM 등 사내 시스템으로 넘기는 데이터 파이프라인 구성까지 함께 진행합니다. 대상 시스템의 연동 방식을 확인한 뒤 범위를 제안드립니다.',
            },
        ],
        // 출처: C:\project\fb-scraper (Playwright 엔진 + WebSocket 실시간 제어)
        //       및 C:\project\fb-scraper-manager (Electron + Vue 데스크톱 관리 앱 = "FB매니저")
        stack: ['Node.js', 'Playwright', 'WebSocket', 'Electron (관리 앱)', 'Vue.js', 'SheetJS (xlsx)', 'Winston', 'esbuild'],
        relatedProjects: ['cuckoo'],
    },
]

/** slug 로 솔루션 하나를 찾습니다. 없으면 undefined */
export const findSolution = (slug: string) => fbSolutions.find(s => s.slug === slug)
