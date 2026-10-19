<template>
    <section id="tools" class="section section--alt">
        <div class="container">
            <div class="section-head">
                <span class="eyebrow">Tools · 개발·운영 도구</span>
                <h2>
                    매일의 작업에 필요한
                    <br />
                    도구를 만듭니다.
                </h2>
                <p class="lead">개발자와 운영 담당자가 PC에 설치해 직접 사용하는 도구입니다. 제공 버전과 이용 조건을 확인하고 시작하세요.</p>
            </div>
            <article class="tool-card">
                <div class="tool-mark"><img :src="tool.brand!.mark" :alt="tool.name + ' 심볼'" width="120" height="120" /></div>
                <div class="tool-body">
                    <span class="eyebrow">Windows x64 · 베타</span>
                    <h3>
                        {{ tool.name }}
                        <span>{{ tool.ko }}</span>
                    </h3>
                    <p>{{ tool.desc }}</p>
                    <ul aria-label="주요 기능">
                        <li v-for="feature in tool.feats" :key="feature.t">{{ feature.t }}</li>
                    </ul>
                    <NuxtLink :to="linkberryPath + '/'" class="btn btn-primary">
                        베타 소개·다운로드
                        <span aria-hidden="true">→</span>
                    </NuxtLink>
                </div>
            </article>
        </div>
    </section>
</template>

<script setup lang="ts">
import { linkberryTool as tool, linkberryPath } from '~/data/linkberry'
</script>

<style scoped>
.tool-card {
    display: grid;
    grid-template-columns: 200px minmax(0, 1fr);
    gap: 40px;
    margin-top: 40px;
    padding: 40px;
    border: 1px solid var(--line);
    border-radius: var(--radius-l);
    background: var(--bg);
}
.tool-mark {
    display: grid;
    place-items: center;
    align-self: stretch;
}
.tool-body h3 {
    margin-top: 16px;
    font: 600 34px var(--font-disp);
}
.tool-body h3 span {
    font: 400 16px var(--font-sans);
    color: var(--ink-2);
    margin-left: 10px;
}
.tool-body p {
    color: var(--ink-2);
    margin-top: 16px;
    max-width: 700px;
    line-height: 1.8;
}
.tool-body ul {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    gap: 8px;
    padding: 0;
    margin: 22px 0 28px;
}
.tool-body li {
    border: 1px solid var(--line);
    border-radius: var(--radius-s);
    padding: 6px 10px;
    font-size: 13px;
    color: var(--ink-2);
}
@media (max-width: 920px) {
    .tool-card {
        grid-template-columns: 120px minmax(0, 1fr);
        gap: 24px;
        padding: 28px;
    }
}
@media (max-width: 600px) {
    .tool-card {
        grid-template-columns: 1fr;
        padding: 24px;
    }
    .tool-mark {
        justify-content: start;
    }
    .tool-mark img {
        width: 72px;
        height: 72px;
    }
    .tool-body h3 {
        font-size: 30px;
    }
    .tool-body .btn {
        white-space: normal;
    }
}
</style>
