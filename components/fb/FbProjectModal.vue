<template>
    <Teleport to="body">
        <Transition name="fb-fade">
            <div v-if="project" class="fb-modal-backdrop" @click.self="emit('close')">
                <div class="fb-modal" role="dialog" aria-modal="true" :aria-label="project.client">
                    <button class="fb-modal-close" type="button" aria-label="닫기" @click="emit('close')">×</button>
                    <div class="fb-modal-hero">
                        <img class="slot-img" :src="project.thumb" :alt="project.client" />
                    </div>
                    <div class="fb-modal-body">
                        <div class="yr">{{ project.period }}</div>
                        <h3>{{ project.title }}</h3>
                        <div class="client">Client · {{ project.client }}</div>
                        <p class="overview">{{ project.overview }}</p>
                        <div v-if="project.shots?.length" class="fb-modal-shots">
                            <img v-for="src in project.shots" :key="src" :src="src" :alt="project.client + ' 화면'" loading="lazy" />
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { watch, onUnmounted } from 'vue'
import type { FbProject } from '~/data/projects'

const props = defineProps<{ project: FbProject | null }>()
const emit = defineEmits<{ close: [] }>()

// 모달이 열려 있는 동안 배경 스크롤 잠금
watch(
    () => props.project,
    p => {
        if (typeof document === 'undefined') return
        document.body.style.overflow = p ? 'hidden' : ''
    }
)
onUnmounted(() => {
    if (typeof document !== 'undefined') document.body.style.overflow = ''
})

const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') emit('close')
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
