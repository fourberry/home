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
import { fbFaq } from '~/data/faq'

const openIndex = ref<number | null>(null)
const toggle = (i: number) => (openIndex.value = openIndex.value === i ? null : i)

// 데이터는 data/faq.ts 가 단일 출처입니다.
// pages/index.vue 의 FAQPage 구조화 데이터가 같은 배열을 씁니다 —
// 화면과 구조화 데이터가 다르면 구글이 스팸으로 판단하므로 이 파일에서 직접 고치지 마세요.
const faq = fbFaq
</script>
