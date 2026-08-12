<template>
    <div ref="mapEl" class="fb-map" aria-label="포베리 오피스 위치 지도"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fbCompany } from '~/data/company'

// 서울 영등포구 양평로 22길 21 코오롱디지털타워 (선유도 인근)
// ※ 좌표는 data/company.ts 가 단일 출처입니다. 구조화 데이터(GeoCoordinates)도 같은 값을 씁니다.
const LAT = fbCompany.geo.lat
const LNG = fbCompany.geo.lng

const mapEl = ref<HTMLDivElement | null>(null)
const { $kakao } = useNuxtApp()

onMounted(async () => {
    try {
        const kakao = await $kakao.load()
        if (!mapEl.value) return
        const center = new kakao.maps.LatLng(LAT, LNG)
        const map = new kakao.maps.Map(mapEl.value, { center, level: 4 })
        new kakao.maps.Marker({ position: center, map })
        map.setZoomable(false) // 페이지 스크롤이 지도에 먹히지 않게
    } catch (e) {
        console.error('[FbMap] kakao map init failed', e)
    }
})
</script>
