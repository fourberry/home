<template>
    <div>
        <section class="section fb-page-head">
            <div class="container">
                <FbBreadcrumb :items="crumbs" />
                <span class="eyebrow">Service · SI 구축 · SM 운영</span>
                <h1>
                    구축에서 끝내지 않고,
                    <br />
                    운영까지 같은 팀이 이어서 합니다.
                </h1>
                <p class="lead">
                    시스템을 새로 만드는 일(SI)과 만들어진 시스템을 안정적으로 굴리는 일(SM)을 함께 수행합니다. 기획·요건 분석부터 구축, 오픈 이후 운영과 고도화까지 한 흐름으로 이어갑니다.
                </p>
                <div class="fb-page-actions">
                    <NuxtLink to="/#contact" class="btn btn-primary">
                        발주 상담 문의
                        <span class="arw">→</span>
                    </NuxtLink>
                    <NuxtLink to="/work/" class="btn btn-ghost">수행 실적 보기</NuxtLink>
                </div>
            </div>
        </section>

        <section class="section section--alt">
            <div class="fb-prose fb-prose--narrow container">
                <span class="eyebrow">Note · 용어 풀이</span>
                <h2>SI와 SM은 무엇이 다른가요?</h2>
                <p>
                    SI(System Integration, 시스템 통합)는 흩어져 있는 업무와 시스템을 하나로 묶어 새로 만드는 일입니다. 요건을 정리하고, 설계하고, 개발해서 실제로 돌아가는 시스템으로 만들어 넘기는
                    단계까지가 SI의 범위입니다.
                </p>
                <p>
                    SM(System Management, 시스템 운영)은 그렇게 만들어진 시스템을 계속 돌아가게 하는 일입니다. 장애에 대응하고, 데이터가 늘어나면서 생기는 문제를 손보고, 현업의 새로운 요구를 기능으로
                    반영합니다.
                </p>
                <p>
                    두 단계를 다른 회사가 맡으면 인수인계 과정에서 "왜 이렇게 만들었는지"가 사라집니다. 그러면 운영 쪽은 구조를 다시 파악하는 데 시간을 쓰고, 손대기 두려운 부분은 그대로 남습니다.
                    포베리가 구축한 시스템의 상당수를 직접 운영하고 있는 이유가 여기에 있습니다. 실제로 쿠쿠 영업관리 시스템은 2021년 구축 이후, 영등포농협 WITHFRESH는 2024년 오픈 이후 현재까지 운영과
                    고도화를 이어가고 있습니다.
                </p>
            </div>
        </section>

        <section class="section">
            <div class="fb-split container">
                <div class="fb-split-side">
                    <span class="eyebrow">Fit · 이런 발주</span>
                    <h2>이런 상황에 맞습니다.</h2>
                </div>
                <ul class="fb-problems">
                    <li>여러 시스템에 흩어진 업무를 하나로 통합하고 싶습니다.</li>
                    <li>오래된 시스템을 차세대로 다시 만들어야 합니다.</li>
                    <li>서비스를 멈출 수 없는 상태에서 데이터베이스를 옮겨야 합니다.</li>
                    <li>구축은 끝났는데 운영을 맡아줄 곳을 찾고 있습니다.</li>
                    <li>규제·인증 요건에 맞춘 시스템을 새로 갖춰야 합니다.</li>
                    <li>웹과 모바일 앱, 관리자 사이트를 한 번에 만들어야 합니다.</li>
                </ul>
            </div>
        </section>

        <section class="section section--ink">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">Process · 진행 방식</span>
                    <h2>어떻게 진행되나요.</h2>
                    <p class="lead">요구사항이 정리되지 않은 상태에서 문의 주셔도 됩니다. 어떤 것부터 정해야 하는지부터 함께 짚습니다.</p>
                </div>
                <div class="fb-step-grid fb-stagger">
                    <div v-for="s in steps" :key="s.idx" class="fb-step">
                        <div class="idx">{{ s.idx }}</div>
                        <h3>{{ s.t }}</h3>
                        <p>{{ s.d }}</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="section section--alt">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">Work · 수행 실적</span>
                    <h2>말보다 실적으로 보여드립니다.</h2>
                    <p class="lead">제조·유통, 금융, 공공, 교육 분야에서 수행한 구축·운영 프로젝트입니다.</p>
                </div>
                <div class="fb-card-grid fb-card-grid--sm">
                    <NuxtLink v-for="p in fbProjects" :key="p.id" class="fb-card" :to="`/work/${p.id}/`">
                        <div class="fb-card-media">
                            <img class="slot-img" :src="p.thumb" :alt="`${p.client} — ${p.title}`" loading="lazy" />
                        </div>
                        <div class="fb-card-body">
                            <span class="sol-tag">{{ p.category }}</span>
                            <h3>{{ p.client }}</h3>
                            <p>{{ p.title }}</p>
                        </div>
                        <div class="fb-card-more">자세히 보기 →</div>
                    </NuxtLink>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="fb-split container">
                <div class="fb-split-side">
                    <span class="eyebrow">FAQ · 자주 묻는 질문</span>
                    <h2>발주 전 확인.</h2>
                </div>
                <dl class="fb-faq">
                    <template v-for="item in faq" :key="item.q">
                        <dt>{{ item.q }}</dt>
                        <dd>{{ item.a }}</dd>
                    </template>
                </dl>
            </div>
        </section>

        <FbCtaBand title="발주를 검토 중이신가요?" desc="예산 규모와 희망 일정을 알려주시면 요건 분석 후 적합한 범위와 견적을 제안드립니다." />
    </div>
</template>

<script setup lang="ts">
import { fbProjects } from '~/data/projects'
import type { FbFaqItem } from '~/data/faq'

const crumbs = [
    { name: '홈', path: '/' },
    { name: 'SI 구축 · SM 운영', path: '/services/si-sm' },
]

const steps = [
    { idx: '01', t: '요건 확인', d: '현재 시스템 구조와 해결하려는 문제를 확인합니다. 요구사항이 문서로 정리되어 있지 않아도 됩니다.' },
    { idx: '02', t: '범위·견적 제안', d: '무엇까지 이번에 하고 무엇을 다음으로 미룰지 나눠, 예산과 일정에 맞는 범위를 제안드립니다.' },
    { idx: '03', t: '설계 · 구축', d: '화면과 데이터 구조를 설계하고 개발합니다. 중간 결과를 공유하며 방향을 맞춰 나갑니다.' },
    { idx: '04', t: '오픈 · 운영(SM)', d: '오픈 후 안정화를 거쳐 운영으로 넘어갑니다. 장애 대응과 기능 고도화를 이어서 담당합니다.' },
]

// 화면에 보이는 내용과 FAQPage 구조화 데이터가 같아야 합니다. 이 배열 하나만 고치세요.
const faq: FbFaqItem[] = [
    {
        q: '어떤 유형의 프로젝트를 의뢰할 수 있나요?',
        a: '신규 시스템 구축, 시스템 유지보수, 솔루션 도입, AI 도입, 홈페이지 구축 등 다양한 IT 프로젝트를 수행합니다. 기획부터 구축, 운영·고도화까지 전 과정을 함께합니다.',
    },
    {
        q: '예산과 일정은 어떻게 산정되나요?',
        a: '프로젝트 범위와 요구사항에 따라 달라집니다. 문의 시 예산 규모와 희망 일정을 알려주시면, 요건 분석 후 적합한 범위와 견적을 제안드립니다.',
    },
    {
        q: '다른 회사가 구축한 시스템의 운영만 맡길 수 있나요?',
        a: '가능합니다. 다만 인수인계 범위와 현재 시스템 상태에 따라 준비 기간이 달라지므로, 구조와 문서화 수준을 먼저 확인한 뒤 범위를 제안드립니다.',
    },
    {
        q: '구축 이후 운영·유지보수도 지원하나요?',
        a: '구축 후 시스템 운영(SM)과 고도화까지 지속적으로 지원합니다. 안정적인 운영을 위한 모니터링과 개선 작업을 함께 진행합니다.',
    },
    {
        q: '상담은 어떻게 진행되나요?',
        a: '하단 문의 양식 또는 전화·이메일로 연락 주시면 담당자가 요구사항을 확인한 뒤 상담 일정을 안내드립니다. 비대면·방문 상담 모두 가능합니다.',
    },
]

useFbSeo({
    title: 'SI 구축 · SM 운영 — 시스템 통합 개발 업체',
    description: '시스템 통합(SI) 구축부터 운영(SM)까지 한 팀이 이어서 수행합니다. 차세대 시스템 구축, 시스템 통합, 무중단 DB 전환, 구축 이후 유지보수까지 범위와 견적을 상담해 드립니다.',
    path: '/services/si-sm',
})

useFbJsonLd([
    serviceJsonLd({
        name: 'SI 구축 · SM 운영',
        description: '시스템 통합(SI) 구축과 시스템 운영(SM)을 함께 수행합니다. 요건 분석·설계·구축부터 오픈 이후 운영과 기능 고도화까지 담당합니다.',
        path: '/services/si-sm',
        serviceType: '시스템 통합(SI) 구축 및 시스템 운영(SM)',
    }),
    faqJsonLd(faq),
])
</script>
