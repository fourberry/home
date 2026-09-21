<template>
    <div class="ai-work-page">
        <section class="section fb-page-head">
            <div class="container">
                <FbBreadcrumb :items="crumbs" />
                <span class="eyebrow">How We Work · AI 활용 개발</span>
                <h1 v-reveal>
                    AI와 함께 개발하고,
                    <br />
                    사람이 판단합니다.
                </h1>
                <p v-reveal class="lead">{{ aiWorkflow.intro }}</p>
                <div class="fb-page-actions">
                    <NuxtLink to="/#contact" class="btn btn-primary">
                        프로젝트 상담
                        <span class="arw">→</span>
                    </NuxtLink>
                    <NuxtLink to="/work/" class="btn btn-ghost">수행 실적 보기</NuxtLink>
                </div>
                <nav class="ai-jump-links" aria-label="개발 방식 페이지 목차">
                    <a href="#process">개발 과정</a>
                    <a href="#experience">적용 경험</a>
                    <a href="#principles">개발 기준</a>
                    <a href="#questions">자주 묻는 질문</a>
                </nav>
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

        <section v-for="(example, index) in aiWorkflow.cases" :id="index === 0 ? 'experience' : undefined" :key="example.name" class="section" :class="{ 'section--alt': index === 1 }">
            <div class="fb-split container">
                <div v-reveal class="fb-split-side">
                    <span class="eyebrow">{{ example.name }} · {{ example.status }}</span>
                    <h2>{{ example.title }}</h2>
                </div>
                <div v-reveal class="fb-prose">
                    <p>{{ example.body }}</p>
                    <p>{{ example.detail }}</p>
                </div>
            </div>
        </section>

        <section id="principles" class="section">
            <div class="fb-prose fb-prose--narrow container">
                <div v-reveal>
                    <span class="eyebrow">Principles · 우리가 지키는 기준</span>
                    <h2>변경을 설명하고 확인할 수 있도록.</h2>
                </div>
                <article v-for="principle in aiWorkflow.principles" :key="principle.h" v-reveal>
                    <h3>{{ principle.h }}</h3>
                    <p>{{ principle.body }}</p>
                </article>
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

        <FbCtaBand title="함께 만들 프로젝트가 있으신가요?" desc="해결하려는 문제와 현재 환경을 알려주시면, 필요한 개발 범위와 진행 방법을 함께 검토합니다." />
    </div>
</template>

<script setup lang="ts">
import { aiWorkflow, aiWorkflowFaq } from '~/data/aiWorkflow'

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
.ai-work-page article p {
    margin-top: 14px;
}
.ai-jump-links {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 32px;
}
.ai-jump-links a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    padding: 10px 16px;
    border: 1px solid var(--line);
    border-radius: var(--radius-s);
    color: var(--ink-2);
    font-size: 14px;
    transition:
        color 0.2s ease,
        border-color 0.2s ease,
        background 0.2s ease;
}
.ai-jump-links a:hover {
    border-color: var(--accent);
    background: var(--accent-lite);
    color: var(--accent);
}
.ai-jump-links a:focus-visible {
    outline: 3px solid var(--accent);
    outline-offset: 4px;
}
@media (prefers-reduced-motion: reduce) {
    .ai-jump-links a {
        transition: none;
    }
}
</style>
