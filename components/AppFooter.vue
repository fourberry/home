<template>
    <footer class="site-footer">
        <div class="container">
            <div class="footer-top">
                <div>
                    <div class="footer-brand">
                        <span class="fb-chip"><span class="fb-mark"></span></span>FOURBERRY
                    </div>
                    <p class="footer-brand-sub">
                        한 발 앞선 IT 서비스로 고객의 경험과 가치를 우선합니다. making sweet and sour software.
                    </p>
                </div>
                <!-- 푸터의 내부 링크는 사람에게도 쓸모가 있지만, 검색엔진이 하위 페이지를
                     발견하는 경로이기도 합니다. 새 페이지를 만들면 여기에도 추가하세요. -->
                <div class="footer-col">
                    <h5>Company</h5>
                    <NuxtLink to="/#about">회사소개</NuxtLink>
                    <NuxtLink to="/#services">서비스</NuxtLink>
                    <NuxtLink to="/#culture">컬처</NuxtLink>
                    <NuxtLink to="/#faq">FAQ</NuxtLink>
                </div>
                <div class="footer-col">
                    <h5>Solution</h5>
                    <NuxtLink to="/solutions/">자체 솔루션</NuxtLink>
                    <NuxtLink v-for="s in fbSolutions" :key="s.slug" :to="`/solutions/${s.slug}/`">
                        {{ s.name }} {{ s.ko }}
                    </NuxtLink>
                </div>
                <div class="footer-col">
                    <h5>Work</h5>
                    <NuxtLink to="/services/si-sm/">SI 구축 · SM 운영</NuxtLink>
                    <NuxtLink to="/work/">수행 실적</NuxtLink>
                </div>
                <div class="footer-col">
                    <h5>Contact</h5>
                    <a :href="fbCompany.telHref" @click="trackContactChannel('tel')">{{ fbCompany.tel }}</a>
                    <a :href="`mailto:${fbCompany.email}`" @click="trackContactChannel('email')">{{ fbCompany.email }}</a>
                    <p>서울 영등포구 양평로 22길 21<br />코오롱디지털타워 1409호</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>
                    {{ fbCompany.legalName }} · 대표이사 {{ fbCompany.ceo }} &nbsp;|&nbsp; 사업자등록번호
                    {{ fbCompany.bizNo }}<br />
                    ({{ fbCompany.address.postalCode }}) {{ fbCompany.address.region }}
                    {{ fbCompany.address.locality }} 양평로 22길 21 1409호
                </p>
                <p>© {{ year }} FOURBERRY. All rights reserved.</p>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { fbCompany } from '~/data/company'
import { fbSolutions } from '~/data/solutions'

const year = new Date().getFullYear()

// 문의 섹션(FbContact.vue)과 같은 이벤트를 쓰되 link_location 으로 위치를 구분합니다.
const trackContactChannel = (channel: 'tel' | 'email') => {
    useTrackEvent('contact_channel_click', { channel, link_location: 'footer' })
}
</script>
