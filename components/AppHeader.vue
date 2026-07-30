<template>
    <header class="site-header" :class="{ scrolled, 'menu-open': open }">
        <div class="container nav">
            <a class="brand" href="#top" aria-label="FOURBERRY 홈" @click="close">
                <span class="fb-mark" role="img" aria-label="FOURBERRY 로고"></span>FOURBERRY
            </a>
            <nav class="nav-links" aria-label="주 메뉴">
                <a v-for="item in menu" :key="item.href" :href="item.href">{{ item.label }}</a>
            </nav>
            <div class="nav-cta">
                <a href="#contact" class="btn btn-primary nav-contact">문의하기</a>
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
            <a v-for="item in menu" :key="item.href" :href="item.href" @click="close">{{ item.label }}</a>
            <a href="#contact" class="btn btn-primary" @click="close">상담 문의하기 →</a>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const menu = [
    { href: '#about', label: '회사소개' },
    { href: '#services', label: '서비스' },
    { href: '#solutions', label: '솔루션' },
    { href: '#work', label: '실적' },
    { href: '#culture', label: '컬처' },
    { href: '#faq', label: 'FAQ' },
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
