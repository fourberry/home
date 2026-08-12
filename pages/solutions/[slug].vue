<template>
    <div>
        <section class="section fb-page-head">
            <div class="container">
                <FbBreadcrumb :items="crumbs" />
                <span class="eyebrow">{{ solution.tag }}</span>
                <h1 class="fb-headline">{{ solution.headline }}</h1>
                <p class="lead">{{ solution.desc }}</p>
                <div class="fb-page-actions">
                    <NuxtLink to="/#contact" class="btn btn-primary" @click="trackInquiry">
                        도입 문의
                        <span class="arw">→</span>
                    </NuxtLink>
                    <NuxtLink to="/solutions/" class="btn btn-ghost">다른 솔루션 보기</NuxtLink>
                </div>
            </div>
        </section>

        <section class="section section--alt">
            <div class="fb-split container">
                <div class="fb-split-side">
                    <span class="eyebrow">Problem · 이런 상황이라면</span>
                    <h2>이런 상황에서 씁니다.</h2>
                </div>
                <ul class="fb-problems">
                    <li v-for="p in solution.problems" :key="p">{{ p }}</li>
                </ul>
            </div>
        </section>

        <section class="section section--ink">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">Feature · 핵심 기능</span>
                    <h2>{{ solution.name }}이(가) 하는 일.</h2>
                </div>
                <div class="fb-feat-grid fb-stagger">
                    <div v-for="f in solution.feats" :key="f.t" class="fb-feat">
                        <b>{{ f.t }}</b>
                        <span>{{ f.d }}</span>
                    </div>
                </div>
                <img class="fb-shot slot-img" :src="solution.image" :alt="`${solution.name} ${solution.ko} 화면`" loading="lazy" />
            </div>
        </section>

        <section class="section">
            <div class="fb-prose container">
                <article v-for="sec in solution.sections" :key="sec.h">
                    <h2>{{ sec.h }}</h2>
                    <p>{{ sec.body }}</p>
                </article>
            </div>
        </section>

        <section v-if="solution.stack?.length" class="section section--alt">
            <div class="fb-split container">
                <div class="fb-split-side">
                    <span class="eyebrow">Stack · 구현 기술</span>
                    <h2>무엇으로 만들었나.</h2>
                    <p class="lead">도입 환경에 붙일 수 있는지 판단하실 수 있도록 구성 기술을 공개합니다.</p>
                </div>
                <ul class="fb-chips">
                    <li v-for="t in solution.stack" :key="t">{{ t }}</li>
                </ul>
            </div>
        </section>

        <section v-if="related.length" class="section">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">Work · 관련 분야 실적</span>
                    <h2>같은 분야에서 이런 일을 했습니다.</h2>
                    <p class="lead">해당 솔루션을 그대로 납품한 사례가 아니라, 같은 영역을 다룬 수행 실적입니다.</p>
                </div>
                <div class="fb-card-grid fb-card-grid--sm">
                    <NuxtLink v-for="p in related" :key="p.id" class="fb-card" :to="`/work/${p.id}/`">
                        <div class="fb-card-media">
                            <img class="slot-img" :src="p.thumb" :alt="`${p.client} — ${p.title}`" loading="lazy" />
                        </div>
                        <div class="fb-card-body">
                            <span class="sol-tag">{{ p.period }}</span>
                            <h3>{{ p.client }}</h3>
                            <p>{{ p.title }}</p>
                        </div>
                        <div class="fb-card-more">실적 자세히 보기 →</div>
                    </NuxtLink>
                </div>
            </div>
        </section>

        <!-- 배경색을 번갈아 주기 위한 조건부 클래스.
             바로 위 "관련 분야 실적" 섹션은 relatedProjects 가 없으면 통째로 빠지므로,
             그때는 FAQ 가 밝은 배경(--alt)을 이어받지 않도록 합니다. -->
        <section class="section" :class="{ 'section--alt': related.length > 0 }">
            <div class="fb-split container">
                <div class="fb-split-side">
                    <span class="eyebrow">FAQ · 자주 묻는 질문</span>
                    <h2>{{ solution.name }} 도입 전 확인.</h2>
                </div>
                <dl class="fb-faq">
                    <template v-for="item in solution.faq" :key="item.q">
                        <dt>{{ item.q }}</dt>
                        <dd>{{ item.a }}</dd>
                    </template>
                </dl>
            </div>
        </section>

        <FbCtaBand :title="`${solution.name} 도입을 검토 중이신가요?`" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { findSolution } from '~/data/solutions'
import { fbProjects } from '~/data/projects'

const route = useRoute()
const slug = String(route.params.slug)
const found = findSolution(slug)

// 프리렌더 중 존재하지 않는 slug 가 들어오면 여기서 멈춥니다.
if (!found) {
    throw createError({ statusCode: 404, statusMessage: '존재하지 않는 솔루션입니다.', fatal: true })
}
const solution = found

const related = computed(() => fbProjects.filter(p => solution.relatedProjects?.includes(p.id)))

const crumbs = [
    { name: '홈', path: '/' },
    { name: '솔루션', path: '/solutions' },
    { name: solution.name, path: `/solutions/${solution.slug}` },
]

// 원페이지의 FbSolutions.vue 와 같은 이벤트명. 어느 솔루션에 관심이 쏠리는지 파악합니다.
const trackInquiry = () => {
    useTrackEvent('solution_inquiry_click', { solution: solution.name })
}

useFbSeo({
    title: solution.seoTitle,
    description: solution.seoDescription,
    path: `/solutions/${solution.slug}`,
    image: solution.image,
})

useFbJsonLd([solutionJsonLd(solution), faqJsonLd(solution.faq)])
</script>
