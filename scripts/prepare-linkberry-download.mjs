import { readFile, mkdir, stat } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
const release = JSON.parse(await readFile(path.join(root, 'data/linkberry-release.json'), 'utf8'))
const macTrial = JSON.parse(await readFile(path.join(root, 'data/linkberry-mac-trial.json'), 'utf8'))
for (const artifact of macTrial.artifacts) {
    if (!/^BerryLinker-[0-9A-Za-z.-]+-mac-(x64|arm64)\.(dmg|zip)$/.test(artifact.fileName) || !/^berrylinker-mac-trial-[0-9A-Za-z.-]+$/.test(artifact.releaseTag) || !Number.isSafeInteger(artifact.bytes) || artifact.bytes <= 100 || !/^[a-f0-9]{64}$/.test(artifact.sha256)) {
        throw new Error('Mac 시험본 배포 정보가 올바르지 않습니다.')
    }
}
for (const artifact of [release, ...(release.retainedDownloads || [])]) {
    if (artifact.downloadUrl && artifact.downloadUrl !== 'https://github.com/fourberry/home/releases/download/' + artifact.releaseTag + '/' + artifact.fileName) throw new Error('Windows 다운로드 주소가 허용된 Release 경로와 다릅니다.')
}
const directory = path.join(root, 'public/downloads/linkberry')
const artifacts = [release, { ...release.updateManifest, releaseTag: release.releaseTag }, ...(release.retainedDownloads || []), ...macTrial.artifacts]

for (const artifact of artifacts) {
    // Release 주소를 가진 설치 파일은 Pages 출력과 분리해 검증합니다.
    const artifactDirectory = macTrial.artifacts.includes(artifact) ? path.join(root, '.data/mac-trial-downloads') : artifact.downloadUrl ? path.join(root, '.data/windows-downloads') : directory
    await mkdir(artifactDirectory, { recursive: true })
    const file = path.join(artifactDirectory, artifact.fileName)
    if (process.argv.includes('--fetch')) {
        execFileSync('gh', ['release', 'download', artifact.releaseTag, '--repo', process.env.GITHUB_REPOSITORY, '--pattern', artifact.fileName, '--dir', artifactDirectory], { stdio: 'inherit' })
    }
    const bytes = await readFile(file)
    if ((await stat(file)).size !== artifact.bytes || createHash('sha256').update(bytes).digest('hex') !== artifact.sha256) {
        throw new Error('BerryLinker 배포 파일의 크기 또는 SHA-256이 배포 정보와 다릅니다: ' + artifact.fileName)
    }
    console.log('BerryLinker 배포 파일 크기·SHA-256 확인 완료: ' + artifact.fileName)
}
