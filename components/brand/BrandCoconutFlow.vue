<template>
    <div ref="root" class="cf-flow" :class="{ 'is-hold': hold }">
        <div class="cf-stage">
            <!-- 같은 장면을 가로(PC)·세로(모바일) 두 벌로 두고 CSS 로 하나만 보여줍니다. 내용·타이밍은 같습니다. -->
            <svg class="cf-svg cf-svg--d" viewBox="0 0 1100 400" focusable="false" role="img" aria-labelledby="cf-title-d">
                <title id="cf-title-d">로그인 한 번으로 서비스 A와 B를 이용하는 흐름</title>
                <defs>
                    <linearGradient id="dcoco" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" style="stop-color: var(--accent-hover)"></stop>
                        <stop offset="0.55" style="stop-color: var(--accent)"></stop>
                        <stop offset="1" style="stop-color: var(--accent-lite)"></stop>
                    </linearGradient>
                    <linearGradient id="dgloss" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stop-color="#ffffff" stop-opacity="0.16"></stop>
                        <stop offset="0.55" stop-color="#ffffff" stop-opacity="0"></stop>
                    </linearGradient>
                    <radialGradient id="dglow" cx="0.5" cy="0.5" r="0.5">
                        <stop offset="0" style="stop-color: var(--accent-lite)" stop-opacity="0.28"></stop>
                        <stop offset="1" style="stop-color: var(--accent-lite)" stop-opacity="0"></stop>
                    </radialGradient>
                    <radialGradient id="ddotA" cx="0.35" cy="0.3" r="0.75">
                        <stop offset="0" stop-color="#d6c8ff"></stop>
                        <stop offset="0.45" style="stop-color: var(--accent)"></stop>
                        <stop offset="1" style="stop-color: var(--accent-hover)"></stop>
                    </radialGradient>
                    <radialGradient id="ddotI" cx="0.35" cy="0.3" r="0.75">
                        <stop offset="0" stop-color="#7d8590"></stop>
                        <stop offset="0.5" stop-color="#2b3138"></stop>
                        <stop offset="1" stop-color="#0f1216"></stop>
                    </radialGradient>
                    <radialGradient id="ddotGlow" cx="0.5" cy="0.5" r="0.5">
                        <stop offset="0" style="stop-color: var(--accent-lite)" stop-opacity="0.45"></stop>
                        <stop offset="1" style="stop-color: var(--accent-lite)" stop-opacity="0"></stop>
                    </radialGradient>
                    <linearGradient id="dtint" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" style="stop-color: var(--accent)" stop-opacity="0.18"></stop>
                        <stop offset="1" style="stop-color: var(--accent-lite)" stop-opacity="0.06"></stop>
                    </linearGradient>
                    <filter id="dshadow" x="-20%" y="-30%" width="140%" height="170%">
                        <feDropShadow dx="0" dy="8" stdDeviation="9" style="flood-color: var(--ink)" flood-opacity="0.10"></feDropShadow>
                    </filter>
                    <filter id="dnodeShadow" x="-20%" y="-30%" width="140%" height="170%">
                        <feDropShadow dx="0" dy="14" stdDeviation="14" style="flood-color: var(--accent-hover)" flood-opacity="0.35"></feDropShadow>
                    </filter>
                    <linearGradient id="dlineL" gradientUnits="userSpaceOnUse" x1="114" y1="0" x2="260" y2="0">
                        <stop offset="0" stop-color="#e3e5e9"></stop>
                        <stop offset="1" stop-color="#d6cdf4"></stop>
                    </linearGradient>
                    <linearGradient id="dlineR" gradientUnits="userSpaceOnUse" x1="480" y1="0" x2="660" y2="0">
                        <stop offset="0" stop-color="#d6cdf4"></stop>
                        <stop offset="1" stop-color="#b9a4f4"></stop>
                    </linearGradient>
                </defs>
                <ellipse cx="800" cy="200" rx="270" ry="175" fill="url(#dglow)"></ellipse>
                <path d="M114,200 C180,200 200,120 260,120" fill="none" stroke="url(#dlineL)" stroke-width="2"></path>
                <path d="M114,200 C180,200 200,280 260,280" fill="none" stroke="url(#dlineL)" stroke-width="2"></path>
                <path d="M480,120 C560,120 590,200 660,200" fill="none" stroke="url(#dlineR)" stroke-width="2"></path>
                <path d="M480,280 C560,280 590,200 660,200" fill="none" stroke="url(#dlineR)" stroke-width="2"></path>
                <circle cx="80" cy="200" r="34" fill="url(#dtint)"></circle>
                <circle cx="80" cy="200" r="33.25" fill="none" stroke="rgba(109,40,217,0.35)" stroke-width="1.5"></circle>
                <g transform="translate(62.1 183.2) scale(1.4875)" fill="none" style="stroke: var(--accent)" stroke-width="1.21" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="8" r="4"></circle>
                    <path d="M20 21a8 8 0 0 0-16 0"></path>
                </g>
                <text x="80" y="262" text-anchor="middle" font-size="14" font-weight="600" style="fill: var(--ink-2)">사용자</text>
                <rect x="260" y="70" width="220" height="100" rx="14" fill="#ffffff" stroke="rgba(20,24,29,0.12)" filter="url(#dshadow)"></rect>
                <circle cx="292" cy="116" r="20" fill="url(#dtint)"></circle>
                <g transform="translate(281.0 105.0) scale(0.9167)" fill="none" style="stroke: var(--accent)" stroke-width="1.96" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2"></rect>
                    <path d="M8 21h8"></path>
                    <path d="M12 17v4"></path>
                </g>
                <text x="324" y="110" font-size="17" font-weight="700" style="fill: var(--ink)">서비스 A</text>
                <text x="324" y="130" font-size="13" style="fill: var(--ink-2)">연동 서비스 · 웹</text>
                <rect x="260" y="230" width="220" height="100" rx="14" fill="#ffffff" stroke="rgba(20,24,29,0.12)" filter="url(#dshadow)"></rect>
                <circle cx="292" cy="276" r="20" fill="url(#dtint)"></circle>
                <g transform="translate(281.0 265.0) scale(0.9167)" fill="none" style="stroke: var(--accent)" stroke-width="1.96" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="3"></rect>
                    <path d="M11 18h2"></path>
                </g>
                <text x="324" y="270" font-size="17" font-weight="700" style="fill: var(--ink)">서비스 B</text>
                <text x="324" y="290" font-size="13" style="fill: var(--ink-2)">연동 서비스 · 앱</text>
                <g opacity="0">
                    <rect x="284" y="142" width="158" height="22" rx="11" style="fill: var(--accent-2)"></rect>
                    <text x="296" y="157" font-size="12" font-weight="600" style="fill: var(--accent)">로그인 완료 · 자체 세션</text>
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0" keyTimes="0;0.5714;0.5893;0.9714;1"></animate>
                </g>
                <g opacity="0">
                    <rect x="284" y="302" width="140" height="22" rx="11" style="fill: var(--accent-2)"></rect>
                    <text x="296" y="317" font-size="12" font-weight="600" style="fill: var(--accent)">재로그인 없이 이용</text>
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0" keyTimes="0;0.8143;0.8321;0.9714;1"></animate>
                </g>
                <rect x="654" y="104" width="292" height="192" rx="22" fill="none" stroke="url(#dcoco)" stroke-width="3" opacity="0">
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;0;0;1;0;0" keyTimes="0;0.2643;0.2786;0.3143;0.75;0.7643;0.8;1"></animate>
                </rect>
                <rect x="660" y="110" width="280" height="180" rx="18" fill="url(#dcoco)" stroke="rgba(255,255,255,0.22)" filter="url(#dnodeShadow)"></rect>
                <rect x="660" y="110" width="280" height="180" rx="18" fill="url(#dgloss)"></rect>
                <rect x="688" y="134" width="26" height="26" rx="5.7" fill="#ffffff"></rect>
                <g transform="translate(688 134) scale(0.8125)">
                    <path d="M16 4 L26 8 L26 16 C26 22 21 27 16 28 C11 27 6 22 6 16 L6 8 Z" fill="none" style="stroke: var(--accent)" stroke-width="1.8" stroke-linejoin="round"></path>
                    <circle cx="16" cy="13" r="3" style="fill: var(--accent)"></circle>
                    <rect x="15" y="15" width="2" height="8" rx="1" style="fill: var(--accent)"></rect>
                    <rect x="17" y="19" width="3" height="1.5" rx="0.5" style="fill: var(--accent)"></rect>
                    <rect x="17" y="21.5" width="2" height="1.5" rx="0.5" style="fill: var(--accent)"></rect>
                </g>
                <text x="726" y="152" font-size="18" font-weight="700" fill="#ffffff" letter-spacing="0.5">COCONUT</text>
                <text x="726" y="171" font-size="12.5" fill="#e4d9ff">인가 서버 · 같은 테넌트</text>
                <circle cx="700" cy="201" r="9" fill="none" stroke="#e4d9ff" stroke-opacity="0.55" stroke-width="1.5"></circle>
                <text x="718" y="206" font-size="14" fill="#ffffff" fill-opacity="0.75">인증 (비밀번호)</text>
                <g opacity="0">
                    <circle cx="700" cy="201" r="9" fill="#ffffff"></circle>
                    <path d="M696 201 l3 3 l6 -6" fill="none" style="stroke: var(--accent)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    <text x="718" y="206" font-size="14" font-weight="600" fill="#ffffff">인증 (비밀번호)</text>
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0" keyTimes="0;0.2857;0.3036;0.9714;1"></animate>
                </g>
                <circle cx="700" cy="229" r="9" fill="none" stroke="#e4d9ff" stroke-opacity="0.55" stroke-width="1.5"></circle>
                <text x="718" y="234" font-size="14" fill="#ffffff" fill-opacity="0.75">2단계 인증 (MFA)</text>
                <g opacity="0">
                    <circle cx="700" cy="229" r="9" fill="#ffffff"></circle>
                    <path d="M696 229 l3 3 l6 -6" fill="none" style="stroke: var(--accent)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    <text x="718" y="234" font-size="14" font-weight="600" fill="#ffffff">2단계 인증 (MFA)</text>
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0" keyTimes="0;0.3571;0.375;0.9714;1"></animate>
                </g>
                <circle cx="700" cy="257" r="9" fill="none" stroke="#e4d9ff" stroke-opacity="0.55" stroke-width="1.5"></circle>
                <text x="718" y="262" font-size="14" fill="#ffffff" fill-opacity="0.75">동의 (스코프 · 약관)</text>
                <g opacity="0">
                    <circle cx="700" cy="257" r="9" fill="#ffffff"></circle>
                    <path d="M696 257 l3 3 l6 -6" fill="none" style="stroke: var(--accent)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    <text x="718" y="262" font-size="14" font-weight="600" fill="#ffffff">동의 (스코프 · 약관)</text>
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0" keyTimes="0;0.4286;0.4464;0.9714;1"></animate>
                </g>
                <g opacity="0">
                    <circle r="17" fill="url(#ddotGlow)"></circle>
                    <circle r="7" fill="url(#ddotA)" stroke="#ffffff" stroke-width="1.5"></circle>
                    <animateMotion dur="14s" repeatCount="indefinite" calcMode="linear" keyPoints="0;0;1;1" keyTimes="0;0.0357;0.1429;1" path="M114,200 C180,200 200,120 260,120"></animateMotion>
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.0357;0.0429;0.1357;0.1429;1"></animate>
                </g>
                <g opacity="0">
                    <circle r="17" fill="url(#ddotGlow)"></circle>
                    <circle r="7" fill="url(#ddotA)" stroke="#ffffff" stroke-width="1.5"></circle>
                    <animateMotion dur="14s" repeatCount="indefinite" calcMode="linear" keyPoints="0;0;1;1" keyTimes="0;0.1571;0.2643;1" path="M480,120 C560,120 590,200 660,200"></animateMotion>
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.1571;0.1643;0.2571;0.2643;1"></animate>
                </g>
                <g opacity="0">
                    <circle r="17" fill="url(#ddotGlow)"></circle>
                    <circle r="7" fill="url(#ddotI)" stroke="#ffffff" stroke-width="1.5"></circle>
                    <animateMotion dur="14s" repeatCount="indefinite" calcMode="linear" keyPoints="0;0;1;1" keyTimes="0;0.4643;0.5714;1" path="M660,200 C590,200 560,120 480,120"></animateMotion>
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.4643;0.4714;0.5643;0.5714;1"></animate>
                </g>
                <g opacity="0">
                    <circle r="17" fill="url(#ddotGlow)"></circle>
                    <circle r="7" fill="url(#ddotA)" stroke="#ffffff" stroke-width="1.5"></circle>
                    <animateMotion dur="14s" repeatCount="indefinite" calcMode="linear" keyPoints="0;0;1;1" keyTimes="0;0.6071;0.6786;1" path="M114,200 C180,200 200,280 260,280"></animateMotion>
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.6071;0.6143;0.6714;0.6786;1"></animate>
                </g>
                <g opacity="0">
                    <circle r="14" fill="url(#ddotGlow)"></circle>
                    <circle r="6" fill="url(#ddotA)" stroke="#ffffff" stroke-width="1.5"></circle>
                    <animateMotion dur="14s" repeatCount="indefinite" calcMode="linear" keyPoints="0;0;1;1" keyTimes="0;0.6929;0.75;1" path="M480,280 C560,280 590,200 660,200"></animateMotion>
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.6929;0.7;0.7429;0.75;1"></animate>
                </g>
                <g opacity="0">
                    <circle r="14" fill="url(#ddotGlow)"></circle>
                    <circle r="6" fill="url(#ddotI)" stroke="#ffffff" stroke-width="1.5"></circle>
                    <animateMotion dur="14s" repeatCount="indefinite" calcMode="linear" keyPoints="0;0;1;1" keyTimes="0;0.7571;0.8143;1" path="M660,200 C590,200 560,280 480,280"></animateMotion>
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.7571;0.7643;0.8071;0.8143;1"></animate>
                </g>
                <text x="187" y="146" text-anchor="middle" font-size="12.5" font-weight="600" style="fill: var(--ink-2)" paint-order="stroke" stroke="#ffffff" stroke-width="4" opacity="0">
                    로그인 요청
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.0357;0.0464;0.1357;0.1429;1"></animate>
                </text>
                <text x="570" y="146" text-anchor="middle" font-size="12.5" font-weight="600" style="fill: var(--ink-2)" paint-order="stroke" stroke="#ffffff" stroke-width="4" opacity="0">
                    인가 요청
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.1571;0.1679;0.2571;0.2643;1"></animate>
                </text>
                <text x="570" y="146" text-anchor="middle" font-size="12.5" font-weight="600" style="fill: var(--ink-2)" paint-order="stroke" stroke="#ffffff" stroke-width="4" opacity="0">
                    토큰 발급
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.4643;0.475;0.5643;0.5714;1"></animate>
                </text>
                <text x="187" y="254" text-anchor="middle" font-size="12.5" font-weight="600" style="fill: var(--ink-2)" paint-order="stroke" stroke="#ffffff" stroke-width="4" opacity="0">
                    서비스 B 이용
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.6071;0.6179;0.6714;0.6786;1"></animate>
                </text>
                <text x="570" y="254" text-anchor="middle" font-size="12.5" font-weight="600" style="fill: var(--ink-2)" paint-order="stroke" stroke="#ffffff" stroke-width="4" opacity="0">
                    세션 확인
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.6929;0.7036;0.7429;0.75;1"></animate>
                </text>
                <text x="570" y="254" text-anchor="middle" font-size="12.5" font-weight="600" style="fill: var(--ink-2)" paint-order="stroke" stroke="#ffffff" stroke-width="4" opacity="0">
                    토큰
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.7571;0.7679;0.8071;0.8143;1"></animate>
                </text>
            </svg>
            <svg class="cf-svg cf-svg--m" viewBox="0 0 350 600" focusable="false" role="img" aria-labelledby="cf-title-m">
                <title id="cf-title-m">로그인 한 번으로 서비스 A와 B를 이용하는 흐름</title>
                <defs>
                    <linearGradient id="mcoco" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" style="stop-color: var(--accent-hover)"></stop>
                        <stop offset="0.55" style="stop-color: var(--accent)"></stop>
                        <stop offset="1" style="stop-color: var(--accent-lite)"></stop>
                    </linearGradient>
                    <linearGradient id="mgloss" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stop-color="#ffffff" stop-opacity="0.16"></stop>
                        <stop offset="0.55" stop-color="#ffffff" stop-opacity="0"></stop>
                    </linearGradient>
                    <radialGradient id="mglow" cx="0.5" cy="0.5" r="0.5">
                        <stop offset="0" style="stop-color: var(--accent-lite)" stop-opacity="0.28"></stop>
                        <stop offset="1" style="stop-color: var(--accent-lite)" stop-opacity="0"></stop>
                    </radialGradient>
                    <radialGradient id="mdotA" cx="0.35" cy="0.3" r="0.75">
                        <stop offset="0" stop-color="#d6c8ff"></stop>
                        <stop offset="0.45" style="stop-color: var(--accent)"></stop>
                        <stop offset="1" style="stop-color: var(--accent-hover)"></stop>
                    </radialGradient>
                    <radialGradient id="mdotI" cx="0.35" cy="0.3" r="0.75">
                        <stop offset="0" stop-color="#7d8590"></stop>
                        <stop offset="0.5" stop-color="#2b3138"></stop>
                        <stop offset="1" stop-color="#0f1216"></stop>
                    </radialGradient>
                    <radialGradient id="mdotGlow" cx="0.5" cy="0.5" r="0.5">
                        <stop offset="0" style="stop-color: var(--accent-lite)" stop-opacity="0.45"></stop>
                        <stop offset="1" style="stop-color: var(--accent-lite)" stop-opacity="0"></stop>
                    </radialGradient>
                    <linearGradient id="mtint" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" style="stop-color: var(--accent)" stop-opacity="0.18"></stop>
                        <stop offset="1" style="stop-color: var(--accent-lite)" stop-opacity="0.06"></stop>
                    </linearGradient>
                    <filter id="mshadow" x="-20%" y="-30%" width="140%" height="170%">
                        <feDropShadow dx="0" dy="8" stdDeviation="9" style="flood-color: var(--ink)" flood-opacity="0.10"></feDropShadow>
                    </filter>
                    <filter id="mnodeShadow" x="-20%" y="-30%" width="140%" height="170%">
                        <feDropShadow dx="0" dy="14" stdDeviation="14" style="flood-color: var(--accent-hover)" flood-opacity="0.35"></feDropShadow>
                    </filter>
                    <linearGradient id="mlineT" gradientUnits="userSpaceOnUse" x1="0" y1="72" x2="0" y2="120">
                        <stop offset="0" stop-color="#e3e5e9"></stop>
                        <stop offset="1" stop-color="#d6cdf4"></stop>
                    </linearGradient>
                    <linearGradient id="mlineB" gradientUnits="userSpaceOnUse" x1="0" y1="204" x2="0" y2="320">
                        <stop offset="0" stop-color="#d6cdf4"></stop>
                        <stop offset="1" stop-color="#b9a4f4"></stop>
                    </linearGradient>
                </defs>
                <ellipse cx="175" cy="410" rx="200" ry="150" fill="url(#mglow)"></ellipse>
                <path d="M175,72 C175,100 91,92 91,120" fill="none" stroke="url(#mlineT)" stroke-width="2"></path>
                <path d="M175,72 C175,100 259,92 259,120" fill="none" stroke="url(#mlineT)" stroke-width="2"></path>
                <path d="M91,204 C91,262 130,262 130,320" fill="none" stroke="url(#mlineB)" stroke-width="2"></path>
                <path d="M259,204 C259,262 220,262 220,320" fill="none" stroke="url(#mlineB)" stroke-width="2"></path>
                <circle cx="175" cy="44" r="28" fill="url(#mtint)"></circle>
                <circle cx="175" cy="44" r="27.25" fill="none" stroke="rgba(109,40,217,0.35)" stroke-width="1.5"></circle>
                <g transform="translate(160.3 30.3) scale(1.2250)" fill="none" style="stroke: var(--accent)" stroke-width="1.47" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="8" r="4"></circle>
                    <path d="M20 21a8 8 0 0 0-16 0"></path>
                </g>
                <text x="214" y="49" text-anchor="start" font-size="14" font-weight="600" style="fill: var(--ink-2)">사용자</text>
                <rect x="16" y="120" width="150" height="84" rx="12" fill="#ffffff" stroke="rgba(20,24,29,0.12)" filter="url(#mshadow)"></rect>
                <circle cx="46" cy="154" r="15" fill="url(#mtint)"></circle>
                <g transform="translate(37.8 145.8) scale(0.6875)" fill="none" style="stroke: var(--accent)" stroke-width="2.62" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2"></rect>
                    <path d="M8 21h8"></path>
                    <path d="M12 17v4"></path>
                </g>
                <text x="68" y="151" font-size="15" font-weight="700" style="fill: var(--ink)">서비스 A</text>
                <text x="68" y="168" font-size="11.5" style="fill: var(--ink-2)">연동 서비스 · 웹</text>
                <rect x="184" y="120" width="150" height="84" rx="12" fill="#ffffff" stroke="rgba(20,24,29,0.12)" filter="url(#mshadow)"></rect>
                <circle cx="214" cy="154" r="15" fill="url(#mtint)"></circle>
                <g transform="translate(205.8 145.8) scale(0.6875)" fill="none" style="stroke: var(--accent)" stroke-width="2.62" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="3"></rect>
                    <path d="M11 18h2"></path>
                </g>
                <text x="236" y="151" font-size="15" font-weight="700" style="fill: var(--ink)">서비스 B</text>
                <text x="236" y="168" font-size="11.5" style="fill: var(--ink-2)">연동 서비스 · 앱</text>
                <g opacity="0">
                    <rect x="32" y="176" width="118" height="22" rx="11" style="fill: var(--accent-2)"></rect>
                    <text x="44" y="191" font-size="11" font-weight="600" style="fill: var(--accent)">로그인 완료 · 세션</text>
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0" keyTimes="0;0.5714;0.5893;0.9714;1"></animate>
                </g>
                <g opacity="0">
                    <rect x="200" y="176" width="118" height="22" rx="11" style="fill: var(--accent-2)"></rect>
                    <text x="212" y="191" font-size="11" font-weight="600" style="fill: var(--accent)">재로그인 없이 이용</text>
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0" keyTimes="0;0.8143;0.8321;0.9714;1"></animate>
                </g>
                <rect x="34" y="314" width="282" height="192" rx="20" fill="none" stroke="url(#mcoco)" stroke-width="3" opacity="0">
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;0;0;1;0;0" keyTimes="0;0.2643;0.2786;0.3143;0.75;0.7643;0.8;1"></animate>
                </rect>
                <rect x="40" y="320" width="270" height="180" rx="16" fill="url(#mcoco)" stroke="rgba(255,255,255,0.22)" filter="url(#mnodeShadow)"></rect>
                <rect x="40" y="320" width="270" height="180" rx="16" fill="url(#mgloss)"></rect>
                <rect x="64" y="342" width="24" height="24" rx="5.3" fill="#ffffff"></rect>
                <g transform="translate(64 342) scale(0.7500)">
                    <path d="M16 4 L26 8 L26 16 C26 22 21 27 16 28 C11 27 6 22 6 16 L6 8 Z" fill="none" style="stroke: var(--accent)" stroke-width="1.8" stroke-linejoin="round"></path>
                    <circle cx="16" cy="13" r="3" style="fill: var(--accent)"></circle>
                    <rect x="15" y="15" width="2" height="8" rx="1" style="fill: var(--accent)"></rect>
                    <rect x="17" y="19" width="3" height="1.5" rx="0.5" style="fill: var(--accent)"></rect>
                    <rect x="17" y="21.5" width="2" height="1.5" rx="0.5" style="fill: var(--accent)"></rect>
                </g>
                <text x="98" y="359" font-size="17" font-weight="700" fill="#ffffff" letter-spacing="0.5">COCONUT</text>
                <text x="98" y="377" font-size="12" fill="#e4d9ff">인가 서버 · 같은 테넌트</text>
                <circle cx="72" cy="409" r="9" fill="none" stroke="#e4d9ff" stroke-opacity="0.55" stroke-width="1.5"></circle>
                <text x="90" y="414" font-size="13.5" fill="#ffffff" fill-opacity="0.75">인증 (비밀번호)</text>
                <g opacity="0">
                    <circle cx="72" cy="409" r="9" fill="#ffffff"></circle>
                    <path d="M68 409 l3 3 l6 -6" fill="none" style="stroke: var(--accent)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    <text x="90" y="414" font-size="13.5" font-weight="600" fill="#ffffff">인증 (비밀번호)</text>
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0" keyTimes="0;0.2857;0.3036;0.9714;1"></animate>
                </g>
                <circle cx="72" cy="439" r="9" fill="none" stroke="#e4d9ff" stroke-opacity="0.55" stroke-width="1.5"></circle>
                <text x="90" y="444" font-size="13.5" fill="#ffffff" fill-opacity="0.75">2단계 인증 (MFA)</text>
                <g opacity="0">
                    <circle cx="72" cy="439" r="9" fill="#ffffff"></circle>
                    <path d="M68 439 l3 3 l6 -6" fill="none" style="stroke: var(--accent)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    <text x="90" y="444" font-size="13.5" font-weight="600" fill="#ffffff">2단계 인증 (MFA)</text>
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0" keyTimes="0;0.3571;0.375;0.9714;1"></animate>
                </g>
                <circle cx="72" cy="469" r="9" fill="none" stroke="#e4d9ff" stroke-opacity="0.55" stroke-width="1.5"></circle>
                <text x="90" y="474" font-size="13.5" fill="#ffffff" fill-opacity="0.75">동의 (스코프 · 약관)</text>
                <g opacity="0">
                    <circle cx="72" cy="469" r="9" fill="#ffffff"></circle>
                    <path d="M68 469 l3 3 l6 -6" fill="none" style="stroke: var(--accent)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    <text x="90" y="474" font-size="13.5" font-weight="600" fill="#ffffff">동의 (스코프 · 약관)</text>
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0" keyTimes="0;0.4286;0.4464;0.9714;1"></animate>
                </g>
                <g opacity="0">
                    <circle r="14" fill="url(#mdotGlow)"></circle>
                    <circle r="6" fill="url(#mdotA)" stroke="#ffffff" stroke-width="1.5"></circle>
                    <animateMotion dur="14s" repeatCount="indefinite" calcMode="linear" keyPoints="0;0;1;1" keyTimes="0;0.0357;0.1429;1" path="M175,72 C175,100 91,92 91,120"></animateMotion>
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.0357;0.0429;0.1357;0.1429;1"></animate>
                </g>
                <g opacity="0">
                    <circle r="14" fill="url(#mdotGlow)"></circle>
                    <circle r="6" fill="url(#mdotA)" stroke="#ffffff" stroke-width="1.5"></circle>
                    <animateMotion dur="14s" repeatCount="indefinite" calcMode="linear" keyPoints="0;0;1;1" keyTimes="0;0.1571;0.2643;1" path="M91,204 C91,262 130,262 130,320"></animateMotion>
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.1571;0.1643;0.2571;0.2643;1"></animate>
                </g>
                <g opacity="0">
                    <circle r="14" fill="url(#mdotGlow)"></circle>
                    <circle r="6" fill="url(#mdotI)" stroke="#ffffff" stroke-width="1.5"></circle>
                    <animateMotion dur="14s" repeatCount="indefinite" calcMode="linear" keyPoints="0;0;1;1" keyTimes="0;0.4643;0.5714;1" path="M130,320 C130,262 91,262 91,204"></animateMotion>
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.4643;0.4714;0.5643;0.5714;1"></animate>
                </g>
                <g opacity="0">
                    <circle r="14" fill="url(#mdotGlow)"></circle>
                    <circle r="6" fill="url(#mdotA)" stroke="#ffffff" stroke-width="1.5"></circle>
                    <animateMotion dur="14s" repeatCount="indefinite" calcMode="linear" keyPoints="0;0;1;1" keyTimes="0;0.6071;0.6786;1" path="M175,72 C175,100 259,92 259,120"></animateMotion>
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.6071;0.6143;0.6714;0.6786;1"></animate>
                </g>
                <g opacity="0">
                    <circle r="12" fill="url(#mdotGlow)"></circle>
                    <circle r="5" fill="url(#mdotA)" stroke="#ffffff" stroke-width="1.5"></circle>
                    <animateMotion dur="14s" repeatCount="indefinite" calcMode="linear" keyPoints="0;0;1;1" keyTimes="0;0.6929;0.75;1" path="M259,204 C259,262 220,262 220,320"></animateMotion>
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.6929;0.7;0.7429;0.75;1"></animate>
                </g>
                <g opacity="0">
                    <circle r="12" fill="url(#mdotGlow)"></circle>
                    <circle r="5" fill="url(#mdotI)" stroke="#ffffff" stroke-width="1.5"></circle>
                    <animateMotion dur="14s" repeatCount="indefinite" calcMode="linear" keyPoints="0;0;1;1" keyTimes="0;0.7571;0.8143;1" path="M220,320 C220,262 259,262 259,204"></animateMotion>
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.7571;0.7643;0.8071;0.8143;1"></animate>
                </g>
                <text x="100" y="98" text-anchor="end" font-size="12" font-weight="600" style="fill: var(--ink-2)" paint-order="stroke" stroke="#ffffff" stroke-width="4" opacity="0">
                    로그인 요청
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.0357;0.0464;0.1357;0.1429;1"></animate>
                </text>
                <text x="250" y="98" text-anchor="start" font-size="12" font-weight="600" style="fill: var(--ink-2)" paint-order="stroke" stroke="#ffffff" stroke-width="4" opacity="0">
                    서비스 B 이용
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.6071;0.6179;0.6714;0.6786;1"></animate>
                </text>
                <text x="82" y="268" text-anchor="end" font-size="12" font-weight="600" style="fill: var(--ink-2)" paint-order="stroke" stroke="#ffffff" stroke-width="4" opacity="0">
                    인가 요청
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.1571;0.1679;0.2571;0.2643;1"></animate>
                </text>
                <text x="82" y="268" text-anchor="end" font-size="12" font-weight="600" style="fill: var(--ink-2)" paint-order="stroke" stroke="#ffffff" stroke-width="4" opacity="0">
                    토큰 발급
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.4643;0.475;0.5643;0.5714;1"></animate>
                </text>
                <text x="268" y="268" text-anchor="start" font-size="12" font-weight="600" style="fill: var(--ink-2)" paint-order="stroke" stroke="#ffffff" stroke-width="4" opacity="0">
                    세션 확인
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.6929;0.7036;0.7429;0.75;1"></animate>
                </text>
                <text x="268" y="268" text-anchor="start" font-size="12" font-weight="600" style="fill: var(--ink-2)" paint-order="stroke" stroke="#ffffff" stroke-width="4" opacity="0">
                    토큰
                    <animate attributeName="opacity" dur="14s" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;0.7571;0.7679;0.8071;0.8143;1"></animate>
                </text>
            </svg>
            <button type="button" class="cf-replay" aria-label="동작 흐름 애니메이션 처음부터 다시 보기" title="다시 보기" @click="play">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M3 12a9 9 0 1 0 3-6.7" />
                    <path d="M3 4v5h5" />
                </svg>
            </button>
        </div>
        <ol class="cf-steps" aria-label="동작 흐름 4단계">
            <li class="cf-pill cf-pill--1">
                <span class="idx">01</span>
                로그인 요청
            </li>
            <li class="cf-pill cf-pill--2">
                <span class="idx">02</span>
                인증 · MFA · 동의
            </li>
            <li class="cf-pill cf-pill--3">
                <span class="idx">03</span>
                토큰 발급 → 자체 세션
            </li>
            <li class="cf-pill cf-pill--4">
                <span class="idx">04</span>
                서비스 B는 세션 확인만
            </li>
        </ol>
        <p class="bp-note">같은 테넌트에 연결된 서비스 A·B를 한 번의 로그인으로 이용하는 흐름 예시입니다. 실제 재인증·동의 절차는 세션 상태와 서비스 설정에 따라 달라집니다.</p>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * COCONUT "동작 방식" 애니메이션 — 로그인 한 번으로 서비스 A·B를 이용하는 흐름(14초 순환).
 *
 *  - 인라인 SVG + SMIL(animateMotion/animate) + CSS 키프레임만 씁니다. 외부 라이브러리 없음.
 *  - 단계 텍스트는 HTML(ol.cf-steps)과 SVG <text> 에 그대로 있어 JS 없이도 읽히고 색인됩니다.
 *  - 화면에 들어올 때 처음부터 재생하고, 벗어나면 멈춥니다(CPU 절약). 다시 보기 버튼은 처음부터 재생합니다.
 *  - 동작 줄이기(prefers-reduced-motion): SVG 를 12.5초 지점(모든 단계가 켜진 장면)에 정지하고 알약은 CSS 가 정적으로 보여줍니다.
 *  - JS 가 실패하면 SVG 는 문서 로드 시점부터 자동 재생됩니다(동기화만 안 될 뿐 내용은 보입니다).
 *
 * 시안 원본: 디자인 캔버스 "COCONUT 동작 흐름 애니메이션 시안". 장면·타이밍을 바꾸면 그쪽도 함께 갱신하세요.
 */
const root = ref<HTMLElement | null>(null)
// 마운트 직후 ~ 화면 진입 전에는 알약 애니메이션을 멈춰 SVG 와 같은 시점에 시작하게 합니다.
const hold = ref(false)
const REDUCED_FRAME = 12.5

let svgs: SVGSVGElement[] = []
let io: IntersectionObserver | null = null
let reduce = false

const stopAt = (t: number) => {
    svgs.forEach(s => {
        s.pauseAnimations()
        s.setCurrentTime(t)
    })
}

const play = () => {
    if (reduce) return
    svgs.forEach(s => {
        s.setCurrentTime(0)
        s.unpauseAnimations()
    })
    // 클래스를 한 프레임 뺐다 넣어 CSS 키프레임을 0초부터 다시 돌립니다.
    hold.value = true
    requestAnimationFrame(() => {
        hold.value = false
    })
}

const pause = () => {
    svgs.forEach(s => s.pauseAnimations())
    hold.value = true
}

onMounted(() => {
    if (!root.value) return
    svgs = Array.from(root.value.querySelectorAll<SVGSVGElement>('svg.cf-svg'))
    reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
        stopAt(REDUCED_FRAME)
        return
    }
    stopAt(0)
    hold.value = true
    if (typeof IntersectionObserver === 'undefined') {
        play()
        return
    }
    io = new IntersectionObserver(
        entries => {
            entries.forEach(e => (e.isIntersecting ? play() : pause()))
        },
        // 세로가 짧은 화면(가로 모드 휴대폰)에서도 진입이 잡히도록 낮게 둡니다.
        { threshold: 0.25 }
    )
    io.observe(root.value)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<style>
/* 동작 흐름 애니메이션(BrandCoconutFlow). 색은 전부 브랜드 CSS 변수라 다른 브랜드 페이지에서도 그대로 씁니다. */
.cf-flow {
    margin-top: clamp(28px, 4vw, 40px);
}
.cf-stage {
    position: relative;
    border: 1px solid var(--line);
    border-radius: var(--radius-l);
    overflow: hidden;
    background: linear-gradient(180deg, var(--surface) 0%, color-mix(in srgb, var(--accent) 4%, var(--surface)) 100%);
    box-shadow: 0 24px 60px -36px color-mix(in srgb, var(--accent-hover) 30%, transparent);
}
.cf-svg {
    display: block;
    width: 100%;
    height: auto;
    font-family: var(--font-sans);
}
.cf-svg--m {
    display: none;
}
.cf-replay {
    position: absolute;
    top: 12px;
    right: 12px;
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 999px;
    border: 1px solid var(--line);
    background: var(--surface);
    color: var(--ink-2);
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(15, 20, 28, 0.06);
    transition:
        color 0.2s,
        border-color 0.2s;
}
.cf-replay:hover {
    color: var(--accent);
    border-color: var(--accent);
}
.cf-steps {
    list-style: none;
    margin: 16px 0 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
}
.cf-pill {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 48px;
    padding: 0 16px;
    border-radius: 999px;
    border: 1px solid var(--line);
    background: var(--bg);
    color: var(--ink-2);
    font-size: 14px;
    font-weight: 600;
    animation: 14s linear infinite;
}
.cf-pill .idx {
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.08em;
}
.cf-pill--1 {
    animation-name: cf-p1;
}
.cf-pill--2 {
    animation-name: cf-p2;
}
.cf-pill--3 {
    animation-name: cf-p3;
}
.cf-pill--4 {
    animation-name: cf-p4;
}
/* 화면 진입 전·이탈 후: SVG 와 함께 멈춤 */
.cf-flow.is-hold .cf-pill {
    animation: none;
}
.cf-flow .bp-note {
    margin-top: 16px;
}
@keyframes cf-p1 {
    0%,
    3.1% {
        background: var(--bg);
        color: var(--ink-2);
        border-color: var(--line);
        box-shadow: none;
    }
    3.6%,
    26.4% {
        background: linear-gradient(135deg, var(--accent-hover), var(--accent-lite));
        color: var(--on-accent);
        border-color: transparent;
        box-shadow: 0 10px 22px -12px color-mix(in srgb, var(--accent) 75%, transparent);
    }
    26.9%,
    100% {
        background: var(--bg);
        color: var(--ink-2);
        border-color: var(--line);
        box-shadow: none;
    }
}
@keyframes cf-p2 {
    0%,
    28.1% {
        background: var(--bg);
        color: var(--ink-2);
        border-color: var(--line);
        box-shadow: none;
    }
    28.6%,
    46.4% {
        background: linear-gradient(135deg, var(--accent-hover), var(--accent-lite));
        color: var(--on-accent);
        border-color: transparent;
        box-shadow: 0 10px 22px -12px color-mix(in srgb, var(--accent) 75%, transparent);
    }
    46.9%,
    100% {
        background: var(--bg);
        color: var(--ink-2);
        border-color: var(--line);
        box-shadow: none;
    }
}
@keyframes cf-p3 {
    0%,
    45.9% {
        background: var(--bg);
        color: var(--ink-2);
        border-color: var(--line);
        box-shadow: none;
    }
    46.4%,
    60.7% {
        background: linear-gradient(135deg, var(--accent-hover), var(--accent-lite));
        color: var(--on-accent);
        border-color: transparent;
        box-shadow: 0 10px 22px -12px color-mix(in srgb, var(--accent) 75%, transparent);
    }
    61.2%,
    100% {
        background: var(--bg);
        color: var(--ink-2);
        border-color: var(--line);
        box-shadow: none;
    }
}
@keyframes cf-p4 {
    0%,
    60.2% {
        background: var(--bg);
        color: var(--ink-2);
        border-color: var(--line);
        box-shadow: none;
    }
    60.7%,
    97.0% {
        background: linear-gradient(135deg, var(--accent-hover), var(--accent-lite));
        color: var(--on-accent);
        border-color: transparent;
        box-shadow: 0 10px 22px -12px color-mix(in srgb, var(--accent) 75%, transparent);
    }
    97.5%,
    100% {
        background: var(--bg);
        color: var(--ink-2);
        border-color: var(--line);
        box-shadow: none;
    }
}
@media (max-width: 920px) {
    .cf-steps {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
    }
    .cf-pill {
        min-height: 44px;
        padding: 0 12px;
        font-size: 13px;
    }
}
@media (max-width: 640px) {
    .cf-svg--d {
        display: none;
    }
    .cf-svg--m {
        display: block;
    }
}
/* 동작 줄이기: SVG 는 JS 가 마지막 장면에 정지시키고, 알약은 전부 켜진 정적 상태로 보여줍니다(fb-brand.css 가 animation 을 끕니다). */
@media (prefers-reduced-motion: reduce) {
    .cf-pill {
        background: var(--accent-2);
        color: var(--accent);
        border-color: transparent;
    }
}
</style>
