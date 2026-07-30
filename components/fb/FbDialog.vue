<template>
    <Teleport to="body">
        <Transition name="fb-fade">
            <div v-if="show" class="fb-dialog-backdrop" @click.self="emit('close')">
                <div class="fb-dialog" role="dialog" aria-modal="true" :aria-label="title">
                    <h3>{{ title }}</h3>
                    <div class="fb-dialog-body"><slot /></div>
                    <button class="btn btn-primary" type="button" @click="emit('close')">확인</button>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { watch, onUnmounted } from 'vue'

const props = defineProps<{ show: boolean; title?: string }>()
const emit = defineEmits<{ close: [] }>()

watch(
    () => props.show,
    v => {
        if (typeof document !== 'undefined') document.body.style.overflow = v ? 'hidden' : ''
    }
)
onUnmounted(() => {
    if (typeof document !== 'undefined') document.body.style.overflow = ''
})

const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.show) emit('close')
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
