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
            <div v-reveal class="work-grid fb-stagger">
                <button
                    v-for="p in fbProjects"
                    :key="p.id"
                    class="work-card"
                    type="button"
                    @click="selected = p"
                >
                    <div class="work-thumb">
                        <img class="slot-img" :src="p.thumb" :alt="p.client" loading="lazy" />
                    </div>
                    <div class="work-meta">
                        <span class="yr">{{ p.period }}</span>
                        <h4>{{ p.client }}</h4>
                        <p>{{ p.title }}</p>
                    </div>
                    <div class="work-more">자세히 보기 →</div>
                </button>
            </div>
        </div>
        <FbProjectModal :project="selected" @close="selected = null" />
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { fbProjects, type FbProject } from '~/data/projects'

const selected = ref<FbProject | null>(null)
</script>
