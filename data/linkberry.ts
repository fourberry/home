import type { FbSolution } from './solutions'
import release from './linkberry-release.json'
import macTrial from './linkberry-mac-trial.json'

type MacArtifact = { fileName: string; arch: string; bytes: number; sha256: string; releaseTag: string }
export const linkberryMacTrial = {
    ...macTrial,
    downloads: (macTrial.artifacts as MacArtifact[]).filter(file => file.fileName.endsWith('.dmg')).map(file => ({
        ...file,
        label: file.arch === 'arm64' ? 'Apple Silicon (M 시리즈)' : 'Intel Mac',
        downloadPath: 'https://github.com/fourberry/home/releases/download/' + file.releaseTag + '/' + file.fileName,
        sizeLabel: (file.bytes / 1024 / 1024).toFixed(1) + ' MiB',
    })),
}
const hasMacTrial = linkberryMacTrial.downloads.length > 0

export const linkberryRelease = {
    ...release,
    downloadPath: '/downloads/linkberry/' + release.fileName,
    sizeLabel: (release.bytes / 1024 / 1024).toFixed(1) + ' MiB',
}

export const linkberryPath = '/tools/linkberry'

// 실제 앱에 가상 데이터를 넣어 촬영한 화면입니다. 접속 정보와 업무 내용은 예시입니다.
export const linkberryScreens = [
    {
        id: 'workspace',
        label: '분할 터미널',
        title: '터미널과 파일 작업을 한 화면에서',
        description: '분할 터미널로 서비스 상태와 로그를 나란히 확인하고, SFTP 파일 탐색기로 원격 파일을 관리하세요.',
        image: '/images/solutions/linkberry/workspace.png',
        alt: 'BerryLinker의 왼쪽 SFTP 파일 탐색기와 서비스 상태·로그를 나란히 표시한 두 개의 분할 터미널. 데모 데이터 화면.',
    },
    {
        id: 'files',
        label: '파일 전송',
        title: '원격 파일을 찾고, 전송하고',
        description: '원격 폴더를 탐색하며 파일을 업로드하고 다운로드하세요. 파일 목록과 전송 결과를 터미널 옆에서 확인할 수 있습니다.',
        image: '/images/solutions/linkberry/files.png',
        alt: 'SFTP 탐색기에 업로드된 release-notes.md와 다운로드 메뉴, 업로드 완료 상태가 표시된 BerryLinker 데모 화면.',
    },
    {
        id: 'editor',
        label: '원격 편집',
        title: '설정 파일을 열고, 바로 수정',
        description: '원격 텍스트 파일을 앱 안에서 열어 내용을 확인하고 수정하세요. 변경 내용을 확인한 뒤 원격 서버에 저장할 수 있습니다.',
        image: '/images/solutions/linkberry/editor.png',
        alt: '가상 프로젝트의 nginx.conf를 연 BerryLinker 원격 텍스트 편집기와 저장하지 않은 변경 표시, 원격에 저장 버튼.',
    },
    {
        id: 'commands',
        label: '명령어 사전',
        title: '필요한 명령어를 찾아서 활용',
        description: '작업에 맞는 Linux·Docker 명령어를 검색하고 설명과 예제를 확인하세요. 예제를 복사해 경로와 이름을 환경에 맞게 바꿔 사용할 수 있습니다.',
        image: '/images/solutions/linkberry/commands.png',
        alt: '로그를 검색한 BerryLinker 명령어 사전에서 docker logs의 설명과 기본·응용 예제를 터미널 옆에 표시한 화면.',
    },
    {
        id: 'notes',
        label: '작업 메모',
        title: '서버 작업에 필요한 정보를 함께 기록',
        description: '서버별 메모에 작업 경로, 확인할 내용과 작업 기록을 정리하세요. 색상과 태그로 구분하고 메모 보드에 자유롭게 배치할 수 있습니다.',
        image: '/images/solutions/linkberry/notes.png',
        alt: '데모 서버의 배포 확인 목록, 작업 경로, 로그 명령어와 작업 기록을 색상과 태그로 구분한 BerryLinker 메모 보드.',
    },
]

// 공통 브랜드 표시 형식만 재사용하며 솔루션 목록에는 등록하지 않습니다.
export const linkberryTool: FbSolution = {
    slug: 'linkberry',
    name: 'BerryLinker',
    ko: '베리링커',
    tag: 'BETA · Windows · SSH / SFTP',
    image: '/images/solutions/linkberry/mark.svg',
    desc: '개발자와 서버 관리자를 위한 Windows 원격 접속 도구입니다. SSH 터미널과 SFTP 파일 탐색·전송을 한 앱에서 사용합니다. 현재 사내 사용과 피드백을 중심으로 검증 중인 베타 버전입니다.',
    feats: [
        { t: 'SSH 터미널', d: '여러 서버 연결을 탭과 분할 화면으로 확인합니다.' },
        { t: 'SFTP 파일 작업', d: '원격 폴더를 탐색하고 파일을 업로드·다운로드·편집합니다.' },
        { t: '서버 관리', d: '접속 정보를 저장하고 폴더별로 분류합니다.' },
        { t: '인증 방식', d: '비밀번호와 SSH 개인 키 인증을 지원합니다.' },
    ],
    seoTitle: 'BerryLinker 베타 — Windows SSH·SFTP 도구 다운로드',
    seoDescription: '포베리 BerryLinker는 Windows용 SSH·SFTP 원격 접속 도구입니다. 사내 검증 중인 베타 버전의 기능과 제한, 설치 파일 정보, 이용 시 주의사항 및 책임 제한 안내를 확인하고 다운로드하세요.',
    headline: '서버 접속부터 파일 작업까지,\n하나의 작업 공간에서.',
    category: 'DeveloperApplication',
    problems: ['여러 서버의 터미널과 파일 작업을 함께 확인하고 싶을 때', '자주 사용하는 서버 접속 정보를 폴더로 정리하고 싶을 때'],
    sections: [
        {
            h: '접속할 서버를 먼저 확인합니다',
            body: '서버 주소·포트·사용자와 인증 방식을 등록하고 연결합니다. 처음 접속할 때 표시되는 서버의 SSH 호스트 지문은 관리자가 제공한 값과 대조하세요. 저장된 지문이 달라지면 접속이 차단됩니다. 접속 대상과 계정의 권한은 사용자가 확인해야 합니다.',
        },
        {
            h: '터미널과 파일 작업을 함께 진행합니다',
            body: 'SSH 명령 실행과 SFTP 파일 탐색·전송·텍스트 편집을 제공합니다. 원격 파일의 덮어쓰기나 명령 실행은 실제 서버에 영향을 줍니다. 운영 데이터는 먼저 백업하고 테스트 환경에서 동작을 확인하세요. 전송 결과와 서버 응답을 확인한 뒤 다음 작업을 진행하는 것이 좋습니다.',
        },
        {
            h: 'PC에서 직접 연결합니다',
            body: '앱은 사용 중인 PC의 네트워크 경로로 대상 서버에 연결합니다. VPN과 방화벽, 서버의 접속 허용 정책을 따라야 합니다. 접속 설정은 PC의 사용자 데이터 폴더에 저장되며, 비밀번호 저장은 선택 사항입니다. 개인 키 파일과 PC 계정의 접근 권한도 별도로 관리하세요. 업데이트 확인·다운로드 시 회사 홈페이지에 연결하며 서버 접속 정보나 인증 정보는 전송하지 않습니다.',
        },
    ],
    faq: [
        {
            q: '정식 출시된 제품인가요?',
            a: '아닙니다. 현재 사내 사용과 피드백을 중심으로 검증 중인 베타 버전입니다. 외부에서 내려받는 경우에도 같은 베타 안내와 제한이 적용됩니다. 기능·화면이 바뀌거나 오류가 발생할 수 있습니다.',
        },
        {
            q: '어떤 환경에서 설치할 수 있나요?',
            a: hasMacTrial
                ? 'Windows x64 베타와 Apple Silicon·Intel Mac용 시험 DMG를 제공합니다. Node.js는 별도로 설치하지 않습니다. Mac 시험본은 팀 검증용이며 Developer ID 서명·Apple 공증이 없어 실행이 차단될 수 있습니다. Linux·Windows ARM용 공개 설치 파일은 제공하지 않습니다.'
                : '현재 제공 파일은 Windows x64용 설치 프로그램입니다. Node.js를 별도로 설치할 필요는 없습니다. macOS·Linux·Windows ARM용 설치 파일은 제공하지 않으며, 모든 Windows 버전과 기업 보안 정책에서의 호환성은 검증하지 않았습니다.',
        },
        {
            q: '업데이트는 자동으로 설치되나요?',
            a: 'Windows는 0.1.1-beta.3부터 새 버전을 자동으로 확인하고 백그라운드에서 다운로드합니다. 작업을 마친 뒤 앱을 종료하거나 재시작하여 업데이트를 선택하면 설치합니다. 파일 작업이나 열린 편집기가 있으면 설치를 막습니다. 자동 업데이트가 없는 0.1.1-beta.1 이하 버전은 이번 설치 파일을 한 번 직접 설치해야 합니다. Mac 시험본은 수동 업데이트 방식입니다.',
        },
        {
            q: '업데이트하면 접속 설정이 유지되나요?',
            a: '같은 Windows 계정의 기존 앱 설정 폴더를 유지하며, 자동 설치 전에 접속 설정을 별도로 백업합니다. 시험 환경에서 서버·폴더·호스트 지문·개인 키 경로와 암호화된 인증 정보, 언어·테마의 보존을 확인했습니다. 개인 키 원본은 이동하지 않습니다. 다른 계정이나 PC로 옮기는 동작은 별도 이전 작업입니다.',
        },
        {
            q: '업데이트가 실패하면 어떻게 하나요?',
            a: '통신 실패·파일 검증 실패·설정 백업 실패 시 설치를 진행하지 않고 재시도 안내를 표시합니다. 설치가 완료되지 않으면 다음 앱 실행에서 알립니다. 앱의 업데이트 재시도를 사용하거나 이 페이지에서 설치 파일을 다시 받을 수 있습니다. 설치 도중 전원 중단 등 모든 상황의 자동 복구를 보장하지는 않습니다. 기존 설정과 백업은 삭제하지 말고 보존하세요.',
        },
        {
            q: '설치할 때 Windows 보안 경고가 표시되나요?',
            a: '현재 설치 파일은 코드 서명이 없는 시험 배포본이므로 Windows나 보안 제품이 경고하거나 실행을 차단할 수 있습니다. 회사의 설치 정책을 따르고, 보안 기능을 끄거나 정책을 우회하지 마세요. 설치가 제한되면 내부 관리자에게 확인하세요.',
        },
        {
            q: '문제를 발견하면 어떻게 알려야 하나요?',
            a: '포베리 문의 채널로 앱 버전, 발생한 작업과 오류 메시지를 알려주세요. 비밀번호·개인 키·고객 정보·내부 서버 주소를 포함하지 마세요. 별도 지원 계약이 없는 베타 이용에 대해 개별 환경의 장애 복구나 응답·수정 기한을 약속하지 않습니다.',
        },
    ],
    brand: {
        accent: '#35652d',
        accentHover: '#284e22',
        accentLite: '#b6e970',
        inkBg: '#142021',
        inkSurface: '#203031',
        inkAccent: '#b6e970',
        inkFg2: '#bacab9',
        mark: '/images/solutions/linkberry/mark.svg',
    },
}

export const linkberryTerms = [
    {
        title: '베타 제공과 보장 범위',
        body: 'BerryLinker는 검증 중인 상태로 제공됩니다. 법령상 허용되는 범위에서 오류 없는 동작, 특정 목적에 대한 적합성, 모든 환경의 호환성·연속적인 이용을 보장하지 않습니다. 본 안내가 페이지에 명시한 기능이나 법령상 보장 의무를 배제하는 것은 아닙니다.',
    },
    {
        title: '허가된 시스템에서 사용',
        body: '접속·관리 권한을 보유하거나 관리자의 허가를 받은 시스템에서만 사용하세요. 계정과 개인 키를 안전하게 관리하고, 관련 법령·소속 조직의 보안 정책·대상 서비스의 이용 조건을 준수해야 합니다. 무단 접근이나 제3자의 권리를 침해하는 용도로 사용할 수 없습니다.',
    },
    {
        title: '작업 전 확인과 백업',
        body: 'SSH 명령 실행, 파일 전송·덮어쓰기·편집은 서버와 데이터에 직접 영향을 줍니다. 작업 대상과 명령·파일 내용을 확인하고 필요한 백업과 복구 절차를 준비하세요. 터미널 출력 기록에는 민감한 정보가 포함될 수 있으므로 저장·공유 범위도 확인하세요.',
    },
    {
        title: '책임 제한과 예외',
        body: '법령상 허용되는 범위에서 포베리는 이용자의 무단 접근, 권한을 벗어난 사용, 법령·보안 정책 위반 또는 잘못된 명령 실행으로 발생한 손해에 대해 책임을 부담하지 않습니다. 베타의 오류로 데이터 손실·업무 중단 등이 발생할 수 있으나, 이 안내만으로 회사가 부담해야 할 위험이나 책임을 이용자에게 전가하지 않습니다. 회사·이행 보조자·피고용자의 고의 또는 중대한 과실, 그 밖에 법령상 배제·제한할 수 없는 책임에는 위 제한이 적용되지 않습니다.',
    },
    {
        title: '지원과 제3자 소프트웨어',
        body: '베타의 기능·지원 범위와 업데이트 일정은 검증 결과에 따라 달라질 수 있습니다. 별도 계약이 없는 경우 지속적인 유지보수나 특정 기한 내 수정·복구를 보장하지 않습니다. 포함된 오픈소스 소프트웨어에는 각 라이선스가 적용되며 관련 고지와 원문은 설치 파일에 포함되어 있습니다.',
    },
]
