<template>
    <section id="values" class="section section--alt">
        <div class="container">
            <div v-reveal class="section-head">
                <span class="eyebrow">Values · 핵심 가치</span>
                <h2>기술의 본질과 미래를 탐구하며,<br />가장 확실한 가치를 더합니다.</h2>
            </div>
            <div v-reveal class="val-grid fb-stagger">
                <div v-for="v in values" :key="v.n" class="val">
                    <div class="vicon"><img :src="v.icon" alt="" loading="lazy" /></div>
                    <div class="vn">{{ v.n }}</div>
                    <h4>{{ v.ko }}</h4>
                    <div class="en">{{ v.en }}</div>
                    <p>{{ v.desc }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const values = [
    { n: '01', ko: '고객 중심', en: 'Customer First', icon: '/images/people.png', desc: '모든 기술 발전의 최우선 가치이자 고객 경험의 출발점입니다.' },
    { n: '02', ko: '기술 역량과 품질', en: 'Quality & Craft', icon: '/images/tech.png', desc: 'R&D 집중 투자로 실용적 혁신과 최상의 품질을 제공합니다.' },
    { n: '03', ko: '신뢰 기반 성장', en: 'Trust & Growth', icon: '/images/growth2.jpg', desc: '투명한 소통과 협력을 통해 고객과 함께 지속적으로 성장합니다.' },
    { n: '04', ko: '혁신과 도전', en: 'Innovation', icon: '/images/challenge.png', desc: '새로운 기술과 도전을 두려워하지 않고 더 나은 방법을 탐구합니다.' },
]
</script>
