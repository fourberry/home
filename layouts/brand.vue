<template>
    <div class="brand-page flex min-h-screen flex-col" :style="vars">
        <BrandHeader :solution="solution" :nav="nav" />
        <main id="top" class="grow">
            <slot />
        </main>
        <AppFooter />
        <AppScrollTop />
    </div>
</template>

<script setup lang="ts">
import { findSolution } from '~/data/solutions'

/**
 * 솔루션 브랜드 페이지 레이아웃.
 *
 * 페이지에서 definePageMeta({ layout: 'brand', brand: '{slug}', brandNav: [...] }) 로 지정합니다.
 * data/solutions.ts 의 brand 색을 래퍼의 CSS 변수로 덮어써서, 기존 .section/.btn/.eyebrow 가
 * 그대로 브랜드 색으로 그려집니다. 헤더만 회사 메뉴 대신 페이지 안 앵커를 보여주고,
 * 푸터는 회사 공통 푸터를 그대로 둡니다(사업자 정보·솔루션 목록 링크가 검색엔진 경로이기도 합니다).
 */
const route = useRoute()
const slug = String(route.meta.brand ?? '')
const found = findSolution(slug)
if (!found?.brand) {
    throw createError({ statusCode: 500, statusMessage: `브랜드 레이아웃을 쓰려면 data/solutions.ts 의 '${slug}' 항목에 brand 색이 있어야 합니다.`, fatal: true })
}
const solution = found
const b = solution.brand!
const nav = (route.meta.brandNav as { to: string; label: string }[] | undefined) ?? []

// 데이터가 상수라 반응형(computed)이 필요 없습니다.
const vars = {
    '--accent': b.accent,
    '--accent-hover': b.accentHover,
    '--accent-2': `color-mix(in srgb, ${b.accent} 12%, transparent)`,
    '--accent-lite': b.accentLite,
    '--ink-bg': b.inkBg,
    '--ink-surface': b.inkSurface,
    '--ink-accent': b.inkAccent,
    '--ink-fg2': b.inkFg2,
}

useHead({
    htmlAttrs: { lang: 'ko' },
    // 모바일 브라우저 상단 색. nuxt.config 의 전역값(회사 색)을 이 페이지에서만 덮어씁니다.
    meta: [{ name: 'theme-color', content: b.accent }],
})

// 회사 정보(Organization)는 브랜드 페이지에도 공통으로 심습니다. 솔루션 JSON-LD 가 provider 로 참조합니다.
useFbJsonLd(orgJsonLd())
</script>
