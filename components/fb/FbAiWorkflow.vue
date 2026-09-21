<template>
    <section id="ai-workflow" class="section section--alt">
        <div class="container">
            <div class="fb-split">
                <div v-reveal class="fb-split-side">
                    <span class="eyebrow">How We Work · AI 활용 개발</span>
                    <!-- 페이지(/how-we-work/)의 h1 과 같은 문장입니다 — 클릭 전후가 이어지도록 data/aiWorkflow.ts 한 곳에서 관리 -->
                    <h2>
                        {{ aiWorkflow.headline[0] }}
                        <br />
                        {{ aiWorkflow.headline[1] }}
                    </h2>
                </div>
                <div v-reveal class="aiw-body">
                    <p>{{ aiWorkflow.summary }}</p>
                    <div>
                        <NuxtLink to="/how-we-work/" class="btn btn-primary">
                            {{ aiWorkflow.title }} 보기
                            <span class="arw">→</span>
                        </NuxtLink>
                    </div>
                </div>
            </div>
            <!-- 4단계 미리보기 — 번호와 제목만. 설명은 페이지에서 봅니다.
                 fb-stagger 는 반드시 v-reveal 과 함께 써야 합니다(CLAUDE.md). -->
            <ol v-reveal class="aiw-steps fb-stagger" aria-label="개발 과정 요약">
                <li v-for="step in aiWorkflow.steps" :key="step.idx">
                    <span class="idx">{{ step.idx }}</span>
                    <b>{{ step.t }}</b>
                </li>
            </ol>
        </div>
    </section>
</template>

<script setup lang="ts">
import { aiWorkflow } from '~/data/aiWorkflow'
</script>

<style scoped>
h2 {
    word-break: keep-all;
    overflow-wrap: anywhere;
}
.aiw-body {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding-top: 8px;
}
.aiw-body p {
    font-size: 17px;
    line-height: 1.75;
    color: var(--ink-2);
    max-width: 560px;
}
.aiw-steps {
    list-style: none;
    margin: clamp(48px, 6vw, 72px) 0 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 40px;
    border-top: 1px solid var(--line);
}
.aiw-steps li {
    padding-top: 28px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.aiw-steps .idx {
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.08em;
    color: var(--accent);
}
.aiw-steps b {
    font-size: 17px;
    font-weight: 600;
    color: var(--ink);
    word-break: keep-all;
}
@media (max-width: 920px) {
    .aiw-steps {
        grid-template-columns: 1fr 1fr;
        gap: 28px 32px;
    }
}
@media (max-width: 560px) {
    .aiw-body {
        padding-top: 0;
    }
    .aiw-body p {
        font-size: 15px;
    }
    .btn {
        width: 100%;
        justify-content: center;
        white-space: normal;
    }
    /* 모바일은 번호+제목 한 줄 리스트 */
    .aiw-steps {
        grid-template-columns: 1fr;
        gap: 0;
        margin-top: 40px;
    }
    .aiw-steps li {
        flex-direction: row;
        align-items: center;
        gap: 16px;
        padding: 18px 0;
        border-bottom: 1px solid var(--line-2);
    }
    .aiw-steps li:last-child {
        border-bottom: 0;
    }
    .aiw-steps b {
        font-size: 15px;
    }
}
</style>
