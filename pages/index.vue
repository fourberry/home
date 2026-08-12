<template>
    <div class="overflow-x-hidden">
        <FbHero />
        <FbPartners />
        <FbAbout />
        <FbServices />
        <FbSolutions />
        <FbWork />
        <FbValues />
        <FbCulture />
        <FbFaq />
        <FbContact />
    </div>
</template>

<script setup lang="ts">
import { fbFaq } from '~/data/faq'

useFbSeo({
    title: '홈',
    description: 'IT와 AI의 결합으로 새로운 가치를 창출하는 포베리(Fourberry). 인공지능(AI) 솔루션 개발, SI/SM 시스템 통합, 빅데이터 분석 및 맞춤형 소프트웨어 컨설팅을 제공합니다.',
    path: '/',
})

// 화면에 보이는 FAQ(FbFaq.vue)와 같은 배열을 그대로 씁니다.
useFbJsonLd([webSiteJsonLd(), faqJsonLd(fbFaq)])
</script>
