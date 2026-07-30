<template>
    <button
        class="scroll-top"
        :class="{ show: visible }"
        type="button"
        aria-label="맨 위로 이동"
        @click="toTop"
    >
        <span class="st-arrow" aria-hidden="true"></span>
    </button>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

const visible = ref(false)
const THRESHOLD = 480 // 이만큼 내려가면 버튼 노출

let ticking = false
function onScroll() {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
        visible.value = window.scrollY > THRESHOLD
        ticking = false
    })
}

function toTop() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
}

onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>
