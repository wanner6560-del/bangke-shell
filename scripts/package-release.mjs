import { cp, mkdir, readdir, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

const root = fileURLToPath(new URL('../', import.meta.url))
const releaseRoot = join(root, 'releases')
const name = `bangke-shell-${new Date().toISOString().replace(/[:.]/g, '-')}`
const destination = join(releaseRoot, name)
const allowlist = ['src', 'public', 'showcase', 'docs', 'scripts', '.github', 'index.html', 'package.json', 'pnpm-lock.yaml', 'vite.config.js', '.gitignore', '.oxlintrc.json', 'README.md', 'RIGHTS.md', 'CONTRIBUTING.md']
await mkdir(destination, { recursive: true })
for (const entry of allowlist) await cp(join(root, entry), join(destination, entry), { recursive: true })

async function scan(directory) {
  for (const entry of await readdir(directory)) {
    const path = join(directory, entry)
    if (['.private-demo', '.env', 'RESEARCH', 'output', 'photography-guide', 'node_modules'].includes(entry) || /\.(jpe?g|pem|key)$/i.test(entry)) throw new Error(`Unexpected private/source material in release: ${path}`)
    if ((await stat(path)).isDirectory()) await scan(path)
  }
}
await scan(destination)
const archive = join(releaseRoot, `${name}.tar.gz`)
const result = spawnSync('tar', ['-czf', archive, '-C', releaseRoot, name], { stdio: 'inherit', env: { ...process.env, LC_ALL: 'C' } })
if (result.status !== 0) throw new Error('Archive creation failed')
console.log(`Release folder: ${destination}\nArchive: ${archive}`)
