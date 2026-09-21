<template>
    <button type="button" class="fb-zoom" :aria-label="`크게 보기: ${alt}`" @click="open = true">
        <img :src="src" :alt="alt" :width="width" :height="height" :loading="loading" :fetchpriority="fetchpriority" />
        <span class="fb-zoom-badge" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5M11 8v6M8 11h6" />
            </svg>
        </span>
    </button>
    <!-- 확대 화면. 서버에서는 open 이 항상 false 라 아무것도 렌더링되지 않습니다. -->
    <Teleport to="body">
        <Transition name="fb-fade">
            <div v-if="open" class="fb-dialog-backdrop fb-lightbox" role="dialog" aria-modal="true" :aria-label="alt" @click.self="close">
                <button type="button" class="fb-lightbox-close" aria-label="닫기" @click="close">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
                </button>
                <figure class="fb-lightbox-figure" @click.self="close">
                    <!-- 확대 화면은 원본 해상도 파일(fullSrc)을 씁니다. 없으면 페이지용 이미지를 그대로 씁니다. -->
                    <img :src="fullSrc || src" :alt="alt" />
                    <figcaption v-if="alt">{{ alt }}</figcaption>
                </figure>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

/**
 * 클릭하면 원본 크기로 크게 보는 이미지. 마우스를 올리면 돋보기 커서와 배지가 보입니다.
 * 스크린샷처럼 글자가 작은 이미지에 씁니다(브랜드 페이지의 관리자 콘솔 화면 등).
 * 배경 클릭·닫기 버튼·ESC 로 닫히고, 열려 있는 동안 본문 스크롤을 막습니다(FbDialog 와 같은 방식).
 */
withDefaults(
    defineProps<{
        src: string
        /** 클릭 확대용 고해상도 파일. 페이지용 src 가 줄인 이미지일 때 지정합니다 */
        fullSrc?: string
        alt: string
        width?: number
        height?: number
        loading?: 'lazy' | 'eager'
        fetchpriority?: 'high' | 'low' | 'auto'
    }>(),
    { loading: 'lazy', fetchpriority: 'auto' }
)

const open = ref(false)
const close = () => (open.value = false)

watch(open, v => {
    if (typeof document !== 'undefined') document.body.style.overflow = v ? 'hidden' : ''
})
onUnmounted(() => {
    if (typeof document !== 'undefined') document.body.style.overflow = ''
})

const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && open.value) close()
}
if (typeof document !== 'undefined') {
    document.addEventListener('keydown', onKey)
    onUnmounted(() => document.removeEventListener('keydown', onKey))
}
</script>

<style scoped>
.fb-fade-enter-active,
.fb-fade-leave-active {
    transition: opacity 0.22s ease;
}
.fb-fade-enter-from,
.fb-fade-leave-to {
    opacity: 0;
}
</style>
