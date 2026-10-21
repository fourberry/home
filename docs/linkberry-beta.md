## 요약

LinkBerry 베타는 회사 홈페이지의 별도 개발·운영 도구 섹션과 /tools/linkberry/에서 제공합니다. SaaS·온프레미스 솔루션 목록에는 포함하지 않습니다. 2026-10-19 사용자가 최신 설치 파일 제작, 관련 커밋, 릴리스 게시 및 홈페이지 배포를 승인했습니다.

## 제공 파일

- 버전: 0.1.1-beta.3, Windows x64, 114172386바이트, 코드 서명 없는 베타.
- 파일: LinkBerry-Setup-0.1.1-beta.3-x64.exe
- SHA-256: 85ecd8ce8edb25e3dd455147175aa55aa168f42031785c476cb9882d817261d7
- GitHub Release: https://github.com/fourberry/home/releases/tag/linkberry-v0.1.1-beta.3
- 안내 페이지: https://www.fourberry.co.kr/tools/linkberry/
- 다운로드: https://www.fourberry.co.kr/downloads/linkberry/LinkBerry-Setup-0.1.1-beta.3-x64.exe
- 최신 UI·홈/분할/세션 관리, 자체 아이콘, 명령어 사전, 파일 정렬·소유자 표시·드래그 업로드, 터미널 폴더 연동 개선을 포함합니다.
- Node.js 별도 설치 불필요. 자동 업데이트 지원, 코드 서명 없음. 실제 NSIS 업데이트·재시작·설정 보존을 격리된 시험 설치에서 검증했습니다. 다른 PC·기업 설치 정책은 미검증입니다.

## 배포 절차와 정본

설치 파일은 100MiB를 넘으므로 일반 Git 파일로 커밋하지 않습니다. public/downloads/linkberry/*.exe와 beta.yml은 Git 제외이며 같은 저장소의 GitHub Release 자산을 Pages 빌드가 받아 크기와 SHA-256을 확인한 뒤 .output/public에 포함합니다. 다운로드 주소는 회사 도메인 안에 유지합니다. 이전 로컬 0.1.0 사본은 .data/linkberry-archive에 보존하고 새 배포에는 포함하지 않습니다.

배포 정보의 정본은 data/linkberry-release.json입니다. 새 버전은 기존 자산을 덮어쓰지 않고 버전·파일명·태그·해시를 함께 갱신합니다. 검증된 EXE를 해당 태그의 prerelease 자산으로 먼저 게시한 다음 main을 push합니다. 자산 누락·해시 불일치 시 빌드는 실패하며 기존 운영 사이트를 유지합니다. main push는 GitHub Actions의 Pages 배포를 즉시 시작합니다.

로컬에서는 node scripts/prepare-linkberry-download.mjs 후 npm.cmd run generate로 검증합니다. CI의 --fetch는 GITHUB_REPOSITORY와 GH_TOKEN을 사용합니다. 배포 완료 후 실제 공개 페이지 버전과 다운로드 파일의 SHA-256을 다시 확인합니다. 자동 업데이트 채널은 https://www.fourberry.co.kr/downloads/linkberry/beta.yml입니다. 목록과 EXE를 같은 Pages 배포에 포함합니다. data/linkberry-release.json의 updateManifest도 크기·SHA-256을 검증하며 retainedDownloads에 등록한 기존 beta.1 다운로드를 보존합니다. beta.2는 시험용으로만 사용했고 공개하지 않습니다.

원본 프로그램은 C:\project\fourberry\linkberry에서 관리합니다. 원본 저장소에는 remote가 설정되어 있지 않아 소스는 로컬 커밋으로 보존하고 공개 홈페이지 저장소에는 설치 파일 자산과 홈페이지 코드만 게시합니다. 이 문서의 내부 경로는 공개 HTML·메타·번들에 포함하지 않습니다.

## 이용 안내의 범위

베타 상태, 권한 있는 시스템 이용, 명령·파일 작업의 영향, 백업, 지원 한계 및 책임 제한을 다운로드 전에 표시합니다. 확인 체크박스는 브라우저의 기본 필수 입력 검사를 사용합니다. 서버에 동의 기록을 저장하거나 파일 접근을 통제하지 않으므로 동의 증빙이나 내부 전용 접근 제한으로 설명하지 않습니다. 공개 홈페이지에서는 외부인도 파일 URL로 직접 받을 수 있습니다.

책임 제한은 무단 접근·권한 외 사용·잘못된 명령 등 이용자 행위와 연결하고, 고의·중과실 등 제한할 수 없는 책임을 제외했습니다. 법률 검토를 마친 약관 또는 면책 보장을 뜻하지 않으며 페이지 고지를 설치 프로그램에 삽입하지 않았습니다. 실제 배포·계약 관계에 맞는 법적 효력은 전문가 검토 대상입니다.

근거: 국가법령정보센터 약관의 규제에 관한 법률 제7조(2026-10-19 확인), https://www.law.go.kr/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=1000526556 . 상당한 이유 없는 손해배상·담보책임 제한도 금지됩니다.
파일 배포 근거: https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github (2026-10-19 확인).

## 페이지 구성과 검증

솔루션은 data/solutions.ts, 도구는 data/linkberry.ts에서 별도로 관리하며 색인 대상 URL은 15개입니다. 새 도구 컴포넌트·페이지는 독립 섹션과 URL 관리에 필요해 추가했고 기존 브랜드 레이아웃·SEO·FAQ JSON-LD를 재사용했습니다. 이전 /solutions/linkberry/는 파일 삭제 없이 noindex·새 canonical·정적 HTML 새로고침으로 이동만 지원하며 사이트맵에서 제외합니다.

도구 분리 후 정적 생성, 15개 URL의 h1·고유 제목·설명·canonical·내부 링크·FAQ 본문과 JSON-LD 일치를 확인했습니다. PC·모바일 390×844에서 도구 섹션·메뉴·가로 넘침과 브랜드 간 이동을 확인했습니다. 필수 체크박스 미선택 시 다운로드가 차단되고 키보드 Space 선택 후 실제 다운로드되는 것을 기존 0.1.0 파일로 확인했습니다. 새 파일도 크기·해시와 정적 출력의 일치를 확인한 뒤 배포합니다.

JavaScript 비활성은 생성 HTML의 본문·FAQ·네이티브 폼으로, 동작 줄이기는 기존 CSS 규칙과 새 모션 미추가로 검토했습니다. 기존 브라우저 데이터 갱신 안내·Nuxt cache-driver 경고가 남아 있습니다. 로컬 홈의 카카오 지도 SDK 로드 실패는 이번 범위 밖이며 LinkBerry 페이지와 다운로드 검사에는 영향이 없었습니다.

현재 베타는 기본 검사 35개, Electron 기존 화면 흐름 36개, HTTP 업데이트·실패·설정 백업 7개 흐름, 실제 NSIS 업데이트·재시작·설정 보존 6개 항목과 npm 전체 의존성 감사 0건을 확인했습니다. 설치 파일의 버전·최신 소스·화면 바이트·실행 의존성·라이선스·비밀/시험 파일 제외를 검사했고, 공개 패키지의 소스·화면 바이트와 production HTTPS 채널, beta.yml의 EXE 크기·SHA-512를 검증했습니다. 기존 설치 앱과 사용자 설정은 교체하지 않았습니다. 세부 프로그램 검증은 원본 VERIFICATION.md를 참고합니다.

이번 자동 업데이트 작업에서는 개인·회사·프로젝트 AI 규칙을 변경하지 않았습니다. 도구 분류 규칙은 이전 배포에서 반영됐습니다. 홈페이지 새 의존성·파일 삭제는 없고, 프로그램에는 승인된 electron-updater 6.8.9(MIT)를 정확 버전으로 추가했습니다.

## 자동 업데이트와 현재 검증

0.1.1-beta.1 이하에는 업데이트 기능이 없어 새 설치 파일을 한 번 직접 설치해야 합니다. 같은 Windows 계정에서 기존 작업을 마치고 설치합니다. 이후 실행 15초 뒤와 4시간마다 새 베타를 확인·다운로드하고, 작업을 마친 뒤 종료하거나 재시작을 선택하면 설치합니다. 파일 전송·연결 준비·열린 편집기가 있으면 설치를 보류합니다.

자동 설치 직전에 EXE 무결성을 재검사하고 접속 설정을 암호화된 원본 상태로 백업합니다. 서버·폴더·호스트 지문·개인 키 경로·인증 정보·언어·테마 보존을 실제 시험 설치에서 확인했습니다. 통신·검증·백업 실패에는 설치하지 않으며 미완료 설치는 다음 실행에서 안내합니다. 전원 중단·디스크 장애의 자동 복구까지 보장하지 않습니다. 업데이트 서버로 접속 설정·인증 정보를 전송하지 않습니다.

최종 로컬 검증(2026-10-19): 정적 생성 통과, 15개 색인 URL·FAQ 본문/JSON-LD·이전 주소 안내·필수 확인란·도구 분리·설치 파일 및 beta.yml SHA-256·기존 beta.1 다운로드 보존을 확인했습니다. PC와 모바일 390×844에서 안내와 가로 넘침을 확인했고 필수 확인란 미선택 시 다운로드 차단을 확인했습니다. 기존 Browserslist 데이터·Nuxt cache-driver 경고는 남아 있습니다.

프로그램 소스 커밋: e0b9b7b38da266855c2f65ace114c4e6a9260694 (master, 로컬 저장소에 remote 없음). 기존 Electron 회귀의 스크롤 시험 실패는 실제 키 입력 대신 직접 IPC를 호출한 시험 조건을 수정하고 36개 최종 통과했습니다. 테스트 실패와 정리 오류도 원본 VERIFICATION.md에 기록했습니다. 이번 변경은 updater·안내·배포 검증 범위이며 불필요해진 정적 버전 CSS 외 기존 기능을 제거하지 않았습니다.

공개 배포 후 운영 URL의 버전·EXE SHA-256·beta.yml과 기존 다운로드를 다시 검증합니다. 같은 이름의 공개 자산을 덮어쓰지 않고 다음 버전은 새 태그·EXE로 게시합니다.


## BerryLinker Mac 시험판 배포 준비 — 2026-10-21
Mac 파일은 홈페이지의 CPU별 버튼에서 회사 공개 GitHub Release 자산으로 연결합니다. 기존 Windows 다운로드 보존으로 Pages 용량이 약 1GB에 근접하여 Mac 파일을 정적 출력에 추가하지 않습니다. 다운로드 준비 스크립트는 Mac 파일을 `.data/mac-trial-downloads`에서 별도로 해시 검증합니다.

상한 근거: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits . 기존 Windows 파일·해시·업데이트 URL은 유지합니다. 앱 소스는 회사 비공개 저장소에만 있으며 공개 저장소에는 검증된 설치 파일과 홈페이지 코드·배포 정보만 게시합니다.

두 CPU의 최종 Mac 빌드와 DMG 복사본 실행 검사는 2026-10-21에 통과했습니다. 빌드 소스는 `4f4f01db422084956aa87769e6685fda11a21928`이며 버전은 `0.1.1-beta.10`입니다. 파일 크기와 SHA-256은 `data/linkberry-mac-trial.json`에 기록합니다. 각 네이티브 macOS 환경에서 기본 117개 검사, 실제 앱 화면, SSH·SFTP·원격 파일 편집과 패키지 구성을 검증했습니다.

Mac 시험판은 Developer ID 서명·Apple 공증·자동 업데이트를 제공하지 않습니다. CI 결과가 실제 팀원의 인터넷 다운로드 후 Gatekeeper·Applications 설치·Keychain·재실행을 대신하지 않습니다. Apple Silicon CI의 제한된 화면에서는 큰 창 레이아웃 검증이 제한됩니다. 공개 Windows 설치본은 이전 LinkBerry 이름이며 기존 파일·업데이트 채널을 유지합니다.
