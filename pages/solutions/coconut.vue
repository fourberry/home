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
                            흩어진 계정을 하나로.
                            <br />
                            서비스는 로그인을 잊어도 됩니다.
                        </h1>
                        <p class="lead">{{ solution.desc }}</p>
                        <div class="fb-page-actions">
                            <NuxtLink to="/#contact" class="btn btn-primary" @click="trackInquiry('hero')">
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
                    <div class="bp-frame bp-frame--hero">
                        <img :src="coconutHero.image" :alt="coconutHero.alt" :width="coconutHero.w" :height="coconutHero.h" fetchpriority="high" />
                    </div>
                </div>
            </div>
        </section>

        <!-- 문제 상황 → 도입 후. 좌우 분할(fb-split)은 왼쪽이 비어 허전해서 대응표로 바꿨습니다. -->
        <section class="section section--alt">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">Problem · 이런 상황이라면</span>
                    <h2>서비스마다 로그인을 다시 만들고 계신가요.</h2>
                </div>
                <div class="bp-compare" role="table" aria-label="도입 전후 비교">
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
                    <h2>계정과 인증은 COCONUT 이, 업무 권한은 서비스가.</h2>
                    <p class="lead">연동 서비스는 로그인 화면을 만들지 않습니다. 표준 흐름으로 COCONUT 에 인증을 맡기고, 돌려받은 토큰만 확인하면 됩니다.</p>
                </div>
                <div class="bp-flow">
                    <div class="bp-flow-node">
                        <b>연동 서비스</b>
                        <span>로그인 버튼을 누르면 표준 인가 요청을 보냅니다.</span>
                    </div>
                    <div class="bp-flow-arrow" aria-hidden="true">→</div>
                    <div class="bp-flow-node is-core">
                        <b>{{ solution.name }}</b>
                        <span>사용자를 인증하고 2단계 인증·동의를 거쳐 토큰을 발급합니다.</span>
                    </div>
                    <div class="bp-flow-arrow" aria-hidden="true">→</div>
                    <div class="bp-flow-node">
                        <b>연동 서비스</b>
                        <span>토큰을 검증하고 자기 업무 권한을 적용합니다.</span>
                    </div>
                </div>
                <div v-reveal class="bp-steps fb-stagger">
                    <div v-for="(s, i) in coconutLoginSteps" :key="s.t" class="bp-step">
                        <div class="idx">STEP {{ String(i + 1).padStart(2, '0') }}</div>
                        <h3>{{ s.t }}</h3>
                        <p>{{ s.d }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- 핵심 기능 -->
        <section id="features" class="section section--ink">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">Feature · 핵심 기능</span>
                    <h2>{{ solution.name }}이 하는 일.</h2>
                </div>
                <div v-reveal class="fb-feat-grid fb-stagger">
                    <div v-for="f in solution.feats" :key="f.t" class="fb-feat">
                        <b>{{ f.t }}</b>
                        <span>{{ f.d }}</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- 관리자 콘솔 투어 -->
        <section id="console" class="section">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">Console · 관리자 콘솔</span>
                    <h2>운영 담당자가 직접 다룹니다.</h2>
                    <p class="lead">테넌트·클라이언트·사용자·정책·이력을 한 콘솔에서 관리합니다. 계정 업무가 개발 요청 없이 운영 담당자 선에서 끝납니다.</p>
                </div>
                <div class="bp-tour">
                    <div v-for="(t, i) in coconutTour" :id="`console-${t.id}`" :key="t.id" class="bp-tour-row" :class="{ reverse: i % 2 === 1 }">
                        <div class="bp-frame">
                            <img :src="t.image" :alt="t.alt" loading="lazy" :width="t.w" :height="t.h" />
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
                <div class="bp-tour-mini">
                    <figure v-for="m in coconutTourMini" :key="m.h2">
                        <div class="bp-frame">
                            <img :src="m.image" :alt="m.alt" loading="lazy" :width="m.w" :height="m.h" />
                        </div>
                        <figcaption>
                            <b>{{ m.h2 }}</b>
                            <span>{{ m.p }}</span>
                        </figcaption>
                    </figure>
                </div>
                <p class="bp-note">화면의 통계·목록은 이해를 돕기 위한 예시 데이터이며 개인정보는 가려져 있습니다.</p>
            </div>
        </section>

        <!-- 보안 -->
        <section id="security" class="section section--ink">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">Security · 보안</span>
                    <h2>보안 요건은 설정으로 대응합니다.</h2>
                    <p class="lead">서비스 코드를 고치지 않고 인가 서버 쪽에서 정책을 바꿉니다. 감사 요건이 생겨도 이력은 이미 남아 있습니다.</p>
                </div>
                <div v-reveal class="bp-grid-3 fb-stagger">
                    <div v-for="s in coconutSecurity" :key="s.t" class="fb-feat">
                        <b>{{ s.t }}</b>
                        <span>{{ s.d }}</span>
                    </div>
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
                        하나의 인가 서버를 쓰더라도 서비스마다 로고·색상·문구를 따로 둡니다. 관리자 콘솔에서 미리보기로 확인하고 게시하면 로그인·회원가입·동의 화면에 바로 반영됩니다.
                    </p>
                    <ul class="bp-brand-list">
                        <li v-for="b in coconutBranding" :key="b.t">
                            <b>{{ b.t }}</b>
                            <span>{{ b.d }}</span>
                        </li>
                    </ul>
                </div>
                <div class="bp-login-stage" aria-hidden="true">
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
                    <h2>표준으로 붙고, 이벤트로 알립니다.</h2>
                    <p class="lead">웹·모바일·서버 간 통신 어디에나 같은 방식으로 붙습니다. 계정 상태가 바뀌면 연동 서비스에 먼저 알립니다.</p>
                </div>
                <div v-reveal class="bp-grid-3 fb-stagger">
                    <div v-for="it in coconutIntegrations" :key="it.t" class="bp-int">
                        <div class="k">{{ it.k }}</div>
                        <b>{{ it.t }}</b>
                        <span>{{ it.d }}</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- 깊이 읽기 -->
        <section class="section section--alt">
            <div class="fb-prose container">
                <article v-for="sec in solution.sections" :key="sec.h">
                    <h2>{{ sec.h }}</h2>
                    <p>{{ sec.body }}</p>
                </article>
            </div>
        </section>

        <!-- 설치 요구사항 · 기술 -->
        <section id="spec" class="section">
            <div class="fb-split container">
                <div class="fb-split-side">
                    <span class="eyebrow">Spec · 설치 요구사항</span>
                    <h2>무엇이 필요하고, 무엇으로 만들었나.</h2>
                    <p class="bp-lead">
                        도입 환경에 붙일 수 있는지 판단하실 수 있게 설치 요구사항과 구성 기술을 공개합니다. 계정 데이터베이스는 설치한 서버의 MySQL 에 두고, 문자·이메일 발송(LIME)과 본인인증(NICE)은
                        각 서비스로 연결됩니다.
                    </p>
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
                    <ul class="fb-chips bp-chips">
                        <li v-for="t in solution.stack" :key="t">{{ t }}</li>
                    </ul>
                </div>
            </div>
        </section>

        <!-- 도입 절차 -->
        <section id="adoption" class="section section--ink">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">Adoption · 도입 절차</span>
                    <h2>어떻게 진행되나요.</h2>
                    <p class="lead">현재 회원 구조를 확인한 뒤 단계적 전환 방안을 제안드립니다. 요구사항이 정리되지 않은 상태에서 문의 주셔도 됩니다.</p>
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
                <dl class="fb-faq">
                    <template v-for="item in solution.faq" :key="item.q">
                        <dt>{{ item.q }}</dt>
                        <dd>{{ item.a }}</dd>
                    </template>
                </dl>
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

        <FbCtaBand :title="`${solution.name} 도입을 검토 중이신가요?`" desc="현재 회원 구조와 연동할 서비스를 알려주시면 전환 방안과 일정을 제안드립니다." />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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
    coconutTourMini,
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
        { to: '#how', label: '동작 방식' },
        { to: '#console', label: '관리자 콘솔' },
        { to: '#security', label: '보안' },
        { to: '#integration', label: '연동' },
        { to: '#adoption', label: '도입 절차' },
        { to: '#faq', label: 'FAQ' },
    ],
})

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
