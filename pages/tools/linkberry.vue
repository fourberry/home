<template>
    <div class="lb-page">
        <section class="bp-hero">
            <div class="container">
                <FbBreadcrumb :items="crumbs" />
                <div class="bp-hero-grid">
                    <div>
                        <span class="eyebrow">BerryLinker · Beta</span>
                        <h1>{{ solution.headline }}</h1>
                        <p class="lead">{{ solution.desc }}</p>
                        <div class="fb-page-actions">
                            <a href="#download" class="btn btn-primary">
                                베타 다운로드
                                <span aria-hidden="true">↓</span>
                            </a>
                            <a v-if="macTrial.downloads.length" href="#mac-trial" class="btn btn-ghost">Mac 시험본 다운로드</a>
                            <a href="#terms" class="btn btn-ghost">이용 안내 확인</a>
                        </div>
                        <p class="lb-caption">Windows x64 · v{{ release.version }} · 자동 업데이트 지원</p>
                    </div>
                    <div class="lb-identity">
                        <img :src="solution.brand!.mark" alt="BerryLinker 연결 고리 심볼" width="112" height="112" />
                        <p class="lb-wordmark">
                            BerryLinker
                            <span>BETA</span>
                        </p>
                        <p>서버를 연결하고, 작업을 이어갑니다.</p>
                        <ul aria-label="기본 작업 흐름">
                            <li>
                                <span>01</span>
                                서버 등록
                            </li>
                            <li>
                                <span>02</span>
                                SSH 접속
                            </li>
                            <li>
                                <span>03</span>
                                터미널 · 파일 작업
                            </li>
                        </ul>
                    </div>
                </div>
                <aside class="lb-notice" aria-label="베타 버전 안내">
                    <strong>현재는 사내 검증을 중심으로 제공하는 베타 버전입니다.</strong>
                    <p>외부 이용자도 아래 제한과 주의사항을 확인해 주세요. 오류나 데이터 손실이 발생할 수 있으므로 중요한 시스템에 적용하기 전에 테스트와 백업이 필요합니다.</p>
                </aside>
            </div>
        </section>

        <BrandLinkberryGallery />

        <section id="features" class="section section--alt">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">Workspace</span>
                    <h2>원격 작업에 필요한 기본 기능.</h2>
                    <p class="lead">서버 연결과 파일 작업을 한 앱에서 확인합니다.</p>
                </div>
                <div class="lb-features">
                    <article v-for="(feature, i) in solution.feats" :key="feature.t">
                        <span class="lb-number">0{{ i + 1 }}</span>
                        <h3>{{ feature.t }}</h3>
                        <p>{{ feature.d }}</p>
                    </article>
                </div>
                <div class="lb-guidance">
                    <article v-for="section in solution.sections" :key="section.h">
                        <h3>{{ section.h }}</h3>
                        <p>{{ section.body }}</p>
                    </article>
                </div>
            </div>
        </section>

        <section id="download" class="section">
            <div class="lb-download-grid container">
                <div class="section-head">
                    <span class="eyebrow">Download · Beta</span>
                    <h2>확인하고 시작하세요.</h2>
                    <p class="lead">현재 제공하는 파일은 v{{ release.version }} 베타입니다. 설치 후 서버 접속 정보를 등록해 사용합니다.</p>
                    <ul class="lb-limits">
                        <li>Windows x64용 · Node.js 별도 설치 불필요</li>
                        <li>코드 서명 없음 · 보안 경고 또는 설치 차단 가능</li>
                        <li>새 버전 자동 확인·다운로드 · 작업 후 종료 시 설치</li>
                        <li>모든 Windows 환경과 기업 설치 정책의 호환성 미검증</li>
                    </ul>
                    <p class="lb-caption">0.1.1-beta.1 이하 버전은 이번 설치 파일을 한 번 직접 설치해야 자동 업데이트가 시작됩니다. 기존 앱의 연결과 파일 작업을 마친 뒤 설치하세요.</p>
                    <p class="lb-caption">보안 기능을 끄거나 조직의 설치 정책을 우회하지 마세요.</p>
                </div>
                <div class="lb-download-card">
                    <span class="lb-badge">{{ release.stage }} · v{{ release.version }}</span>
                    <h3>Windows용 BerryLinker</h3>
                    <p v-if="release.fileName.startsWith('LinkBerry-')" class="lb-caption">제품 이름을 LinkBerry에서 BerryLinker(베리링커)로 변경했습니다. 현재 Windows 다운로드는 이름 변경 전 LinkBerry 설치본이며, 새 이름은 다음 배포부터 적용됩니다.</p>
                    <dl>
                        <div>
                            <dt>파일</dt>
                            <dd>{{ release.fileName }}</dd>
                        </div>
                        <div>
                            <dt>크기</dt>
                            <dd>{{ release.sizeLabel }}</dd>
                        </div>
                        <div>
                            <dt>빌드 날짜</dt>
                            <dd>{{ release.date }}</dd>
                        </div>
                    </dl>
                    <p>
                        다운로드 전에 아래
                        <a href="#terms">베타 이용 안내와 책임 제한</a>
                        을 읽어주세요.
                    </p>
                    <form :action="release.downloadPath" method="get">
                        <label class="lb-confirm" for="beta-acknowledgement">
                            <input id="beta-acknowledgement" type="checkbox" required />
                            <span>베타 상태, 이용 시 주의사항 및 책임 제한 안내를 확인했습니다.</span>
                        </label>
                        <button type="submit" class="btn btn-primary">
                            Windows x64 다운로드
                            <span aria-hidden="true">↓</span>
                        </button>
                    </form>
                    <details class="lb-checksum">
                        <summary>파일 확인용 SHA-256</summary>
                        <code>{{ release.sha256 }}</code>
                        <p>파일이 안내된 설치 파일과 같은지 비교하는 값입니다. 코드 서명을 대신하지 않습니다.</p>
                    </details>
                </div>
            </div>
        </section>

        <section v-if="macTrial.downloads.length" id="mac-trial" class="section section--alt">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">macOS · Trial</span>
                    <h2>Mac 시험용 다운로드.</h2>
                    <p class="lead">v{{ macTrial.version }} · 팀원의 실제 Mac 설치·동작 확인을 위한 시험본입니다. 정식 지원 검증은 진행 중입니다.</p>
                    <ul class="lb-limits">
                        <li>이 Mac에 관하여에서 칩을 확인하고 Apple Silicon 또는 Intel 파일을 선택하세요.</li>
                        <li>DMG를 열고 앱을 응용 프로그램(Applications) 폴더로 복사합니다. Node.js는 별도로 설치하지 않습니다.</li>
                        <li>Developer ID 서명·Apple 공증 없음 · 시험용 ad-hoc 서명은 게시자 신원을 보증하지 않습니다. macOS가 실행을 차단할 수 있습니다.</li>
                        <li>설치가 차단되면 경고 내용을 담당자에게 전달하세요. 보안 기능을 끄거나 조직 정책을 우회하지 마세요.</li>
                        <li>자동 업데이트 미지원 · 파일은 포베리 GitHub 릴리스에서 내려받으며, 새 시험본은 수동으로 설치합니다.</li>
                    </ul>
                </div>
                <div class="lb-download-grid">
                    <article v-for="file in macTrial.downloads" :key="file.arch" class="lb-download-card">
                        <span class="lb-badge">Mac 시험본</span>
                        <h3>{{ file.label }}</h3>
                        <dl>
                            <div><dt>파일</dt><dd>{{ file.fileName }}</dd></div>
                            <div><dt>크기</dt><dd>{{ file.sizeLabel }}</dd></div>
                            <div><dt>빌드 날짜</dt><dd>{{ macTrial.date }}</dd></div>
                        </dl>
                        <form :action="file.downloadPath" method="get">
                            <label class="lb-confirm" :for="'mac-ack-' + file.arch">
                                <input :id="'mac-ack-' + file.arch" type="checkbox" required />
                                <span>Mac 시험본의 미검증 범위와 <a href="#terms">베타 이용 안내</a>를 확인했습니다.</span>
                            </label>
                            <button type="submit" class="btn btn-primary" :aria-label="file.label + ' DMG 다운로드'">DMG 다운로드</button>
                        </form>
                        <details class="lb-checksum"><summary>파일 확인용 SHA-256</summary><code>{{ file.sha256 }}</code></details>
                    </article>
                </div>
                <p class="lb-caption">검증 순서: 설치·첫 실행 → SSH 비밀번호/키 인증 → ⌘C·⌘V → SFTP 업로드·다운로드·편집 → 메모 저장 → 앱 재실행 후 설정 확인. 시험 서버를 사용하고 앱 버전·Mac 칩·macOS 버전·오류를 담당자에게 알려주세요. 비밀번호·개인 키·내부 서버 정보는 공유하지 마세요.</p>
            </div>
        </section>

        <section id="terms" class="section section--ink">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">Beta notice</span>
                    <h2>베타 이용 안내와 책임 제한.</h2>
                    <p class="lead">사내·외 이용자 모두에게 적용되는 현재 배포본의 안내입니다. 법령상 보장되는 이용자의 권리를 제한하지 않습니다.</p>
                </div>
                <div class="lb-terms">
                    <article v-for="(term, i) in linkberryTerms" :key="term.title">
                        <span class="lb-number">0{{ i + 1 }}</span>
                        <div>
                            <h3>{{ term.title }}</h3>
                            <p>{{ term.body }}</p>
                        </div>
                    </article>
                </div>
                <p class="lb-caption">
                    안내 기준일: {{ release.date }} · 문의:
                    <a :href="'mailto:' + fbCompany.email">{{ fbCompany.email }}</a>
                </p>
            </div>
        </section>

        <section id="faq" class="section section--alt">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">FAQ</span>
                    <h2>설치 전에 궁금한 점.</h2>
                </div>
                <div class="lb-faq">
                    <article v-for="item in solution.faq" :key="item.q">
                        <h3>{{ item.q }}</h3>
                        <p>{{ item.a }}</p>
                    </article>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { linkberryTool as solution, linkberryPath, linkberryRelease as release, linkberryMacTrial as macTrial, linkberryTerms } from '~/data/linkberry'
import { fbCompany } from '~/data/company'

definePageMeta({
    layout: 'brand',
    brand: 'linkberry',
    brandNav: [
        { to: '#screens', label: '화면 둘러보기' },
        { to: '#features', label: '기능' },
        { to: '#download', label: '다운로드' },
        { to: '#terms', label: '이용 안내' },
        { to: '#faq', label: 'FAQ' },
    ],
})
const crumbs = [
    { name: '홈', path: '/' },
    { name: '개발·운영 도구', path: '/#tools' },
    { name: 'BerryLinker', path: linkberryPath },
]
useFbSeo({ title: solution.seoTitle, description: solution.seoDescription, path: linkberryPath })
useFbJsonLd([solutionJsonLd(solution, linkberryPath), faqJsonLd(solution.faq)])
</script>

<style scoped>
.lb-page {
    overflow-wrap: anywhere;
}
.lb-caption {
    margin-top: 20px;
    font-size: 13px;
    color: var(--ink-2);
}
.lb-identity {
    padding: clamp(28px, 4vw, 56px);
    background: var(--ink-bg);
    color: var(--ink-fg);
    border-radius: var(--radius-l);
}
.lb-identity > img {
    margin-bottom: 24px;
}
.lb-wordmark {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    font-family: var(--font-disp);
    font-size: clamp(32px, 4vw, 52px);
    font-weight: 600;
}
.lb-wordmark span,
.lb-badge {
    font: 500 12px var(--font-mono);
    padding: 6px 10px;
    border-radius: var(--radius-s);
    background: var(--accent-2);
    color: var(--accent);
}
.lb-wordmark span {
    color: var(--ink-accent);
    border: 1px solid var(--ink-line);
}
.lb-identity > p + p {
    color: var(--ink-fg2);
    margin-top: 10px;
}
.lb-identity ul {
    list-style: none;
    padding: 24px 0 0;
    margin: 24px 0 0;
    border-top: 1px solid var(--ink-line);
    display: grid;
    gap: 14px;
}
.lb-identity li span {
    color: var(--ink-accent);
    font-family: var(--font-mono);
    margin-right: 20px;
}
.lb-notice {
    margin-top: 40px;
    padding: 24px;
    border-left: 3px solid var(--accent);
    background: var(--accent-2);
    border-radius: var(--radius-s);
}
.lb-notice p {
    margin-top: 8px;
    color: var(--ink-2);
}
.lb-features {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 28px;
    margin-top: 40px;
}
.lb-features article {
    padding-top: 20px;
    border-top: 1px solid var(--line);
}
.lb-number {
    font: 500 13px var(--font-mono);
    color: var(--accent);
}
.lb-page h3 {
    font-size: 20px;
    line-height: 1.45;
}
.lb-features h3 {
    margin-top: 18px;
}
.lb-features p,
.lb-guidance p,
.lb-faq p {
    margin-top: 12px;
    color: var(--ink-2);
    line-height: 1.8;
}
.lb-guidance {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 32px;
    padding-top: 44px;
    margin-top: 44px;
    border-top: 1px solid var(--line);
}
.lb-download-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 56px;
    align-items: start;
}
.lb-limits {
    margin: 28px 0 0;
    padding-left: 20px;
    color: var(--ink-2);
    line-height: 1.8;
}
.lb-limits li + li {
    margin-top: 10px;
}
.lb-download-card {
    padding: clamp(24px, 3vw, 40px);
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius-l);
}
.lb-download-card h3 {
    margin-top: 20px;
    font-size: 26px;
}
.lb-download-card dl {
    margin: 24px 0;
    font-size: 14px;
}
.lb-download-card dl div {
    display: grid;
    grid-template-columns: 70px minmax(0, 1fr);
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid var(--line);
}
.lb-download-card dt {
    color: var(--ink-2);
}
.lb-download-card dd {
    margin: 0;
}
.lb-download-card > p {
    font-size: 14px;
    line-height: 1.8;
}
.lb-download-card a,
.lb-terms + p a {
    text-decoration: underline;
    text-underline-offset: 3px;
}
.lb-confirm {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin: 24px 0;
    font-size: 14px;
    cursor: pointer;
}
.lb-confirm input {
    margin-top: 4px;
    width: 18px;
    height: 18px;
    flex: none;
    accent-color: var(--accent);
}
.lb-download-card button {
    width: 100%;
    justify-content: center;
    white-space: normal;
}
.lb-checksum {
    margin-top: 24px;
    font-size: 12px;
    color: var(--ink-2);
}
.lb-checksum summary {
    cursor: pointer;
    padding: 8px 0;
}
.lb-checksum code {
    display: block;
    margin: 10px 0;
    font-family: var(--font-mono);
    word-break: break-all;
}
.lb-terms {
    margin-top: 40px;
}
.lb-terms article {
    display: grid;
    grid-template-columns: 40px minmax(0, 1fr);
    gap: 20px;
    padding: 28px 0;
    border-top: 1px solid var(--ink-line);
}
.lb-terms .lb-number {
    color: var(--ink-accent);
    padding-top: 6px;
}
.lb-terms p {
    color: var(--ink-fg2);
    line-height: 1.9;
    margin-top: 14px;
    max-width: 880px;
}
.section--ink .lb-caption {
    color: var(--ink-fg2);
}
.lb-faq {
    margin-top: 40px;
    max-width: 900px;
}
.lb-faq article {
    padding: 28px 0;
    border-top: 1px solid var(--line);
}
.lb-page :is(input, summary, a):focus-visible {
    outline: 3px solid var(--accent);
    outline-offset: 4px;
}
.section--ink a:focus-visible {
    outline-color: var(--ink-accent);
}
@media (max-width: 920px) {
    .lb-download-grid {
        grid-template-columns: 1fr;
        gap: 32px;
    }
    .lb-features {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .lb-guidance {
        grid-template-columns: 1fr;
        gap: 28px;
    }
}
@media (max-width: 480px) {
    .lb-features {
        grid-template-columns: 1fr;
        gap: 24px;
    }
    .lb-terms article {
        grid-template-columns: 24px minmax(0, 1fr);
        gap: 12px;
    }
}
</style>
