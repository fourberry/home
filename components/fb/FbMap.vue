<template>
    <div ref="mapEl" class="fb-map" aria-label="포베리 오피스 위치 지도"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fbCompany } from '~/data/company'

// 서울 영등포구 양평로22길 21 코오롱디지털타워 (선유도 인근)
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
        // scrollwheel:false 는 "마우스 휠 = 페이지 스크롤" 로 두기 위한 것입니다.
        // 확대·축소 자체를 막는 setZoomable(false) 를 쓰면 +/- 버튼과 모바일 핀치까지
        // 같이 죽어서 지도를 키울 방법이 사라집니다. 되돌리지 마세요.
        const map = new kakao.maps.Map(mapEl.value, { center, level: 3, scrollwheel: false })
        new kakao.maps.Marker({ position: center, map })
        // 확대·축소 수단: 오른쪽 +/- 컨트롤 · 더블클릭 · 모바일 핀치
        map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT)
    } catch (e) {
        console.error('[FbMap] kakao map init failed', e)
    }
})
</script>
