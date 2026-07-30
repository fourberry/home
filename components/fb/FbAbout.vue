<template>
    <section id="about" class="section section--alt">
        <div class="container">
            <div class="about-grid">
                <div v-reveal>
                    <span class="eyebrow">About · 회사소개</span>
                    <h2 class="section-head" style="font-size: clamp(28px, 4.2vw, 50px); margin-top: 18px">
                        인증부터 데이터까지,<br />한 팀에서 해결합니다.
                    </h2>
                    <p class="lead" style="margin-top: 20px">
                        포베리는 시스템 자동화와 통합 솔루션, AI·빅데이터 R&amp;D를 수행하는 IT 전문 기업입니다. 2023년
                        설립 이후 시스템 구축부터 운영·고도화까지 15개 프로젝트를 함께했습니다.
                    </p>
                    <div v-reveal class="core-areas fb-stagger">
                        <span>AI · 데이터</span><span>인증 · 보안</span><span>자동화 · 연동</span
                        ><span>클라우드 · 인프라</span><span>웹 · 모바일</span>
                    </div>
                </div>
                <div
                    v-reveal
                    class="about-visual"
                    role="img"
                    aria-label="모니터를 함께 보며 협업하는 포베리 팀"
                >
                    <img class="slot-img" src="/images/fb/about-team.png" alt="" />
                    <div class="ab-caption">한 팀, 다섯 영역 · One Team, Five Areas</div>
                </div>
            </div>
            <div v-reveal class="about-stats">
                <!-- 10.30 은 날짜라 카운트업하지 않습니다 -->
                <div class="as"><div class="num"><em>10</em>.30</div><div class="lbl">2023년 설립 · Established</div></div>
                <div class="as"><div v-countup class="num">15<em>+</em></div><div class="lbl">누적 프로젝트 · Total Projects</div></div>
                <div class="as"><div v-countup class="num">5</div><div class="lbl">핵심 기술영역 · Core Areas</div></div>
                <div class="as"><div v-countup class="num">6</div><div class="lbl">함께한 고객사 · Clients</div></div>
            </div>
        </div>
    </section>
</template>
