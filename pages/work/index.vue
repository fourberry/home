<template>
    <div>
        <section class="section fb-page-head">
            <div class="container">
                <FbBreadcrumb :items="crumbs" />
                <span class="eyebrow">Work · SI / SM 실적</span>
                <h1>
                    만들고, 지키고,
                    <br />
                    더 나은 시스템으로.
                </h1>
                <p class="lead">
                    제조·유통, 금융, 공공, 교육 등 다양한 분야에서 시스템 구축부터 운영·고도화까지 함께해온 대표 프로젝트입니다. 구축으로 끝내지 않고 운영(SM) 단계까지 이어가는 것이 포베리의
                    방식입니다.
                </p>
            </div>
        </section>

        <section class="section section--ink">
            <div class="container">
                <div class="work-grid fb-stagger">
                    <NuxtLink v-for="p in fbProjects" :key="p.id" class="work-card" :to="`/work/${p.id}/`">
                        <div class="work-thumb">
                            <img class="slot-img" :src="p.thumb" :alt="`${p.client} — ${p.title}`" loading="lazy" />
                        </div>
                        <div class="work-meta">
                            <span class="yr">{{ p.period }}</span>
                            <h2>{{ p.client }}</h2>
                            <p>{{ p.title }}</p>
                        </div>
                        <div class="work-more">자세히 보기 →</div>
                    </NuxtLink>
                </div>
            </div>
        </section>

        <FbCtaBand title="비슷한 프로젝트를 검토 중이신가요?" desc="구축이 필요한 상황인지, 운영 중인 시스템의 고도화인지 알려주시면 적합한 범위를 제안드립니다." />
    </div>
</template>

<script setup lang="ts">
import { fbProjects } from '~/data/projects'

const crumbs = [
    { name: '홈', path: '/' },
    { name: '수행 실적', path: '/work' },
]

useFbSeo({
    title: 'SI 구축 · SM 운영 수행 실적',
    description:
        '포베리가 수행한 SI 구축·SM 운영 프로젝트입니다. OMS·차세대 영업관리 시스템, 브랜드몰과 통합 인증(SSO), 자동차 사이버보안(K-CSMS) 대응 시스템, 무중단 DB 전환 등의 실적을 확인하실 수 있습니다.',
    path: '/work',
})
</script>
