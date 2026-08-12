<template>
    <header class="site-header" :class="{ scrolled, 'menu-open': open }">
        <div class="container nav">
            <NuxtLink class="brand" to="/" aria-label="FOURBERRY 홈" @click="close">
                <span class="fb-mark" role="img" aria-label="FOURBERRY 로고"></span>FOURBERRY
            </NuxtLink>
            <nav class="nav-links" aria-label="주 메뉴">
                <NuxtLink v-for="item in menu" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink>
            </nav>
            <div class="nav-cta">
                <NuxtLink to="/#contact" class="btn btn-primary nav-contact">문의하기</NuxtLink>
                <button
                    class="nav-toggle"
                    :class="{ open }"
                    :aria-label="open ? '메뉴 닫기' : '메뉴 열기'"
                    :aria-expanded="open ? 'true' : 'false'"
                    aria-controls="mobileMenu"
                    @click="open = !open"
                >
                    <span></span><span></span><span></span>
                </button>
            </div>
        </div>
        <div id="mobileMenu" class="mobile-menu" :class="{ open }">
            <NuxtLink v-for="item in menu" :key="item.to" :to="item.to" @click="close">{{ item.label }}</NuxtLink>
            <NuxtLink to="/#contact" class="btn btn-primary" @click="close">상담 문의하기 →</NuxtLink>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// ⚠️ 앵커는 반드시 '/#...' 형태여야 합니다.
// '#about' 로 두면 /solutions/coconut 같은 하위 페이지에는 그런 요소가 없어 메뉴가 먹통이 됩니다.
// NuxtLink 를 쓰므로 홈에서 눌러도 새로고침 없이 해당 섹션으로 이동합니다.
const menu = [
    { to: '/#about', label: '회사소개' },
    { to: '/#services', label: '서비스' },
    { to: '/#solutions', label: '솔루션' },
    { to: '/#work', label: '실적' },
    { to: '/#culture', label: '컬처' },
    { to: '/#faq', label: 'FAQ' },
]

const open = ref(false)
const scrolled = ref(false)
const close = () => (open.value = false)

const onScroll = () => (scrolled.value = window.scrollY > 8)
const onResize = () => {
    if (window.innerWidth > 920) close()
}
const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close()
}

onMounted(() => {
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    document.addEventListener('keydown', onKey)
})
onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
    document.removeEventListener('keydown', onKey)
})
</script>
