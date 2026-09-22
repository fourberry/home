<template>
    <details class="bp-fold" :open="!isMobile || opened" @toggle="onToggle">
        <summary class="bp-fold-summary" :tabindex="isMobile ? undefined : -1" @click="onClick">
            <slot name="summary" />
            <span class="bp-fold-icon" aria-hidden="true">+</span>
        </summary>
        <div class="bp-fold-body">
            <slot />
        </div>
    </details>
</template>

<script setup lang="ts">
import { ref } from 'vue'

/**
 * 모바일에서만 접히는 카드·행.
 *
 *  - PC: 항상 열려 있고 summary 를 눌러도 닫히지 않습니다. fb-brand.css 가 summary/body 를
 *    display:contents 로 두어 기존 카드·그리드 구조(예: .bp-compat-row 의 3열)가 그대로 유지됩니다.
 *  - 모바일: 제목(summary 슬롯)만 먼저 보이고, 누르면 본문(기본 슬롯)이 펼쳐집니다.
 *  - SSR 에서는 isMobile 이 false 라 열린 채로 렌더됩니다 → JS 없이도 내용이 보이고 색인도 됩니다.
 *
 * 사용: <BrandFold class="bp-fit-card" :is-mobile="isMobile"><template #summary><h3>…</h3></template><p>…</p></BrandFold>
 * 루트 details 에 class 가 그대로 전달되므로 기존 카드 클래스를 그대로 쓰면 됩니다.
 */
const props = defineProps<{
    isMobile: boolean
    /** 모바일에서 처음부터 펼쳐 둘지 (예: 첫 항목) */
    defaultOpen?: boolean
}>()

const opened = ref(!!props.defaultOpen)

// PC 에서는 토글을 막습니다. 키보드 Enter/Space 도 click 이벤트로 오므로 함께 막힙니다.
const onClick = (e: MouseEvent) => {
    if (!props.isMobile) e.preventDefault()
}
// 모바일에서 사용자가 여닫은 상태를 따라갑니다(details 의 기본 동작을 그대로 쓰고 상태만 동기화).
const onToggle = (e: Event) => {
    if (props.isMobile) opened.value = (e.target as HTMLDetailsElement).open
}
</script>
