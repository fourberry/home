<template>
    <section id="services" class="section section--ink">
        <div class="container">
            <div v-reveal class="section-head">
                <span class="eyebrow">Service · 사업영역</span>
                <h2>기술로 연결하고,<br />혁신으로 성장합니다.</h2>
                <p class="lead">
                    시스템 자동화, 맞춤형 솔루션, AI 연구개발, IT 컨설팅을 통해 기업의 디지털 전환을 앞당깁니다.
                </p>
            </div>
            <div v-reveal class="svc-grid">
                <div v-for="s in services" :key="s.idx" class="svc">
                    <div class="idx">{{ s.idx }}</div>
                    <h3>{{ s.ko }}</h3>
                    <div class="en">{{ s.en }}</div>
                    <p>{{ s.desc }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const services = [
    {
        idx: '01',
        ko: '시스템 자동화 및 통합',
        en: 'System Automation & Integration',
        desc: '기업 환경에 최적화된 업무 프로세스 자동화와 시스템 통합 솔루션을 제공합니다.',
    },
    {
        idx: '02',
        ko: '시스템 솔루션 개발',
        en: 'Solution Development',
        desc: '고객의 요구에 맞춘 맞춤형 웹·모바일 솔루션을 기획부터 구축까지 전 과정 수행합니다.',
    },
    {
        idx: '03',
        ko: 'AI · 빅데이터 R&D',
        en: 'AI & Big Data R&D',
        desc: '데이터 기반의 인공지능 기술과 산학협력을 통해 혁신적인 연구개발을 이어갑니다.',
    },
    {
        idx: '04',
        ko: 'IT 컨설팅',
        en: 'IT Consulting',
        desc: '프로젝트 기획부터 운영까지, 기술과 비즈니스를 잇는 전략적 IT 컨설팅을 제공합니다.',
    },
]
</script>
