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
                <div class="footer-col">
                    <h5>Sitemap</h5>
                    <a href="#about">회사소개</a>
                    <a href="#services">서비스</a>
                    <a href="#solutions">솔루션</a>
                    <a href="#work">실적</a>
                    <a href="#culture">컬처</a>
                </div>
                <div class="footer-col">
                    <h5>Contact</h5>
                    <a href="tel:01027550650">010-2755-0650</a>
                    <a href="mailto:fourberry@fourberry.co.kr">fourberry@fourberry.co.kr</a>
                    <p>서울 영등포구 양평로 22길 21<br />코오롱디지털타워 1409호</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>
                    (주)포베리 · 대표이사 우대식 &nbsp;|&nbsp; 사업자등록번호 562-88-02654<br />
                    (07205) 서울특별시 영등포구 양평로 22길 21 1409호
                </p>
                <p>© {{ year }} FOURBERRY. All rights reserved.</p>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>
