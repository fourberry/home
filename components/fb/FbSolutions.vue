<template>
    <section id="solutions" class="section">
        <div class="container">
            <div v-reveal class="section-head">
                <span class="eyebrow">Solution · 자체 솔루션</span>
                <h2>검증된 자체 솔루션으로<br />도입을 앞당깁니다.</h2>
                <p class="lead">인증·메시징·데이터 수집을 표준화한 포베리의 자체 솔루션 라인업입니다.</p>
            </div>
            <div class="sol">
                <article
                    v-for="(s, i) in solutions"
                    :key="s.name"
                    v-reveal
                    class="sol-card"
                    :class="{ reverse: i % 2 === 1 }"
                >
                    <div class="sol-media">
                        <img class="slot-img" :src="s.image" :alt="`${s.name} ${s.ko} — ${s.tag}`" loading="lazy" />
                    </div>
                    <div class="sol-body">
                        <div class="sol-head">
                            <div class="sol-head-text">
                                <span class="sol-tag">{{ s.tag }}</span>
                                <h3>{{ s.name }} <span class="ko">{{ s.ko }}</span></h3>
                            </div>
                            <a href="#contact" class="btn btn-ghost sol-cta" @click="trackSolutionInquiry(s.name)">도입 문의 <span class="arw">→</span></a>
                        </div>
                        <p>{{ s.desc }}</p>
                        <div class="sol-feats">
                            <div v-for="ft in s.feats" :key="ft.t" class="f">
                                <b>{{ ft.t }}</b><span>{{ ft.d }}</span>
                            </div>
                        </div>
                        <!-- 상세 페이지로 가는 링크. 크롤러가 솔루션 페이지를 발견하는 경로입니다. -->
                        <NuxtLink :to="`/solutions/${s.slug}`" class="sol-detail">
                            {{ s.name }} 자세히 보기 <span class="arw">→</span>
                        </NuxtLink>
                    </div>
                </article>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { fbSolutions } from '~/data/solutions'

// 어느 솔루션에 관심이 쏠리는지 파악하기 위한 GA4 이벤트.
// 앵커 이동(#contact)은 페이지 전환이 아니라 GA 가 자동으로 잡지 못합니다.
const trackSolutionInquiry = (solution: string) => {
    useTrackEvent('solution_inquiry_click', { solution })
}

// 데이터는 data/solutions.ts 가 단일 출처입니다.
// 상세 페이지(pages/solutions/[slug].vue)와 같은 내용을 씁니다.
const solutions = fbSolutions
</script>
