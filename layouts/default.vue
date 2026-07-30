<template>
    <div class="flex min-h-screen flex-col">
        <AppHeader />
        <main id="top" class="grow">
            <slot />
        </main>
        <AppFooter />
        <AppScrollTop />
    </div>
</template>

<script setup lang="ts">
// 인트로 프리로더 / 스크롤 잠금 제거 — 진입 즉시 콘텐츠가 보입니다.
useHead({ htmlAttrs: { lang: 'ko' } })
</script>
