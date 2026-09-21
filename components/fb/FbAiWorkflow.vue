<template>
    <section id="ai-workflow" class="section section--alt">
        <div class="fb-split container">
            <div v-reveal class="fb-split-side">
                <span class="eyebrow">How We Work · AI 활용 개발</span>
                <h2>
                    AI와 함께 만들고,
                    <br />
                    검토와 검증으로 완성합니다.
                </h2>
            </div>
            <div v-reveal class="fb-prose">
                <p>{{ aiWorkflow.intro }}</p>
                <p>기업용 플랫폼 개발에서 쌓은 AI 활용 경험을 회사 공통 기준으로 정리하고, 현재 개발 중인 레몬에 적용하고 있습니다.</p>
                <div>
                    <NuxtLink to="/how-we-work/" class="btn btn-primary">
                        AI와 일하는 방식 보기
                        <span class="arw">→</span>
                    </NuxtLink>
                </div>
            </div>
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
@media (max-width: 560px) {
    .btn {
        width: 100%;
        justify-content: center;
        white-space: normal;
    }
}
</style>
