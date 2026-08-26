# 문의 폼 전송 프록시 (카페24 Node 서버용)

정적 배포(GitHub Pages)의 문의 폼이 이 프록시를 경유해 발송 API를 호출합니다.
`https(브라우저) → 이 프록시(https) → 발송 API(http)` 구조로, mixed content 차단을 없애고
API 키를 서버에만 둡니다.

## 현재 운영 위치 (2026-08-26 확인)

| 항목 | 값 |
|---|---|
| 서버 | 카페24 리눅스 (`briskly0714`) |
| 설치 경로 | **`/opt/fb-contact`** |
| 실행 | pm2, 앱 이름 **`fb-contact`**, `root` 계정 |
| 외부 주소 | `https://briskly0714.cafe24.com/fb-contact/` |
| git 저장소 | **아님** — 파일만 올라가 있어 `git pull` 이 안 됩니다 |

아래 "배포 순서"는 **최초 구축용**입니다. 이미 돌고 있는 서버를 갱신하려면
[코드를 고쳤을 때](#코드를-고쳤을-때--재배포-방법) 절을 보세요.

## 필요 환경
- Node.js 18 이상 (전역 `fetch` 사용)
- 외부에서 https로 접근 가능한 경로 (아래 5번)

---

## 배포 순서

### 1) 파일 업로드
이 폴더(`deploy/contact-proxy-node/`)를 카페24 서버의 임의 위치에 올립니다. 예: `/home/<계정>/fb-contact/`

### 2) 의존성 설치
```bash
cd ~/fb-contact
npm install --omit=dev
```

### 3) 환경변수 설정
```bash
cp .env.example .env
# .env 를 열어 MESSAGE_API_KEY 등 실제 값 입력
```
`.env` 는 서버에만 두고 저장소에 커밋하지 마세요.

> 이 앱은 `.env` 를 자동으로 읽지 않습니다. pm2 로 띄우면(4번) `.env` 를 자동 로드하지 않으므로,
> 아래 4번의 `--env` 방식 대신 셸에서 export 하거나 pm2 ecosystem 파일을 쓰세요.
> 가장 간단한 방법:
> ```bash
> set -a; . ./.env; set +a   # .env 를 현재 셸 환경으로 로드
> npm start                   # 테스트 실행
> ```

### 4) 상시 실행 (pm2 권장)
```bash
npm install -g pm2
set -a; . ./.env; set +a
pm2 start server.js --name fb-contact
pm2 save
pm2 startup   # 재부팅 후 자동 시작 (출력되는 명령을 한 번 더 실행)
```
서버는 `PORT`(기본 8787)에서 리스닝합니다. 헬스체크: `curl http://localhost:8787/` → `{"ok":true,...}`

### 5) 외부 https 노출 (nginx 리버스 프록시)
이미 https가 걸린 도메인이 있으면, 그 nginx 설정에 아래 location 을 추가합니다.
(첨부파일 때문에 `client_max_body_size` 를 넉넉히 잡는 게 중요합니다.)

```nginx
# 예: https://api.fourberry.co.kr 또는 https://<기존도메인>/fb-contact
location /fb-contact/ {
    client_max_body_size 30m;
    proxy_pass http://127.0.0.1:8787/;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```
설정 후 `sudo nginx -t && sudo systemctl reload nginx`.

> 카페24 상품에 따라 nginx 직접 설정이 안 될 수 있습니다.
> - **가상서버(VPS)**: 위처럼 직접 설정 가능
> - **관리형 Node 호스팅**: 카페24 관리자에서 "도메인 ↔ 앱 포트" 매핑 메뉴로 연결
> 어느 쪽인지 모르면 카페24 고객센터에 "Node 앱을 외부 https 도메인/경로로 연결하는 방법"을 문의하세요.

### 6) 최종 엔드포인트 확인
브라우저로 아래를 열어 `{"ok":true,...}` 가 뜨면 성공입니다.
```
https://<노출된-주소>/api/contact     (또는 리버스 프록시 경로)
```
이 **전체 URL** 을 홈페이지 담당(또는 Claude)에게 전달하면, 빌드가 이 주소로 문의를
보내도록 `NUXT_PUBLIC_CONTACT_ENDPOINT` 를 연결합니다.

---

---

## 코드를 고쳤을 때 — 재배포 방법

이 폴더는 **GitHub Pages 배포에 포함되지 않습니다.** 저장소에 커밋해도 서버에는 반영되지
않으므로, 아래를 직접 해야 합니다.

서버의 `/opt/fb-contact` 는 git 저장소가 아니라 파일만 올라가 있습니다. 그래서 `git pull` 이
아니라 **바뀐 파일을 GitHub 에서 직접 받아 덮습니다.** (아래는 2026-08-26 실제로 통한 절차)

```bash
cd /opt/fb-contact
cp server.js server.js.bak.$(date +%Y%m%d)
curl -fsSL https://raw.githubusercontent.com/fourberry/home/main/deploy/contact-proxy-node/server.js -o server.js
grep -c useTemplate server.js    # 0 이면 옛 코드가 그대로 — 받아지지 않은 것
pm2 restart fb-contact
pm2 logs fb-contact --lines 20 --nostream
```

로그에 `[contact-proxy] listening on :8787` 이 보이고 에러 로그가 비어 있어야 합니다.
그다음 외부 주소로 헬스체크합니다.

```bash
curl -s https://briskly0714.cafe24.com/fb-contact/ ; echo
# → {"ok":true,"service":"contact-proxy","method":"POST only for sending"}
```

문제가 생기면 백업본으로 되돌립니다. `.env` 와 `node_modules` 는 건드리지 않으므로
이 한 줄이면 원래대로 돌아갑니다.

```bash
cd /opt/fb-contact && cp server.js.bak.$(date +%Y%m%d) server.js && pm2 restart fb-contact
```

`package.json` 의 의존성이 바뀐 경우에만 `npm install --omit=dev` 를 추가로 돌리세요.
지금까지의 변경은 `server.js` 한 파일뿐이라 필요 없었습니다.

> **순서 주의**: 프론트(홈페이지)보다 **프록시를 먼저** 올리세요. 프록시는 새 형식과 옛 형식을
> 모두 받으므로 먼저 올려도 기존 폼이 그대로 동작합니다. 반대로 하면 그 사이 들어온 문의가
> 400 으로 유실됩니다.

---

## 요청/응답 형식 (참고)

프론트가 보내는 JSON 은 두 가지입니다.

- **템플릿 방식(현재)** — `{ templateId, data, attachments }`
  제목·본문은 라임의 `HOMEPAGE_CONTACT` 템플릿에 있습니다. 프록시는 그대로 전달만 합니다.
- **직접 방식(구버전)** — `{ subject, content, data, attachments }`
  배포 후에도 브라우저에 옛 JS 가 캐시돼 있을 수 있어 계속 받습니다.

`attachments` 는 `[{filename, mimeType, content(base64)}]` 형식입니다.

- 성공: `200 { "ok": true }`
- 실패: `4xx/5xx { "ok": false, "message": "..." }`
- 제한: 첨부 최대 5개 · 개당 10MB · 합계 25MB

발송 API 로는 수신자(`CONTACT_RECIPIENTS`)와 `X-API-Key` 를 붙여 넘깁니다.
템플릿 방식이면 `templateId`+`data` 를, 아니면 `subject`+`content` 를 싣습니다.

## 보안 메모
발송 API 키는 그동안 정적 번들과 git 히스토리에 노출되어 있었습니다. 프록시로 옮긴 뒤에도
**키 재발급**을 권장하며, 새 키는 이 서버의 `.env` 에만 두세요.
