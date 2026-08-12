<template>
    <section id="work" class="section section--ink">
        <div class="container">
            <div v-reveal class="section-head">
                <span class="eyebrow">Work · SI / SM 실적</span>
                <h2>만들고, 지키고,<br />더 나은 시스템으로.</h2>
                <p class="lead">
                    다양한 산업 분야에서 시스템 구축부터 운영·고도화까지 함께해온 대표 프로젝트입니다.
                </p>
            </div>
            <!-- ⚠️ 카드는 반드시 링크(NuxtLink)여야 합니다.
                 <button> 으로 모달을 띄우면 검색엔진 크롤러가 상세 내용을 따라가지 못합니다. -->
            <div v-reveal class="work-grid fb-stagger">
                <NuxtLink v-for="p in fbProjects" :key="p.id" class="work-card" :to="`/work/${p.id}/`">
                    <div class="work-thumb">
                        <img class="slot-img" :src="p.thumb" :alt="`${p.client} — ${p.title}`" loading="lazy" />
                    </div>
                    <div class="work-meta">
                        <span class="yr">{{ p.period }}</span>
                        <h4>{{ p.client }}</h4>
                        <p>{{ p.title }}</p>
                    </div>
                    <div class="work-more">자세히 보기 →</div>
                </NuxtLink>
            </div>
            <div v-reveal class="work-foot">
                <NuxtLink to="/work/" class="btn btn-ghost">수행 실적 전체 보기 <span class="arw">→</span></NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { fbProjects } from '~/data/projects'
</script>
