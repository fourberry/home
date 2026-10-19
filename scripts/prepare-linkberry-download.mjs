import { readFile, mkdir, stat } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
const release = JSON.parse(await readFile(path.join(root, 'data/linkberry-release.json'), 'utf8'))
const directory = path.join(root, 'public/downloads/linkberry')
const artifacts = [release, { ...release.updateManifest, releaseTag: release.releaseTag }, ...(release.retainedDownloads || [])]
await mkdir(directory, { recursive: true })
for (const artifact of artifacts) {
    const file = path.join(directory, artifact.fileName)
    if (process.argv.includes('--fetch')) {
        execFileSync('gh', ['release', 'download', artifact.releaseTag, '--repo', process.env.GITHUB_REPOSITORY, '--pattern', artifact.fileName, '--dir', directory], { stdio: 'inherit' })
    }
    const bytes = await readFile(file)
    if ((await stat(file)).size !== artifact.bytes || createHash('sha256').update(bytes).digest('hex') !== artifact.sha256) {
        throw new Error('LinkBerry 배포 파일의 크기 또는 SHA-256이 배포 정보와 다릅니다: ' + artifact.fileName)
    }
    console.log('LinkBerry 배포 파일 크기·SHA-256 확인 완료: ' + artifact.fileName)
}
