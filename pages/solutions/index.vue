<template>
    <div>
        <section class="section fb-page-head">
            <div class="container">
                <FbBreadcrumb :items="crumbs" />
                <span class="eyebrow">Solution · 자체 솔루션</span>
                <h1>
                    검증된 자체 솔루션으로
                    <br />
                    도입을 앞당깁니다.
                </h1>
                <p class="lead">
                    인증·메시징·데이터 수집처럼 어느 프로젝트에나 반복해서 필요한 기능을 표준화한 포베리의 자체 솔루션 라인업입니다. 세 솔루션 모두 단독 도입이 가능하며, 기존 서비스 구조에 맞춰
                    연동합니다.
                </p>
            </div>
        </section>

        <section class="section section--alt">
            <div class="container">
                <div class="fb-card-grid fb-stagger">
                    <NuxtLink v-for="s in fbSolutions" :key="s.slug" class="fb-card" :to="`/solutions/${s.slug}/`">
                        <div class="fb-card-media">
                            <img class="slot-img" :src="s.image" :alt="`${s.name} ${s.ko} — ${s.tag}`" loading="lazy" />
                        </div>
                        <div class="fb-card-body">
                            <span class="sol-tag">{{ s.tag }}</span>
                            <h2>
                                {{ s.name }}
                                <span class="ko">{{ s.ko }}</span>
                            </h2>
                            <p>{{ s.desc }}</p>
                        </div>
                        <div class="fb-card-more">자세히 보기 →</div>
                    </NuxtLink>
                </div>
            </div>
        </section>

        <FbCtaBand title="어떤 솔루션이 맞을지 함께 골라 드립니다." desc="현재 시스템 구조와 도입 목적을 알려주시면 적합한 솔루션과 연동 방식을 제안드립니다." />
    </div>
</template>

<script setup lang="ts">
import { fbSolutions } from '~/data/solutions'

const crumbs = [
    { name: '홈', path: '/' },
    { name: '솔루션', path: '/solutions' },
]

useFbSeo({
    title: '자체 솔루션 — SSO 인증 · 통합 메시징 · 웹 스크래핑',
    description: '포베리의 자체 솔루션 라인업입니다. SSO 통합 인증(COCONUT), 알림톡·SMS 통합 발송(LIME), 웹 스크래핑·업무 자동화(MUSCAT) 세 가지를 단독 도입 또는 연동 구축으로 제공합니다.',
    path: '/solutions',
})
</script>
