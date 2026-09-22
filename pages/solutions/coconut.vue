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
                            여러 서비스의 로그인과
                            <br />
                            계정 관리를 한곳에서.
                        </h1>
                        <p class="lead">{{ solution.desc }}</p>
                        <div class="fb-page-actions">
                            <NuxtLink :to="coconutInquiryHref" class="btn btn-primary" @click="trackInquiry('hero')">
                                도입 문의
                                <span class="arw">→</span>
                            </NuxtLink>
                            <a :href="coconutBrochure" class="btn btn-ghost" target="_blank" rel="noopener">제품 설명서 (PDF)</a>
                        </div>
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
                        <p class="bp-note">관리자 콘솔 · 예시 데이터 / 화면을 누르면 확대됩니다.</p>
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
            </div>
        </section>

        <!-- 문제 상황 → 도입 후. 좌우 분할(fb-split)은 왼쪽이 비어 허전해서 대응표로 바꿨습니다. -->
        <section class="section section--alt">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">Problem · 이런 상황이라면</span>
                    <h2>서비스마다 로그인을 다시 만들고 계신가요.</h2>
                </div>
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
            </div>
        </section>

        <!-- 동작 방식 -->
        <section id="how" class="section">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">How it works · 동작 방식</span>
                    <h2>인증은 COCONUT이, 업무 권한은 서비스가.</h2>
                    <p class="lead">공통 로그인 화면으로 인증 기능의 중복 개발을 줄입니다. 연동 서비스는 로그인 응답·토큰을 검증해 자체 세션과 업무 권한을 적용합니다.</p>
                </div>
                <!-- 로그인 한 번으로 서비스 A·B를 이용하는 흐름 애니메이션(14초 순환). 정적 3단계 카드(.bp-flow)를 대체합니다. -->
                <BrandCoconutFlow />
                <details class="bp-detail bp-technical-flow">
                    <summary>
                        개발 담당자를 위한 인증 처리 순서
                        <span class="bp-detail-icon" aria-hidden="true">+</span>
                    </summary>
                    <ol class="bp-steps">
                        <li v-for="(step, i) in coconutLoginSteps" :key="step.t" class="bp-step">
                            <span class="idx">STEP 0{{ i + 1 }}</span>
                            <h3>{{ step.t }}</h3>
                            <p>{{ step.d }}</p>
                        </li>
                    </ol>
                </details>
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
                <!-- 모바일 전용: 화면 4개를 탭으로 전환합니다. PC 는 위아래로 나열된 그대로입니다. -->
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
                <details class="bp-detail bp-terms-detail">
                    <summary>
                        약관과 동의 항목 관리도 확인하세요
                        <span class="bp-detail-icon" aria-hidden="true">+</span>
                    </summary>
                    <div class="bp-terms-content">
                        <p>약관 유형을 관리하고 서비스별 약관과 필수·선택 동의를 구성합니다. 유형 등록과 실제 서비스에 적용할 약관 설정은 구분합니다.</p>
                        <div class="bp-frame"><FbZoomImage :src="coconutTerms.image" :full-src="coconutTerms.full" :alt="coconutTerms.alt" :width="coconutTerms.w" :height="coconutTerms.h" /></div>
                    </div>
                </details>
                <p class="bp-note">화면의 통계·목록은 이해를 돕기 위한 예시 데이터이며 개인정보는 가려져 있습니다.</p>
            </div>
        </section>

        <!-- 보안 -->
        <section id="security" class="section section--ink">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">Security · 보안</span>
                    <h2>인증 정책과 운영 이력을 함께 관리합니다.</h2>
                    <p class="lead">표준 로그인 연동 후 지원하는 정책을 관리자 설정으로 변경합니다. 필요한 감사 기록과 보관 범위는 고객의 운영 기준에 맞춰 확인합니다.</p>
                </div>
                <div v-reveal class="bp-grid-3 fb-stagger">
                    <BrandFold v-for="s in coconutSecurity" :key="s.t" class="fb-feat" :is-mobile="isMobile">
                        <template #summary>
                            <b>{{ s.t }}</b>
                        </template>
                        <span>{{ s.d }}</span>
                    </BrandFold>
                </div>
            </div>
        </section>

        <!-- 로그인 화면 브랜딩 -->
        <section id="branding" class="section section--alt">
            <div class="bp-brand-grid container">
                <div>
                    <span class="eyebrow">Branding · 로그인 화면</span>
                    <h2>사용자는 자기 서비스의 로그인 화면을 봅니다.</h2>
                    <p class="bp-lead">
                        하나의 인가 서버를 쓰더라도 서비스마다 로고·색상·문구를 따로 둡니다. 관리자 콘솔에서 미리보기와 저장·게시 기능으로 관리합니다. 로그인 템플릿 등 항목에 따라 반영 방식이
                        다릅니다.
                    </p>
                    <ul v-reveal class="bp-brand-list fb-stagger">
                        <li v-for="b in coconutBranding" :key="b.t">
                            <b>{{ b.t }}</b>
                            <span>{{ b.d }}</span>
                        </li>
                    </ul>
                </div>
                <div class="bp-login-stage" aria-hidden="true">
                    <span class="bp-mock-label">로그인 화면 구성 예시</span>
                    <div class="bp-swatch">
                        <i style="background: var(--accent)"></i>
                        <i style="background: var(--accent-lite)"></i>
                        <i style="background: var(--on-accent)"></i>
                    </div>
                    <div class="bp-login">
                        <div class="logo">
                            <i></i>
                            서비스 이름
                        </div>
                        <h4>로그인</h4>
                        <div class="sub">서비스별 부제목 · 환영 메시지</div>
                        <div class="fld">아이디</div>
                        <div class="fld">비밀번호</div>
                        <div class="cta">로그인</div>
                        <div class="links">
                            <span>회원가입</span>
                            <span>비밀번호 찾기</span>
                        </div>
                        <div class="foot">푸터 문구 · 링크</div>
                    </div>
                </div>
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
            </div>
        </section>

        <section id="operations" class="section section--alt">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">Operations · 운영 조건</span>
                    <h2>로그인 이후의 운영까지 함께 설계합니다.</h2>
                    <p class="lead">계정 정지, 세션 종료, 장애가 발생했을 때 각 서비스가 어떻게 동작할지 확인합니다.</p>
                </div>
                <div v-reveal class="bp-fit-grid fb-stagger">
                    <BrandFold v-for="item in coconutOperations" :key="item.t" class="bp-fit-card" :is-mobile="isMobile">
                        <template #summary>
                            <h3>{{ item.t }}</h3>
                        </template>
                        <p>{{ item.d }}</p>
                    </BrandFold>
                </div>
                <aside class="bp-callout">
                    <b>외부 서비스의 즉시 차단에는 수신 처리가 필요합니다.</b>
                    <p>
                        코코넛의 계정 정지·세션 폐기만으로 외부 서비스의 기존 쿠키와 토큰이 자동으로 사라지지는 않습니다. 수신 서비스가 웹훅을 검증해 자체 세션을 종료하고, 이벤트 누락과 토큰 만료·갱신
                        시 동작을 함께 확인해야 합니다.
                    </p>
                </aside>
            </div>
        </section>

        <!-- 설치 요구사항 · 기술 -->
        <section id="spec" class="section">
            <div class="fb-split container">
                <div class="fb-split-side">
                    <span class="eyebrow">Spec · 설치 요구사항</span>
                    <h2>설치 환경과 운영 규모를 구분해 확인합니다.</h2>
                    <p class="bp-lead">계정 데이터는 설치 환경의 MySQL에 저장합니다. 문자·이메일과 본인인증은 외부 서비스 연결이 필요하며, 폐쇄망이나 외부 통신 제한이 있다면 먼저 알려주세요.</p>
                </div>
                <div>
                    <table class="bp-spec">
                        <tbody>
                            <tr v-for="row in coconutSpec" :key="row.k">
                                <th scope="row">{{ row.k }}</th>
                                <td>{{ row.v }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <details class="bp-detail">
                        <summary>
                            구성 기술 확인
                            <span class="bp-detail-icon" aria-hidden="true">+</span>
                        </summary>
                        <ul class="fb-chips bp-chips">
                            <li v-for="t in solution.stack" :key="t">{{ t }}</li>
                        </ul>
                    </details>
                </div>
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
                     9개 전부 DOM 에 남아 있어 FAQ JSON-LD 와 화면 내용이 계속 일치합니다. -->
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

        <!-- 소개서 -->
        <section class="section bp-doc-section">
            <div class="container">
                <div class="bp-doc">
                    <div>
                        <b>{{ solution.name }} 제품 설명서 (PDF · 14쪽 · 약 0.7MB)</b>
                        <span>관리자 콘솔 화면과 도입 절차를 정리한 고객 배포용 문서입니다. 내부 검토용으로 전달하실 때 쓰세요.</span>
                    </div>
                    <a :href="coconutBrochure" class="btn btn-ghost" target="_blank" rel="noopener">내려받기 ↓</a>
                </div>
            </div>
        </section>

        <FbCtaBand :inquiry-to="coconutInquiryHref" :title="`${solution.name} 도입을 검토 중이신가요?`" desc="현재 회원 구조와 연동할 서비스를 알려주시면 전환 방안과 일정을 제안드립니다." />

        <!-- 모바일 전용 하단 고정 바. 긴 페이지 어디서든 문의·설명서로 갈 수 있게 합니다. PC 는 헤더 버튼이 그 역할입니다. -->
        <div class="bp-mobile-bar" :hidden="!isMobile">
            <a :href="coconutBrochure" class="bp-mobile-bar-doc" target="_blank" rel="noopener" aria-label="제품 설명서 PDF 내려받기">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M12 4v11" />
                    <path d="M7 10l5 5 5-5" />
                    <path d="M5 20h14" />
                </svg>
            </a>
            <NuxtLink :to="coconutInquiryHref" class="btn btn-primary" @click="trackInquiry('mobile_bar')">
                도입 문의
                <span class="arw">→</span>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { findSolution } from '~/data/solutions'
import { fbProjects } from '~/data/projects'
import {
    coconutBrochure,
    coconutHero,
    coconutOgImage,
    coconutProblems,
    coconutFacts,
    coconutLoginSteps,
    coconutTour,
    coconutTerms,
    coconutFit,
    coconutCompatibility,
    coconutOperations,
    coconutSupply,
    coconutInquiryHref,
    coconutSecurity,
    coconutBranding,
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
        { to: '#fit', label: '도입 대상' },
        { to: '#how', label: '이용 흐름' },
        { to: '#console', label: '관리자 콘솔' },
        { to: '#integration', label: '연동' },
        { to: '#adoption', label: '도입 절차' },
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
    // 카드 사진 대신 실제 화면을 링크 미리보기로. SoftwareApplication JSON-LD 의 image 는 solution.image 를 유지합니다.
    image: coconutOgImage,
})

useFbJsonLd([solutionJsonLd(solution), faqJsonLd(solution.faq)])
</script>
