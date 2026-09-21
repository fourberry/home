<template>
    <div class="overflow-x-hidden">
        <FbHero />
        <FbPartners />
        <FbAbout />
        <FbServices />
        <FbAiWorkflow />
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
import { SITE_DESCRIPTION } from '~/data/company'

useFbSeo({
    title: '홈',
    description: SITE_DESCRIPTION,
    path: '/',
})

// 화면에 보이는 FAQ(FbFaq.vue)와 같은 배열을 그대로 씁니다.
useFbJsonLd([webSiteJsonLd(), faqJsonLd(fbFaq)])
</script>
