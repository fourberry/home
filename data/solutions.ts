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

/**
 * 브랜드 페이지(layouts/brand.vue) 전용 색상.
 * fb-design.css 의 :root 변수와 같은 이름을 페이지 래퍼에서 덮어씁니다.
 * 이 값이 있는 솔루션만 pages/solutions/{slug}.vue 정적 페이지가 브랜드 레이아웃을 씁니다.
 */
export interface FbSolutionBrand {
    /** 주 색상(--accent). 버튼·강조·eyebrow */
    accent: string
    /** 버튼 hover 색 */
    accentHover: string
    /** 밝은 보조 색(--accent-lite) */
    accentLite: string
    /** 어두운 섹션 배경(--ink-bg) */
    inkBg: string
    /** 어두운 섹션 카드(--ink-surface) */
    inkSurface: string
    /** 어두운 섹션 강조(--ink-accent) */
    inkAccent: string
    /** 어두운 섹션 보조 글자(--ink-fg2) */
    inkFg2: string
    /** 헤더·푸터에 쓰는 심볼 이미지 경로 */
    mark: string
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
    /** 이름의 유래 한 줄. 브랜드 페이지 히어로의 이름 바로 아래에 보입니다. 비우면 표시하지 않습니다 */
    nameOrigin?: string
    /** 브랜드 페이지 색상. 없으면 pages/solutions/[slug].vue 의 공통 상세 페이지를 씁니다 */
    brand?: FbSolutionBrand
}

export const fbSolutions: FbSolution[] = [
    {
        slug: 'coconut',
        name: 'COCONUT',
        ko: '코코넛',
        tag: 'IAM · SSO · OAuth2 / OIDC',
        // 홈·목록 카드용 사진. 브랜드 페이지의 OG 이미지는 data/coconut.ts 의 coconutOgImage 가 따로 담당합니다.
        image: '/images/SSO.png',
        desc: 'OAuth2·OIDC 기반으로 여러 서비스의 인증을 연결하고, 2단계 인증(MFA)·계정 정책·로그인 이력을 중앙에서 관리하는 통합 인증(SSO) 솔루션입니다.',
        feats: [
            { t: '멀티테넌트', d: '여러 조직을 단일 시스템에서' },
            { t: '표준 인증', d: 'OAuth2 · OIDC 기반 인가 서버' },
            { t: '2단계 인증', d: 'SMS · 이메일 · OTP 앱(TOTP)' },
            { t: '관리자 콘솔', d: '테넌트·클라이언트·이용자 관리' },
        ],
        seoTitle: 'SSO 통합 인증 솔루션 COCONUT (코코넛)',
        seoDescription: 'OAuth2·OIDC 기반 SSO 통합 인증 솔루션 코코넛. 계정 관리, MFA, 서비스별 로그인 화면과 감사 이력을 제공합니다. 연동 지원 범위와 기존 계정 전환·운영 조건을 확인하세요.',
        headline: '흩어진 계정을 하나로.\nSSO 통합 인증 솔루션 COCONUT',
        category: 'SecurityApplication',
        problems: [
            '서비스마다 회원 테이블이 따로 있어, 같은 고객이 계정을 여러 개 들고 있습니다.',
            '신규 서비스를 붙일 때마다 로그인·비밀번호 찾기·세션 관리를 처음부터 다시 만듭니다.',
            '보안 요건 때문에 2단계 인증을 넣어야 하는데 서비스별로 각각 구현해야 합니다.',
            '계정 상태와 로그인 이력을 서비스마다 따로 확인하고 있습니다.',
        ],
        sections: [
            {
                h: '서비스에 맞는 표준 인증 연동',
                body: 'COCONUT은 OAuth2·OIDC 기반 인가 서버입니다. 웹·앱 사용자 로그인과 서버 간 API 인증을 구분해 구성합니다. 연동 서비스는 로그인 응답과 토큰을 검증하고 자체 세션, 업무·데이터 권한을 적용합니다.',
            },
            {
                h: '조직별 계정과 운영 범위 구분',
                body: '테넌트는 고객사를, 클라이언트는 인증을 연결하는 서비스를 구분합니다. 관리자는 부여된 역할과 범위에 따라 사용자·연동 서비스·정책을 관리합니다. 다른 테넌트의 계정이 자동 통합되는 구조는 아닙니다.',
            },
            {
                h: '인증 정책과 로그인 화면 관리',
                body: '표준 로그인 연동 후 SMS·이메일·OTP 앱 기반 MFA와 지원하는 인증 정책을 서비스별로 구성합니다. 서비스의 로고·색상·문구를 로그인 화면에 반영하고 관리자 콘솔에서 확인할 수 있습니다.',
            },
            {
                h: '계정 상태와 인증 세션 관리',
                body: '코코넛의 계정 상태·인증 세션과 로그인 이력을 관리합니다. 외부 서비스의 기존 로그인 세션까지 종료하려면 해당 서비스가 웹훅 이벤트를 받아 자체 세션에 반영해야 합니다. 차단 시점과 이벤트 누락 시 동작은 연동 시 검증합니다.',
            },
        ],
        faq: [
            {
                q: '기존 회원과 비밀번호를 그대로 옮길 수 있나요?',
                a: '기존 회원 식별자, 중복 계정, 업무 데이터 연결과 비밀번호 저장 방식을 먼저 확인합니다. 이전 가능 여부와 비밀번호 재설정 필요성을 검토한 뒤 시범 연동, 단계적 전환과 원복 조건을 정합니다. 모든 계정의 자동 이전을 전제로 하지는 않습니다.',
            },
            {
                q: '한 번 로그인하면 모든 서비스에 바로 접속되나요?',
                a: '같은 테넌트에 연결된 서비스에서 유효한 코코넛 인증 세션과 서비스 정책이 허용하면 비밀번호 재입력을 줄일 수 있습니다. 추가 인증·약관 동의가 필요하면 해당 절차를 거칩니다. 각 서비스의 업무 권한은 별도로 확인하며 다른 테넌트 계정이 자동 통합되지는 않습니다.',
            },
            {
                q: '사내 AD·LDAP, SAML이나 Entra ID에도 연결되나요?',
                a: '현재 안내하는 기본 연동은 OAuth2·OIDC입니다. 기존 사내 디렉터리, SAML 기반 시스템, Entra ID와의 연결 및 SCIM 계정 동기화는 요구 규격과 현재 환경을 확인한 뒤 지원 여부와 추가 작업 범위를 안내합니다.',
            },
            {
                q: '계정 정지나 로그아웃은 외부 서비스에도 즉시 적용되나요?',
                a: '코코넛의 인증 세션과 외부 서비스의 자체 로그인 세션은 구분됩니다. 외부 서비스는 서명된 웹훅을 받아 자체 세션을 종료해야 합니다. 이미 발급된 토큰의 만료, 갱신 시 상태 확인, 이벤트 누락 시 처리를 함께 구성하며 차단 시간을 검증합니다.',
            },
            {
                q: '인증 서버 장애나 이중화는 어떻게 준비하나요?',
                a: '신규 로그인·토큰 갱신과 기존 이용의 영향은 서비스의 토큰 검증·세션 구조에 따라 다릅니다. 운영 환경에서 장애 시 동작, 이중화 구성, 백업·복구 절차와 복구 목표를 확인합니다. 가용성 보장 수준과 대응 범위는 공급 조건에서 별도로 정합니다.',
            },
            {
                q: '설치 환경과 외부 서비스가 필요한가요?',
                a: 'Java 21 기반 애플리케이션을 Docker 이미지로 배포하고 MySQL 8.0 이상을 사용합니다. 문자·이메일 발송은 LIME, 본인인증은 NICE 연동으로 구성합니다. 선택 기능에 필요한 외부 연결, 계약·이용 요금과 폐쇄망 적용 조건은 사전에 확인합니다.',
            },
            {
                q: '2단계 인증과 로그인 화면을 서비스별로 설정할 수 있나요?',
                a: 'SMS·이메일·OTP 앱(TOTP) 방식과 서비스별 MFA 설정을 제공합니다. 표준 로그인 연동 후 지원하는 정책을 설정으로 변경할 수 있습니다. 로고·색상·문구 등 브랜딩 항목도 관리하며 항목별 미리보기·저장·게시 범위를 확인합니다.',
            },
            {
                q: '도입 비용과 일정은 무엇을 기준으로 정하나요?',
                a: '연동 서비스 수, 기존 회원 이전, 설치·운영 환경과 추가 개발 범위를 확인한 뒤 산정합니다. 라이선스·구축·유지보수와 외부 발송·본인인증 비용의 포함 여부를 구분하고, 패치·장애 대응·운영 지원 범위를 함께 협의합니다.',
            },
            {
                q: '도입 전에 화면 시연이나 시범 연동을 검토할 수 있나요?',
                a: '도입 문의에 대상 서비스와 확인하고 싶은 시나리오를 남겨주세요. 제공 가능한 시연·시범 연동 범위와 일정을 협의합니다. 로그인, 추가 인증, 계정 정지, 로그아웃과 장애 시 동작을 검증 항목으로 정할 수 있습니다.',
            },
        ],
        // 출처: C:\project\fourberry\coconut (Spring Authorization Server 기반 인가 서버)
        stack: ['Java 21', 'Spring Boot 3.5', 'Spring Authorization Server', 'Spring Security 6', 'MySQL 8', 'JPA · Hibernate', 'Flyway', 'Thymeleaf', 'Docker', 'Swagger (OpenAPI)'],
        relatedProjects: ['withfresh'],
        nameOrigin: '단단한 껍질 안에 알맹이를 지키는 코코넛처럼, 계정과 인증을 안에서 지킵니다.',
        // 관리자 콘솔·심볼(보라 계열)에 맞춘 브랜드 색. pages/solutions/coconut.vue 가 이 값으로 그려집니다.
        brand: {
            accent: '#6d28d9',
            accentHover: '#5b21b6',
            accentLite: '#8b5cf6',
            inkBg: '#150b2e',
            inkSurface: '#221242',
            inkAccent: '#b79cff',
            inkFg2: '#b5a8d9',
            mark: '/images/solutions/coconut/mark.svg',
        },
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
                // 근거: C:\project\fb-scraper README "실시간 제어 및 디버깅(WebSocket)" +
                //       C:\project\fb-scraper-manager (Electron + Vue 데스크톱 앱 = FB매니저)
                h: '돌려놓고 지켜볼 수 있습니다 — 실시간 제어',
                body: '스크래핑은 대상 사이트가 조금만 달라져도 중간에 멈추는데, 로그만 남으면 원인을 짐작하는 데 시간이 걸립니다. MUSCAT은 전용 관리 앱과 WebSocket으로 연결되어 있어 실행 중인 작업이 지금 어느 단계에 있는지 보면서 일시정지하고 다시 재개할 수 있습니다. 디버그 모드로 띄우면 처음부터 관리 앱의 명령을 기다리므로, 새 수집 대상을 붙일 때 동작을 하나씩 보내가며 화면 반응을 그 자리에서 확인할 수 있습니다. 문제가 생긴 지점을 추측하지 않고 눈으로 보고 고치는 만큼, 대상이 늘어나도 손이 덜 갑니다.',
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
