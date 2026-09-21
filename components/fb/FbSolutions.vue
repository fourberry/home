<template>
    <section id="solutions" class="section">
        <div class="container">
            <div v-reveal class="section-head">
                <span class="eyebrow">Solution · 자체 솔루션</span>
                <h2>
                    검증된 자체 솔루션으로
                    <br />
                    도입을 앞당깁니다.
                </h2>
                <p class="lead">인증·메시징·데이터 수집을 표준화한 포베리의 자체 솔루션 라인업입니다.</p>
            </div>
            <div class="sol">
                <!-- 카드 전체가 상세 페이지 링크입니다. 카드 안에 다른 버튼을 두지 마세요 —
                     행동이 둘이면 복잡해 보여서 단순화했고(2026-09), a 안에 a 를 넣을 수도 없습니다.
                     도입 문의는 섹션 하단 버튼 한 곳과 상세 페이지가 맡습니다. -->
                <NuxtLink
                    v-for="(s, i) in solutions"
                    :key="s.name"
                    v-reveal
                    class="sol-card"
                    :class="{ reverse: i % 2 === 1 }"
                    :to="`/solutions/${s.slug}/`"
                    :aria-label="`${s.name} ${s.ko} 자세히 보기`"
                >
                    <div class="sol-media">
                        <img class="slot-img" :src="s.image" :alt="`${s.name} ${s.ko} — ${s.tag}`" loading="lazy" />
                    </div>
                    <div class="sol-body">
                        <span class="sol-tag">{{ s.tag }}</span>
                        <h3>
                            {{ s.name }}
                            <span class="ko">{{ s.ko }}</span>
                        </h3>
                        <p>{{ s.desc }}</p>
                        <ul class="sol-chips" aria-label="핵심 기능">
                            <li v-for="ft in s.feats" :key="ft.t">{{ ft.t }}</li>
                        </ul>
                        <span class="sol-more">
                            자세히 보기
                            <span class="arw">→</span>
                        </span>
                    </div>
                </NuxtLink>
            </div>
            <div class="sol-foot">
                <p>어떤 솔루션이 맞을지 함께 골라 드립니다.</p>
                <a href="#contact" class="btn btn-primary" @click="trackInquiry">
                    솔루션 도입 문의
                    <span class="arw">→</span>
                </a>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { fbSolutions } from '~/data/solutions'

// 솔루션에 대한 관심을 파악하기 위한 GA4 이벤트.
// 카드별 버튼을 없애고 섹션 하단 버튼 하나로 합쳤으므로 solution 은 'ALL' 입니다.
// 솔루션별 관심은 상세·브랜드 페이지의 같은 이벤트(solution: COCONUT 등)로 봅니다.
// 앵커 이동(#contact)은 페이지 전환이 아니라 GA 가 자동으로 잡지 못합니다.
const trackInquiry = () => {
    useTrackEvent('solution_inquiry_click', { solution: 'ALL', link_location: 'solutions_footer' })
}

// 데이터는 data/solutions.ts 가 단일 출처입니다.
// 상세 페이지(pages/solutions/[slug].vue)와 같은 내용을 씁니다.
const solutions = fbSolutions
</script>
