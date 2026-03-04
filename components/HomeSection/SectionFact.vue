<template>
 <section class="bg-accent pt-6 pb-0 md:pt-12 md:pb-0 
         rounded-t-[2.5rem] md:rounded-t-[5rem] text-white">
    <div class="container-wide">
      <h2 class="sr-only">회사 기본 정보</h2>

      <!-- 헤더 -->
      <header class="mx-auto mb-8 max-w-7xl px-4 text-center md:mb-12 md:px-8 lg:px-12">
        <p class="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-100">location</p>
        <h2 class="mb-3 text-2xl font-extrabold leading-tight md:text-4xl text-white">오시는 길</h2>
      </header>

      <!-- 2컬럼 레이아웃 -->
      <div class="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-[3fr_2fr] lg:gap-16">
        <!-- 왼쪽: 지도 -->
        <div class="flex h-full min-h-full flex-col space-y-4 rounded-2xl">
          <div class="relative w-full">
            <div ref="mapContainerRef" class="h-[400px] w-full bg-gray-100 shadow-inner"></div>

            <!-- 주소 라벨 -->
            <div
              class="absolute bottom-4 left-4 rounded-lg border border-white/30 bg-white/20 px-3 py-2 text-xs text-white backdrop-blur-sm shadow-lg">
              서울특별시 영등포구 양평로 22길 21
              <br />
              코오롱디지털타워 1409호 (선유도 인근)
            </div>
          </div>
        </div>

        <!-- 오른쪽: 회사 정보 -->
        <!-- 회사 정보 -->
        <div class="flex h-full min-h-full flex-col justify-center">
          <dl class="divide-y divide-white/30">

            <!-- 회사명 (아이콘 + 내용) -->
            <div class="grid grid-cols-1 gap-1 py-4 md:grid-cols-6 md:py-4">
              <!-- 접근성: 용어는 화면에서 숨기고 의미만 남김 -->
              <dt class="sr-only">회사명</dt>
              <dd class="col-span-6">
                <div
                  class="grid grid-cols-[5rem_1fr] gap-x-1 sm:gap-x-2 gap-y-[2px] sm:grid-cols-[6rem_1fr] md:grid-cols-[6.5rem_1fr]">
                  <span class="flex items-center gap-[2px] text-sm md:text-base text-blue-100">
                    <i class="fa-solid fa-building text-blue-100 translate-x-[12px]"></i>
                  </span>
                  <span
                    class="text-base text-white md:text-[1rem] lg:text-[1.05rem] xl:text-xl leading-snug break-keep">
                    포베리주식회사
                  </span>
                </div>
              </dd>
            </div>

            <!-- 설립일 (아이콘 + 내용) -->
            <div class="grid grid-cols-1 gap-1 py-4 md:grid-cols-6 md:py-4">
              <dt class="sr-only">설립일</dt>
              <dd class="col-span-6">
                <div
                  class="grid grid-cols-[5rem_1fr] gap-x-1 sm:gap-x-2 gap-y-[2px] sm:grid-cols-[6rem_1fr] md:grid-cols-[6.5rem_1fr]">
                  <span class="flex items-center gap-[2px] text-sm md:text-base text-blue-100">
                    <i class="fa-solid fa-calendar-days text-blue-100 translate-x-[12px]"></i>
                  </span>
                  <span
                    class="text-base text-white md:text-[1rem] lg:text-[1.05rem] xl:text-xl leading-snug break-keep">
                    2023년 10월 30일
                  </span>
                </div>
              </dd>
            </div>

            <!-- 연락처 (기존 그대로 유지) -->
            <div class="grid grid-cols-1 gap-1 py-4 md:grid-cols-6 md:py-4">
              <dd
                class="col-span-6 text-base text-white md:pl-0 md:text-[1rem] lg:text-[1.05rem] xl:text-xl leading-snug">
                <div
                  class="grid grid-cols-[5rem_1fr] gap-x-1 sm:gap-x-2 gap-y-[2px] sm:grid-cols-[6rem_1fr] md:grid-cols-[6.5rem_1fr]">
                  <span class="flex items-center gap-[2px] text-sm md:text-base text-blue-100">
                    <i class="fa-solid fa-phone text-blue-100 translate-x-[12px]"></i>
                  </span>
                  <span>
                    <a href="tel:010-2755-0650" class="hover:text-yellow-200 transition">010-2755-0650</a>
                  </span>

                  <span class="flex items-center gap-[2px] text-sm md:text-base text-blue-100">
                    <i class="fa-solid fa-location-dot text-blue-100 translate-x-[12px]"></i>
                  </span>
                  <span class="break-words leading-relaxed text-white">
                    서울특별시 영등포구 양평로 22길 21 코오롱디지털타워 1409호
                  </span>

                  <span class="flex items-center gap-[2px] text-sm md:text-base text-blue-100">
                    <i class="fa-solid fa-envelope text-blue-100 translate-x-[12px]"></i>
                  </span>
                  <span class="break-all text-white">
                    <a href="mailto:fourberry@fourberry.co.kr" class="hover:text-yellow-200 transition">
                      fourberry@fourberry.co.kr
                    </a>
                  </span>
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
    <div class="h-6 md:h-16 bg-accent"></div>
    <footer class="bg-accent text-white pt-3 pb-2 md:pt-5 md:pb-4 lg:pt-6 lg:pb-5">
      <div class="container-wide flex flex-col gap-1.5 text-center">
        <div class="text-sm font-semibold">(주)포베리</div>
        <div class="text-xs font-extralight">(07205) 서울특별시 영등포구 양평로 22길 21 1409호</div>
        <div class="text-xs font-extralight flex justify-center gap-1">
          <span>대표이사 : </span>
          <span>|</span>
          <span>사업자등록번호: 562-88-02654</span>
        </div>
        <div class="text-xs font-extralight flex justify-center gap-1">
          <span>Tel: 010-2755-0650</span>
          <span>|</span>
          <span>Email: fourberry@fourberry.co.kr</span>
        </div>

        <!-- 로고 영역 패딩 축소 -->
        <div class="p-2 flex align-middle justify-center">
          <div class="w-40">
            <img src="/images/logo_text_white_transparent.png" />
          </div>
        </div>
      </div>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const mapContainerRef = ref<HTMLDivElement | null>(null)
const { $kakao } = useNuxtApp()

let kakaoRef: any = null
let mapRef: any = null

const companyLat = 37.5398071417051
const companyLng = 126.894657064548

onMounted(async () => {
  kakaoRef = await $kakao.load()
  const center = new kakaoRef.maps.LatLng(companyLat, companyLng)
  const mapOptions = { center, level: 4 }

  if (mapContainerRef.value) {
    mapRef = new kakaoRef.maps.Map(mapContainerRef.value, mapOptions)

    const marker = new kakaoRef.maps.Marker({ position: center, map: mapRef })

    const content = document.createElement('div')
    content.innerHTML = `
      <div style="
        display: inline-block;
        background: rgba(0, 0, 0, 0.85);
        border-radius: 10px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
        padding: 8px 14px;
        font-size: 13px;
        color: #fff;
        font-weight: 600;
        white-space: nowrap;
        transform: translate(-50%, -100%);
        position: absolute;
        left: 50%;
        bottom: 100%;
      ">
        포베리 주식회사
      </div>
    `

    const overlay = new kakaoRef.maps.CustomOverlay({
      content,
      position: center,
      yAnchor: 1.5,
    })

    overlay.setMap(mapRef)
  }
})
</script>
