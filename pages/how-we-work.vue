<template>
    <div class="ai-work-page">
        <section class="section fb-page-head">
            <div class="ai-head container">
                <div class="ai-head-main">
                    <FbBreadcrumb :items="crumbs" />
                    <span class="eyebrow">How We Work · AI 활용 개발</span>
                    <!-- 홈 섹션(FbAiWorkflow.vue)의 h2 와 같은 문장입니다 -->
                    <h1 v-reveal>
                        {{ aiWorkflow.headline[0] }}
                        <br />
                        {{ aiWorkflow.headline[1] }}
                    </h1>
                    <p v-reveal class="lead">{{ aiWorkflow.lead }}</p>
                    <div class="fb-page-actions">
                        <NuxtLink :to="aiInquiryHref('hero')" class="btn btn-primary" @click="trackInquiry('hero')">
                            프로젝트 상담
                            <span class="arw">→</span>
                        </NuxtLink>
                        <NuxtLink to="/work/" class="btn btn-ghost" @click="trackNavigation('work')">수행 실적 보기</NuxtLink>
                    </div>
                    <!-- 페이지 안 목차 — 위의 버튼과 위계가 겹치지 않도록 텍스트형으로 둡니다 -->
                    <nav class="ai-toc" aria-label="개발 방식 페이지 목차">
                        <a href="#process" @click="trackNavigation('process')">01 개발 과정</a>
                        <a href="#experience" @click="trackNavigation('experience')">02 적용 경험</a>
                        <a href="#principles" @click="trackNavigation('principles')">03 개발 기준</a>
                        <a href="#questions" @click="trackNavigation('questions')">04 자주 묻는 질문</a>
                    </nav>
                </div>
                <!-- 기준의 층과 AI·사람의 역할 경계 — 페이지의 핵심 구조를 먼저 보여주는 도식 -->
                <div v-reveal class="ai-diagram" role="img" aria-label="회사 공통 AI 개발 기준이 프로젝트 고유 업무 규칙으로 이어지고, 그 아래에서 AI는 구현과 테스트를, 사람은 판단과 승인을 맡습니다">
                    <span class="ai-diagram-cap">기준의 층</span>
                    <template v-for="(layer, i) in aiWorkflow.diagram.layers" :key="layer.t">
                        <div v-if="i > 0" class="ai-diagram-arrow" aria-hidden="true">↓</div>
                        <div class="ai-diagram-layer">
                            <b>{{ layer.t }}</b>
                            <span>{{ layer.tag }}</span>
                        </div>
                    </template>
                    <div class="ai-diagram-arrow" aria-hidden="true">↓</div>
                    <div class="ai-diagram-roles">
                        <div v-for="role in aiWorkflow.diagram.roles" :key="role.who" class="ai-diagram-role" :class="{ 'is-human': role.who === '사람' }">
                            <span>{{ role.who }}</span>
                            <b>{{ role.t }}</b>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="process" class="section section--ink">
            <div class="container">
                <div v-reveal class="section-head">
                    <span class="eyebrow">Process · 개발 과정</span>
                    <h2>
                        같은 요구사항에서 시작해,
                        <br />
                        검증 결과까지 함께 봅니다.
                    </h2>
                    <p class="lead">작은 작업 단위로 구현하고 확인하며, 다음 작업에 피드백을 반영합니다.</p>
                </div>
                <ol v-reveal class="fb-step-grid fb-stagger">
                    <li v-for="step in aiWorkflow.steps" :key="step.idx" class="fb-step">
                        <div class="idx">{{ step.idx }}</div>
                        <h3>{{ step.t }}</h3>
                        <p>{{ step.d }}</p>
                    </li>
                </ol>
            </div>
        </section>

        <!-- 적용 경험 — 사례를 섹션마다 나누지 않고, '경험 → 공통 기준 → 다음 개발' 흐름 하나로 보여줍니다 -->
        <section id="experience" class="section section--alt">
            <div class="container">
                <div class="fb-split">
                    <div v-reveal class="fb-split-side">
                        <span class="eyebrow">Experience · 적용 경험</span>
                        <h2>
                            한 프로젝트의 경험을
                            <br />
                            다음 개발에 연결합니다.
                        </h2>
                    </div>
                    <p v-reveal class="ai-cases-intro">{{ aiWorkflow.casesIntro }}</p>
                </div>
                <ol v-reveal class="ai-cases fb-stagger">
                    <li v-for="c in aiWorkflow.cases" :key="c.name" class="ai-case" :class="`is-${c.tone}`">
                        <span class="ai-case-idx">
                            {{ c.idx }} · {{ c.name }}
                            <em v-if="c.status">· {{ c.status }}</em>
                        </span>
                        <h3>{{ c.title }}</h3>
                        <p>{{ c.body }}</p>
                    </li>
                </ol>
            </div>
        </section>

        <section id="principles" class="section">
            <div class="fb-split container">
                <div v-reveal class="fb-split-side">
                    <span class="eyebrow">Principles · 우리가 지키는 기준</span>
                    <h2>
                        변경을 설명하고
                        <br />
                        확인할 수 있도록.
                    </h2>
                </div>
                <ol v-reveal class="ai-principles fb-stagger">
                    <li v-for="principle in aiWorkflow.principles" :key="principle.h">
                        <span class="idx">{{ principle.idx }}</span>
                        <h3>{{ principle.h }}</h3>
                        <p>{{ principle.body }}</p>
                    </li>
                </ol>
            </div>
        </section>

        <section id="questions" class="section section--alt">
            <div class="fb-split container">
                <div class="fb-split-side">
                    <span class="eyebrow">FAQ · 자주 묻는 질문</span>
                    <h2>AI 활용 개발이 궁금하신가요?</h2>
                </div>
                <dl class="fb-faq">
                    <template v-for="item in aiWorkflowFaq" :key="item.q">
                        <dt>{{ item.q }}</dt>
                        <dd>{{ item.a }}</dd>
                    </template>
                </dl>
            </div>
        </section>

        <FbCtaBand
            title="함께 만들 프로젝트가 있으신가요?"
            desc="해결하려는 문제와 현재 환경을 알려주시면, 필요한 개발 범위와 진행 방법을 함께 검토합니다."
            :inquiry-to="aiInquiryHref('cta_band')"
            @inquiry="trackInquiry('cta_band')"
        />
    </div>
</template>

<script setup lang="ts">
import { aiWorkflow, aiWorkflowFaq } from '~/data/aiWorkflow'
import { aiInquiryHref } from '~/utils/inquiryAnalytics'

const { trackNavigation, trackInquiry } = useAiWorkflowTracking()

const crumbs = [
    { name: '홈', path: '/' },
    { name: aiWorkflow.title, path: '/how-we-work/' },
]

useFbSeo({ title: aiWorkflow.title, description: aiWorkflow.description, path: '/how-we-work/' })
useFbJsonLd(faqJsonLd(aiWorkflowFaq))
</script>

<style scoped>
.ai-work-page :is(h1, h2, h3) {
    word-break: keep-all;
    overflow-wrap: anywhere;
}
.ai-work-page section[id] {
    scroll-margin-top: 96px;
}

/* ---------- 페이지 머리: 좌 본문 / 우 도식 ---------- */
.ai-head {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
    gap: clamp(40px, 6vw, 96px);
    align-items: start;
}
.ai-head .lead {
    max-width: 520px;
}
.ai-toc {
    margin-top: clamp(40px, 5vw, 64px);
    display: flex;
    flex-wrap: wrap;
    gap: 12px 28px;
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.08em;
}
.ai-toc a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    color: var(--ink-3);
    border-bottom: 1px solid transparent;
    transition:
        color 0.2s ease,
        border-color 0.2s ease;
}
.ai-toc a:hover {
    color: var(--ink);
    border-bottom-color: var(--ink);
}
.ai-toc a:focus-visible {
    outline: 3px solid var(--accent);
    outline-offset: 4px;
}

.ai-diagram {
    margin-top: clamp(24px, 4vw, 60px);
    padding: clamp(24px, 3vw, 40px) clamp(22px, 3vw, 36px);
    background: var(--ink-bg);
    color: var(--ink-fg);
    border-radius: var(--radius-l);
    box-shadow: var(--shadow-lg);
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.ai-diagram-cap {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ink-accent);
}
.ai-diagram-layer {
    padding: 20px 22px;
    border: 1px solid var(--ink-line);
    border-radius: var(--radius);
    background: var(--ink-surface);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
}
.ai-diagram-layer b {
    font-size: 15px;
    font-weight: 600;
}
.ai-diagram-layer span {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--ink-accent);
    white-space: nowrap;
}
.ai-diagram-arrow {
    text-align: center;
    color: var(--ink-accent);
    font-size: 16px;
    line-height: 1;
    margin: -4px 0;
}
.ai-diagram-roles {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
}
.ai-diagram-role {
    padding: 20px 22px;
    border-radius: var(--radius);
    border: 1px dashed rgba(94, 168, 234, 0.5);
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.ai-diagram-role span {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.1em;
    color: var(--ink-accent);
}
.ai-diagram-role b {
    font-size: 15px;
    font-weight: 600;
}
.ai-diagram-role.is-human {
    border: 1px solid transparent;
    background: var(--accent);
}
.ai-diagram-role.is-human span,
.ai-diagram-role.is-human b {
    color: var(--on-accent);
}

/* ---------- 적용 경험: 3단 흐름 카드 ---------- */
.ai-cases-intro {
    margin-top: 8px;
    font-size: 17px;
    line-height: 1.75;
    color: var(--ink-2);
    max-width: 560px;
}
.ai-cases {
    list-style: none;
    margin: clamp(40px, 5vw, 64px) 0 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px;
}
.ai-case {
    padding: clamp(28px, 3vw, 36px) clamp(24px, 2.5vw, 32px);
    border: 1px solid var(--line);
    border-radius: 12px;
    background: var(--bg);
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.ai-case-idx {
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.08em;
    color: var(--accent);
}
.ai-case-idx em {
    font-style: normal;
    color: var(--ink-3);
}
.ai-case h3 {
    font-size: 20px;
    line-height: 1.35;
}
.ai-case p {
    margin-top: 4px;
    font-size: 14.5px;
    line-height: 1.7;
    color: var(--ink-2);
}
/* 가운데(공통 기준)를 다크로 강조해 '연결'을 보여줍니다 */
.ai-case.is-dark {
    background: var(--ink-bg);
    border-color: transparent;
    color: var(--ink-fg);
}
.ai-case.is-dark .ai-case-idx {
    color: var(--ink-accent);
}
.ai-case.is-dark p {
    color: var(--ink-fg2);
}
.ai-case.is-raised {
    background: var(--surface);
    box-shadow: var(--shadow);
}

/* ---------- 개발 기준: 2×2 번호 카드 ---------- */
.ai-principles {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
}
.ai-principles li {
    padding: clamp(24px, 2.5vw, 32px) clamp(22px, 2.5vw, 30px);
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 14px;
}
.ai-principles .idx {
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.08em;
    color: var(--accent);
}
.ai-principles h3 {
    font-size: 17px;
    line-height: 1.4;
}
.ai-principles p {
    font-size: 14px;
    line-height: 1.7;
    color: var(--ink-2);
}

@media (max-width: 920px) {
    .ai-head {
        grid-template-columns: 1fr;
    }
    .ai-diagram {
        margin-top: 0;
        max-width: 560px;
    }
    .ai-cases {
        grid-template-columns: 1fr;
    }
    .ai-principles {
        grid-template-columns: 1fr;
    }
}
@media (max-width: 560px) {
    .ai-toc {
        gap: 4px 20px;
    }
    .ai-diagram-roles {
        grid-template-columns: 1fr;
    }
}
@media (prefers-reduced-motion: reduce) {
    .ai-toc a {
        transition: none;
    }
}
</style>
