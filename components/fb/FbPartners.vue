<template>
    <div class="container">
        <div v-reveal class="marquee-wrap">
            <div class="marquee-label">함께한 파트너 · Trusted by</div>
            <div class="marquee">
                <span v-for="(name, i) in doubled" :key="name + i">{{ name }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// 고객사(회사) 이름입니다. 'WITHFRESH' 는 영등포농협의 브랜드몰 이름이라 여기 오면 안 됩니다.
const partners = ['쿠쿠', '아우토크립트', '영등포농협', '한국해양진흥공사', '한국체육대학교', '동행복권']
const doubled = [...partners, ...partners]
</script>
