<template>
    <section class="section section--ink fb-cta">
        <div class="fb-cta-inner container">
            <div>
                <span class="eyebrow">Contact · 문의</span>
                <h2>{{ title }}</h2>
                <p class="lead">{{ desc }}</p>
            </div>
            <div class="fb-cta-actions">
                <NuxtLink to="/#contact" class="btn btn-primary">
                    상담 문의하기
                    <span class="arw">→</span>
                </NuxtLink>
                <a :href="fbCompany.telHref" class="btn btn-ghost" @click="trackCall">{{ fbCompany.tel }}</a>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { fbCompany } from '~/data/company'

withDefaults(
    defineProps<{
        title?: string
        desc?: string
    }>(),
    {
        title: '어떤 것부터 시작할지 함께 정리해 드립니다.',
        desc: '요구사항이 아직 정리되지 않아도 괜찮습니다. 상황을 알려주시면 적합한 범위와 일정을 제안드립니다.',
    }
)

// 하위 페이지에서 발생한 전화 클릭은 link_location 으로 구분합니다.
// (원페이지의 FbContact·AppFooter 와 같은 이벤트명)
const trackCall = () => {
    useTrackEvent('contact_channel_click', { channel: 'tel', link_location: 'cta_band' })
}
</script>
