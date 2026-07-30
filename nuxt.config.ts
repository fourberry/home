// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

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
    ],

    site: {
        url: 'https://www.fourberry.co.kr',
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

    app: {
        baseURL: '/',
        head: {
            titleTemplate: '%s | AI 솔루션 & SI 전문 기업 (주)포베리',
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
                { property: 'og:type', content: 'website' },
                { property: 'og:site_name', content: '(주)포베리' },
                { property: 'og:title', content: 'AI 솔루션 & SI 전문 기업 (주)포베리' },
                { property: 'og:description', content: '혁신적인 AI 기술과 안정적인 IT 서비스로 비즈니스의 성공을 돕습니다.' },
                { property: 'og:image', content: 'https://www.fourberry.co.kr/og/cover.jpg' },
                { property: 'og:url', content: 'https://www.fourberry.co.kr' },
            ],
            link: [
                { rel: 'canonical', href: 'https://www.fourberry.co.kr' },
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
