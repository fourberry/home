import { readFile, mkdir, stat } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
const release = JSON.parse(await readFile(path.join(root, 'data/linkberry-release.json'), 'utf8'))
const directory = path.join(root, 'public/downloads/linkberry')
const installer = path.join(directory, release.fileName)
if (process.argv.includes('--fetch')) {
    await mkdir(directory, { recursive: true })
    execFileSync('gh', ['release', 'download', release.releaseTag, '--repo', process.env.GITHUB_REPOSITORY, '--pattern', release.fileName, '--dir', directory], { stdio: 'inherit' })
}
const bytes = await readFile(installer)
if ((await stat(installer)).size !== release.bytes || createHash('sha256').update(bytes).digest('hex') !== release.sha256) {
    throw new Error('LinkBerry 설치 파일의 크기 또는 SHA-256이 배포 정보와 다릅니다.')
}
console.log('LinkBerry 설치 파일 크기·SHA-256 확인 완료: ' + release.fileName)
