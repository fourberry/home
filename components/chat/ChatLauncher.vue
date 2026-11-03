<template>
    <div class="fbc-root" :class="{ 'is-brand': host.brandPage.value, 'is-open': open }">
        <Transition name="fbc-pop">
            <component :is="panel" v-if="open && panel" @close="close" @unavailable="unavailable = true" />
            <div v-else-if="open && loadFailed" class="fbc-fallback" role="dialog" aria-labelledby="fbc-fallback-title" @keydown.esc="close">
                <p id="fbc-fallback-title">채팅을 불러오지 못했습니다. 잠시 뒤 다시 시도하거나 문의 폼을 이용해 주세요.</p>
                <div class="fbc-fallback-actions">
                    <a ref="fallbackLink" class="btn btn-primary" :href="chatInquiryHref" @click="onFallbackContact">문의 폼으로</a>
                    <button type="button" class="btn btn-ghost" @click="close">닫기</button>
                </div>
            </div>
        </Transition>
        <button
            v-if="!unavailable"
            ref="button"
            type="button"
            class="fbc-launcher"
            aria-label="포베리 AI 상담"
            aria-haspopup="dialog"
            :aria-expanded="open ? 'true' : 'false'"
            :aria-controls="open && panel ? 'fb-chat-panel' : undefined"
            :aria-busy="loading ? 'true' : undefined"
            @click="toggle"
            @keydown.esc="open && close()"
        >
            <svg class="fbc-launcher-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                    d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.6c-.5.4-1.3.1-1.3-.6V16A2.5 2.5 0 0 1 4 13.5v-8Z"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linejoin="round"
                />
                <path d="M8.5 9.5h.01M12 9.5h.01M15.5 9.5h.01" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
            </svg>
            <span>AI 상담</span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { inject, markRaw, nextTick, ref, shallowRef, type Component } from 'vue'
import { CHAT_HOST, chatInquiryHref } from '~/utils/chatHost'
import { trackChat } from '~/utils/chatTrack'

/**
 * 채팅 여는 버튼. plugins/chat.client.ts 가 별도 Vue 앱으로 띄웁니다(Nuxt 컴포저블·NuxtLink 를 쓰지 않음).
 * 창(ChatPanel)의 코드는 버튼을 처음 누를 때 내려받습니다.
 */
const host = inject(CHAT_HOST)!

const open = ref(false)
const loading = ref(false)
const loadFailed = ref(false)
/** 404·origin 거절·한도 조회 실패. 창을 닫으면 버튼을 숨깁니다(그 탭에서만) */
const unavailable = ref(false)
const panel = shallowRef<Component | null>(null)
const button = ref<HTMLButtonElement | null>(null)
const fallbackLink = ref<HTMLAnchorElement | null>(null)

const toggle = async () => {
    if (open.value) return close()
    if (loading.value) return
    if (!panel.value) {
        loading.value = true
        try {
            panel.value = markRaw((await import('./ChatPanel.vue')).default)
            loadFailed.value = false
        } catch (error) {
            console.error('[chat] 채팅 창을 불러오지 못했습니다.', error)
            loadFailed.value = true
        } finally {
            loading.value = false
        }
    }
    open.value = true
    trackChat(host, 'chat_open', { link_location: 'launcher' })
    if (!panel.value) nextTick(() => fallbackLink.value?.focus())
}

const close = () => {
    open.value = false
    // 대화상자를 닫으면 여는 버튼으로 포커스를 돌려 둡니다. 버튼을 숨긴 경우(채팅 사용 불가)는 그대로 둡니다.
    nextTick(() => button.value?.focus({ preventScroll: true }))
}

const onFallbackContact = (event: MouseEvent) => {
    trackChat(host, 'chat_contact_click', { link_location: 'chat_panel' })
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    open.value = false
    host.openContact()
}
</script>

<style scoped>
/*
 * 위치: 데스크톱은 오른쪽 아래. 920px 이하에서는 '맨 위로' 버튼(.scroll-top, 아래 16px) 위에 쌓고,
 * 브랜드 페이지는 하단 고정 바(.bp-mobile-bar)와 그 위로 올라간 '맨 위로'(아래 88px)보다 더 위에 둡니다.
 * ⚠️ 920px 은 fb-design.css·fb-brand.css 의 모바일 기준과 같아야 합니다(composables/useIsMobile.ts 참고).
 * z-index 47 은 '맨 위로'와 같은 층입니다. 모바일 메뉴(48)·헤더(50)가 버튼을 덮고, 버튼은 하단 바(46)를 덮습니다.
 */
.fbc-launcher {
    position: fixed;
    right: 24px;
    bottom: calc(24px + env(safe-area-inset-bottom));
    z-index: 47;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 52px;
    padding: 0 20px 0 16px;
    border: 0;
    border-radius: 999px;
    background: var(--accent);
    color: var(--on-accent);
    font-family: var(--font-sans);
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.01em;
    box-shadow:
        0 10px 30px -12px rgba(0, 61, 165, 0.55),
        var(--shadow);
    cursor: pointer;
    transition:
        background 0.2s ease,
        transform 0.18s ease;
}
.fbc-launcher:hover {
    background: var(--accent-hover);
    transform: translateY(-1px);
}
.fbc-launcher:focus-visible {
    outline: 3px solid var(--accent-lite);
    outline-offset: 3px;
}
.fbc-launcher-icon {
    flex: none;
}

.fbc-fallback {
    position: fixed;
    right: 24px;
    bottom: calc(88px + env(safe-area-inset-bottom));
    z-index: 100;
    width: min(360px, calc(100vw - 32px));
    padding: 20px;
    border: 1px solid var(--line);
    border-radius: var(--radius-l);
    background: var(--surface);
    color: var(--ink);
    box-shadow: var(--shadow-lg);
    font-size: 14.5px;
    line-height: 1.6;
}
.fbc-fallback-actions {
    display: flex;
    gap: 8px;
    margin-top: 14px;
}
.fbc-fallback-actions .btn {
    flex: 1;
    justify-content: center;
    padding: 11px 16px;
}

.fbc-pop-enter-active,
.fbc-pop-leave-active {
    transition:
        opacity 0.2s ease,
        transform 0.22s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.fbc-pop-enter-from,
.fbc-pop-leave-to {
    opacity: 0;
    transform: translateY(12px);
}

@media (max-width: 920px) {
    .fbc-launcher {
        right: 16px;
        bottom: calc(74px + env(safe-area-inset-bottom));
        height: 48px;
        padding: 0 18px 0 14px;
    }
    .is-brand .fbc-launcher {
        bottom: calc(146px + env(safe-area-inset-bottom));
    }
    /* 창이 화면 전체를 쓰는 동안 버튼은 창 뒤에 숨깁니다 */
    .is-open .fbc-launcher {
        display: none;
    }
    .fbc-fallback {
        right: 16px;
        left: 16px;
        width: auto;
        bottom: calc(74px + env(safe-area-inset-bottom));
    }
}

@media (prefers-reduced-motion: reduce) {
    .fbc-launcher,
    .fbc-pop-enter-active,
    .fbc-pop-leave-active {
        transition: none;
    }
    .fbc-launcher:hover {
        transform: none;
    }
}
</style>
