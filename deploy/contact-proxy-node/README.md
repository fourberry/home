# 문의 폼 전송 프록시 (카페24 Node 서버용)

정적 배포(GitHub Pages)의 문의 폼이 이 프록시를 경유해 발송 API를 호출합니다.
`https(브라우저) → 이 프록시(https) → 발송 API(http)` 구조로, mixed content 차단을 없애고
API 키를 서버에만 둡니다.

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

## 요청/응답 형식 (참고)
- 프론트가 보내는 JSON: `{ subject, content, data, attachments: [{filename, content(base64)}] }`
- 성공: `200 { "ok": true }`
- 실패: `4xx/5xx { "ok": false, "message": "..." }`
- 제한: 첨부 최대 5개 · 개당 10MB · 합계 25MB

## 보안 메모
발송 API 키는 그동안 정적 번들과 git 히스토리에 노출되어 있었습니다. 프록시로 옮긴 뒤에도
**키 재발급**을 권장하며, 새 키는 이 서버의 `.env` 에만 두세요.
