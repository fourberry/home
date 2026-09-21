# CLAUDE.md

이 파일은 이 저장소에서 작업하는 Claude Code·Codex 등 AI 개발 도구의 프로젝트 공통 지침 정본입니다.
Codex의 진입 문서는 루트 [AGENTS.md](AGENTS.md)이며 이 파일을 함께 읽습니다.

## 프로젝트 개요

(주)포베리 회사 소개 홈페이지. Nuxt 4 기반이며 **정적 사이트(SSG)로 빌드되어 GitHub Pages에 배포**됩니다.
`/`는 주요 내용을 요약하는 원페이지이고, 그 아래에 **검색 노출용 하위 페이지 13개**가 함께 있습니다
(솔루션 3 + 실적 6 + 허브 2 + 서비스 1 + AI 활용 개발 방식 1). 현재 색인 대상 URL은 14개입니다.
페이지를 추가·삭제할 때 이 개수도 실제 프리렌더 경로·사이트맵과 함께 갱신합니다.

## 명령어

```bash
npm run dev        # 개발 서버 (포트 4000 고정 — 3000은 다른 프로젝트와 충돌)
npm run generate   # 정적 빌드 → .output/public (실제 배포에 쓰이는 명령)
npm run build      # Nitro 서버 포함 빌드 (Pages 배포에는 사용 안 함)
npm run preview    # 빌드 결과 미리보기
npx prettier --write .   # 포맷팅
```

테스트·린트 설정은 이 저장소에 없습니다. 변경 검증은 `npm run dev`로 화면을 확인하거나,
프리렌더가 깨지지 않는지 `npm run generate`로 확인하는 방식입니다.
`generate`는 SSR 프리렌더를 돌리므로 **브라우저 전용 API를 잘못 쓰면 여기서만 터집니다.**

## 아키텍처

### 원페이지 + 하위 페이지 구조

[pages/index.vue](pages/index.vue)가 `components/fb/` 아래 섹션 컴포넌트를 순서대로 나열합니다.
헤더·푸터·맨위로 버튼은 [layouts/default.vue](layouts/default.vue)에 있습니다.
"어떤 섹션을 고쳐야 하나"는 `index.vue`의 나열 순서를 보면 바로 찾을 수 있습니다.

하위 페이지는 아래 구조이며, 내용은 전부 `data/` 의 배열에서 나옵니다.

| 경로 | 파일 | 데이터 |
|---|---|---|
| `/solutions`, `/solutions/{slug}` | `pages/solutions/` | [data/solutions.ts](data/solutions.ts) |
| `/work`, `/work/{id}` | `pages/work/` | [data/projects.ts](data/projects.ts) |
| `/services/si-sm` | [pages/services/si-sm.vue](pages/services/si-sm.vue) | 페이지 안에 인라인 |
| `/how-we-work` | [pages/how-we-work.vue](pages/how-we-work.vue) | [data/aiWorkflow.ts](data/aiWorkflow.ts) |

#### 솔루션 브랜드 페이지 (COCONUT)

`/solutions/coconut/` 은 공통 상세 페이지가 아니라 **브랜드 페이지**입니다.
정적 파일 [pages/solutions/coconut.vue](pages/solutions/coconut.vue)가 동적 `[slug].vue` 보다 우선하므로
URL·canonical·프리렌더 경로는 그대로이고 화면만 바뀝니다. 구성 요소는 세 가지입니다.

| 파일 | 역할 |
|---|---|
| [layouts/brand.vue](layouts/brand.vue) | `definePageMeta({ layout: 'brand', brand: '{slug}', brandNav })` 로 지정. `data/solutions.ts` 의 `brand` 색을 래퍼의 CSS 변수(`--accent` 등)로 덮어씀 |
| [components/brand/BrandHeader.vue](components/brand/BrandHeader.vue) | 회사 메뉴 대신 페이지 안 앵커를 보여주는 헤더. 푸터는 회사 공통 푸터 그대로 |
| [assets/css/fb-brand.css](assets/css/fb-brand.css) | 브랜드 페이지 전용 배치(`.bp-*`). `fb-design.css` 뒤에 로드 |

카드·SEO·FAQ 는 여전히 [data/solutions.ts](data/solutions.ts)가 출처이고, 브랜드 페이지에만 보이는
화면 투어·보안·연동·도입 절차는 [data/coconut.ts](data/coconut.ts)에 있습니다.
화면 이미지(`public/images/solutions/coconut/`)와 제품 설명서(`public/docs/coconut-product-guide.pdf`)는
`C:\project\fourberry\coconut\output\pdf\` 의 **공통 배포용** 산출물에서 가져온 것입니다(개인정보 가림 처리된 보정본).
PDF 는 원본(4.2MB)을 그대로 넣지 않고 이미지를 재압축한 사본(약 0.7MB)입니다 — 저장소 이력이 커지지 않도록
갱신할 때도 같은 방식으로 줄여서 넣으세요. 코코넛 기능이 바뀌면 그쪽 소개서를 먼저 갱신하고 여기로 옮기세요.

다른 솔루션을 브랜드 페이지로 올리려면 `data/solutions.ts` 항목에 `brand` 색을 넣고
`pages/solutions/{slug}.vue` 를 만들면 됩니다. `brand` 가 없는 solution 에 브랜드 레이아웃을 지정하면
레이아웃이 의도적으로 에러를 냅니다.

**솔루션·실적을 추가하면 하위 페이지가 자동으로 생깁니다.**
[nuxt.config.ts](nuxt.config.ts)의 `nitro.prerender.routes`가 두 데이터 배열에서 경로를 뽑아내기
때문입니다. 그래서 이 두 파일에는 **Nuxt 전용 API를 쓰면 안 됩니다**(nuxt.config가 import 하므로 순수 데이터만).

상세 항목을 추가할 때 `problems` / `sections` / `background` / `domainBody` 같은 본문 필드를 채우세요.
한국어 800자 이상은 이 프로젝트의 내용 충실도 검토 기준이며, 검색엔진의 색인 조건이나 노출 보장 수치가 아닙니다.
분량을 맞추기 위한 반복보다 사용자의 질문에 답할 수 있는 구체적인 설명과 확인된 근거를 우선합니다.

### CSS 3층 구조 — 로드 순서가 중요

[nuxt.config.ts](nuxt.config.ts)의 `css` 배열 순서가 의도된 것입니다.

1. `assets/css/tailwind.css` — Tailwind 지시자 + `@font-face` 선언 (SCSS abstract도 여기서 import)
2. `assets/scss/common.scss` — 구버전 공통 스타일
3. `assets/css/fb-design.css` — **2026 리디자인 디자인 시스템**. `:root` CSS 변수(`--accent`, `--ink`,
   `--section-y` 등)와 `.section`, `.btn`, `.eyebrow`, `.container` 같은 시맨틱 클래스를 정의

fb 컴포넌트는 Tailwind 유틸리티보다 **`fb-design.css`의 클래스와 CSS 변수를 우선 사용**합니다.
색상·간격을 하드코딩하지 말고 기존 CSS 변수를 쓰세요. 순서가 바뀌면 리디자인 스타일이 덮여 깨집니다.

#### 클래스 두 개는 짝이 있습니다 — 빼먹으면 화면이 조용히 깨집니다

빌드도 통과하고 HTML에도 내용이 다 들어가는데 **화면에서만 망가지는** 조합입니다.
실제로 이 두 가지 때문에 하위 페이지가 운영 중에 깨진 적이 있습니다.

| 클래스 | 반드시 함께 필요한 것 | 빼먹으면 |
|---|---|---|
| `fb-stagger` | 컨테이너에 **`v-reveal`** | 자식이 `opacity:0` 인 채로 남아 **영역이 통째로 비어 보임** |
| `slot-img` | 부모에 **`position:relative`** | 이미지가 부모를 뚫고 페이지 폭으로 퍼져 **아래 내용을 덮음** |

`slot-img` 는 `position:absolute; inset:0` 이라 부모를 기준으로 꽉 채우는 용도입니다.
`.sol-media` · `.work-thumb` · `.cul-img` · `.fb-card-media` 처럼 **비율을 가진 래퍼 안**에서만 쓰세요.
섹션에 그냥 흐르는 이미지(`.fb-shot`)에는 붙이면 안 됩니다.

`fb-stagger` 의 숨김 규칙은 `.fb-stagger.reveal > *` 로 좁혀 두었습니다.
`reveal` 은 JS(`v-reveal`)만 붙이므로, **JS가 실패하면 콘텐츠가 그냥 보입니다.**
이 방어를 `.fb-stagger > *` 로 되돌리지 마세요 — [plugins/reveal.ts](plugins/reveal.ts)가
SSR에서 클래스를 심지 않는 것과 같은 이유입니다.

### 커스텀 디렉티브는 반드시 유니버설 플러그인

[plugins/reveal.ts](plugins/reveal.ts)(`v-reveal`, 스크롤 페이드업)와
[plugins/countup.ts](plugins/countup.ts)(`v-countup`, 숫자 카운트업)는 **`.client` 접미사를 붙이면 안 됩니다.**
클라이언트 전용이 되면 프리렌더 중 디렉티브가 등록되지 않아 Vue SSR이 `getSSRProps`를 읽지 못하고
`npm run generate`가 500으로 실패합니다. 두 디렉티브 모두 SSR에서는 아무 속성도 내보내지 않고,
JS가 실패해도 콘텐츠가 보이도록 타임아웃 안전장치를 갖고 있습니다 — 이 방어 로직을 걷어내지 마세요.

지도 SDK만 [plugins/kakaoMap.client.ts](plugins/kakaoMap.client.ts)로 클라이언트 전용이며,
`$kakao.load()`를 await한 뒤 사용합니다.

### 문의 폼 전송 경로 (가장 헷갈리는 부분)

프론트는 항상 `runtimeConfig.public.contactEndpoint` 한 곳으로만 POST합니다
([FbContact.vue:224](components/fb/FbContact.vue:224)). 그 값이 환경에 따라 달라집니다.

| 환경 | contactEndpoint | 처리 주체 |
|---|---|---|
| 로컬 `npm run dev` | `/api/contact` (기본값) | [server/api/contact.post.ts](server/api/contact.post.ts) — Nitro 라우트 |
| GitHub Pages 배포 | `https://briskly0714.cafe24.com/fb-contact/` | 카페24의 Node 프록시 ([deploy/contact-proxy-node/](deploy/contact-proxy-node/)) |

**정적 배포에는 Nitro 서버가 없으므로 `/api/contact`가 404입니다.** 그래서
[deploy.yml:43](.github/workflows/deploy.yml:43)에서 빌드 시 `NUXT_PUBLIC_CONTACT_ENDPOINT`를 주입합니다.
엔드포인트를 바꾸려면 이 워크플로 파일을 고쳐야 합니다.

프록시 구현은 **세 개**이고 모두 **동일한 계약**을 지킵니다. 하나만 고치면 운영 중인 경로가
그대로 남으므로 반드시 함께 고치세요.

| 파일 | 쓰이는 곳 |
|---|---|
| [server/api/contact.post.ts](server/api/contact.post.ts) | 로컬 `npm run dev` |
| [deploy/contact-proxy-node/server.js](deploy/contact-proxy-node/server.js) | **현재 운영** — 카페24 리눅스 서버 |
| [deploy/contact-proxy.worker.js](deploy/contact-proxy.worker.js) | 미사용(대안) — Cloudflare Worker |

요청 본문은 두 가지를 받습니다.

- **템플릿 방식(현재)** `{ templateId, data, attachments }`
  제목·본문·머리말·꼬리말은 전부 라임에 있습니다. 폼은 값만 보냅니다.
- **직접 방식(구버전)** `{ subject, content, data, attachments }`
  정적 사이트라 배포 후에도 브라우저에 옛 JS 가 캐시돼 있을 수 있어 남겨 둡니다.
  400 을 내면 그 문의가 그대로 유실됩니다.

첨부 제한은 5개 · 개당 10MB · 합계 25MB이고 `attachments: [{filename, mimeType, content(base64)}]` 형식입니다.

**메일 문구·디자인은 이 저장소에 없습니다.** 라임의 `HOMEPAGE_CONTACT` 템플릿(홈페이지 프로젝트)과
거기 연결된 이메일 레이아웃에 있습니다. 문구를 고치려면 라임에서 고치세요 — 여기를 배포할 필요가 없습니다.
폼이 보내는 `data` 키(`clientLabel`·`clientName`·`message` 등)와 템플릿의 `{{변수}}` 는 짝이므로,
키 이름을 바꾸려면 양쪽을 함께 고쳐야 합니다.

⚠️ 값을 **미리 HTML escape 하지 마세요.** 라임이 Handlebars 로 치환하면서 이스케이프합니다.
여기서 한 번 더 하면 이중 이스케이프가 돼 메일에 `&amp;lt;` 같은 문자가 그대로 보입니다.

프록시가 존재하는 이유는 두 가지입니다: 발송 API가 http라 브라우저 mixed content에 걸리는 것을 우회하고,
`X-API-Key`와 수신자 주소를 클라이언트 번들 밖에 두기 위함입니다. 이 값들을 프론트로 옮기지 마세요.

### 검색 노출(SEO) — 건드리면 조용히 망가지는 것들

**⚠️ canonical 을 [nuxt.config.ts](nuxt.config.ts)의 전역 `app.head` 에 넣지 마세요.**
전역에 두면 모든 하위 페이지가 "내 정규 주소는 홈이다"라고 선언하게 되어
구글이 하위 페이지를 통째로 색인에서 제외합니다. 화면상으로는 아무 문제가 없어 보여서
몇 주 뒤 검색에 안 나온다는 사실로만 드러납니다. 같은 이유로 `og:url` 도 전역값은 기본값일 뿐입니다.

페이지 메타는 **[composables/useFbSeo.ts](composables/useFbSeo.ts) 하나로만** 설정합니다.
`title` / `description` / `path` 를 주면 canonical · og · twitter 태그가 함께 만들어집니다.

구조화 데이터(JSON-LD)는 [composables/useFbJsonLd.ts](composables/useFbJsonLd.ts)에 모여 있습니다.
`Organization` 은 [layouts/default.vue](layouts/default.vue)에서 전 페이지 공통으로 심고,
나머지(`WebSite`·`FAQPage`·`SoftwareApplication`·`Service`·`BreadcrumbList`)는 각 페이지가 심습니다.
회사 정보는 [data/company.ts](data/company.ts)가 단일 출처이며 푸터·지도·JSON-LD가 모두 이 파일을 씁니다.

**FAQ 구조화 데이터는 화면에 실제로 보이는 질문·답변과 반드시 같아야 합니다**(다르면 스팸 판정).
그래서 [data/faq.ts](data/faq.ts) 한 곳만 고치면 `FbFaq.vue` 와 JSON-LD가 함께 바뀝니다.

**목록 카드는 `<button>` 이 아니라 `<NuxtLink>` 여야 합니다.** 크롤러는 버튼을 따라가지 못합니다.
(실적 카드가 원래 모달을 띄우는 버튼이었고, 그래서 상세 내용이 색인되지 않았습니다)

**헤더·푸터의 앵커는 `/#about` 형태여야 합니다.** `#about` 으로 두면 하위 페이지에는 그런 요소가
없어 메뉴가 먹통이 됩니다. 하위 페이지에서 홈 앵커로 넘어갈 때의 스크롤 보정은
[plugins/hashScroll.client.ts](plugins/hashScroll.client.ts)가 담당합니다 — 이게 없으면
페이지는 이동하지만 맨 위에 그대로 멈춥니다.

### GEO·AEO 기본 작업 기준

**모든 작업에서 GEO(Generative Engine Optimization, 생성형 검색 최적화)와
AEO(Answer Engine Optimization, 답변형 검색 최적화)에 미치는 영향을 먼저 확인합니다.**
공개 콘텐츠·페이지·UI·라우팅·메타·빌드를 추가하거나 수정할 때 아래 기준을 기본으로 적용하고,
검토에서도 회귀 여부를 확인합니다. 검색 노출과 무관한 변경은 영향 없음의 이유를 짧게 남깁니다.

- **질문에 먼저 답하기:** 페이지 첫 부분에서 대상 고객, 제공 가치와 범위를 짧고 구체적으로 설명합니다.
  제목 계층을 명확히 하고, 필요한 경우 도입 조건·제약·지원 범위를 본문과 FAQ로 설명합니다.
  모든 페이지에 FAQ를 기계적으로 추가하거나 키워드를 반복하지 않습니다.
- **확인된 사실만 공개하기:** 실적의 수행 주체·기간, 구성원의 이전 회사 경력과 포베리의 실적을 구분합니다.
  개발 중인 제품은 상태를 표시하고, 성능·가격·지원 수준·AI 역량·정량 성과를 근거 없이 단정하지 않습니다.
  새 주장의 근거와 미확인 사항은 `docs/`에 기록하고, 미확인 사실은 추정해 채우지 않습니다.
  비공개 프로젝트명·내부 경로·정책 원문·비밀정보는 공개 본문뿐 아니라 메타·JSON-LD·번들에도 포함하지 않습니다.
- **데이터와 설명의 일치:** 회사·제품·실적·AI 활용 소개는 기존 `data/` 정본을 재사용합니다.
  홈 요약·상세 페이지·FAQ·메타·JSON-LD가 같은 사실과 상태를 설명해야 합니다.
  구조화 데이터는 `useFbJsonLd.ts`에서 관리하고, 실제 본문과 확인된 속성에 맞는 타입만 사용합니다.
- **읽고 찾을 수 있는 페이지:** 핵심 설명과 링크는 JavaScript 실행 전 정적 HTML에 포함합니다.
  페이지별 `useFbSeo.ts` 메타·대표 URL, 사이트맵·프리렌더 경로, 홈이나 허브에서 도달하는 실제 링크를 유지합니다.
  의도하지 않은 `noindex`·`nosnippet`·robots 차단이 생기지 않도록 확인합니다.
- **UI·UX와 모션 함께 검토하기:** 본문을 이미지·영상·클릭 후 로딩에만 의존하지 않습니다.
  모바일 가독성·가로 넘침·키보드 탐색·포커스·앵커 위치를 확인하고, 애니메이션은 읽기와 탐색을 방해하지 않게 합니다.
  기존 reveal의 JS 실패 시 표시 방어와 `prefers-reduced-motion` 대응을 유지합니다.
- **정책과 성과 구분하기:** 검색엔진별 기능·지원 정책을 판단 근거로 사용할 때는 해당 제공자의 최신 공식 문서를 확인합니다.
  구조화 데이터나 별도 AI 파일만으로 색인·검색 순위·AI 인용을 보장하지 않습니다.
  크롤러 접근 정책은 수집 목적과 기존 공개 범위를 확인하고 변경합니다.

#### 완료 전 검증

공개 콘텐츠나 생성 결과에 영향을 주는 변경은 다음을 확인하고, 완료 보고에 결과와 미검증 항목을 짧게 남깁니다.

1. `npm run generate`로 정적 생성을 확인합니다. 환경 문제로 대체 명령을 사용했다면 명령과 한계를 기록합니다.
2. 변경 페이지의 생성 HTML에서 본문·제목 계층(페이지당 h1 1개)·고유 제목·설명·대표 URL을 확인합니다.
   경로를 추가·삭제했다면 사이트맵·프리렌더 결과·내부 링크 도달 여부도 확인합니다.
3. 변경한 FAQ의 질문·답변과 JSON-LD 일치, 구조화 데이터 파싱, 내용의 근거와 비공개 정보 미노출을 확인합니다.
   공통 데이터·SEO·레이아웃·설정을 바꿨다면 그 영향을 받는 모든 페이지로 검증 범위를 넓힙니다.
4. UI·모션 변경은 데스크톱과 모바일에서 확인하고, JS 실패 시 콘텐츠 표시와 동작 줄이기 설정도 검토합니다.
   코드 확인만 했는지 실제 브라우저에서 동작을 확인했는지 구분해 보고합니다.

지침·문서만 수정해 생성 결과가 바뀌지 않는 경우에는 링크·기존 규칙과의 충돌·diff를 검토하고 빌드는 생략할 수 있습니다.
배포가 승인된 작업은 배포 후 변경 URL의 정상 응답과 반영 상태를 확인합니다. 빌드·배포 성공과 실제 색인·AI 인용 성과는 구분합니다.

### Google Analytics (nuxt-gtag)

측정 ID(`G-5WNYBB6NQY`)는 [nuxt.config.ts](nuxt.config.ts) 상단의 `GTAG_ID` 상수 **한 곳**에만
있습니다. 공개값이라 `.env`나 워크플로 주입이 필요 없습니다.

바로 아래 `GTAG_ENABLED`가 **로컬 `npm run dev`에서는 GA를 끕니다**(개발 중 새로고침이 실제
통계에 방문자로 섞이지 않도록). 로컬에서 GA 동작을 확인해야 하면
`NUXT_PUBLIC_GTAG_ID=G-XXXX npm run dev`로 실행하세요 — 환경변수를 직접 준 경우에는 dev에서도
켜집니다. **ID를 하드코딩할 때 이 가드를 함께 걷어내지 마세요.**

홈과 하위 페이지를 함께 운영하므로 페이지 조회수와 방문자 수를 구분합니다. 문의 성과는
[FbContact.vue](components/fb/FbContact.vue)의 `handleSubmit`에서 발생하는 다음 이벤트로 봅니다.

- `generate_lead` — 문의 전송 성공 (GA4 권장 이벤트명, 전환으로 등록해 사용)
- `contact_submit_failed` — 전송 실패. 프록시 장애를 통계로 감지하는 용도
- `contact_submit_attempt` — 필수 입력 검증을 통과한 제출 시도. 입력 오류·폼 방문은 포함하지 않음

다음 클릭 행동은 별도 이벤트로 측정합니다. 내부 링크·앵커와 `tel:`·`mailto:`의 클릭을
자동 이탈 클릭 수집만으로 측정한다고 가정하지 않습니다.

- `solution_inquiry_click` — `solution` 파라미터로 COCONUT/LIME/MUSCAT 구분.
  홈의 [FbSolutions.vue](components/fb/FbSolutions.vue)는 카드별 버튼 없이 섹션 하단 버튼 하나라
  `solution: 'ALL'`, `link_location: 'solutions_footer'` 로 보내고, 솔루션별 관심은 상세·브랜드 페이지의
  같은 이벤트로 봅니다(브랜드 페이지는 `link_location` `brand_header`·`hero`)
- `contact_channel_click` — 전화·이메일 링크. [FbContact.vue](components/fb/FbContact.vue)와
  [AppFooter.vue](components/AppFooter.vue) 양쪽에 있으며 `link_location`으로 위치를 구분
- `ai_workflow_link_click` / `ai_workflow_navigation` — AI 소개 링크 및 목차·실적 링크 클릭.
  [useAiWorkflowTracking.ts](composables/useAiWorkflowTracking.ts)에서 고정된 구분 값으로 관리
- `contact_cta_click` — AI 소개 페이지의 상단·하단 상담 버튼 클릭. 문의 성공과 구분

상담 링크의 출처는 [inquiryAnalytics.ts](utils/inquiryAnalytics.ts)에서 허용한 고정 값만 사용하며,
제출 시도·성공·실패에 같은 출처를 기록합니다. 원문 URL이나 임의 쿼리 값을 이벤트 매개변수로 보내지 않습니다.
내부 링크에 UTM을 붙이지 않고, 자동 페이지 조회와 수동 `page_view`를 중복 전송하지 않습니다.
이벤트 계약·GA 계정 설정·보고서 해석은 [GA4 운영 안내](docs/ga4-guide.md)를 함께 갱신합니다.

**이벤트에 이름·연락처·이메일 등 개인 식별 정보를 넣지 마세요.** GA 정책 위반입니다.
현재는 상담 유형·관심 서비스·예산·일정 같은 선택 항목과 고정된 링크·상담 진입 구분 값을 보냅니다.

### 배포

`main`에 push하면 [.github/workflows/deploy.yml](.github/workflows/deploy.yml)이 `npm run generate` 후
`.output/public`을 GitHub Pages로 배포합니다. **커밋을 푸시하면 곧바로 운영 사이트에 반영됩니다.**

### 프로젝트 실적 데이터

수행 실적은 [data/projects.ts](data/projects.ts)의 `fbProjects` 배열이 단일 출처이며,
`FbWork`(목록)와 `FbProjectModal`(상세)이 함께 사용합니다. 실적을 추가·수정할 때는 이 파일만 고치면 됩니다.
타입 정의도 같은 파일 안의 `FbProject` 인터페이스이며, 별도의 `types/` 디렉터리는 없습니다.

## 작업 규칙

- **브랜치를 만들지 말고 `main`에 직접 커밋·푸시합니다.** 브랜치는 사용자가 명시적으로 요청할 때만 생성합니다.
  단, push하면 위 배포 워크플로가 즉시 실행되므로 푸시 사실을 사용자에게 알립니다.
- 코드 스타일은 Prettier 설정을 따릅니다: 세미콜론 없음, 작은따옴표, **들여쓰기 4칸**, printWidth 200.
- 주석과 UI 문구는 한국어로 작성합니다.
- `.claude/settings.local.json`은 개인 설정이라 gitignore 대상입니다. `.claude/launch.json`은 팀 공용으로 커밋합니다.
