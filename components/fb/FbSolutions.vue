<template>
    <section id="solutions" class="section">
        <div class="container">
            <div v-reveal class="section-head">
                <span class="eyebrow">Solution · 자체 솔루션</span>
                <h2>검증된 자체 솔루션으로<br />도입을 앞당깁니다.</h2>
                <p class="lead">인증·메시징·데이터 수집을 표준화한 포베리의 자체 솔루션 라인업입니다.</p>
            </div>
            <div class="sol">
                <article
                    v-for="(s, i) in solutions"
                    :key="s.name"
                    v-reveal
                    class="sol-card"
                    :class="{ reverse: i % 2 === 1 }"
                >
                    <div class="sol-media">
                        <img class="slot-img" :src="s.image" :alt="s.name + ' 화면'" loading="lazy" />
                    </div>
                    <div class="sol-body">
                        <div class="sol-head">
                            <div class="sol-head-text">
                                <span class="sol-tag">{{ s.tag }}</span>
                                <h3>{{ s.name }} <span class="ko">{{ s.ko }}</span></h3>
                            </div>
                            <a href="#contact" class="btn btn-ghost sol-cta" @click="trackSolutionInquiry(s.name)">도입 문의 <span class="arw">→</span></a>
                        </div>
                        <p>{{ s.desc }}</p>
                        <div class="sol-feats">
                            <div v-for="ft in s.feats" :key="ft.t" class="f">
                                <b>{{ ft.t }}</b><span>{{ ft.d }}</span>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
// 어느 솔루션에 관심이 쏠리는지 파악하기 위한 GA4 이벤트.
// 앵커 이동(#contact)은 페이지 전환이 아니라 GA 가 자동으로 잡지 못합니다.
const trackSolutionInquiry = (solution: string) => {
    useTrackEvent('solution_inquiry_click', { solution })
}

const solutions = [
    {
        name: 'COCONUT',
        ko: '코코넛',
        tag: 'IAM · SSO · OAuth2 / OIDC',
        image: '/images/SSO.png',
        desc: '하나의 계정으로 여러 서비스를 안전하게 이용하는 통합 인증(SSO) 솔루션. OAuth2·OIDC 표준을 준수하며, 멀티테넌트 환경과 2단계 인증(MFA)을 지원합니다.',
        feats: [
            { t: '멀티테넌트', d: '여러 조직을 단일 시스템에서' },
            { t: '표준 인증', d: 'OAuth2 · OIDC 기반 인가 서버' },
            { t: '2단계 인증', d: 'SMS · 이메일 · OTP 앱(TOTP)' },
            { t: '관리자 콘솔', d: '테넌트·클라이언트·이용자 관리' },
        ],
    },
    {
        name: 'LIME',
        ko: '라임',
        tag: 'Message · Notification · Integration',
        image: '/images/solutions/lime.png',
        desc: 'SMS·알림톡·이메일·푸시를 하나의 API로 통합 발송하는 메시징 플랫폼. 채널마다 따로 연동하지 않고 한 번의 요청으로 처리합니다.',
        feats: [
            { t: '통합 채널', d: 'SMS · LMS · MMS · 알림톡 · 이메일 · 푸시' },
            { t: '단일 API', d: 'API Key 하나로 전 채널 연동' },
            { t: '대량 발송', d: '워커 기반 큐 처리로 안정적' },
            { t: '발송 관리', d: '프로젝트별 채널 설정·발송 이력' },
        ],
    },
    {
        name: 'MUSCAT',
        ko: '머스캣',
        tag: 'Web Automation · Scraping · Data',
        image: '/images/auto.png',
        desc: 'API를 제공하지 않는 웹사이트의 데이터를 안정적으로 수집하는 웹 스크래핑 솔루션. 모듈화된 아키텍처로 OMS·SCM 연동과 반복 업무를 자동화합니다.',
        feats: [
            { t: '실제 브라우저 기반', d: 'Playwright 엔진으로 안정 수집' },
            { t: '자동 수집', d: '검색결과·상품정보·파일 추출' },
            { t: '프로세스 자동화', d: '로그인부터 다운로드까지' },
            { t: '시스템 연동', d: 'OMS · SCM 데이터 파이프라인' },
        ],
    },
]
</script>
