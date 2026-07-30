<template>
    <section class="hero">
        <div class="container hero-grid">
            <div class="hero-copy">
                <span v-reveal class="eyebrow">AI Solution &amp; SI · Since 2023</span>
                <h1 v-reveal style="margin-top: 22px">
                    한 발 앞선 IT 서비스로<br />고객의 경험과 <span class="accentword">가치</span>를<br />우선합니다.
                </h1>
                <p v-reveal class="tagline">making sweet and sour software.</p>
                <p v-reveal class="sub">
                    시스템 통합과 맞춤형 솔루션으로 비즈니스의 디지털 전환을 앞당깁니다. 인증·메시징·데이터 수집은 검증된
                    자체 솔루션으로 도입 기간을 줄입니다.
                </p>
                <div v-reveal class="hero-actions">
                    <a href="#contact" class="btn btn-primary">상담 문의하기 <span class="arw">→</span></a>
                    <a href="#services" class="btn btn-ghost">서비스 살펴보기</a>
                </div>
                <div v-reveal class="hero-stats">
                    <div v-for="s in stats" :key="s.lbl" class="stat">
                        <div v-countup="s.count !== false" class="num">{{ s.num }}</div>
                        <div class="lbl">{{ s.lbl }}</div>
                    </div>
                </div>
            </div>
            <div v-reveal class="hero-visual">
                <img
                    class="slot-img"
                    src="/images/fb/hero-node.png"
                    alt="포베리의 연결된 노드 구조를 형상화한 오브제"
                />
                <div class="hero-badge">
                    <div class="hb-mark">CORE</div>
                    <div>
                        <div class="hb-t">AI · 보안 · 자동화 · 클라우드 · 모바일</div>
                        <div class="hb-s">변화하는 시대에 맞춘 통합 IT 솔루션</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const stats = [
    // 연도는 0 부터 세면 고장난 것처럼 보이므로 카운트업 제외
    { num: '2023', lbl: '설립 연도 · Founded', count: false },
    { num: '15+', lbl: '수행 프로젝트 · Projects' },
    { num: '3', lbl: '자체 솔루션 · Products' },
]
</script>
