// 홈페이지 채팅 시스템 프롬프트 원본(docs/chat-system-prompt.md)을 검사합니다.
//
//   node scripts/check-chat-prompt.mjs           글자 수·FAQ 문구·금지 패턴 검사
//   node scripts/check-chat-prompt.mjs --print   검사를 통과하면 본문만 출력(plum 콘솔에 붙여 넣을 글)
//
// 이 스크립트는 빌드·배포에 쓰이지 않습니다. 프롬프트를 고칠 때 사람이 돌립니다.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const MAX_CHARS = 12000 // plum 모델 목록 webchat.max_system_prompt_chars
const PUBLIC_EMAIL = 'fourberry@fourberry.co.kr'

const doc = readFileSync(root + 'docs/chat-system-prompt.md', 'utf8').replace(/\r\n/g, '\n')
const block = doc.match(/<!-- chat-prompt:start -->\s*```text\n([\s\S]*?)\n```\s*<!-- chat-prompt:end -->/)
if (!block) {
    console.error('프롬프트 본문 블록(<!-- chat-prompt:start --> ```text … ``` <!-- chat-prompt:end -->)을 찾지 못했습니다.')
    process.exit(1)
}
const prompt = block[1].trim()
const problems = []

// 1) 길이: 유니코드 코드 포인트(plum 과 같은 기준)
const length = [...prompt].length
if (length > MAX_CHARS) problems.push(`길이 ${length}자 > ${MAX_CHARS}자`)

// 2) 홈페이지 FAQ 는 data/faq.ts 와 같은 문구여야 합니다(화면·JSON-LD·채팅이 같은 답).
const faqSource = readFileSync(root + 'data/faq.ts', 'utf8')
const faq = [...faqSource.matchAll(/q:\s*'([^']*)',\s*a:\s*'([^']*)'/g)].map(([, q, a]) => ({ q, a }))
if (!faq.length) problems.push('data/faq.ts 에서 질문을 읽지 못했습니다(형식이 바뀌었으면 이 스크립트도 고쳐 주세요)')
for (const { q, a } of faq) {
    if (!prompt.includes(`Q. ${q}\nA. ${a}`)) problems.push(`FAQ 문구가 data/faq.ts 와 다릅니다: ${q}`)
}

// 3) 비공개 정보가 섞이지 않았는지(방문자가 프롬프트를 꺼내 볼 수 있다고 봅니다)
const forbidden = [
    [/[A-Za-z]:\\/, '내부 경로(C:\\…)'],
    [/\b\d{1,3}(?:\.\d{1,3}){3}\b/, 'IP 주소'],
    [/http:\/\//, 'http 주소'],
    [/\bsk-[A-Za-z0-9]/, '키처럼 보이는 값'],
    [/api[_-]?key|secret|password\s*[:=]/i, '비밀값 이름'],
]
for (const [pattern, label] of forbidden) if (pattern.test(prompt)) problems.push(`금지 패턴: ${label}`)
for (const email of prompt.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g) ?? []) {
    if (email !== PUBLIC_EMAIL) problems.push(`공개 대표 주소가 아닌 이메일: ${email}`)
}

if (problems.length) {
    console.error('채팅 프롬프트 검사 실패:\n- ' + problems.join('\n- '))
    process.exit(1)
}
if (process.argv.includes('--print')) process.stdout.write(prompt + '\n')
else console.log(`채팅 프롬프트 검사 통과: ${length}/${MAX_CHARS}자, 홈페이지 FAQ ${faq.length}개 일치`)
