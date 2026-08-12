# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

(주)포베리 회사 소개 홈페이지. Nuxt 4 기반이며 **정적 사이트(SSG)로 빌드되어 GitHub Pages에 배포**됩니다.
페이지는 사실상 `/` 하나뿐인 원페이지 사이트입니다.

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

### 원페이지 구조

[pages/index.vue](pages/index.vue)가 `components/fb/` 아래 섹션 컴포넌트를 순서대로 나열하는 것이
사이트의 전부입니다. 헤더·푸터·맨위로 버튼은 [layouts/default.vue](layouts/default.vue)에 있습니다.
"어떤 섹션을 고쳐야 하나"는 `index.vue`의 나열 순서를 보면 바로 찾을 수 있습니다.

### CSS 3층 구조 — 로드 순서가 중요

[nuxt.config.ts](nuxt.config.ts)의 `css` 배열 순서가 의도된 것입니다.

1. `assets/css/tailwind.css` — Tailwind 지시자 + `@font-face` 선언 (SCSS abstract도 여기서 import)
2. `assets/scss/common.scss` — 구버전 공통 스타일
3. `assets/css/fb-design.css` — **2026 리디자인 디자인 시스템**. `:root` CSS 변수(`--accent`, `--ink`,
   `--section-y` 등)와 `.section`, `.btn`, `.eyebrow`, `.container` 같은 시맨틱 클래스를 정의

fb 컴포넌트는 Tailwind 유틸리티보다 **`fb-design.css`의 클래스와 CSS 변수를 우선 사용**합니다.
색상·간격을 하드코딩하지 말고 기존 CSS 변수를 쓰세요. 순서가 바뀌면 리디자인 스타일이 덮여 깨집니다.

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

두 구현(`server/api/contact.post.ts`와 `deploy/contact-proxy-node/server.js`)은 **동일한 계약**을 지킵니다.
요청 `{ subject, content, data, attachments: [{filename, mimeType, content(base64)}] }`,
제한 첨부 5개 · 개당 10MB · 합계 25MB. 한쪽 검증 규칙을 바꾸면 다른 쪽도 함께 고치세요.

프록시가 존재하는 이유는 두 가지입니다: 발송 API가 http라 브라우저 mixed content에 걸리는 것을 우회하고,
`X-API-Key`와 수신자 주소를 클라이언트 번들 밖에 두기 위함입니다. 이 값들을 프론트로 옮기지 마세요.

### 배포

`main`에 push하면 [.github/workflows/deploy.yml](.github/workflows/deploy.yml)이 `npm run generate` 후
`.output/public`을 GitHub Pages로 배포합니다. **커밋을 푸시하면 곧바로 운영 사이트에 반영됩니다.**

### 프로젝트 실적 데이터

수행 실적은 [data/projects.ts](data/projects.ts)의 `fbProjects` 배열이 단일 출처이며,
`FbWork`(목록)와 `FbProjectModal`(상세)이 함께 사용합니다. 실적을 추가·수정할 때는 이 파일만 고치면 됩니다.
(`types/project.ts`의 `Project` 인터페이스는 리디자인 이전 잔재로, 현재 아무 데서도 참조하지 않습니다.)

## 작업 규칙

- **브랜치를 만들지 말고 `main`에 직접 커밋·푸시합니다.** 브랜치는 사용자가 명시적으로 요청할 때만 생성합니다.
  단, push하면 위 배포 워크플로가 즉시 실행되므로 푸시 사실을 사용자에게 알립니다.
- 코드 스타일은 Prettier 설정을 따릅니다: 세미콜론 없음, 작은따옴표, **들여쓰기 4칸**, printWidth 200.
- 주석과 UI 문구는 한국어로 작성합니다.
- `.claude/settings.local.json`은 개인 설정이라 gitignore 대상입니다. `.claude/launch.json`은 팀 공용으로 커밋합니다.
