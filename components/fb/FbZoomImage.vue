<template>
    <a class="fb-zoom" :href="fullSrc || src" :aria-label="`크게 보기: ${alt}`" @click="openImage">
        <img :src="src" :alt="alt" :width="width" :height="height" :loading="loading" :fetchpriority="fetchpriority" />
        <span class="fb-zoom-badge" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5M11 8v6M8 11h6" />
            </svg>
        </span>
    </a>
    <Teleport to="body">
        <dialog ref="viewer" class="fb-image-viewer" :aria-label="alt" @close="restoreFocus" @click="onBackdrop">
            <div class="fb-image-viewer-header">
                <p>{{ alt }}</p>
                <div class="fb-image-viewer-actions">
                    <button type="button" :aria-pressed="zoomed" @click="zoomed = !zoomed">{{ zoomed ? '전체 보기' : '세부 확대' }}</button>
                    <form method="dialog"><button type="submit" autofocus>닫기 ×</button></form>
                </div>
            </div>
            <p class="fb-image-viewer-hint">확대한 화면은 가로·세로로 스크롤하거나 방향키로 이동할 수 있습니다.</p>
            <div ref="scrollArea" class="fb-image-viewer-scroll" :class="{ 'is-zoomed': zoomed }" tabindex="0" aria-label="확대된 화면 스크롤 영역">
                <img v-if="viewerOpen" :src="fullSrc || src" :alt="alt" />
            </div>
        </dialog>
    </Teleport>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref } from 'vue'

withDefaults(
    defineProps<{
        src: string
        fullSrc?: string
        alt: string
        width?: number
        height?: number
        loading?: 'lazy' | 'eager'
        fetchpriority?: 'high' | 'low' | 'auto'
    }>(),
    { loading: 'lazy', fetchpriority: 'auto' }
)

// LinkberryGallery와 같은 기본 dialog 패턴을 사용합니다. 브라우저가 배경 접근과 키보드 초점을 관리합니다.
const viewer = ref<HTMLDialogElement>()
const scrollArea = ref<HTMLElement>()
const viewerOpen = ref(false)
const zoomed = ref(true)
let returnTarget: HTMLElement | null = null
let previousOverflow = ''

async function openImage(event: MouseEvent) {
    if (!viewer.value?.showModal || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    returnTarget = event.currentTarget as HTMLElement
    previousOverflow = document.body.style.overflow
    viewerOpen.value = true
    zoomed.value = true
    await nextTick()
    document.body.style.overflow = 'hidden'
    viewer.value.showModal()
    scrollArea.value?.scrollTo(0, 0)
}

function onBackdrop(event: MouseEvent) {
    if (event.target !== viewer.value) return
    const bounds = viewer.value.getBoundingClientRect()
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) viewer.value.close()
}

function restoreFocus() {
    viewerOpen.value = false
    document.body.style.overflow = previousOverflow
    returnTarget?.focus({ preventScroll: true })
    returnTarget = null
}
onBeforeUnmount(() => {
    if (viewer.value?.open) {
        viewer.value.close()
        document.body.style.overflow = previousOverflow
    }
})
</script>

<style scoped>
.fb-image-viewer {
    width: min(1400px, calc(100vw - 32px));
    max-width: none;
    max-height: calc(100dvh - 32px);
    margin: auto;
    padding: 20px;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    background: var(--surface);
    color: var(--ink);
    box-sizing: border-box;
}
.fb-image-viewer::backdrop {
    background: rgb(15 20 28 / 75%);
}
.fb-image-viewer-header {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: space-between;
}
.fb-image-viewer-header p {
    min-width: 0;
    font-size: 14px;
    line-height: 1.5;
}
.fb-image-viewer-actions {
    display: flex;
    flex: none;
    gap: 8px;
}
.fb-image-viewer-actions button {
    min-height: 44px;
    padding: 8px 12px;
    border: 1px solid var(--line);
    border-radius: var(--radius-s);
    background: var(--bg);
    color: var(--ink);
    font: inherit;
    font-size: 14px;
    cursor: pointer;
}
.fb-image-viewer-hint {
    margin: 12px 0;
    font-size: 13px;
    color: var(--ink-2);
}
.fb-image-viewer-scroll {
    max-height: calc(100dvh - 180px);
    overflow: auto;
    background: var(--bg);
    overscroll-behavior: contain;
}
.fb-image-viewer-scroll img {
    display: block;
    max-width: 100%;
    height: auto;
    margin: auto;
}
.fb-image-viewer-scroll.is-zoomed img {
    width: auto;
    max-width: none;
    margin: 0;
}
.fb-image-viewer :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
}
@media (max-width: 600px) {
    .fb-image-viewer {
        padding: 12px;
    }
    .fb-image-viewer-header {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
    }
    .fb-image-viewer-actions {
        justify-content: flex-end;
    }
    .fb-image-viewer-scroll {
        max-height: calc(100dvh - 280px);
    }
}
</style>
