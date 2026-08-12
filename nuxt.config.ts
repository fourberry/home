// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import { SITE_URL, SITE_TITLE_SUFFIX, SITE_OG_IMAGE } from './data/company'
import { fbSolutions } from './data/solutions'
import { fbProjects } from './data/projects'

// GA4 측정 ID.
//  - 브라우저에 노출되는 공개값이라 저장소에 그대로 두어도 됩니다(.env 불필요).
//  - 정적 배포라 이 값은 빌드 시점에 번들로 들어갑니다. 바꾸면 재배포가 필요합니다.
const GTAG_ID = process.env.NUXT_PUBLIC_GTAG_ID || 'G-5WNYBB6NQY'

// 로컬 개발 서버(npm run dev)에서는 GA 를 끕니다.
// 개발 중 새로고침이 실제 통계에 방문자로 섞이는 것을 막기 위함입니다.
// 로컬에서 GA 동작을 확인해야 하면 NUXT_PUBLIC_GTAG_ID=G-XXXX npm run dev 로 실행하세요
// (환경변수를 직접 지정한 경우에는 dev 에서도 켜집니다).
const GTAG_ENABLED = Boolean(GTAG_ID) && (process.env.NODE_ENV === 'production' || Boolean(process.env.NUXT_PUBLIC_GTAG_ID))

export default defineNuxtConfig({
    ssr: true,
    compatibilityDate: '2025-07-15',
    devtools: { enabled: false },

    // 로컬 개발 서버 포트. 3000 은 다른 프로젝트와 충돌하므로 4000 을 사용합니다.
    devServer: { port: 4000 },

    modules: [
        '@nuxtjs/tailwindcss',
        'nuxt-swiper',
        ['@nuxt/image', { format: ['webp', 'avif'] }],
        '@vueuse/nuxt',
        'unplugin-icons/nuxt',
        '@vueuse/motion/nuxt',
        '@nuxtjs/sitemap',
        'nuxt-gtag',
    ],

    // ✅ Google Analytics 4 (nuxt-gtag)
    //  - 원페이지 사이트라 페이지뷰보다 문의 폼 전환(generate_lead)이 핵심 지표입니다.
    //    이벤트 발생 지점은 components/fb/FbContact.vue 의 handleSubmit 입니다.
    gtag: {
        id: GTAG_ID,
        enabled: GTAG_ENABLED,
    },

    site: {
        url: SITE_URL,
    },

    // ✅ 문의 전송 설정
    //  - 서버 전용 값은 .env 로 주입 (클라이언트 번들에 포함되지 않음)
    //  - public.contactEndpoint: 기본은 Nitro 서버 라우트.
    //    GitHub Pages 정적 배포를 유지하려면 Cloudflare Worker 주소로 바꾸세요.
    runtimeConfig: {
        messageApiBase: process.env.MESSAGE_API_BASE || 'http://59.15.89.190:8061',
        messageApiKey: process.env.MESSAGE_API_KEY || '',
        contactRecipients:
            process.env.CONTACT_RECIPIENTS ||
            'briskly0415@fourberry.co.kr,won567567@fourberry.co.kr,lsj8376@fourberry.co.kr',
        public: {
            contactEndpoint: process.env.NUXT_PUBLIC_CONTACT_ENDPOINT || '/api/contact',
        },
    },

    // ✅ fb-design.css 는 반드시 tailwind.css / common.scss 뒤에 와야 합니다.
    css: ['~/assets/css/tailwind.css', '~/assets/scss/common.scss', '~/assets/css/fb-design.css'],

    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },

    routeRules: {
        '/**': { prerender: true },
        // 문의 프록시는 프리렌더 대상에서 제외 (런타임에서만 실행)
        '/api/**': { prerender: false },
    },

    // ✅ 동적 라우트(/solutions/[slug], /work/[slug])는 크롤러가 링크를 따라가야 발견됩니다.
    //    허브 페이지의 링크가 하나라도 빠지면 그 페이지는 조용히 생성되지 않으므로
    //    데이터에서 경로를 직접 뽑아 명시합니다. 실적·솔루션을 추가하면 자동으로 따라옵니다.
    nitro: {
        prerender: {
            crawlLinks: true,
            routes: [
                '/solutions',
                '/work',
                '/services/si-sm',
                ...fbSolutions.map(s => `/solutions/${s.slug}`),
                ...fbProjects.map(p => `/work/${p.id}`),
            ],
        },
    },

    app: {
        baseURL: '/',
        head: {
            titleTemplate: `%s | ${SITE_TITLE_SUFFIX}`,
            title: '홈',
            meta: [
                { name: 'theme-color', content: '#003da5' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { charset: 'utf-8' },
                {
                    name: 'description',
                    content:
                        'IT와 AI의 결합으로 새로운 가치를 창출하는 포베리(Fourberry). 인공지능(AI) 솔루션 개발, SI/SM 시스템 통합, 빅데이터 분석 및 맞춤형 소프트웨어 컨설팅을 제공합니다.',
                },
                {
                    name: 'keywords',
                    content: '포베리, Fourberry, AI, 인공지능, AI 솔루션, AI 개발, 딥러닝, 머신러닝, SI, SM, 시스템 통합, IT 컨설팅, 웹 개발',
                },
                { name: 'naver-site-verification', content: 'dbb8fecd579367cf06f6d9c76589b36d6f59738a' },
                { name: 'google-site-verification', content: '7cGSanoPk5RmyIUaeIFy6yyajvN1-BA8QccITOXgtyY' },
                // ⚠️ og:title / og:description / og:url 은 여기서는 "기본값"일 뿐입니다.
                //    각 페이지가 useFbSeo() 로 같은 property 를 다시 선언하면 그 값이 이깁니다.
                //    (unhead 는 name/property 가 같은 meta 를 뒤에 선언된 것으로 덮어씁니다)
                { property: 'og:type', content: 'website' },
                { property: 'og:site_name', content: '(주)포베리' },
                { property: 'og:title', content: SITE_TITLE_SUFFIX },
                { property: 'og:description', content: '혁신적인 AI 기술과 안정적인 IT 서비스로 비즈니스의 성공을 돕습니다.' },
                { property: 'og:image', content: SITE_URL + SITE_OG_IMAGE },
                { property: 'og:url', content: SITE_URL },
            ],
            link: [
                // ⚠️ canonical 을 여기(전역)에 두면 안 됩니다.
                //    모든 하위 페이지가 "내 정규 주소는 홈이다"라고 선언하게 되어
                //    구글이 하위 페이지를 전부 색인에서 제외합니다.
                //    canonical 은 페이지마다 composables/useFbSeo.ts 가 설정합니다.
                { rel: 'icon', type: 'image/png', sizes: '64x64', href: '/favicon-64x64.png' },
                { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon-180x180.png' },
                {
                    rel: 'stylesheet',
                    href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
                },
                // ✅ 새 디자인용 영문 디스플레이 / 모노 서체
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap',
                },
            ],
        },
    },
})
