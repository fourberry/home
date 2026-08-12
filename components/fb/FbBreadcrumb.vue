<template>
    <nav class="fb-crumb" aria-label="현재 위치">
        <ol>
            <li v-for="(item, i) in items" :key="item.path">
                <NuxtLink v-if="i < items.length - 1" :to="withSlash(item.path)">{{ item.name }}</NuxtLink>
                <span v-else aria-current="page">{{ item.name }}</span>
            </li>
        </ol>
    </nav>
</template>

<script setup lang="ts">
import { withSlash } from '~/data/company'

// 화면의 경로 표시와 BreadcrumbList 구조화 데이터를 한 번에 처리합니다.
// 마지막 항목이 현재 페이지이며 링크를 걸지 않습니다.
// path 는 슬래시 없이 넘겨도 되고, 링크·구조화 데이터 양쪽에서 withSlash 로 맞춰집니다.
const props = defineProps<{ items: { name: string; path: string }[] }>()

useFbJsonLd(breadcrumbJsonLd(props.items))
</script>
