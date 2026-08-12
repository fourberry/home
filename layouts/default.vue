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

// 회사 정보(Organization) 구조화 데이터는 모든 페이지에 공통으로 들어갑니다.
// 각 페이지의 JSON-LD 가 provider 로 이 노드를 @id 참조합니다.
useFbJsonLd(orgJsonLd())
</script>
