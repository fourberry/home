## 요약

LinkBerry 베타는 회사 홈페이지의 별도 개발·운영 도구 섹션과 /tools/linkberry/에서 제공합니다. SaaS·온프레미스 솔루션 목록에는 포함하지 않습니다. 2026-10-19 사용자가 최신 설치 파일 제작, 관련 커밋, 릴리스 게시 및 홈페이지 배포를 승인했습니다.

## 제공 파일

- 버전: 0.1.1-beta.1, Windows x64, 113843007바이트, 코드 서명 없는 베타.
- 파일: LinkBerry-Setup-0.1.1-beta.1-x64.exe
- SHA-256: 23523b6b69d4bfcdae42e902e6064e4e3c64553194260462399d5b32efdf0f36
- GitHub Release: https://github.com/fourberry/home/releases/tag/linkberry-v0.1.1-beta.1
- 안내 페이지: https://www.fourberry.co.kr/tools/linkberry/
- 다운로드: https://www.fourberry.co.kr/downloads/linkberry/LinkBerry-Setup-0.1.1-beta.1-x64.exe
- 최신 UI·홈/분할/세션 관리, 자체 아이콘, 명령어 사전, 파일 정렬·소유자 표시·드래그 업로드, 터미널 폴더 연동 개선을 포함합니다.
- Node.js 별도 설치 불필요. 자동 업데이트·코드 서명 미제공. 다른 PC·기업 설치 정책·버전 간 업데이트 설치는 미검증입니다.

## 배포 절차와 정본

설치 파일은 100MiB를 넘으므로 일반 Git 파일로 커밋하지 않습니다. public/downloads/linkberry/*.exe는 Git 제외이며 같은 저장소의 GitHub Release 자산을 Pages 빌드가 받아 크기와 SHA-256을 확인한 뒤 .output/public에 포함합니다. 다운로드 주소는 회사 도메인 안에 유지합니다. 이전 로컬 0.1.0 사본은 .data/linkberry-archive에 보존하고 새 배포에는 포함하지 않습니다.

배포 정보의 정본은 data/linkberry-release.json입니다. 새 버전은 기존 자산을 덮어쓰지 않고 버전·파일명·태그·해시를 함께 갱신합니다. 검증된 EXE를 해당 태그의 prerelease 자산으로 먼저 게시한 다음 main을 push합니다. 자산 누락·해시 불일치 시 빌드는 실패하며 기존 운영 사이트를 유지합니다. main push는 GitHub Actions의 Pages 배포를 즉시 시작합니다.

로컬에서는 node scripts/prepare-linkberry-download.mjs 후 npm.cmd run generate로 검증합니다. CI의 --fetch는 GITHUB_REPOSITORY와 GH_TOKEN을 사용합니다. 배포 완료 후 실제 공개 페이지 버전과 다운로드 파일의 SHA-256을 다시 확인합니다. 자동 업데이트 채널은 구성하지 않았습니다.

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

원본 베타는 기본 검사 29개, Electron 실제 화면 흐름 36개, npm 전체 의존성 감사 0건을 확인했습니다. 설치 파일의 버전·최신 소스·화면 바이트·실행 의존성·라이선스·비밀/시험 파일 제외를 검사했고, EXE에서 추출한 229개 파일이 검증된 패키지와 일치했습니다. 기존 설치 앱과 사용자 설정은 교체하지 않았습니다. 세부 프로그램 검증은 원본 VERIFICATION.md를 참고합니다.

개인 설정·회사 공통 규칙은 변경하지 않았습니다. 프로젝트 CLAUDE.md에는 도구 분류·정본 경로·색인 URL 수를 반영했습니다. 새 외부 의존성·파일 삭제는 없습니다.

최종 로컬 검증(2026-10-19): 새 베타 정보로 정적 생성을 다시 통과했고, 15개 색인 URL·이전 주소 안내·필수 확인란·도구 분리·설치 파일 SHA-256을 재확인했습니다. 원본 소스 커밋은 68e1dd34cd396f3a6088f9831b531f87b6637f8f이며, 해당 EXE에서 추출한 패키지의 Electron 시험 36개도 통과했습니다.
