<template>
    <div class="lime-page">
        <section id="overview" class="bp-hero">
            <div class="container">
                <FbBreadcrumb :items="crumbs" />
                <div class="bp-hero-grid">
                    <div>
                        <div class="bp-hero-name">
                            {{ solution.name }}
                            <span class="ko">{{ solution.ko }} · 통합 메시징</span>
                        </div>
                        <span class="eyebrow">{{ solution.tag }}</span>
                        <h1>{{ solution.headline }}</h1>
                        <p class="lead">{{ solution.desc }}</p>
                        <div class="fb-page-actions">
                            <NuxtLink to="/#contact" class="btn btn-primary" @click="trackInquiry('hero')">
                                도입 문의
                                <span class="arw" aria-hidden="true">→</span>
                            </NuxtLink>
                            <a href="#channels" class="btn btn-ghost">
                                지원 채널 살펴보기
                                <span aria-hidden="true">↓</span>
                            </a>
                        </div>
                        <div class="bp-facts">
                            <div v-for="fact in limeFacts" :key="fact.k">
                                <b>{{ fact.k }}</b>
                                <span>{{ fact.v }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="bp-hero-visual">
                        <div class="bp-frame bp-frame--hero">
                            <FbZoomImage :src="limeHero.image" :alt="limeHero.alt" :width="limeHero.w" :height="limeHero.h" loading="eager" fetchpriority="high" />
                        </div>
                        <p class="bp-note">
                            실제 대시보드 화면 · 눌러서 세부 내용을 확인하세요.
                            <br />
                            표시된 수치는 촬영 시점의 데이터이며 성능·가용성 보장을 의미하지 않습니다.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section id="channels" class="section section--alt">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">Channels · 지원 채널</span>
                    <h2>
                        고객에게도, 운영팀에게도.
                        <br />
                        필요한 곳으로 알림을 보냅니다.
                    </h2>
                    <p class="lead">공통 API로 연결하고, 새 발송사는 어댑터로 유연하게 확장합니다.</p>
                </div>
                <div v-reveal class="lime-channel-grid fb-stagger">
                    <article v-for="channel in limeChannels" :key="channel.code" class="lime-channel">
                        <span class="lime-channel-code">{{ channel.code }}</span>
                        <h3>{{ channel.name }}</h3>
                        <p>{{ channel.body }}</p>
                    </article>
                </div>
                <aside class="lime-inapp">
                    <span class="lime-channel-code">IN-APP</span>
                    <div>
                        <h3>화면 안의 알림 문구도, 템플릿으로.</h3>
                        <p>인앱 채널은 제목·본문을 즉시 만들어 반환합니다. 외부 발송이나 알림함을 제공하는 방식이 아니며, 화면 표시는 고객 서비스에서 구현합니다.</p>
                    </div>
                </aside>
                <aside class="lime-inapp">
                    <span class="lime-channel-code">ADAPTER</span>
                    <div>
                        <h3>{{ limeAdapter.title }}</h3>
                        <p>{{ limeAdapter.body }}</p>
                    </div>
                </aside>
            </div>
        </section>

        <section id="how" class="section section--ink">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">Delivery · 발송 흐름</span>
                    <h2>
                        요청은 먼저 접수하고,
                        <br />
                        발송 결과는 이어서 확인합니다.
                    </h2>
                    <p class="lead">큐와 워커가 외부 채널의 전송을 처리합니다. 서비스가 전송 완료까지 기다리는 부담을 줄이는 구조입니다.</p>
                </div>
                <ol class="lime-flow">
                    <li v-for="(step, index) in limeFlow" :key="step.t">
                        <span class="idx">STEP 0{{ index + 1 }}</span>
                        <h3>{{ step.t }}</h3>
                        <p>{{ step.d }}</p>
                    </li>
                </ol>
                <div class="lime-statuses">
                    <div v-for="status in limeStatuses" :key="status.code">
                        <code>{{ status.code }}</code>
                        <h3>{{ status.title }}</h3>
                        <p>{{ status.body }}</p>
                    </div>
                </div>
                <p class="lime-dark-note">
                    수신 완료는 발송사 도달 리포트를 제공하는 문자·카카오에서 확인합니다. 이메일·앱 푸시·Google Chat은 발송사 접수가 마지막 확인 상태입니다. 인앱은 큐 없이 문구를 반환합니다.
                </p>
            </div>
        </section>

        <section id="operations" class="section">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">Operations · 운영 관리</span>
                    <h2>연동 이후의 알림 운영까지.</h2>
                    <p class="lead">서비스가 늘어도 프로젝트·문구·결과를 같은 관리 흐름에서 다룹니다.</p>
                </div>
                <div class="lime-console-gallery">
                    <figure v-for="shot in limeConsole" :key="shot.image">
                        <div class="bp-frame"><FbZoomImage :src="shot.image" :alt="shot.alt" :width="shot.w" :height="shot.h" /></div>
                        <figcaption>
                            <h3>{{ shot.title }}</h3>
                            <p>{{ shot.body }}</p>
                        </figcaption>
                    </figure>
                </div>
                <div class="bp-fit-grid">
                    <BrandFold v-for="(item, index) in limeOperations" :key="item.n" class="bp-fit-card" :is-mobile="isMobile" :default-open="index === 0">
                        <template #summary>
                            <span class="bp-index">{{ item.n }}</span>
                            <h3>{{ item.t }}</h3>
                        </template>
                        <p>{{ item.d }}</p>
                        <ul class="lime-points">
                            <li v-for="point in item.points" :key="point">{{ point }}</li>
                        </ul>
                    </BrandFold>
                </div>
                <div class="lime-usage">
                    <div>
                        <span class="eyebrow">Use cases · 활용</span>
                        <h3>서비스의 중요한 순간에.</h3>
                    </div>
                    <p>회원가입·로그인 인증번호, 주문·배송 상태, 예약 확인과 리마인드, 정기 안내 메일, 운영팀 알림에 활용할 수 있습니다. COCONUT과 함께 구성하면 인증번호 발송도 연결합니다.</p>
                </div>
                <p class="bp-note">웹 푸시는 정보성 즉시 단건만 지원합니다. 인앱·웹 푸시는 예약·대량 발송 대상에서 제외됩니다.</p>
            </div>
        </section>

        <section id="integration" class="section section--alt">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">Integration · 연동</span>
                    <h2>
                        고객 서버와 라임 사이의
                        <br />
                        연결부터 준비합니다.
                    </h2>
                    <p class="lead">프로젝트별 채널 설정과 API Key를 준비한 뒤, 발송 요청과 결과 처리를 함께 연결합니다.</p>
                </div>
                <div class="bp-grid-3">
                    <article v-for="item in limeIntegration" :key="item.t" class="bp-int">
                        <h3>{{ item.t }}</h3>
                        <p>{{ item.d }}</p>
                    </article>
                </div>
                <details class="bp-detail">
                    <summary>
                        구성 기술과 운영 조건
                        <span class="bp-detail-icon" aria-hidden="true">+</span>
                    </summary>
                    <ul class="fb-chips bp-chips">
                        <li v-for="technology in solution.stack" :key="technology">{{ technology }}</li>
                    </ul>
                    <p>
                        API·관리 콘솔·발송 워커와 MySQL·Redis를 구성합니다. 설치 위치, 서버 자원, 발송사 연결과 백업·복구·모니터링 범위는 운영 환경에 맞춰 확인합니다. 처리량이나 가용성은 개별 구성과
                        검수 결과를 기준으로 협의합니다.
                    </p>
                </details>
            </div>
        </section>

        <section id="adoption" class="section">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">Adoption · 도입 절차</span>
                    <h2>한 서비스의 알림부터 시작하세요.</h2>
                    <p class="lead">기존 발송 흐름을 확인하고 시범 연동한 뒤 전환 범위를 정합니다. 라임 단독 도입도 가능합니다.</p>
                </div>
                <div v-reveal class="fb-step-grid lime-adoption fb-stagger">
                    <div v-for="step in limeAdoption" :key="step.idx" class="fb-step">
                        <div class="idx">{{ step.idx }}</div>
                        <h3>{{ step.t }}</h3>
                        <p>{{ step.d }}</p>
                    </div>
                </div>
                <aside class="lime-inapp lime-supply">
                    <span class="lime-channel-code">SCOPE</span>
                    <div>
                        <h3>비용과 지원은 적용 범위에 맞춰.</h3>
                        <p>사용 채널과 발송량, 설치·연동·추가 개발 범위를 기준으로 협의합니다. 발송사 계약·이용료와 구축·유지보수 비용의 포함 여부, 패치·장애 대응의 담당과 범위를 함께 확인합니다.</p>
                    </div>
                </aside>
            </div>
        </section>

        <section id="faq" class="section section--alt">
            <div class="fb-split container">
                <div class="fb-split-side">
                    <span class="eyebrow">FAQ · 자주 묻는 질문</span>
                    <h2>LIME 도입 전 확인.</h2>
                    <p class="lead">지원 범위와 실제 연동에 필요한 조건을 확인하세요.</p>
                </div>
                <div class="bp-faq">
                    <details v-for="(item, index) in solution.faq" :key="item.q" class="bp-detail" :open="index === 0">
                        <summary>
                            {{ item.q }}
                            <span class="bp-detail-icon" aria-hidden="true">+</span>
                        </summary>
                        <p>{{ item.a }}</p>
                    </details>
                </div>
            </div>
        </section>

        <section class="section section--ink lime-contact">
            <div class="container">
                <span class="eyebrow">Start with LIME</span>
                <h2>어떤 알림을 연결하고 싶으신가요?</h2>
                <p class="lead">
                    사용할 채널, 예상 발송량과 연동할 서비스를 알려주세요.
                    <br />
                    현재 환경에 맞는 구성과 도입 범위를 함께 확인하겠습니다.
                </p>
                <NuxtLink to="/#contact" class="btn btn-primary" @click="trackInquiry('pilot')">
                    라임 도입 문의
                    <span class="arw" aria-hidden="true">→</span>
                </NuxtLink>
            </div>
        </section>

        <div class="bp-mobile-bar" :hidden="!isMobile">
            <a href="#integration" class="btn btn-ghost">연동 조건</a>
            <NuxtLink to="/#contact" class="btn btn-primary" @click="trackInquiry('mobile_bar')">
                도입 문의
                <span aria-hidden="true">→</span>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { findSolution } from '~/data/solutions'
import { limeHero, limeConsole, limeFacts, limeChannels, limeAdapter, limeFlow, limeStatuses, limeOperations, limeIntegration, limeAdoption } from '~/data/lime'

// 기존 상세 주소와 검색 메타를 유지하며 브랜드 레이아웃을 적용합니다.
definePageMeta({
    layout: 'brand',
    brand: 'lime',
    brandNav: [
        { to: '#channels', label: '지원 채널' },
        { to: '#how', label: '발송 흐름' },
        { to: '#operations', label: '운영 관리' },
        { to: '#integration', label: '연동' },
        { to: '#faq', label: 'FAQ' },
    ],
})

const solution = findSolution('lime')!
const isMobile = useIsMobile()
const crumbs = [
    { name: '홈', path: '/' },
    { name: '솔루션', path: '/solutions' },
    { name: solution.name, path: '/solutions/lime' },
]
const trackInquiry = (where: 'hero' | 'pilot' | 'mobile_bar') => useTrackEvent('solution_inquiry_click', { solution: solution.name, link_location: where })

useFbSeo({ title: solution.seoTitle, description: solution.seoDescription, path: '/solutions/lime', image: solution.image })
useFbJsonLd([solutionJsonLd(solution), faqJsonLd(solution.faq)])
</script>

<style scoped>
.bp-hero-name {
    display: flex;
    margin-bottom: 20px;
}
.lime-console-gallery {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
    margin-top: 40px;
}
.lime-console-gallery figure {
    margin: 0;
    min-width: 0;
}
.lime-console-gallery figcaption {
    margin-top: 20px;
}
.lime-console-gallery h3 {
    font-size: 20px;
}
.lime-console-gallery p {
    margin-top: 10px;
    font-size: 15px;
    color: var(--ink-2);
    line-height: 1.8;
}
.lime-channel-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
    margin-top: 40px;
}
.lime-channel {
    min-width: 0;
    padding: clamp(22px, 3vw, 32px);
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius-l);
}
.lime-channel-code {
    font: 500 11px var(--font-mono);
    letter-spacing: 0.09em;
    color: var(--accent);
}
.lime-channel h3 {
    margin-top: 16px;
    font-size: 24px;
}
.lime-channel p {
    margin-top: 12px;
    color: var(--ink-2);
    font-size: 15px;
    line-height: 1.8;
    word-break: keep-all;
}
.lime-inapp {
    display: grid;
    grid-template-columns: 80px minmax(0, 1fr);
    gap: 24px;
    align-items: start;
    padding: 28px;
    margin-top: 24px;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    background: var(--accent-2);
}
.lime-inapp > span {
    padding-top: 6px;
}
.lime-inapp h3 {
    font-size: 18px;
}
.lime-inapp p {
    margin-top: 8px;
    font-size: 15px;
    color: var(--ink-2);
    line-height: 1.8;
}
.lime-flow {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 28px;
    list-style: none;
    padding: 0;
    margin: 48px 0 0;
}
.lime-flow li {
    border-top: 1px solid color-mix(in srgb, var(--ink-fg2) 35%, transparent);
    padding-top: 20px;
}
.lime-flow .idx {
    color: var(--ink-accent);
    font: 12px var(--font-mono);
    letter-spacing: 0.08em;
}
.lime-flow h3 {
    margin-top: 16px;
    font-size: 19px;
}
.lime-flow p,
.lime-statuses p,
.lime-dark-note {
    color: var(--ink-fg2);
    font-size: 14px;
    line-height: 1.8;
}
.lime-flow p {
    margin-top: 12px;
}
.lime-statuses {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1px;
    margin-top: 48px;
    border: 1px solid var(--ink-surface);
    border-radius: var(--radius);
    overflow: hidden;
    background: var(--ink-bg);
}
.lime-statuses > div {
    padding: 24px;
    background: var(--ink-surface);
}
.lime-statuses code {
    font: 12px var(--font-mono);
    color: var(--ink-accent);
}
.lime-statuses h3 {
    font-size: 17px;
    margin-top: 8px;
}
.lime-statuses p {
    margin-top: 8px;
}
.lime-dark-note {
    margin-top: 24px;
    max-width: 850px;
}
.lime-points {
    padding: 20px 0 0;
    margin: 20px 0 0;
    border-top: 1px solid var(--line);
    list-style: none;
    display: grid;
    gap: 10px;
}
.lime-points li {
    font-size: 13px;
    color: var(--ink-2);
    padding-left: 14px;
    position: relative;
}
.lime-points li::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 0;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--accent);
}
.lime-usage {
    display: grid;
    grid-template-columns: minmax(0, 0.7fr) minmax(0, 1fr);
    gap: 32px;
    align-items: center;
    margin-top: 48px;
    padding-top: 32px;
    border-top: 1px solid var(--line);
}
.lime-usage h3 {
    margin-top: 12px;
    font-size: 24px;
}
.lime-usage p,
.bp-int p {
    color: var(--ink-2);
    font-size: 15px;
    line-height: 1.8;
}
.bp-int h3 {
    font-size: 18px;
}
.bp-int p {
    margin-top: 12px;
}
.bp-detail > .fb-chips {
    margin-bottom: 24px;
}
.lime-adoption {
    grid-template-columns: repeat(4, minmax(0, 1fr));
}
.lime-supply {
    margin-top: 40px;
}
.lime-contact .lead {
    margin: 20px 0 28px;
}
@media (max-width: 920px) {
    .lime-channel-grid,
    .lime-flow,
    .lime-adoption {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .lime-usage {
        grid-template-columns: 1fr;
        gap: 20px;
    }
}
@media (max-width: 560px) {
    .lime-channel-grid,
    .lime-flow,
    .lime-statuses,
    .lime-adoption {
        grid-template-columns: minmax(0, 1fr);
    }
    .lime-inapp {
        grid-template-columns: minmax(0, 1fr);
        gap: 12px;
        padding: 22px;
    }
}
</style>
