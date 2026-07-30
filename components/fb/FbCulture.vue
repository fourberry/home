<template>
    <section id="culture" class="section">
        <div class="container">
            <div v-reveal class="quote-block">
                <div>
                    <span class="eyebrow">Message · 인사말</span>
                    <blockquote style="margin-top: 18px">
                        "기술의 중심에 <span class="accentword">사람</span>이 있습니다."
                    </blockquote>
                    <p class="qsub">
                        시스템은 사람이 중심이 되어야 하고 사람을 위해 존재해야 한다는 것이 포베리가 IT 산업을 바라보는
                        철학이자 경영방침입니다. 사람 중심의 IT 기업을 완성할 수 있도록 고객과 함께 노력하겠습니다.
                    </p>
                    <p class="qby">(주)포베리 대표이사 <b>우대식</b></p>
                </div>
            </div>

            <div v-reveal class="section-head" style="margin-bottom: clamp(20px, 3vw, 28px)">
                <span class="eyebrow">Culture · 복지와 문화</span>
                <h2>즐겁게 일하는 포베리의 일상.</h2>
                <p class="lead" style="margin-top: 16px">잘 쉬고 잘 웃는 팀이 좋은 시스템을 만듭니다.</p>
            </div>

            <div v-reveal class="culture-grid fb-stagger">
                <div v-for="c in culture" :key="c.title" class="cul">
                    <div class="cul-img"><img class="slot-img" :src="c.img" :alt="c.title" loading="lazy" /></div>
                    <div class="cul-body">
                        <h4>{{ c.title }}</h4>
                        <p>{{ c.desc }}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const culture = [
    { title: '유연근무제', img: '/images/work.png', desc: '8시~10시 사이 자율 출근. 업무 효율은 높이고 워라밸은 확실하게.' },
    { title: '점심식사 제공', img: '/images/food.jpg', desc: '매일 든든한 식사로 에너지 충전.' },
    { title: '생일 축하금', img: '/images/birthday.jpg', desc: '생일엔 현금 20만원과 조기퇴근. 기념일은 일보다 소중하니까요.' },
    { title: '자기계발비 지원', img: '/images/book.jpg', desc: '책·강의·세미나 등 배움에 대한 투자를 적극 환영합니다.' },
    { title: '간식·커피 무제한', img: '/images/cookie.jpg', desc: '당 떨어질 틈 없이 언제든 꺼내 먹을 수 있어요.' },
    { title: '게임 타임', img: '/images/game.jpg', desc: '보드게임과 온라인게임으로 취미·친목·재미까지.' },
]
</script>
