<template>
    <Teleport to="body">
        <dialog ref="dialog" class="gallery-viewer" :aria-label="label" @close="onClose" @click="onBackdrop" @keydown="onKeydown">
            <header class="gallery-header">
                <div>
                    <p class="gallery-title" aria-live="polite">{{ index + 1 }} / {{ shots.length }} · {{ shot.title }}</p>
                    <p class="gallery-hint">휠로 확대·축소 · 드래그로 이동</p>
                </div>
                <div class="gallery-actions">
                    <button type="button" aria-label="축소" :disabled="zoom === 1" @click="changeZoom(zoom - step)">−</button>
                    <button type="button" aria-label="확대" :disabled="zoom === maxZoom" @click="changeZoom(zoom + step)">+</button>
                    <button type="button" @click="changeZoom(1)">화면 맞춤</button>
                    <form method="dialog"><button type="submit" autofocus>닫기</button></form>
                </div>
            </header>

            <div
                ref="stage"
                class="gallery-stage"
                :class="{ 'can-drag': zoom > 1, 'is-dragging': dragging }"
                tabindex="0"
                aria-label="이미지 보기 및 이동 영역"
                @wheel.prevent="onWheel"
                @pointerdown="startDrag"
                @pointermove="moveDrag"
                @lostpointercapture="dragging = false"
            >
                <div v-if="isOpen" class="gallery-canvas" :style="{ width: `${imageWidth}px`, height: `${imageHeight}px` }">
                    <img ref="image" :src="shot.image" :alt="shot.alt" :width="imageWidth" :height="imageHeight" draggable="false" />
                </div>
            </div>

            <footer class="gallery-footer">
                <button type="button" aria-label="이전 이미지" @click="select(index - 1)">←</button>
                <div class="gallery-thumbs" aria-label="이미지 목록" role="group">
                    <button v-for="(item, i) in shots" :key="item.image" type="button" :aria-label="item.title" :title="item.title" :aria-current="i === index ? 'true' : undefined" @click="select(i)">
                        <img v-if="isOpen" :src="item.image" alt="" draggable="false" />
                    </button>
                </div>
                <button type="button" aria-label="다음 이미지" @click="select(index + 1)">→</button>
            </footer>
        </dialog>
    </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
    label: string
    shots: readonly { image: string; alt: string; title: string; w: number; h: number }[]
}>()

const dialog = ref<HTMLDialogElement>()
const stage = ref<HTMLDivElement>()
const image = ref<HTMLImageElement>()
const isOpen = ref(false)
const index = ref(0)
const shot = computed(() => props.shots[index.value]!)
const zoom = ref(1)
const step = 0.25
const maxZoom = 5
const viewport = ref({ width: 0, height: 0 })
const fitScale = computed(() => Math.min(viewport.value.width / shot.value.w, viewport.value.height / shot.value.h))
const imageWidth = computed(() => Math.floor(shot.value.w * fitScale.value * zoom.value))
const imageHeight = computed(() => Math.floor(shot.value.h * fitScale.value * zoom.value))

const dragging = ref(false)
let dragStart = { x: 0, y: 0, left: 0, top: 0 }
let returnTarget: HTMLElement | null = null
let previousOverflow = ''
let resizeObserver: ResizeObserver | undefined

function measureStage() {
    if (!stage.value) return
    const { width, height } = stage.value.getBoundingClientRect()
    viewport.value = { width, height }
}

async function select(nextIndex: number) {
    index.value = (nextIndex + props.shots.length) % props.shots.length
    zoom.value = 1
    await nextTick()
    stage.value?.scrollTo(0, 0)
}

async function open(event: MouseEvent, nextIndex: number) {
    if (!dialog.value?.showModal || dialog.value.open) return
    event.preventDefault()
    returnTarget = event.currentTarget as HTMLElement
    previousOverflow = document.body.style.overflow
    isOpen.value = true
    dialog.value.showModal()
    document.body.style.overflow = 'hidden'
    await select(nextIndex)
    measureStage()
}

async function changeZoom(nextZoom: number, clientX?: number, clientY?: number) {
    const area = stage.value
    const picture = image.value
    const clampedZoom = Math.min(maxZoom, Math.max(1, nextZoom))
    if (!area || !picture || clampedZoom === zoom.value) return

    const bounds = area.getBoundingClientRect()
    const before = picture.getBoundingClientRect()
    const x = clientX ?? bounds.left + bounds.width / 2
    const y = clientY ?? bounds.top + bounds.height / 2
    const imageX = (x - before.left) / before.width
    const imageY = (y - before.top) / before.height
    zoom.value = clampedZoom

    await nextTick()
    const after = picture.getBoundingClientRect()
    area.scrollLeft += after.left + imageX * after.width - x
    area.scrollTop += after.top + imageY * after.height - y
}

function onWheel(event: WheelEvent) {
    if (event.deltaY) changeZoom(zoom.value - Math.sign(event.deltaY) * step, event.clientX, event.clientY)
}

function startDrag(event: PointerEvent) {
    const area = stage.value
    if (!area || event.pointerType !== 'mouse' || event.button !== 0) return
    if (area.scrollWidth <= area.clientWidth && area.scrollHeight <= area.clientHeight) return
    const bounds = area.getBoundingClientRect()
    if (event.clientX >= bounds.left + area.clientWidth || event.clientY >= bounds.top + area.clientHeight) return
    dragStart = { x: event.clientX, y: event.clientY, left: area.scrollLeft, top: area.scrollTop }
    area.setPointerCapture(event.pointerId)
    dragging.value = true
}

function moveDrag(event: PointerEvent) {
    const area = stage.value
    if (!area || !dragging.value || !area.hasPointerCapture(event.pointerId)) return
    area.scrollLeft = dragStart.left + dragStart.x - event.clientX
    area.scrollTop = dragStart.top + dragStart.y - event.clientY
}

function onKeydown(event: KeyboardEvent) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    if (event.target === stage.value && zoom.value > 1) return
    event.preventDefault()
    select(index.value + (event.key === 'ArrowLeft' ? -1 : 1))
}

function onBackdrop(event: MouseEvent) {
    if (!dialog.value || event.target !== dialog.value) return
    const bounds = dialog.value.getBoundingClientRect()
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.value.close()
}

function onClose() {
    isOpen.value = false
    dragging.value = false
    document.body.style.overflow = previousOverflow
    returnTarget?.focus({ preventScroll: true })
    returnTarget = null
}

onMounted(() => {
    if (!stage.value) return
    resizeObserver = new ResizeObserver(measureStage)
    resizeObserver.observe(stage.value)
})
onBeforeUnmount(() => {
    resizeObserver?.disconnect()
    if (isOpen.value) document.body.style.overflow = previousOverflow
})

defineExpose({ open })
</script>

<style scoped>
.gallery-viewer {
    width: min(1440px, calc(100vw - 24px));
    height: calc(100dvh - 24px);
    max-width: none;
    max-height: none;
    margin: auto;
    padding: 12px;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    background: var(--surface);
    color: var(--ink);
}
.gallery-viewer[open] {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    gap: 10px;
}
.gallery-viewer::backdrop {
    background: rgb(15 20 28 / 75%);
}
.gallery-header,
.gallery-footer,
.gallery-actions,
.gallery-thumbs {
    display: flex;
    align-items: center;
    gap: 8px;
}
.gallery-header {
    justify-content: space-between;
    flex-wrap: wrap;
}
.gallery-title {
    font-size: 14px;
    font-weight: 700;
}
.gallery-hint {
    color: var(--ink-2);
    font-size: 12px;
}
@media (pointer: coarse) {
    .gallery-hint {
        display: none;
    }
}
.gallery-footer {
    justify-content: center;
}
.gallery-viewer button {
    min-width: 44px;
    min-height: 44px;
    padding: 4px 8px;
    border: 1px solid var(--line);
    border-radius: var(--radius-s);
    background: var(--bg);
    color: var(--ink);
    font: inherit;
    font-size: 14px;
    cursor: pointer;
}
.gallery-viewer button:disabled {
    opacity: 0.45;
    cursor: default;
}
.gallery-viewer :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 1px;
}
.gallery-thumbs button {
    width: clamp(44px, 12vw, 72px);
    height: 44px;
    padding: 2px;
}
.gallery-thumbs button[aria-current='true'] {
    border-color: var(--accent);
    box-shadow: inset 0 0 0 1px var(--accent);
}
.gallery-thumbs img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
.gallery-stage {
    overflow: auto;
    overflow-anchor: none;
    overscroll-behavior: contain;
    background: var(--bg);
}
.gallery-stage.can-drag {
    cursor: grab;
}
.gallery-stage.is-dragging {
    cursor: grabbing;
}
.gallery-canvas {
    display: grid;
    place-items: center;
    min-width: 100%;
    min-height: 100%;
    user-select: none;
}
.gallery-canvas img {
    display: block;
    max-width: none;
    height: auto;
}
@media (max-width: 600px) {
    .gallery-viewer {
        width: calc(100vw - 12px);
        height: calc(100dvh - 12px);
        padding: 8px;
    }
    .gallery-footer,
    .gallery-thumbs {
        gap: 4px;
    }
}
</style>
