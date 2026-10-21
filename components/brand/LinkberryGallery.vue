<template>
    <section id="screens" class="section lb-gallery" aria-labelledby="lb-gallery-title">
        <div class="container">
            <div class="section-head">
                <span class="eyebrow">Workspace tour</span>
                <h2 id="lb-gallery-title">실제 화면으로 만나는 BerryLinker.</h2>
                <p class="lead">서버 연결부터 파일 관리와 작업 메모까지, 필요한 기능을 살펴보세요.</p>
            </div>

            <div v-if="enhanced" class="lb-gallery-select" role="group" aria-label="살펴볼 기능 선택" @keydown="onSelectionKey">
                <button
                    v-for="(slide, index) in slides"
                    :key="slide.id"
                    :data-slide-index="index"
                    type="button"
                    :aria-pressed="active === index"
                    :aria-controls="`lb-slide-${slide.id}`"
                    @click="active = index"
                >
                    <span aria-hidden="true">0{{ index + 1 }}</span>
                    {{ slide.label }}
                </button>
            </div>

            <div class="lb-gallery-slides">
                <article v-for="(slide, index) in slides" :id="`lb-slide-${slide.id}`" :key="slide.id" :hidden="enhanced && active !== index" class="lb-gallery-slide">
                    <div class="lb-gallery-copy">
                        <h3>{{ slide.title }}</h3>
                        <p>{{ slide.description }}</p>
                    </div>
                    <a class="lb-gallery-image" :href="slide.image" :aria-label="`${slide.label} 화면 크게 보기`" @click="openImage($event, index)">
                        <img :src="slide.image" :alt="slide.alt" width="3200" height="1800" loading="lazy" decoding="async" />
                        <span v-if="enhanced" class="lb-gallery-zoom" aria-hidden="true">화면 크게 보기 ↗</span>
                    </a>
                </article>
            </div>

            <div class="lb-gallery-footer">
                <p class="lb-gallery-note">데모 데이터로 구성한 실제 BerryLinker 화면입니다. 터미널 출력과 업무 내용은 예시이며, 베타 버전에 따라 화면이 달라질 수 있습니다.</p>
                <div v-if="enhanced" class="lb-gallery-pager" role="group" aria-label="화면 이동">
                    <button type="button" aria-label="이전 기능 화면" @click="move(-1)">←</button>
                    <span aria-live="polite" aria-atomic="true">
                        <span class="lb-sr-only">{{ slides[active].label }} ·</span>
                        {{ active + 1 }} / {{ slides.length }}
                    </span>
                    <button type="button" aria-label="다음 기능 화면" @click="move(1)">→</button>
                </div>
            </div>
        </div>

        <dialog ref="viewer" class="lb-gallery-viewer" aria-labelledby="lb-viewer-title" @click="onBackdrop" @close="restoreFocus">
            <div class="lb-viewer-header">
                <p id="lb-viewer-title">{{ slides[viewing].title }}</p>
                <form method="dialog">
                    <button type="submit" autofocus>
                        닫기
                        <span aria-hidden="true">×</span>
                    </button>
                </form>
            </div>
            <p class="lb-viewer-hint">화면을 가로·세로로 스크롤해 세부 내용을 확인하세요.</p>
            <div class="lb-viewer-scroll" tabindex="0" aria-label="확대된 화면 스크롤 영역">
                <img v-if="viewerOpen" :src="slides[viewing].image" :alt="slides[viewing].alt" width="3200" height="1800" />
            </div>
        </dialog>
    </section>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { linkberryScreens as slides } from '~/data/linkberry'

const active = ref(0)
const enhanced = ref(false)
const viewer = ref<HTMLDialogElement>()
const viewing = ref(0)
const viewerOpen = ref(false)
let returnTarget: HTMLElement | null = null
onMounted(() => (enhanced.value = true))

function move(offset: number) {
    active.value = (active.value + offset + slides.length) % slides.length
}

async function onSelectionKey(event: KeyboardEvent) {
    if (!(event.target instanceof HTMLButtonElement)) return
    const group = event.currentTarget as HTMLElement
    const index = Number(event.target.dataset.slideIndex)
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    active.value = event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + slides.length) % slides.length
    await nextTick()
    group.querySelector<HTMLButtonElement>(`[data-slide-index="${active.value}"]`)?.focus()
}

async function openImage(event: MouseEvent, index: number) {
    if (!viewer.value?.showModal || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    returnTarget = event.currentTarget as HTMLElement
    viewing.value = index
    viewerOpen.value = true
    await nextTick()
    viewer.value.showModal()
    viewer.value.querySelector('.lb-viewer-scroll')?.scrollTo(0, 0)
}

function onBackdrop(event: MouseEvent) {
    if (event.target !== viewer.value) return
    const bounds = viewer.value.getBoundingClientRect()
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) viewer.value.close()
}

function restoreFocus() {
    viewerOpen.value = false
    returnTarget?.focus({ preventScroll: true })
    returnTarget = null
}
onBeforeUnmount(() => viewer.value?.close())
</script>

<style scoped>
.lb-gallery-select {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 10px;
    margin: 32px 0 24px;
}
.lb-gallery-select button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-height: 52px;
    padding: 12px;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    color: var(--ink-2);
    background: var(--surface);
    font-weight: 600;
}
.lb-gallery-select button span {
    font: 500 12px var(--font-mono);
    color: var(--ink-3);
}
.lb-gallery-select button[aria-pressed='true'] {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--accent-2);
}
.lb-gallery-select button[aria-pressed='true'] span {
    color: var(--accent);
}
.lb-gallery-slide {
    border: 1px solid var(--line);
    border-radius: var(--radius-l);
    overflow: hidden;
    background: var(--surface);
}
.lb-gallery-slide + .lb-gallery-slide:not([hidden]) {
    margin-top: 24px;
}
.lb-gallery-slides:has([hidden]) .lb-gallery-slide {
    margin-top: 0;
}
.lb-gallery-copy {
    padding: 26px 32px;
}
.lb-gallery-copy h3 {
    font-size: clamp(21px, 2.2vw, 28px);
    line-height: 1.4;
}
.lb-gallery-copy p {
    margin-top: 10px;
    color: var(--ink-2);
    line-height: 1.8;
}
.lb-gallery-image {
    position: relative;
    display: block;
    background: var(--ink-bg);
    cursor: zoom-in;
}
.lb-gallery-image img {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
}
.lb-gallery-zoom {
    position: absolute;
    right: 16px;
    bottom: 16px;
    padding: 9px 14px;
    border: 1px solid var(--ink-line);
    border-radius: var(--radius-s);
    background: var(--ink-bg);
    color: var(--ink-fg);
    font-size: 12px;
}
.lb-gallery-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    margin-top: 20px;
}
.lb-gallery-note {
    color: var(--ink-2);
    font-size: 13px;
    line-height: 1.7;
    max-width: 760px;
}
.lb-gallery-pager {
    display: flex;
    align-items: center;
    gap: 18px;
    flex: none;
}
.lb-gallery-pager > span {
    min-width: 46px;
    text-align: center;
    font: 500 13px var(--font-mono);
}
.lb-gallery-pager button,
.lb-viewer-header button {
    min-width: 44px;
    min-height: 44px;
    border: 1px solid var(--line);
    border-radius: var(--radius-s);
    background: var(--surface);
    color: var(--ink);
}
.lb-gallery :is(button, a, [tabindex]):focus-visible {
    outline: 3px solid var(--accent);
    outline-offset: 3px;
}
.lb-gallery-image:focus-visible {
    outline-offset: -4px;
}
.lb-sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
.lb-gallery-viewer {
    width: min(96vw, 1720px);
    max-width: none;
    max-height: 94dvh;
    margin: auto;
    padding: 0;
    border: 1px solid var(--line);
    border-radius: var(--radius-l);
    color: var(--ink);
    background: var(--surface);
    overflow: hidden;
}
.lb-gallery-viewer::backdrop {
    background: rgba(0, 0, 0, 0.8);
}
.lb-viewer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 16px 20px 8px;
}
.lb-viewer-header p {
    font-weight: 600;
}
.lb-viewer-header button {
    padding: 8px 16px;
    white-space: nowrap;
}
.lb-viewer-hint {
    font-size: 12px;
    color: var(--ink-2);
    padding: 0 20px 14px;
}
.lb-viewer-scroll {
    max-height: calc(94dvh - 120px);
    overflow: auto;
    overscroll-behavior: contain;
    background: var(--ink-bg);
}
.lb-viewer-scroll img {
    display: block;
    width: max(100%, 1440px);
    max-width: none;
    height: auto;
}
@media (max-width: 920px) {
    .lb-gallery-select {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .lb-gallery-copy {
        padding: 22px;
    }
    .lb-gallery-footer {
        align-items: flex-start;
    }
}
@media (max-width: 580px) {
    .lb-gallery-select {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
    }
    .lb-gallery-select button {
        justify-content: flex-start;
        font-size: 13px;
    }
    .lb-gallery-select button:last-child {
        grid-column: 1 / -1;
    }
    .lb-gallery-copy {
        min-height: 164px;
        padding: 20px;
    }
    .lb-gallery-footer {
        flex-direction: column-reverse;
        gap: 16px;
    }
    .lb-gallery-pager {
        align-self: flex-end;
    }
    .lb-gallery-zoom {
        right: 8px;
        bottom: 8px;
        padding: 6px 9px;
        font-size: 11px;
    }
}
</style>
