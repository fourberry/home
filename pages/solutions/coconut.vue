<template>
    <div>
        <!-- 히어로 -->
        <section id="overview" class="bp-hero">
            <div class="container">
                <FbBreadcrumb :items="crumbs" />
                <div class="bp-hero-grid">
                    <div>
                        <div class="bp-hero-name">
                            {{ solution.name }}
                            <span class="ko">{{ solution.ko }}</span>
                        </div>
                        <p v-if="solution.nameOrigin" class="bp-hero-origin">{{ solution.nameOrigin }}</p>
                        <span class="eyebrow">{{ solution.tag }}</span>
                        <h1>
                            사람·서버·AI의
                            <br />
                            인증을 한곳에서.
                        </h1>
                        <p class="lead">{{ solution.desc }}</p>
                        <div class="fb-page-actions">
                            <NuxtLink :to="coconutInquiryHref" class="btn btn-primary" @click="trackInquiry('hero')">
                                도입 문의
                                <span class="arw">→</span>
                            </NuxtLink>
                            <a href="#ai-control" class="btn btn-ghost">
                                AI 인증 통제 보기
                                <span aria-hidden="true">↓</span>
                            </a>
                        </div>
                        <a :href="coconutProductGuide.href" :download="coconutProductGuide.fileName" class="bp-text-link coconut-guide-link">제품설명서 PDF 다운로드 ↓</a>
                        <div class="bp-facts">
                            <div v-for="f in coconutFacts" :key="f.k">
                                <b>{{ f.k }}</b>
                                <span>{{ f.v }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="bp-hero-visual">
                        <div class="bp-frame bp-frame--hero">
                            <FbZoomImage
                                :src="coconutHero.image"
                                :full-src="coconutHero.full"
                                :alt="coconutHero.alt"
                                :width="coconutHero.w"
                                :height="coconutHero.h"
                                loading="eager"
                                fetchpriority="high"
                            />
                        </div>
                        <p class="bp-note">개발 환경 예시 화면 · 눌러서 세부 내용을 확인하세요.</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="ai-control" class="section section--ink coconut-ai">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">AI access · AI 접근 인증</span>
                    <h2>
                        AI가 접근할 대상과 권한을
                        <br />
                        인증 단계에서 구분합니다.
                    </h2>
                    <p class="lead">{{ coconutAi.intro }}</p>
                    <span class="bp-status dev coconut-ai-status">{{ coconutAi.status }}</span>
                </div>
                <div class="bp-grid-3 coconut-ai-controls">
                    <div v-for="item in coconutAi.controls" :key="item.t" class="fb-feat">
                        <b>{{ item.t }}</b>
                        <span>{{ item.d }}</span>
                    </div>
                </div>
                <p class="coconut-ai-validation">
                    <b>현재 검증 범위</b>
                    {{ coconutAi.validation }}
                </p>
                <a class="bp-text-link" href="#how" @click="selectedFlow = 'ai'">
                    AI MCP 인증 흐름 보기
                    <span aria-hidden="true">↓</span>
                </a>
            </div>
        </section>

        <!-- 관리자 콘솔 투어 -->
        <section id="console" class="section">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">Console · 관리자 콘솔</span>
                    <h2>운영 담당자가 직접 다룹니다.</h2>
                    <p class="lead">테넌트·클라이언트·사용자·정책·이력을 한 콘솔에서 확인합니다. 관리자는 부여된 역할과 범위 안에서 계정 운영 업무를 처리합니다.</p>
                </div>
                <!-- 모바일은 탭으로 전환하며 전체 내용은 정적 HTML에 남깁니다. -->
                <div class="bp-tour-tabs" role="group" aria-label="관리자 콘솔 화면 선택" :hidden="!isMobile">
                    <button v-for="(t, i) in coconutTour" :key="t.id" type="button" :aria-pressed="tourTab === i" @click="tourTab = i">{{ t.tab }}</button>
                </div>
                <div class="bp-tour">
                    <div v-for="(t, i) in coconutTour" v-reveal :id="`console-${t.id}`" :key="t.id" class="bp-tour-row" :class="{ reverse: i % 2 === 1 }" :hidden="isMobile && tourTab !== i">
                        <div class="bp-frame">
                            <FbZoomImage :src="t.image" :full-src="t.full" :alt="t.alt" :width="t.w" :height="t.h" />
                        </div>
                        <div class="bp-tour-text">
                            <span class="eyebrow">{{ t.eyebrow }}</span>
                            <h3>{{ t.h2 }}</h3>
                            <p>{{ t.p }}</p>
                            <ul>
                                <li v-for="pt in t.points" :key="pt">{{ pt }}</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <p class="bp-note">개발 환경의 실제 화면입니다. 표시된 수치와 설정은 운영 실적을 의미하지 않습니다.</p>
            </div>
        </section>

        <!-- 동작 방식 -->
        <section id="how" class="section">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">How it works · 동작 방식</span>
                    <h2>인증은 COCONUT이, 업무 권한은 서비스가.</h2>
                    <p class="lead">사람의 로그인, 서버 간 API 호출, AI 도구의 위임 접근을 각각의 인증 흐름으로 연결합니다.</p>
                </div>
                <div v-if="flowsEnhanced" class="coconut-flow-tabs" role="group" aria-label="인증 흐름 선택">
                    <button
                        v-for="flow in coconutAuthFlows"
                        :key="flow.id"
                        type="button"
                        :aria-pressed="selectedFlow === flow.id"
                        :aria-controls="`auth-flow-${flow.id}`"
                        @click="selectedFlow = flow.id"
                    >
                        {{ flow.label }}
                    </button>
                </div>
                <div v-for="flow in coconutAuthFlows" :id="`auth-flow-${flow.id}`" :key="flow.id" class="coconut-flow-panel" :hidden="flowsEnhanced && selectedFlow !== flow.id">
                    <span v-if="flow.status" class="bp-status dev">{{ flow.status }}</span>
                    <h3>{{ flow.title }}</h3>
                    <p>{{ flow.intro }}</p>
                    <BrandCoconutFlow :flow="flow" />
                    <p v-if="flow.note" class="bp-note">{{ flow.note }}</p>
                    <details class="bp-detail bp-technical-flow">
                        <summary>
                            개발 담당자를 위한 인증 처리 순서
                            <span class="bp-detail-icon" aria-hidden="true">+</span>
                        </summary>
                        <ol class="bp-steps">
                            <li v-for="(step, i) in flow.id === 'user' ? coconutLoginSteps : flow.steps" :key="step.t" class="bp-step">
                                <span class="idx">STEP 0{{ i + 1 }}</span>
                                <h4>{{ step.t }}</h4>
                                <p>{{ step.d }}</p>
                            </li>
                        </ol>
                    </details>
                </div>
            </div>
        </section>

        <!-- 보안 -->
        <section id="security" class="section section--ink">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">Security · 보안</span>
                    <h2>로그인 이후의 접근도 관리합니다.</h2>
                    <p class="lead">계정 보호와 추가 인증부터 토큰 갱신, 세션 종료, 감사 기록까지 연결합니다. 연동 서비스의 검증 방식과 종료 반영 범위를 함께 설계합니다.</p>
                </div>
                <div v-reveal class="bp-grid-3 fb-stagger">
                    <div v-for="s in coconutSecurity" :key="s.t" class="fb-feat">
                        <b>{{ s.t }}</b>
                        <span>{{ s.d }}</span>
                    </div>
                </div>
            </div>
        </section>

        <section id="fit" class="section section--alt">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">Fit · 이런 환경에</span>
                    <h2>우리 서비스에 필요한 인증인지 먼저 확인하세요.</h2>
                    <p class="lead">고객용 웹·앱의 공통 인증과 조직별 계정 운영을 검토할 때 시작할 수 있습니다.</p>
                </div>
                <!-- 모바일에서는 제목만 보이고 눌러서 펼칩니다(BrandFold). PC 는 기존 카드 그대로입니다. -->
                <div v-reveal class="bp-fit-grid fb-stagger">
                    <BrandFold v-for="(item, i) in coconutFit" :key="item.n" class="bp-fit-card" :is-mobile="isMobile" :default-open="i === 0">
                        <template #summary>
                            <span class="bp-index">{{ item.n }}</span>
                            <h3>{{ item.t }}</h3>
                        </template>
                        <p>{{ item.d }}</p>
                    </BrandFold>
                </div>
                <a class="bp-text-link" href="#integration">
                    기존 인증 체계와의 연동 범위 확인
                    <span aria-hidden="true">↗</span>
                </a>
                <details class="bp-detail coconut-comparison-detail">
                    <summary>
                        도입 전후 비교
                        <span class="bp-detail-icon" aria-hidden="true">+</span>
                    </summary>
                    <!-- 모바일 전용: 4행을 한 번에 다 읽지 않도록 '지금 / 도입 후' 를 나눠 보여줍니다. PC 는 대응표 그대로입니다. -->
                    <div class="bp-compare-switch" role="group" aria-label="지금과 도입 후 비교 보기" :hidden="!isMobile">
                        <button type="button" :aria-pressed="compareMode === 'now'" @click="compareMode = 'now'">지금</button>
                        <button type="button" :aria-pressed="compareMode === 'after'" @click="compareMode = 'after'">{{ solution.name }} 도입 후</button>
                    </div>
                    <div class="bp-compare" :class="isMobile ? `is-${compareMode}` : null" role="table" aria-label="도입 전후 비교">
                        <div class="bp-compare-head" role="row">
                            <span role="columnheader">지금</span>
                            <span aria-hidden="true"></span>
                            <span role="columnheader" class="is-after">{{ solution.name }} 도입 후</span>
                        </div>
                        <div v-for="(row, i) in coconutProblems" :key="row.after" class="bp-compare-row" role="row">
                            <div class="bp-compare-now" role="cell">
                                <span class="idx">{{ String(i + 1).padStart(2, '0') }}</span>
                                <p>{{ row.now }}</p>
                            </div>
                            <span class="bp-compare-arrow" aria-hidden="true">→</span>
                            <div class="bp-compare-after" role="cell">
                                <b>{{ row.after }}</b>
                                <span>{{ row.how }}</span>
                            </div>
                        </div>
                    </div>
                </details>
            </div>
        </section>

        <!-- 연동 -->
        <section id="integration" class="section">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">Integration · 연동</span>
                    <h2>연동할 수 있는 범위부터 확인합니다.</h2>
                    <p class="lead">사용자 로그인과 서버 간 인증을 구분해 연결합니다. 기존 사내 인증 체계나 회원 이전은 현재 환경을 확인한 뒤 적용 범위를 정합니다.</p>
                </div>
                <div v-reveal class="bp-compatibility fb-stagger">
                    <BrandFold v-for="(item, i) in coconutCompatibility" :key="item.t" class="bp-compat-row" :is-mobile="isMobile" :default-open="i === 0">
                        <template #summary>
                            <h3>{{ item.t }}</h3>
                            <span class="bp-status" :class="item.kind">{{ item.status }}</span>
                        </template>
                        <p>{{ item.d }}</p>
                    </BrandFold>
                </div>
                <p class="bp-note">기본 제공 기능도 서비스 측 연동과 검수가 필요합니다. 사전 검토 항목의 적용 범위와 일정은 환경 확인 후 안내합니다.</p>
                <details class="bp-detail">
                    <summary>
                        연동 기능 자세히 보기
                        <span class="bp-detail-icon" aria-hidden="true">+</span>
                    </summary>
                    <div class="bp-grid-3">
                        <div v-for="it in coconutIntegrations" :key="it.t" class="bp-int">
                            <div class="k">{{ it.k }}</div>
                            <b>{{ it.t }}</b>
                            <span>{{ it.d }}</span>
                        </div>
                    </div>
                </details>
                <details id="operations" class="bp-detail">
                    <summary>
                        운영·세션 종료 조건
                        <span class="bp-detail-icon" aria-hidden="true">+</span>
                    </summary>
                    <div class="coconut-detail-list">
                        <div v-for="item in coconutOperations" :key="item.t">
                            <h3>{{ item.t }}</h3>
                            <p>{{ item.d }}</p>
                        </div>
                    </div>
                    <p class="bp-note">외부 서비스의 기존 세션 종료는 웹훅 수신·토큰 상태 검증을 연결하고, 이벤트 누락과 장애 시 동작까지 확인합니다.</p>
                </details>
                <details id="spec" class="bp-detail">
                    <summary>
                        설치 환경·구성 기술
                        <span class="bp-detail-icon" aria-hidden="true">+</span>
                    </summary>
                    <table class="bp-spec">
                        <tbody>
                            <tr v-for="row in coconutSpec" :key="row.k">
                                <th scope="row">{{ row.k }}</th>
                                <td>{{ row.v }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <ul class="fb-chips bp-chips">
                        <li v-for="item in solution.stack" :key="item">{{ item }}</li>
                    </ul>
                </details>
                <details id="updates" class="bp-detail">
                    <summary>
                        최신 제품 현황
                        <span class="bp-detail-icon" aria-hidden="true">+</span>
                    </summary>
                    <p>2026년 11월 기준 콘솔 화면을 소개합니다. AI MCP 인증의 개발·검증 범위는 페이지 상단 안내에서 확인할 수 있습니다.</p>
                </details>
            </div>
        </section>

        <!-- 도입 절차 -->
        <section id="adoption" class="section section--ink">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">Adoption · 도입 절차</span>
                    <h2>시범 연동부터 단계적으로 전환합니다.</h2>
                    <p class="lead">기존 계정과 업무 데이터의 연결을 먼저 확인합니다. 서비스 측 개발 범위와 검수 기준, 전환·원복 조건을 함께 정합니다.</p>
                </div>
                <div v-reveal class="fb-step-grid bp-adopt fb-stagger">
                    <div v-for="s in coconutAdoption" :key="s.idx" class="fb-step">
                        <div class="idx">{{ s.idx }}</div>
                        <h3>{{ s.t }}</h3>
                        <p>{{ s.d }}</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="supply" class="section section--alt">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">Scope · 공급과 지원</span>
                    <h2>비용과 일정은 적용 범위에서 시작합니다.</h2>
                    <p class="lead">설치·연동·운영에 포함되는 항목을 구분하고, 현재 환경에 맞춰 협의합니다.</p>
                </div>
                <div v-reveal class="bp-fit-grid fb-stagger">
                    <BrandFold v-for="item in coconutSupply" :key="item.t" class="bp-fit-card" :is-mobile="isMobile">
                        <template #summary>
                            <h3>{{ item.t }}</h3>
                        </template>
                        <p>{{ item.d }}</p>
                    </BrandFold>
                </div>
                <div class="bp-poc">
                    <div>
                        <h3>도입 전 확인하고 싶은 흐름이 있나요?</h3>
                        <p>로그인·추가 인증·계정 정지·로그아웃 등 필요한 시나리오를 알려주세요. 제공 가능한 화면 시연·시범 연동 범위와 일정을 협의합니다.</p>
                    </div>
                    <NuxtLink :to="coconutInquiryHref" class="btn btn-primary" @click="trackInquiry('pilot')">
                        시연·시범 연동 문의
                        <span aria-hidden="true">→</span>
                    </NuxtLink>
                </div>
            </div>
        </section>

        <section id="download" class="section">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">Product guide · 제품설명서</span>
                    <h2>최신 제품설명서를 내려받으세요.</h2>
                    <p class="lead">관리자 화면과 사용자·서버·AI 인증 흐름, 보안 기능과 도입 조건을 한 문서에서 확인할 수 있습니다.</p>
                </div>
                <div class="coconut-guide-card">
                    <div>
                        <h3>COCONUT 제품설명서</h3>
                        <p class="coconut-guide-meta">{{ coconutProductGuide.edition }}판 · {{ coconutProductGuide.updatedAt }} 개정 · PDF {{ coconutProductGuide.pages }}쪽</p>
                        <p>AI MCP 인증의 개발 검증 범위와 서비스 측 연동 조건을 함께 안내합니다.</p>
                    </div>
                    <a :href="coconutProductGuide.href" :download="coconutProductGuide.fileName" class="btn btn-primary">제품설명서 다운로드 <span aria-hidden="true">↓</span></a>
                </div>
            </div>
        </section>

        <!-- 관련 실적 -->
        <section v-if="related.length" class="section">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">Work · 관련 분야 실적</span>
                    <h2>같은 분야에서 이런 일을 했습니다.</h2>
                    <p class="lead">해당 솔루션을 그대로 납품한 사례가 아니라, 같은 영역을 다룬 수행 실적입니다.</p>
                </div>
                <div class="fb-card-grid fb-card-grid--sm">
                    <NuxtLink v-for="p in related" :key="p.id" class="fb-card" :to="`/work/${p.id}/`">
                        <div class="fb-card-media">
                            <img class="slot-img" :src="p.thumb" :alt="`${p.client} — ${p.title}`" loading="lazy" />
                        </div>
                        <div class="fb-card-body">
                            <span class="sol-tag">{{ p.period }}</span>
                            <h3>{{ p.client }}</h3>
                            <p>{{ p.title }}</p>
                        </div>
                        <div class="fb-card-more">실적 자세히 보기 →</div>
                    </NuxtLink>
                </div>
            </div>
        </section>

        <!-- FAQ -->
        <section id="faq" class="section" :class="{ 'section--alt': related.length > 0 }">
            <div class="fb-split container">
                <div class="fb-split-side">
                    <span class="eyebrow">FAQ · 자주 묻는 질문</span>
                    <h2>{{ solution.name }} 도입 전 확인.</h2>
                </div>
                <!-- 모바일에서는 앞의 3개만 먼저 보이고 '더 보기' 로 나머지를 폅니다.
                     전체 질문을 DOM 에 남겨 FAQ JSON-LD 와 화면 내용을 일치시킵니다. -->
                <div class="bp-faq" :class="{ 'is-trimmed': isMobile && !faqExpanded }">
                    <details v-for="(item, i) in solution.faq" :key="item.q" class="bp-detail" :class="{ 'bp-faq-extra': i >= FAQ_PREVIEW }" :open="i === 0">
                        <summary>
                            {{ item.q }}
                            <span class="bp-detail-icon" aria-hidden="true">+</span>
                        </summary>
                        <p>{{ item.a }}</p>
                    </details>
                    <button v-if="solution.faq.length > FAQ_PREVIEW" type="button" class="bp-faq-more" :hidden="!isMobile || faqExpanded" @click="faqExpanded = true">
                        질문 {{ solution.faq.length - FAQ_PREVIEW }}개 더 보기
                        <span aria-hidden="true">↓</span>
                    </button>
                </div>
            </div>
        </section>

        <FbCtaBand :inquiry-to="coconutInquiryHref" :title="`${solution.name} 도입을 검토 중이신가요?`" desc="현재 회원 구조와 연동할 서비스를 알려주시면 전환 방안과 일정을 제안드립니다." />

        <!-- 모바일에서도 설명서 다운로드와 문의에 바로 접근할 수 있습니다. -->
        <div class="bp-mobile-bar" :hidden="!isMobile">
            <a :href="coconutProductGuide.href" :download="coconutProductGuide.fileName" class="bp-mobile-bar-doc" aria-label="제품설명서 PDF 다운로드">
                <b aria-hidden="true">PDF</b>
            </a>
            <NuxtLink :to="coconutInquiryHref" class="btn btn-primary" @click="trackInquiry('mobile_bar')">
                도입 문의
                <span class="arw">→</span>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { findSolution } from '~/data/solutions'
import { fbProjects } from '~/data/projects'
import {
    coconutAi,
    coconutAuthFlows,
    coconutHero,
    coconutOgImage,
    coconutProductGuide,
    coconutProblems,
    coconutFacts,
    coconutLoginSteps,
    coconutTour,
    coconutFit,
    coconutCompatibility,
    coconutOperations,
    coconutSupply,
    coconutInquiryHref,
    coconutSecurity,
    coconutIntegrations,
    coconutSpec,
    coconutAdoption,
} from '~/data/coconut'

/**
 * COCONUT 브랜드 페이지.
 *
 * 정적 파일(coconut.vue)이 동적 라우트([slug].vue)보다 우선하므로 /solutions/coconut/ 은 이 페이지가 받습니다.
 * URL·canonical·프리렌더 경로는 그대로라 기존 색인이 유지됩니다.
 * 카드·SEO·FAQ 는 data/solutions.ts, 브랜드 페이지 전용 내용은 data/coconut.ts 가 출처입니다.
 */
definePageMeta({
    layout: 'brand',
    brand: 'coconut',
    brandNav: [
        { to: '#ai-control', label: 'AI 인증 통제' },
        { to: '#security', label: '보안' },
        { to: '#console', label: '관리자 콘솔' },
        { to: '#how', label: '인증 흐름' },
        { to: '#integration', label: '연동' },
        { to: '#adoption', label: '도입 절차' },
        { to: '#download', label: '제품설명서' },
        { to: '#faq', label: 'FAQ' },
    ],
})

/**
 * 모바일 가독성: PC 화면은 그대로 두고 920px 이하에서만 접기·탭·더 보기를 씁니다.
 * isMobile 은 SSR·첫 렌더에서 false 라 정적 HTML 에는 전부 펼쳐진 상태로 들어갑니다
 * (JS 실패 시에도 내용이 보이고, 검색엔진도 같은 HTML 을 봅니다). 상세는 composables/useIsMobile.ts.
 */
const isMobile = useIsMobile()
const compareMode = ref<'now' | 'after'>('after')
const tourTab = ref(0)
const FAQ_PREVIEW = 3
const faqExpanded = ref(false)
const solution = findSolution('coconut')!
const related = computed(() => fbProjects.filter(p => solution.relatedProjects?.includes(p.id)))
const selectedFlow = ref('user')
const flowsEnhanced = ref(false)
onMounted(() => (flowsEnhanced.value = true))

const crumbs = [
    { name: '홈', path: '/' },
    { name: '솔루션', path: '/solutions' },
    { name: solution.name, path: `/solutions/${solution.slug}` },
]

// 원페이지·상세 페이지와 같은 이벤트명. link_location 으로 페이지 안 위치를 구분합니다.
const trackInquiry = (where: string) => {
    useTrackEvent('solution_inquiry_click', { solution: solution.name, link_location: where })
}

useFbSeo({
    title: solution.seoTitle,
    description: solution.seoDescription,
    path: `/solutions/${solution.slug}`,
    // 홈·목록·구조화 데이터와 같은 최신 콘솔 화면을 링크 미리보기에도 사용합니다.
    image: coconutOgImage,
})

useFbJsonLd([solutionJsonLd(solution), faqJsonLd(solution.faq)])
</script>

<style scoped>
.coconut-guide-link {
    display: inline-block;
    margin-top: 18px;
}
.coconut-guide-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 28px;
    padding: 28px;
    border: 1px solid var(--line);
    border-radius: var(--radius-l);
    background: var(--surface);
}
.coconut-guide-card h3 {
    font-size: 22px;
}
.coconut-guide-card p {
    margin-top: 12px;
    color: var(--ink-2);
    line-height: 1.7;
}
.coconut-guide-card .coconut-guide-meta {
    color: var(--accent);
    font-size: 14px;
}
@media (max-width: 920px) {
    .coconut-guide-card {
        flex-direction: column;
        align-items: stretch;
        padding: 22px;
    }
    .coconut-guide-card .btn {
        justify-content: center;
        white-space: normal;
        text-align: center;
    }
}
.coconut-flow-tabs {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
    margin-top: 28px;
}
.coconut-flow-tabs button {
    padding: 14px 10px;
    min-height: 48px;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    background: var(--surface);
    color: var(--ink);
    font: inherit;
    font-weight: 600;
    word-break: keep-all;
}
.coconut-flow-tabs button[aria-pressed='true'] {
    background: var(--accent);
    color: var(--on-accent);
    border-color: var(--accent);
}
.coconut-flow-tabs button:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
}
.coconut-flow-panel {
    margin-top: 28px;
}
.coconut-flow-panel > h3 {
    margin: 12px 0;
    font-size: clamp(20px, 2.5vw, 28px);
}
.coconut-flow-panel > p {
    color: var(--ink-2);
    line-height: 1.75;
}
.coconut-detail-list {
    display: grid;
    gap: 20px;
    padding: 20px 0;
}
.coconut-detail-list h3 {
    font-size: 17px;
}
.coconut-detail-list p {
    margin-top: 8px;
    color: var(--ink-2);
    line-height: 1.75;
}
.coconut-comparison-detail {
    margin-top: 28px;
}
@media (max-width: 920px) {
    .bp-tour-tabs {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 4px;
        overflow: visible;
    }
    .bp-tour-tabs button {
        padding: 0 6px;
        font-size: 13px;
    }
    .coconut-flow-tabs button {
        font-size: 13px;
    }
}
.coconut-ai-status {
    margin-top: 22px;
    color: var(--ink-accent);
    border-color: var(--ink-fg2);
}
.coconut-ai-number {
    color: var(--ink-accent);
    font-family: var(--font-mono);
    font-size: 13px;
}
.coconut-ai-controls {
    margin-top: 28px;
}
.coconut-ai-validation {
    display: grid;
    gap: 8px;
    margin-top: 28px;
    padding: 22px 24px;
    border: 1px solid var(--ink-fg2);
    border-radius: var(--radius);
    color: var(--ink-fg2);
    line-height: 1.8;
    font-size: 14px;
}
.coconut-ai-validation b,
.coconut-ai .bp-text-link {
    color: var(--ink-accent);
}
.bp-tour-row .bp-frame :deep(img) {
    aspect-ratio: auto;
    object-fit: contain;
}
@media (max-width: 920px) {
    .coconut-ai-validation {
        padding: 18px;
    }
}
</style>
