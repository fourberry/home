/** @type {import('tailwindcss').Config} */
export default {
    // Tailwind CSS가 클래스를 찾아낼 파일 경로를 정의합니다. (Nuxt 기본 설정)
    content: ['./app.vue', './layouts/**/*.vue', './pages/**/*.vue', './components/**/*.vue'],
    theme: {
        // Tailwind의 기본 테마를 확장(extend)합니다.
        extend: {
            // 1. 색상 정의 (Colors): 정의하신 브랜드/중립 컬러를 유지합니다.
            colors: {
                /* 브랜드 컬러 */
                primary: '#003da5', // 메인 블루(로고)
                secondary: '#0084d5', // 보조 블루(로고)
                accent: '#082b43ff', // 다크 블루 포인트

                /* 중립톤 */
                background: '#ffffff', // 전체 배경
                surface: '#f9fafb', // 섹션·카드 배경
                border: '#e5e7eb', // 구분선
                text: '#111827', // 기본 본문 텍스트
                subtext: '#6b7280', // 서브 텍스트
                muted: '#9ca3af', // 비활성, 힌트 텍스트

                /* Gray 명조 */
                gray: {
                    light: '#f3f4f6', // 배경용 (surface보다 살짝 진함)
                    mid: '#9ca3af', // 일반 텍스트, 아이콘용
                    dark: '#374151', // 제목, 강조 텍스트
                    deep: '#111827', // 거의 블랙 (헤드라인)
                },
            },
            // 2. 폰트 정의 (Font Family): 정의하신 폰트 스택을 유지합니다.
            fontFamily: {
                sans: [
                    'Pretendard Variable',
                    'Happiness Sans',
                    'Pretendard',
                    'DM Sans', // 사용자 정의 웹 폰트
                    '-apple-system', // 시스템 폰트 시작
                    'BlinkMacSystemFont',
                    '"Segoe UI"', // 띄어쓰기가 있으므로 따옴표 사용
                    'Roboto',
                    'Oxygen-Sans',
                    'Ubuntu',
                    'Cantarell',
                    '"Helvetica Neue"', // 띄어쓰기가 있으므로 따옴표 사용
                    'sans-serif', // 마지막 fallback
                ],
                pretendard: ['Pretendard', 'sans-serif'],
            },
            maxWidth: {
                '8xl': '1440px', // 1440px 너비 (이름은 자유롭게)
                '9xl': '1600px', // 1600px 너비
            },
            // 3. 테두리 둥글기 (Border Radius): 정의하신 2xl 값을 유지합니다.
            borderRadius: {
                '2xl': '1rem',
                // '3xl': '1.5rem', // 필요하다면 더 큰 값을 추가할 수 있습니다.
            },

            // 4. 그림자 정의 (Box Shadow): 카드를 위한 기본 그림자를 추가합니다. (추가된 부분)
            boxShadow: {
                // 'shadow-card' 클래스로 사용 가능
                card: '0 4px 12px rgba(0, 0, 0, 0.08)', // 은은하고 명확한 카드/섹션 그림자
            },

            // 5. 간격/사이즈 정의 (Spacing): 자주 사용하는 중간 값이나 더 큰 값을 추가하여 유연성을 높입니다. (추가된 부분)
            spacing: {
                4.5: '1.125rem', // 18px (Tailwind 4(16px)와 5(20px) 사이)
                15: '3.75rem', // 60px (섹션 패딩 등으로 활용)
                20: '5rem', // 80px (Tailwind 기본 20: 5rem을 오버라이드하지 않음)
            },

            // 6. 애니메이션 (Animation): 로딩 시나 간단한 인터랙션을 위한 애니메이션을 추가합니다. (추가된 부분)
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'pulse-subtle': {
                    '0%, 100%': {
                        transform: 'scale(1)',
                    },
                    '50%': {
                        transform: 'scale(1.05)', // 3% 커짐
                    },
                },
                'text-shine': {
                    '0%': {
                        backgroundPosition: '0% 50%',
                    },
                    '100%': {
                        backgroundPosition: '200% 50%', // 그라데이션을 200% 이동
                    },
                },
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards', // 페이지,컴포넌트 사라짐 효과
                'fade-in-up': 'fadeInUp 0.6s ease-out forwards', // 페이지,컴포넌트 등장 효과
                'spin-slow': 'spin 3s linear infinite', //로딩 스피너
                'pulse-subtle': 'pulse-subtle 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite', // 2.5초 동안 무한 반복
                'text-shine': 'text-shine 3s ease-in-out infinite',
            },
            backgroundSize: {
                '200%': '200% auto',
            },
            /*노트북일때(스크린 높이 낮음) 패딩 줄이기 */
            screens: {
                short: { raw: '(max-height: 800px)' },
            },
        },
        screens: {
            xs: '320px',
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px',
            desktop: '1200px',
        },
    },

    plugins: [require('@tailwindcss/forms'), require('@tailwindcss/line-clamp')],
}
