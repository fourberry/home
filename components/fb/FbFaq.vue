<template>
    <section id="faq" class="section section--alt">
        <div class="container">
            <div class="faq-grid">
                <div v-reveal>
                    <span class="eyebrow">FAQ · 자주 묻는 질문</span>
                    <h2 style="font-size: clamp(28px, 4vw, 46px); margin-top: 18px">궁금한 점을<br />모았습니다.</h2>
                    <p class="lead" style="margin-top: 18px">
                        더 궁금한 내용은 언제든 문의해 주세요. 담당자가 빠르게 답변드립니다.
                    </p>
                    <a href="#contact" class="btn btn-primary" style="margin-top: 24px">상담 문의 <span class="arw">→</span></a>
                </div>
                <div v-reveal class="faq-list fb-stagger">
                    <div v-for="(item, i) in faq" :key="i" class="faq-item" :class="{ open: openIndex === i }">
                        <button class="faq-q" type="button" :aria-expanded="openIndex === i" @click="toggle(i)">
                            {{ item.q }}<span class="pm"></span>
                        </button>
                        <div class="faq-a" :style="{ maxHeight: openIndex === i ? '400px' : '0px' }">
                            <p>{{ item.a }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const openIndex = ref<number | null>(null)
const toggle = (i: number) => (openIndex.value = openIndex.value === i ? null : i)

const faq = [
    {
        q: '어떤 유형의 프로젝트를 의뢰할 수 있나요?',
        a: '신규 시스템 구축, 시스템 유지보수, 솔루션 도입, AI 도입, 홈페이지 구축 등 다양한 IT 프로젝트를 수행합니다. 기획부터 구축, 운영·고도화까지 전 과정을 함께합니다.',
    },
    {
        q: '예산과 일정은 어떻게 산정되나요?',
        a: '프로젝트 범위와 요구사항에 따라 달라집니다. 문의 시 예산 규모와 희망 일정을 알려주시면, 요건 분석 후 적합한 범위와 견적을 제안드립니다.',
    },
    {
        q: '코코넛·라임·머스캣 솔루션만 단독 도입할 수 있나요?',
        a: '네. 자체 솔루션은 단독 도입이 가능하며, 기존 서비스 구조에 맞춰 유연하게 연동됩니다. 도입 규모와 환경에 따라 맞춤 구성을 안내드립니다.',
    },
    {
        q: '구축 이후 운영·유지보수도 지원하나요?',
        a: '구축 후 시스템 운영(SM)과 고도화까지 지속적으로 지원합니다. 안정적인 운영을 위한 모니터링과 개선 작업을 함께 진행합니다.',
    },
    {
        q: '상담은 어떻게 진행되나요?',
        a: '하단 문의 양식 또는 전화·이메일로 연락 주시면 담당자가 요구사항을 확인한 뒤 상담 일정을 안내드립니다. 비대면·방문 상담 모두 가능합니다.',
    },
    {
        q: '채용은 어떻게 지원하나요?',
        a: '채용 관련 문의는 fourberry@fourberry.co.kr로 연락 주시면 진행 중인 포지션과 전형 절차를 안내드립니다.',
    },
]
</script>
