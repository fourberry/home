<template>
    <section class="bg-surface">
        <div class="container-wide py-28 md:py-32">
            <div class="grid min-w-0 grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-24">
                <!-- 왼쪽 정보 패널 -->
                <aside class="hidden lg:col-span-4 lg:block">
                    <div class="space-y-8 lg:sticky lg:top-24">
                        <div>
                            <h1 class="text-4xl font-extrabold leading-[1.1] tracking-tight lg:text-5xl">인사말</h1>
                            <p class="mt-2 text-xl font-semibold text-gray-800 lg:text-2xl">대표이사 </p>
                        </div>
                    </div>
                </aside>

                <!-- 오른쪽 본문 -->
                <article class="min-w-0 lg:col-span-8">
                    <!-- 모바일·태블릿 전용 헤더 -->
                    <div class="mb-6 block lg:hidden">
                        <p class="text-lg font-semibold text-gray-800">대표이사 </p>
                    </div>

                    <!-- 제목 영역 -->
                    <header class="mb-8 lg:mb-10">
                        <!--  laptop-L(xl~)부터 글자 크기 살짝 축소 -->
                        <h2
                            class="whitespace-normal break-words text-[clamp(20px,6vw,48px)] font-extrabold leading-snug tracking-tight text-text lg:text-[clamp(24px,4vw,60px)] xl:text-[56px] 2xl:text-[64px]">
                            "기술의 중심에 사람이 있습니다."
                        </h2>
                    </header>

                    <!-- 본문 -->
                    <div class="lg:border-l-4 border-l-0 border-gray-300 pl-0 lg:pl-8 xl:pl-10">
                        <div class="prose prose-gray max-w-none text-[15px] text-gray-800
         leading-relaxed sm:text-base md:text-[17px] lg:text-[22px] lg:leading-loose xl:leading-[1.9]">
                            <p class="mb-8">
                                주식회사 포베리는 2023년 창업 이래 IT 분야에서
                                <span class="font-semibold text-secondary">기본이 되자는 목적과 사명의식</span>
                                을 가지고 사업을 추진하고 있습니다.
                            </p>

                            <p class="mb-8">
                                시스템은
                                <span class="font-semibold text-secondary">사람이 중심</span>
                                이 되어야 하고 사람을 위해서 존재해야 한다는 것이 저희 포베리가 IT 산업을 바라보는 철학이자 기업의 경영방침입니다.
                            </p>

                            <p class="mb-8">
                                사람 중심의 기술 발전을 위해
                                <span class="font-semibold text-secondary">AICBM (AI · IoT · Cloud · Big Data ·
                                    Mobile)</span>
                                중심의 사업 전개가 필수적이라는 판단에서 관련 사업에 적극적으로 매진함과 동시에 R&D 역량 향상에도 집중적으로 투자하고 있습니다.
                            </p>

                            <p>
                                거시적 관점의 기술 개발에서 초미세화 관점으로 전이되고 있는 IT 기술의 시대 변화에 대응하고, 사람 중심의 IT 기업을 완성할 수 있도록 고객과 함께
                                노력하는 기업이 되도록 하겠습니다.
                            </p>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts"></script>

<style scoped></style>
