<template>
    <header class="site-header brand-header" :class="{ scrolled, 'menu-open': open }">
        <div class="nav container">
            <a class="brand" href="#top" :aria-label="`${solution.name} 맨 위로`" @click="close">
                <img class="brand-mark" :src="solution.brand!.mark" :alt="`${solution.name} 심볼`" width="28" height="28" />
                {{ solution.name }}
                <span class="brand-by">by FOURBERRY</span>
            </a>
            <nav class="nav-links" :aria-label="`${solution.name} 페이지 메뉴`">
                <!-- 같은 페이지 안의 앵커라 NuxtLink 대신 a 를 씁니다. 헤더 높이만큼의 보정은 fb-brand.css 의 scroll-margin-top 이 담당합니다. -->
                <a v-for="item in nav" :key="item.to" :href="item.to">{{ item.label }}</a>
                <NuxtLink to="/" class="home">← 포베리 홈</NuxtLink>
            </nav>
            <div class="nav-cta">
                <NuxtLink to="/#contact" class="btn btn-primary nav-contact" @click="trackInquiry">도입 문의</NuxtLink>
                <button
                    class="nav-toggle"
                    :class="{ open }"
                    :aria-label="open ? '메뉴 닫기' : '메뉴 열기'"
                    :aria-expanded="open ? 'true' : 'false'"
                    aria-controls="brandMobileMenu"
                    @click="open = !open"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </div>
        <div id="brandMobileMenu" class="mobile-menu" :class="{ open }">
            <a v-for="item in nav" :key="item.to" :href="item.to" @click="close">{{ item.label }}</a>
            <NuxtLink to="/" class="home" @click="close">← 포베리 홈</NuxtLink>
            <NuxtLink to="/#contact" class="btn btn-primary" @click="closeAndTrack">도입 문의하기 →</NuxtLink>
        </div>
    </header>
</template>

<script setup lang="ts">
import type { FbSolution } from '~/data/solutions'

// 솔루션 브랜드 페이지 전용 헤더. 회사 메뉴 대신 페이지 안의 섹션 앵커를 보여줍니다.
// 배치·모바일 동작은 AppHeader 와 같은 클래스(.site-header 계열)를 그대로 씁니다.
const props = defineProps<{
    solution: FbSolution
    nav: { to: string; label: string }[]
}>()

// 열림·스크롤 상태와 리스너는 AppHeader 와 같은 composable 을 씁니다.
const { open, scrolled, close } = useSiteHeader()

// 원페이지·상세 페이지와 같은 이벤트명. 어느 솔루션에 관심이 쏠리는지 파악합니다.
const trackInquiry = () => {
    useTrackEvent('solution_inquiry_click', { solution: props.solution.name, link_location: 'brand_header' })
}
const closeAndTrack = () => {
    close()
    trackInquiry()
}
</script>
