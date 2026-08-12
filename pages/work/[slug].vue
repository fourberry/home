<template>
    <div>
        <section class="section fb-page-head">
            <div class="container">
                <FbBreadcrumb :items="crumbs" />
                <span class="eyebrow">{{ project.category }} · {{ project.period }}</span>
                <h1>{{ project.title }}</h1>
                <p class="fb-client">Client · {{ project.client }}</p>
                <p class="lead fb-pre">{{ project.overview }}</p>
            </div>
        </section>

        <section class="section section--ink">
            <div class="container">
                <img class="fb-shot slot-img" :src="project.thumb" :alt="`${project.client} ${project.title} 화면`" />
            </div>
        </section>

        <section class="section">
            <div class="fb-split container">
                <div class="fb-split-side">
                    <span class="eyebrow">Background · 과제</span>
                    <h2>어떤 과제였나.</h2>
                </div>
                <div class="fb-prose">
                    <p>{{ project.background }}</p>
                </div>
            </div>
        </section>

        <section class="section section--alt">
            <div class="fb-split container">
                <div class="fb-split-side">
                    <span class="eyebrow">Scope · 수행 범위</span>
                    <h2>포베리가 한 일.</h2>
                </div>
                <ol class="fb-scope">
                    <li v-for="s in project.scope" :key="s">{{ s }}</li>
                </ol>
            </div>
        </section>

        <section v-if="project.stack?.length" class="section">
            <div class="fb-split container">
                <div class="fb-split-side">
                    <span class="eyebrow">Stack · 기술</span>
                    <h2>사용 기술.</h2>
                </div>
                <ul class="fb-chips">
                    <li v-for="t in project.stack" :key="t">{{ t }}</li>
                </ul>
            </div>
        </section>

        <section class="section section--alt">
            <div class="fb-prose fb-prose--narrow container">
                <span class="eyebrow">Note · 용어 풀이</span>
                <h2>{{ project.domainTitle }}</h2>
                <p>{{ project.domainBody }}</p>
            </div>
        </section>

        <section class="section section--ink">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">Work · 다른 실적</span>
                    <h2>다른 프로젝트도 보시겠어요?</h2>
                </div>
                <div class="work-grid fb-stagger">
                    <NuxtLink v-for="p in others" :key="p.id" class="work-card" :to="`/work/${p.id}`">
                        <div class="work-thumb">
                            <img class="slot-img" :src="p.thumb" :alt="`${p.client} — ${p.title}`" loading="lazy" />
                        </div>
                        <div class="work-meta">
                            <span class="yr">{{ p.period }}</span>
                            <h3>{{ p.client }}</h3>
                            <p>{{ p.title }}</p>
                        </div>
                        <div class="work-more">자세히 보기 →</div>
                    </NuxtLink>
                </div>
            </div>
        </section>

        <FbCtaBand />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { fbProjects, findProject } from '~/data/projects'

const route = useRoute()
const slug = String(route.params.slug)
const found = findProject(slug)

// 프리렌더 중 존재하지 않는 slug 가 들어오면 여기서 멈춥니다.
if (!found) {
    throw createError({ statusCode: 404, statusMessage: '존재하지 않는 실적입니다.', fatal: true })
}
const project = found

// 같은 화면에 자기 자신이 다시 나오지 않게 걸러내고 3건만 보여줍니다.
const others = computed(() => fbProjects.filter(p => p.id !== project.id).slice(0, 3))

const crumbs = [
    { name: '홈', path: '/' },
    { name: '수행 실적', path: '/work' },
    { name: project.client, path: `/work/${project.id}` },
]

useFbSeo({
    title: project.seoTitle,
    description: project.seoDescription,
    path: `/work/${project.id}`,
    image: project.thumb,
})
</script>
