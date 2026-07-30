export interface FbProject {
    id: string
    client: string
    title: string
    period: string
    thumb: string
    overview: string
    shots?: string[]
}

export const fbProjects: FbProject[] = [
    {
        id: 'cuckoo',
        client: '쿠쿠',
        title: 'OMS 및 차세대 영업관리 시스템 구축 · 운영 고도화',
        period: '2021 — 운영 중',
        thumb: '/images/homeSiSm/oms_2.webp',
        overview:
            '주문관리(OMS)를 중심으로 영업 프로세스 전반을 재설계하고, 차세대 영업관리 시스템을 구축했습니다.\n구축 이후 현재까지 운영(SM)과 고도화를 지속하고 있습니다.',
    },
    {
        id: 'withfresh',
        client: '영등포농협',
        title: '브랜드몰 WITHFRESH 및 SSO 구축 · 운영 고도화',
        period: '2024 — 운영 중',
        thumb: '/images/homeSiSm/withfresh_9.png',
        overview:
            '영등포농협의 자체 브랜드몰 WITHFRESH를 구축한 프로젝트입니다. 하이브리드 모바일 앱과 온라인 쇼핑몰, 관리자 사이트를 함께 구현했습니다.\n2개의 관리 사이트와 신규 브랜드몰의 회원을 통합 관리하는 SSO를 구축했고, 운영 단계에서 기능 고도화를 이어가고 있습니다.',
    },
    {
        id: 'autocrypt',
        client: '아우토크립트',
        title: '자동차 보안 대응 시스템(K-CSMS) 구축',
        period: '2024 — 3차 개발 중',
        thumb: '/images/homeSiSm/autocrypt_4.jpg',
        overview:
            '차량 사이버보안 관리체계(K-CSMS) 요건에 맞춘 대응 시스템을 설계·구축했습니다.\n구축 이후 단계별 개발을 이어가고 있으며, 현재 3차 개발을 진행하고 있습니다.',
    },
    {
        id: 'donghang',
        client: '동행복권',
        title: '인쇄복권 시스템 통합 및 DB 전환',
        period: '2024 — 2025',
        thumb: '/images/homeSiSm/migration.png',
        overview: '분산되어 있던 인쇄복권 관련 시스템을 통합하고, 무중단 기준의 데이터베이스 전환을 수행했습니다.',
    },
    {
        id: 'kobc',
        client: '한국해양진흥공사',
        title: '게이미피케이션 접목 캠페인 (PC · 모바일)',
        period: '2024 — 2025',
        thumb: '/images/homeSiSm/kobc_1.png',
        overview: '참여형 게이미피케이션 요소를 접목한 캠페인 사이트를 PC·모바일 동시 대응으로 구축했습니다.',
    },
    {
        id: 'knsu',
        client: '한국체육대학교',
        title: '실시간 승부조작 위험성 경고 시스템 구축',
        period: '2022 — 2023',
        thumb: '/images/homeSiSm/sports_3.jpg',
        overview: '경기 데이터를 실시간으로 분석해 이상 패턴을 탐지하고 위험도를 경고하는 시스템을 구축했습니다.',
    },
]
