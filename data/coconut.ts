// COCONUT 브랜드 페이지(pages/solutions/coconut.vue) 전용 내용.
//  - 카드·SEO·FAQ 같은 공통 필드는 data/solutions.ts 의 coconut 항목이 단일 출처이고,
//    여기에는 브랜드 페이지에만 보이는 화면 투어·보안·연동·도입 절차를 둡니다.
//  - 근거: C:\project\fourberry\coconut 의 README.md · docs/ 와
//    output/pdf/Coconut-제품설명서-공통배포용-원고.md (2026-09-21).
//  - 화면 이미지는 소개서의 보정본입니다. 수치는 예시이고 개인정보는 가려져 있습니다.
//    실제 운영 실적·성능 근거로 쓰지 않습니다.
//
// ⚠️ 순수 데이터만 둡니다 (Nuxt 전용 API 사용 금지).

const IMG = '/images/solutions/coconut'

/**
 * 브랜드 페이지 OG 이미지(카톡·SNS 미리보기). 홈·목록 카드는 data/solutions.ts 의 image(스톡 사진)를 그대로 쓰고,
 * 링크 미리보기에만 실제 관리자 화면(대시보드 보정본, 1600×900 jpg)을 보여줍니다.
 */
export const coconutOgImage = `${IMG}/cover.jpg`

/** 고객 배포용 제품 설명서(PDF, 14쪽). 원본: coconut/output/pdf/Coconut-제품설명서-공통배포용.pdf */
export const coconutBrochure = '/docs/coconut-product-guide.pdf'

/**
 * 문제 상황 → 도입 후. 왼쪽 문제는 data/solutions.ts 의 problems 와 같은 문장이고,
 * 오른쪽은 README 에 있는 기능(SSO 토큰 검증 · 표준 흐름 · 클라이언트별 MFA · 관리자 콘솔)만 적습니다.
 */
export const coconutProblems = [
    {
        now: '서비스마다 회원 테이블이 따로 있어, 같은 고객이 계정을 여러 개 들고 있습니다.',
        after: '계정 하나로 모든 서비스에 로그인',
        how: '회원 정보는 COCONUT 한 곳에 두고, 서비스는 토큰만 확인합니다.',
    },
    {
        now: '신규 서비스를 붙일 때마다 로그인·비밀번호 찾기·세션 관리를 처음부터 다시 만듭니다.',
        after: '표준 OAuth2·OIDC 흐름에 연결만',
        how: '로그인·비밀번호 찾기·회원가입 화면은 COCONUT 이 제공합니다.',
    },
    {
        now: '보안 요건 때문에 2단계 인증을 넣어야 하는데 서비스별로 각각 구현해야 합니다.',
        after: '2단계 인증은 인가 서버가 처리',
        how: 'SMS·이메일·OTP 앱을 클라이언트별 설정으로 켭니다. 서비스 코드는 그대로입니다.',
    },
    {
        now: '어떤 계정이 어떤 서비스에 접근할 수 있는지 한눈에 파악할 방법이 없습니다.',
        after: '관리자 콘솔에서 한눈에',
        how: '테넌트·클라이언트·사용자와 로그인 이력을 한 화면에서 보고 즉시 차단합니다.',
    },
]

/** 히어로 아래 한 줄 요약 4개 */
export const coconutFacts = [
    { k: 'OAuth2 · OIDC', v: '표준 인가 서버' },
    { k: '멀티테넌트', v: '고객사별 분리 운영' },
    { k: 'MFA 3종', v: 'SMS · 이메일 · OTP 앱' },
    { k: 'Docker 배포', v: 'JDK 21 · MySQL 8 환경' },
]

/** 로그인이 이어지는 순서. README 의 "OAuth2 인가 흐름"을 사용자 관점으로 줄였습니다 */
export const coconutLoginSteps = [
    { t: '로그인 요청', d: '연동 서비스가 표준 인가 요청으로 COCONUT 로그인 화면을 엽니다. 팝업 방식도 지원합니다.' },
    { t: '계정 확인', d: '계정 상태·잠금 여부를 확인하고 비밀번호를 검증합니다. 실패 횟수가 쌓이면 자동으로 잠깁니다.' },
    { t: '추가 단계', d: '클라이언트 설정에 따라 본인인증·약관 동의·이메일 인증·2단계 인증을 거칩니다. 끝나면 원래 흐름으로 돌아옵니다.' },
    { t: '동의', d: '어떤 정보를 어느 서비스에 넘기는지 사용자가 확인합니다. 스코프와 약관을 한 화면에서 동의합니다.' },
    { t: '토큰 발급', d: 'RS256 으로 서명한 접근 토큰과 갱신 토큰을 발급합니다. 서비스는 토큰만 검증하면 됩니다.' },
]

export interface CoconutScreen {
    /** 페이지에 보이는 이미지(1600px 폭으로 줄인 webp) */
    image: string
    /** 클릭 확대용 원본 해상도(최대 2287px) webp. 글자가 작은 관리자 화면이라 줄이지 않은 파일을 따로 둡니다 */
    full: string
    alt: string
    /** 실제 픽셀 크기. <img width/height> 로 넘겨 lazy 로딩 전 높이를 정확히 예약합니다(레이아웃 이동 방지) */
    w: number
    h: number
}

export interface CoconutTourItem extends CoconutScreen {
    id: string
    eyebrow: string
    h2: string
    p: string
    points: string[]
}

/** 히어로 화면. 투어에는 넣지 않아 같은 캡처가 두 번 보이지 않습니다 */
export const coconutHero: CoconutScreen = {
    image: `${IMG}/dashboard.webp`,
    full: `${IMG}/dashboard-full.webp`,
    alt: 'COCONUT 관리자 콘솔 대시보드 — 테넌트·사용자·관리자 현황과 주간 로그인 그래프(예시 데이터)',
    w: 1600,
    h: 890,
}

/** 관리자 콘솔 화면 투어. 순서대로 위에서 아래로 배치됩니다 */
export const coconutTour: CoconutTourItem[] = [
    {
        id: 'clients',
        eyebrow: 'Client',
        h2: '서비스를 등록하면 로그인이 연결됩니다.',
        p: '웹·앱·API 서비스를 클라이언트로 등록하고 인증 방식과 스코프, 콜백 주소, 토큰 유효기간을 정합니다. 서버형(Confidential)과 공개형(Public)을 구분하고 PKCE 필수 여부를 서비스별로 둡니다.',
        points: ['Authorization Code · Refresh Token · Client Credentials', '스코프별 필수 동의 지정', '토큰 유효기간 · 서명 방식 · 갱신 정책'],
        image: `${IMG}/client-setup.webp`,
        full: `${IMG}/client-setup-full.webp`,
        alt: 'COCONUT 클라이언트 생성 화면 — 인증 방식과 스코프 설정',
        w: 1600,
        h: 1052,
    },
    {
        id: 'users',
        eyebrow: 'User',
        h2: '사용자를 찾고, 상태를 바꾸고, 잠금을 풉니다.',
        p: '이름·계정·이메일로 검색하고 상태와 소속 테넌트, 마지막 로그인을 확인합니다. 상세 화면에서 상태 변경, 비밀번호 초기화, 2단계 인증·이메일 인증 요청 제한 해제를 처리하므로 개발 요청 없이 운영 담당자 선에서 끝납니다.',
        points: ['상태 · 소속 · 로그인 정보 조회', '비밀번호 초기화 · 계정 잠금 해제', '인증 요청 제한 해제'],
        image: `${IMG}/users.webp`,
        full: `${IMG}/users-full.webp`,
        alt: 'COCONUT 사용자 관리 화면 — 사용자 목록과 상태(예시 데이터, 개인정보 가림)',
        w: 1600,
        h: 890,
    },
    {
        id: 'settings',
        eyebrow: 'Policy',
        h2: '보안 정책은 설정으로, 코드 수정 없이.',
        p: '로그인 실패 잠금 횟수와 잠금 시간, 비밀번호 만료 기간과 최소 길이, 세션 타임아웃, 토큰 유효기간을 시스템 기본값으로 두고 클라이언트별로 다르게 적용할 수 있습니다.',
        points: ['로그인 실패 잠금 · 세션 타임아웃', '비밀번호 만료 · 복잡성 규칙', '접근 토큰 · 갱신 토큰 기본 유효기간'],
        image: `${IMG}/settings.webp`,
        full: `${IMG}/settings-full.webp`,
        alt: 'COCONUT 시스템 설정 화면 — 보안 정책과 OAuth 토큰 기본값',
        w: 1600,
        h: 890,
    },
    {
        id: 'logs',
        eyebrow: 'Monitoring',
        h2: '누가, 언제, 어디서 로그인했는지 남습니다.',
        p: '로그인 성공·실패와 접속 IP, 로그인 방식을 기간·상태·클라이언트로 검색합니다. 보안 감사 로그는 심각도별로, 활동 로그는 관리자별로 따로 조회해 "고객이 로그인이 안 된다"는 문의의 원인을 바로 좁힙니다.',
        points: ['로그인 이력 — 성공 · 실패 · 잠금', '보안 감사 로그 — 심각도 · 이벤트 유형', '활동 로그 — 관리자가 무엇을 바꿨는지'],
        image: `${IMG}/logs.webp`,
        full: `${IMG}/logs-full.webp`,
        alt: 'COCONUT 로그인 이력 화면 — 성공·실패 통계와 이력 목록(예시 데이터, 개인정보 가림)',
        w: 1600,
        h: 889,
    },
]

/** 투어 아래 작은 화면 2장. 높이가 달라 화면에서는 16:10 으로 잘라 보여줍니다 */
export const coconutTourMini: (CoconutScreen & { h2: string; p: string })[] = [
    {
        h2: '약관 유형 관리',
        p: '이용약관·개인정보 동의 항목을 유형별로 관리하고 서비스마다 필수·선택을 지정합니다.',
        image: `${IMG}/terms.webp`,
        full: `${IMG}/terms-full.webp`,
        alt: 'COCONUT 약관 유형 관리 화면',
        w: 1600,
        h: 890,
    },
    {
        h2: '약관 유형 추가',
        p: '새 약관 유형을 등록하면 회원가입과 동의 화면에 바로 반영됩니다.',
        image: `${IMG}/terms-setup.webp`,
        full: `${IMG}/terms-setup-full.webp`,
        alt: 'COCONUT 약관 유형 등록 화면',
        w: 1600,
        h: 1052,
    },
]

/** 보안 기능. README "보안 기능" 절 기준 */
export const coconutSecurity = [
    { t: '계정 잠금', d: '로그인 실패 횟수 기준으로 자동 잠금. 시도 횟수와 잠금 시간은 클라이언트별로 설정하고 시간이 지나면 자동 해제됩니다.' },
    { t: '비밀번호 정책', d: '최소 길이·대소문자·숫자·특수문자 규칙, 만료 기간(기본 90일), 최근 5개 비밀번호 재사용 금지.' },
    { t: '2단계 인증(MFA)', d: 'SMS·이메일·OTP 앱(TOTP) 세 가지. 신뢰 기기를 등록해 매번 묻지 않도록 할 수 있습니다.' },
    { t: '요청 횟수 제한', d: 'MFA 코드·이메일 인증·본인인증 요청을 시간당 횟수로 제한해 무차별 시도를 막습니다.' },
    { t: 'JWT 서명 키 로테이션', d: '서명 키를 DB 에서 관리하고 ACTIVE → ROTATED → EXPIRED 로 교체합니다. 기존 토큰 검증은 유지한 채 새 키로 넘어갑니다.' },
    { t: '보안 감사 로그', d: '로그인·잠금·MFA·비밀번호·토큰 이벤트를 INFO / WARNING / CRITICAL 심각도로 기록합니다.' },
]

/** 서비스별 로그인 화면 브랜딩. 소개서 §8 기준 */
export const coconutBranding = [
    { t: '로고와 색상', d: '로고·다크모드 로고·파비콘, 주요·보조·강조·배경·글자 색상' },
    { t: '문구와 글꼴', d: '로그인 제목·부제목·환영 메시지·도움말, 글꼴' },
    { t: '화면 구성', d: '로그인 템플릿, 회원가입 버튼, 비밀번호 찾기, 구분선, 푸터 문구·링크' },
    { t: '미리보기와 게시', d: '로그인·회원가입·동의 화면 미리보기, 임시저장 후 게시' },
]

/** 연동 지점. README "외부 시스템 연동" 과 docs/ 기준 */
export const coconutIntegrations = [
    { k: 'Standard', t: 'OIDC Discovery', d: '/.well-known/openid-configuration 을 제공해 표준 클라이언트 라이브러리가 설정을 자동으로 읽습니다. introspect · revoke 엔드포인트 포함.' },
    { k: 'Webhook', t: '사용자 이벤트 전달', d: '상태 변경·삭제·복원·세션 폐기 이벤트를 HMAC-SHA256 서명으로 연동 서비스에 보냅니다. 실패하면 지수 백오프로 재시도합니다.' },
    { k: 'Popup', t: '팝업 로그인', d: '페이지 이동 없이 팝업 창에서 로그인하고 결과만 돌려받습니다. 소셜 로그인 버튼과 같은 표준 방식입니다.' },
    { k: 'Identity', t: 'NICE 본인인증', d: '회원가입 단계에서 NICE 본인인증을 붙입니다. 필수 여부와 자격 정보는 클라이언트별로 둡니다.' },
    { k: 'Messaging', t: 'LIME 메시징', d: 'MFA 인증번호, 비밀번호 재설정, 이메일 인증 발송을 포베리 LIME 메시징으로 처리합니다. SMS·이메일·카카오 알림톡을 한 API 로 보냅니다.' },
    { k: 'Account', t: '공통 계정 보안 화면', d: '이메일 인증·OTP 등록 상태, 비밀번호 변경, 내 로그인 세션을 보는 화면을 COCONUT 이 제공합니다. 서비스는 링크만 두면 됩니다.' },
]

/** 설치 요구사항. README "시스템 요구사항" · "기술 스택" 기준 */
export const coconutSpec = [
    { k: '런타임', v: 'Java 21 (JDK 21 이상)' },
    { k: '프레임워크', v: 'Spring Boot 3.5 · Spring Authorization Server · Spring Security 6' },
    { k: '데이터베이스', v: 'MySQL 8.0 이상 (Flyway 마이그레이션)' },
    { k: '권장 사양', v: '메모리 2GB 이상, 디스크 1GB 이상 (로그 별도)' },
    { k: '배포', v: 'Docker 이미지 (Jenkins 배포 스크립트 포함)' },
    { k: 'API 문서', v: 'Swagger UI (관리자 · OAuth2 · 사용자 관리 API)' },
]

/** 도입 절차. 소개서 §12 기준 */
export const coconutAdoption = [
    { idx: '01', t: '적용 대상 정리', d: '고객사 구분, 사용자 종류, 관리자 범위와 연동할 서비스를 정합니다.' },
    { idx: '02', t: '클라이언트 구성', d: '인증 방식·콜백·스코프·PKCE·토큰 유효기간을 설정합니다.' },
    { idx: '03', t: '로그인 연결', d: '서비스 로그인 요청 → COCONUT 인증 → 인가 코드 → 토큰 확인 순서로 연결합니다.' },
    { idx: '04', t: '서비스 권한 적용', d: '연동 서비스가 사용자 소속과 업무·데이터 권한을 확인하도록 맞춥니다.' },
    { idx: '05', t: '운영 검수', d: '오류·권한 거부·세션 종료·로그·백업·복구를 실제 환경에서 검수합니다.' },
]
