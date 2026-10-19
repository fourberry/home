<template>
    <section class="section">
        <div class="container">
            <h1>LinkBerry 페이지가 이동했습니다.</h1>
            <p>LinkBerry는 개발·운영 도구로 별도 소개합니다.</p>
            <NuxtLink :to="linkberryPath + '/'" class="btn btn-primary">LinkBerry 베타 소개·다운로드</NuxtLink>
        </div>
    </section>
</template>

<script setup lang="ts">
import { linkberryPath } from '~/data/linkberry'

// 이전에 공유한 주소는 보존하고 정적 호스팅에서도 새 주소로 안내합니다.
useFbSeo({ title: 'LinkBerry 페이지 이동 안내', description: 'LinkBerry 개발·운영 도구 페이지로 이동합니다.', path: linkberryPath })
useHead({
    meta: [
        { name: 'robots', content: 'noindex, follow' },
        { 'http-equiv': 'refresh', content: '0;url=' + linkberryPath + '/' },
    ],
})
</script>
