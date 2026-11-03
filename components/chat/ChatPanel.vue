<template>
    <div
        id="fb-chat-panel"
        ref="root"
        class="fbc-panel"
        role="dialog"
        :aria-modal="isMobile ? 'true' : undefined"
        aria-labelledby="fbc-title"
        aria-describedby="fbc-disclosure"
        @keydown="onPanelKeydown"
    >
        <header class="fbc-head">
            <h2 id="fbc-title" class="fbc-title">포베리 AI 상담</h2>
            <div class="fbc-head-actions">
                <button v-if="hasConversation" type="button" class="fbc-text-btn" @click="newConversation">새 대화</button>
                <button type="button" class="fbc-icon-btn" aria-label="채팅 닫기" @click="emit('close')">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    </svg>
                </button>
            </div>
        </header>

        <div ref="scroller" class="fbc-body" @scroll.passive="onScroll">
            <!-- 고지: 첫 화면에 늘 보입니다. 최종 문구는 결정 15 에 따라 개인정보 담당자가 확인합니다 -->
            <ul id="fbc-disclosure" class="fbc-disclosure">
                <li v-for="line in DISCLOSURE" :key="line">{{ line }}</li>
            </ul>

            <p v-if="session.phase === 'loading'" class="fbc-status">채팅을 준비하고 있습니다…</p>
            <p v-else-if="session.phase === 'unavailable'" class="fbc-unavailable">지금은 채팅을 쓸 수 없습니다. 문의 폼을 이용해 주세요.</p>

            <ol v-if="session.turns.length || session.pending" class="fbc-log" aria-label="대화 내용">
                <li v-for="(turn, i) in session.turns" :key="i" class="fbc-msg" :class="'is-' + turn.role">
                    <span class="fbc-sr">{{ turn.role === 'user' ? '질문' : '답변' }}</span>
                    <!-- 답은 글로만 그립니다(textContent). HTML·마크다운·링크를 해석하지 않습니다 -->
                    <p class="fbc-text">{{ turn.content }}</p>
                    <p v-if="turn.masked" class="fbc-meta">개인정보로 보이는 부분은 가리고 AI에 전달했습니다.</p>
                    <p v-if="turn.cut" class="fbc-meta">답이 길어 중간에 끊겼습니다. 자세한 내용은 문의 폼으로 확인해 주세요.</p>
                </li>
                <template v-if="session.pending">
                    <li class="fbc-msg is-user" :class="{ 'is-failed': session.pending.status === 'failed' }">
                        <span class="fbc-sr">질문</span>
                        <p class="fbc-text">{{ session.pending.question }}</p>
                        <p v-if="session.pending.masked" class="fbc-meta">개인정보로 보이는 부분은 가리고 AI에 전달했습니다.</p>
                        <p v-if="session.pending.status === 'failed'" class="fbc-meta">답을 받지 못했습니다.</p>
                    </li>
                    <li v-if="session.pending.status !== 'failed'" class="fbc-msg is-assistant is-pending" aria-busy="true">
                        <span class="fbc-sr">답변</span>
                        <p v-if="session.pending.answer" class="fbc-text">{{ session.pending.answer }}</p>
                        <p v-else class="fbc-typing">
                            답을 준비하고 있습니다
                            <span class="fbc-dots" aria-hidden="true">
                                <i></i>
                                <i></i>
                                <i></i>
                            </span>
                        </p>
                    </li>
                </template>
            </ol>
        </div>

        <div class="fbc-foot">
            <div class="fbc-notice" :class="{ 'is-empty': !noticeText }">
                <p role="status">{{ noticeText }}</p>
                <div v-if="session.notice && (session.notice.retry || session.notice.reset)" class="fbc-notice-actions">
                    <button v-if="session.notice.retry && session.pending?.status === 'failed'" type="button" class="fbc-text-btn" :disabled="blocked" @click="retry">다시 보내기</button>
                    <button v-if="session.notice.reset" type="button" class="fbc-text-btn" @click="newConversation">새 대화 시작</button>
                </div>
            </div>

            <form v-if="session.phase !== 'unavailable'" class="fbc-form" @submit.prevent="submit">
                <label for="fbc-input" class="fbc-sr">질문</label>
                <textarea
                    id="fbc-input"
                    ref="input"
                    v-model="session.draft"
                    class="fbc-input"
                    rows="2"
                    placeholder="포베리에 궁금한 점을 적어 주세요"
                    autocomplete="off"
                    aria-describedby="fbc-count"
                    @keydown="onInputKeydown"
                ></textarea>
                <div class="fbc-form-row">
                    <p id="fbc-count" class="fbc-count" :class="{ 'is-over': tooLong }">
                        <template v-if="session.limits">
                            <span>질문 {{ userTurns }}/{{ session.limits.max_turns }}</span>
                            <span>{{ draftLength }}/{{ session.limits.max_message_chars }}자</span>
                        </template>
                        <span v-if="waitText">{{ waitText }}</span>
                    </p>
                    <button type="submit" class="btn btn-primary fbc-send" :disabled="!canSend">보내기</button>
                </div>
            </form>
            <a ref="contactLink" class="btn btn-ghost fbc-contact" :href="chatInquiryHref" @click="onContactClick">문의 폼으로</a>
        </div>

        <!-- 화면 읽기: 답은 done 뒤에 한 번만 읽힙니다(조각마다 읽히지 않게 대화 목록에는 aria-live 를 두지 않습니다) -->
        <div class="fbc-sr" aria-live="polite" aria-atomic="true">{{ session.announce }}</div>
    </div>
</template>

<script lang="ts">
import { reactive } from 'vue'
import type { ChatLimits } from '~/utils/webchat'

/*
 * 대화는 이 모듈의 메모리에만 둡니다(localStorage·sessionStorage·쿠키 금지).
 * 창을 닫았다 열어도 그 탭에서는 이어지고, 새로고침하면 사라집니다.
 */
interface Turn {
    role: 'user' | 'assistant'
    content: string
    /** 가드레일이 개인정보로 보이는 부분을 가렸다(start 의 masked) */
    masked?: boolean
    /** 답 길이 한도에 닿아 잘렸다(done 의 finish: length) */
    cut?: boolean
}
interface Pending {
    question: string
    answer: string
    status: 'waiting' | 'streaming' | 'failed'
    masked: boolean
}
interface Notice {
    text: string
    retry?: boolean
    reset?: boolean
}

const session = reactive({
    phase: 'idle' as 'idle' | 'loading' | 'ready' | 'unavailable',
    limits: null as ChatLimits | null,
    /** done 까지 받아 서명된 대화 */
    turns: [] as Turn[],
    signature: '',
    pending: null as Pending | null,
    notice: null as Notice | null,
    draft: '',
    /** Retry-After 가 끝나는 시각(ms) */
    blockedUntil: 0,
    announce: '',
})
let inflight: AbortController | null = null
</script>

<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { CHAT_HOST, chatInquiryHref } from '~/utils/chatHost'
import { trackChat } from '~/utils/chatTrack'
import { ChatError, chatLength, fetchChatLimits, sendChatMessage, type ChatMessage } from '~/utils/webchat'

const emit = defineEmits<{ close: []; unavailable: [] }>()
const host = inject(CHAT_HOST)!

/** 첫 화면 고지(사용자 선택: 짧게 줄인 판). 이 문장들이 참이어야 합니다 — plum 은 원문을 두지 않고, 창은 메모리에만 두고, GA 에는 글이 가지 않습니다 */
const DISCLOSURE = ['사내 AI가 홈페이지 공개 자료로 답하며, 틀릴 수 있습니다.', '개인정보는 쓰지 마세요. 상담은 문의 폼으로.', '대화는 저장되지 않습니다.']

const root = ref<HTMLElement | null>(null)
const scroller = ref<HTMLElement | null>(null)
const input = ref<HTMLTextAreaElement | null>(null)
const contactLink = ref<HTMLAnchorElement | null>(null)

// 920px 이하인지. fb-design.css·fb-brand.css 의 모바일 기준, composables/useIsMobile.ts 와 같은 값이어야 합니다.
// useIsMobile 을 import 하지 않는 까닭은 plugins/chat.client.ts 머리 주석(페이지와 조각을 나눠 쓰지 않기).
const mobileQuery = window.matchMedia('(max-width: 920px)')
const isMobile = ref(mobileQuery.matches)
const onMobileChange = () => (isMobile.value = mobileQuery.matches)
mobileQuery.addEventListener('change', onMobileChange)

// ── 한도와 보내기 조건 ──────────────────────────────────────────
const now = ref(Date.now())
let clock: ReturnType<typeof setInterval> | undefined
const blocked = computed(() => session.blockedUntil > now.value)
const waitText = computed(() => {
    const seconds = Math.ceil((session.blockedUntil - now.value) / 1000)
    // 하루 마감(자정까지)처럼 긴 기다림은 안내 문구로 대신하고 초를 세지 않습니다.
    return seconds > 0 && seconds <= 600 ? `${seconds}초 뒤에 다시 보낼 수 있습니다` : ''
})
watch(
    () => session.blockedUntil,
    until => {
        clearInterval(clock)
        now.value = Date.now()
        if (until > now.value) {
            clock = setInterval(() => {
                now.value = Date.now()
                if (now.value >= session.blockedUntil) clearInterval(clock)
            }, 1000)
        }
    },
    { immediate: true }
)

const question = computed(() => session.draft.trim())
const draftLength = computed(() => chatLength(question.value))
const userTurns = computed(() => session.turns.filter(t => t.role === 'user').length)
const usedChars = computed(() => session.turns.reduce((sum, t) => sum + chatLength(t.content), 0))
const tooLong = computed(() => !!session.limits && draftLength.value > session.limits.max_message_chars)
const turnsFull = computed(() => !!session.limits && userTurns.value >= session.limits.max_turns)
const conversationFull = computed(() => !!session.limits && usedChars.value + draftLength.value > session.limits.max_conversation_chars)
const busy = computed(() => session.pending?.status === 'waiting' || session.pending?.status === 'streaming')
const hasConversation = computed(() => session.turns.length > 0 || !!session.pending)
const canSend = computed(() => session.phase === 'ready' && !busy.value && !blocked.value && draftLength.value > 0 && !tooLong.value && !turnsFull.value && !conversationFull.value)

/** 보내기 전에 화면에서 알려 줄 것(서버까지 가지 않음). 서버가 준 안내가 있으면 그것이 먼저입니다 */
const noticeText = computed(() => {
    if (session.notice) return session.notice.text
    if (!session.limits || busy.value) return ''
    if (tooLong.value) return `질문은 ${session.limits.max_message_chars}자까지 쓸 수 있습니다. 줄여 주세요.`
    if (turnsFull.value) return `이 대화에서는 질문을 ${session.limits.max_turns}번까지 할 수 있습니다. 새 대화를 시작하거나 문의 폼을 이용해 주세요.`
    if (conversationFull.value) return '대화가 길어져 더 이어 갈 수 없습니다. 새 대화를 시작하거나 문의 폼을 이용해 주세요.'
    return ''
})

// ── 주고받기 ────────────────────────────────────────────────
const loadLimits = async () => {
    if (session.phase === 'unavailable') return emit('unavailable')
    if (session.phase !== 'idle') return
    session.phase = 'loading'
    try {
        session.limits = await fetchChatLimits(host.endpoint)
        session.phase = 'ready'
    } catch {
        // 404·CORS 실패·네트워크 실패는 브라우저에서 구분되지 않으므로 같게 다룹니다(계약).
        session.phase = 'unavailable'
        emit('unavailable')
        nextTick(() => contactLink.value?.focus())
    }
}

const announce = (text: string) => {
    session.announce = ''
    nextTick(() => (session.announce = text))
}

/** 실패한 질문을 입력 칸으로 되돌립니다(이미 다른 글을 쓰고 있으면 덮어쓰지 않음) */
const restore = (text: string) => {
    session.pending = null
    if (!session.draft.trim()) session.draft = text
}

const markFailed = () => {
    if (!session.pending) return
    session.pending.status = 'failed'
    session.pending.answer = ''
}

const blockFor = (seconds: number) => {
    if (seconds > 0) session.blockedUntil = Date.now() + seconds * 1000
}

/** 계약의 오류 표 "창이 할 일" */
const fail = (text: string, error: ChatError) => {
    trackChat(host, 'chat_answer_failed', { error_code: error.code })
    const max = session.limits?.max_message_chars ?? 0
    switch (error.code) {
        case 'webchat_not_found':
        case 'origin_not_allowed':
            session.pending = null
            session.phase = 'unavailable'
            session.notice = null
            emit('unavailable')
            nextTick(() => contactLink.value?.focus())
            return
        case 'message_too_long':
            restore(text)
            session.notice = { text: `질문이 너무 깁니다. ${max ? max + '자 이내로 ' : ''}줄여 주세요.` }
            return
        case 'guardrail_blocked':
            restore(text)
            session.notice = { text: '이 내용에는 답할 수 없습니다. 문의 폼을 이용해 주세요.' }
            return
        case 'conversation_too_long':
            restore(text)
            session.notice = { text: '대화가 길어져 더 이어 갈 수 없습니다. 새 대화를 시작하거나 문의 폼을 이용해 주세요.', reset: true }
            return
        case 'invalid_request':
        case 'invalid_signature':
        case 'request_too_large':
            restore(text)
            session.notice = { text: '이 대화는 더 이어 갈 수 없습니다. 새 대화를 시작해 주세요.', reset: true }
            return
        case 'budget_exceeded':
            restore(text)
            blockFor(error.retryAfter || 3600)
            session.notice = { text: '오늘 채팅 상담이 마감되었습니다. 문의 폼을 이용해 주세요.' }
            return
        case 'rate_limit_exceeded':
            // IP 하루 한도(한국 날짜)는 Retry-After 가 자정까지라 길게 옵니다. 그날은 다시 보내도 소용없으므로 입력 칸으로 되돌립니다.
            if (error.retryAfter > 600) {
                restore(text)
                blockFor(error.retryAfter)
                session.notice = { text: '오늘 보낼 수 있는 질문을 다 보냈습니다. 문의 폼을 이용해 주세요.' }
                return
            }
            markFailed()
            blockFor(error.retryAfter || 60)
            session.notice = { text: '질문이 짧은 시간에 많이 왔습니다. 잠시 뒤 다시 보내 주세요.', retry: true }
            return
        case 'busy':
            markFailed()
            blockFor(error.retryAfter)
            session.notice = { text: '지금은 답을 기다리는 질문이 많습니다. 잠시 뒤 다시 보내 주세요.', retry: true }
            return
        case 'model_unavailable':
            markFailed()
            blockFor(error.retryAfter)
            session.notice = { text: '지금은 답을 만들 수 없습니다. 잠시 뒤 다시 보내거나 문의 폼을 이용해 주세요.', retry: true }
            return
        default:
            // model_error · timeout · incomplete · network_error · unknown: 받은 조각은 버리고 같은 질문을 다시 보낼 수 있게 합니다.
            markFailed()
            session.notice = { text: '답을 받지 못했습니다. 다시 보내 주세요.', retry: true }
    }
}

const send = async (text: string) => {
    const messages: ChatMessage[] = [...session.turns.map(({ role, content }) => ({ role, content })), { role: 'user', content: text }]
    const pending: Pending = reactive({ question: text, answer: '', status: 'waiting', masked: false })
    session.pending = pending
    session.notice = null
    stick = true
    trackChat(host, 'chat_message_sent', { turn: Math.min(messages.filter(m => m.role === 'user').length, 20) })

    const controller = new AbortController()
    inflight = controller
    try {
        const answer = await sendChatMessage(
            host.endpoint,
            messages,
            session.signature,
            {
                onStart: masked => {
                    pending.masked = masked
                    pending.status = 'streaming'
                },
                onDelta: piece => {
                    pending.status = 'streaming'
                    pending.answer += piece
                },
            },
            controller.signal
        )
        if (session.pending !== pending) return
        // 서명은 받은 글 그대로에 대해 만들어졌으므로 질문·답을 고치지 않고 그대로 둡니다.
        session.turns.push({ role: 'user', content: text, masked: pending.masked }, { role: 'assistant', content: answer.text, cut: answer.finish === 'length' })
        session.signature = answer.signature
        session.pending = null
        announce(answer.finish === 'length' ? `${answer.text} (답이 길어 중간에 끊겼습니다.)` : answer.text)
    } catch (error) {
        if (controller.signal.aborted || session.pending !== pending) return
        fail(text, error instanceof ChatError ? error : new ChatError('unknown'))
    } finally {
        if (inflight === controller) inflight = null
    }
}

const submit = () => {
    if (!canSend.value) return
    const text = question.value
    session.draft = ''
    send(text)
}

const retry = () => {
    const pending = session.pending
    if (!pending || pending.status !== 'failed' || blocked.value || session.phase !== 'ready') return
    send(pending.question)
}

const newConversation = () => {
    inflight?.abort()
    inflight = null
    const unsent = session.pending?.question
    session.turns = []
    session.signature = ''
    session.pending = null
    session.notice = null
    if (unsent && !session.draft.trim()) session.draft = unsent
    nextTick(() => input.value?.focus())
}

const onContactClick = (event: MouseEvent) => {
    trackChat(host, 'chat_contact_click', { link_location: 'chat_panel' })
    // 새 탭으로 여는 클릭은 브라우저에 맡깁니다. 대화 내용은 어느 쪽으로도 옮기지 않습니다.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    emit('close')
    host.openContact()
}

// ── 키보드·포커스 ──────────────────────────────────────────────
const onInputKeydown = (event: KeyboardEvent) => {
    // Enter 로 보내고 Shift+Enter 로 줄을 바꿉니다. 한글 조합 중의 Enter 는 보내지 않습니다.
    if (event.key !== 'Enter' || event.shiftKey || event.isComposing || event.keyCode === 229) return
    event.preventDefault()
    submit()
}

const focusables = () =>
    Array.from(root.value?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? []).filter(el => el.offsetParent !== null)

const onPanelKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && !event.isComposing) {
        event.stopPropagation()
        emit('close')
        return
    }
    // 920px 이하에서는 화면 전체를 덮는 모달이므로 Tab 이 창 밖으로 나가지 않게 합니다.
    if (event.key !== 'Tab' || !isMobile.value) return
    const items = focusables()
    if (!items.length) return
    const first = items[0]!
    const last = items[items.length - 1]!
    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
    }
}

// 모바일 모달 동안 뒤 페이지를 스크롤·화면 읽기에서 막습니다. 직접 건 것만 풉니다(문의 폼 대화상자와 겹치지 않게).
let modalOn = false
const setModal = (on: boolean) => {
    if (on === modalOn) return
    modalOn = on
    document.body.style.overflow = on ? 'hidden' : ''
    const app = document.getElementById('__nuxt')
    if (on) app?.setAttribute('inert', '')
    else app?.removeAttribute('inert')
}
watch(isMobile, setModal)

// ── 스크롤: 맨 아래를 보고 있을 때만 새 글을 따라갑니다 ─────────────────
let stick = true
const onScroll = () => {
    const el = scroller.value
    if (el) stick = el.scrollHeight - el.scrollTop - el.clientHeight < 80
}
watch(
    () => [session.turns.length, session.pending?.answer, session.pending?.status, session.phase],
    () =>
        nextTick(() => {
            const el = scroller.value
            if (el && stick) el.scrollTop = el.scrollHeight
        }),
    { flush: 'post' }
)

onMounted(() => {
    if (isMobile.value) setModal(true)
    const el = scroller.value
    if (el) el.scrollTop = el.scrollHeight
    if (session.phase === 'unavailable') contactLink.value?.focus()
    else input.value?.focus()
    loadLimits()
})

onBeforeUnmount(() => {
    setModal(false)
    clearInterval(clock)
    mobileQuery.removeEventListener('change', onMobileChange)
})
</script>

<style scoped>
/*
 * 데스크톱: 오른쪽 아래 버튼 위에 떠 있는 창(비모달). 920px 이하: 화면 전체(모달).
 * 색·간격은 fb-design.css 의 변수를 씁니다. 창은 #__nuxt 밖에 있어 브랜드 페이지에서도 회사 색으로 보입니다.
 */
.fbc-panel {
    position: fixed;
    right: 24px;
    bottom: calc(88px + env(safe-area-inset-bottom));
    z-index: 100;
    display: flex;
    flex-direction: column;
    width: min(400px, calc(100vw - 48px));
    height: min(640px, calc(100vh - 112px));
    height: min(640px, calc(100dvh - 112px));
    border: 1px solid var(--line);
    border-radius: var(--radius-l);
    background: var(--bg);
    color: var(--ink);
    box-shadow: var(--shadow-lg);
    font-family: var(--font-sans);
    font-size: 14.5px;
    line-height: 1.6;
    overflow: hidden;
}

.fbc-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 12px 12px 20px;
    border-bottom: 1px solid var(--line);
    background: var(--surface);
}
.fbc-title {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.02em;
}
.fbc-head-actions {
    display: flex;
    align-items: center;
    gap: 4px;
}
.fbc-icon-btn {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--ink-2);
    cursor: pointer;
}
.fbc-icon-btn:hover {
    background: var(--accent-2);
    color: var(--ink);
}
.fbc-text-btn {
    min-height: 36px;
    padding: 0 12px;
    border: 1px solid var(--line);
    border-radius: 999px;
    background: var(--surface);
    color: var(--ink);
    font: inherit;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
}
.fbc-text-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
}
.fbc-text-btn:disabled {
    opacity: 0.5;
    cursor: default;
}
.fbc-icon-btn:focus-visible,
.fbc-text-btn:focus-visible,
.fbc-input:focus-visible,
.fbc-panel .btn:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
}

.fbc-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 16px 16px 8px;
}
.fbc-disclosure {
    margin: 0 0 14px;
    padding: 12px 14px 12px 30px;
    border-radius: var(--radius);
    background: var(--accent-2);
    color: var(--ink);
    font-size: 13.5px;
    line-height: 1.55;
    list-style: disc;
}
.fbc-disclosure li + li {
    margin-top: 2px;
}
.fbc-status,
.fbc-unavailable {
    color: var(--ink-2);
    font-size: 14px;
}
.fbc-unavailable {
    padding: 12px 14px;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    background: var(--surface);
    color: var(--ink);
}

.fbc-log {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 0;
    padding: 0;
    list-style: none;
}
.fbc-msg {
    max-width: 88%;
    padding: 10px 14px;
    border-radius: 14px;
}
.fbc-msg.is-user {
    align-self: flex-end;
    border-bottom-right-radius: 4px;
    background: var(--accent);
    color: var(--on-accent);
}
.fbc-msg.is-user.is-failed {
    background: var(--surface);
    border: 1px dashed var(--line);
    color: var(--ink);
}
.fbc-msg.is-assistant {
    align-self: flex-start;
    border: 1px solid var(--line);
    border-bottom-left-radius: 4px;
    background: var(--surface);
}
.fbc-text {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}
.fbc-meta {
    margin-top: 6px;
    font-size: 12.5px;
    opacity: 0.85;
}
.fbc-typing {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--ink-2);
}
.fbc-dots {
    display: inline-flex;
    gap: 3px;
}
.fbc-dots i {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
    animation: fbc-blink 1.2s infinite ease-in-out;
}
.fbc-dots i:nth-child(2) {
    animation-delay: 0.2s;
}
.fbc-dots i:nth-child(3) {
    animation-delay: 0.4s;
}
@keyframes fbc-blink {
    0%,
    80%,
    100% {
        opacity: 0.25;
    }
    40% {
        opacity: 1;
    }
}

.fbc-foot {
    padding: 10px 16px 14px;
    border-top: 1px solid var(--line);
    background: var(--surface);
}
.fbc-notice {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 10px;
    margin-bottom: 8px;
    font-size: 13.5px;
    color: var(--ink);
}
.fbc-notice.is-empty {
    margin: 0;
}
.fbc-notice-actions {
    display: flex;
    gap: 6px;
}
.fbc-input {
    display: block;
    width: 100%;
    min-height: 52px;
    max-height: 140px;
    padding: 10px 12px;
    border: 1px solid var(--line);
    border-radius: var(--radius-s);
    background: var(--bg-2);
    color: var(--ink);
    font: inherit;
    resize: none;
}
.fbc-input:focus {
    border-color: var(--accent);
}
.fbc-form-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-top: 8px;
}
.fbc-count {
    display: flex;
    flex-wrap: wrap;
    gap: 2px 10px;
    font-family: var(--font-mono);
    font-size: 11.5px;
    color: var(--ink-3);
}
.fbc-count.is-over {
    color: #b42318;
}
.fbc-send {
    flex: none;
    padding: 10px 20px;
}
.fbc-send:disabled {
    opacity: 0.5;
    cursor: default;
    transform: none;
}
.fbc-contact {
    width: 100%;
    justify-content: center;
    margin-top: 10px;
    padding: 10px 16px;
}

.fbc-sr {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

@media (max-width: 920px) {
    .fbc-panel {
        inset: 0;
        width: 100%;
        height: 100%;
        height: 100dvh;
        border: 0;
        border-radius: 0;
        padding: env(safe-area-inset-top) env(safe-area-inset-right) 0 env(safe-area-inset-left);
    }
    .fbc-foot {
        padding-bottom: calc(14px + env(safe-area-inset-bottom));
    }
    /* iOS 가 입력 칸에 포커스할 때 화면을 확대하지 않도록 16px 이상 */
    .fbc-input {
        font-size: 16px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .fbc-dots i {
        animation: none;
        opacity: 0.6;
    }
}
</style>
