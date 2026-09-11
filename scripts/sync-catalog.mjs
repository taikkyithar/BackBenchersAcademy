// Copies the catalog and lesson content into web/public/data so the site is fully static.
// Runs automatically before `npm run dev` / `npm run build` in web/.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'web', 'public', 'data')
mkdirSync(join(out, 'lessons'), { recursive: true })

const cat = JSON.parse(readFileSync(join(root, 'catalog', 'catalog.json'), 'utf8'))
const entries = cat.entries.filter((e) => !e.off_curriculum)
writeFileSync(join(out, 'catalog.json'), JSON.stringify({ version: cat.version, generated: new Date().toISOString(), entries }))

function walk(dir) {
  let found = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) found = found.concat(walk(p))
    else if (name === 'lesson.json') found.push(p)
  }
  return found
}
const lessons = []
for (const p of walk(join(root, 'content'))) {
  const l = JSON.parse(readFileSync(p, 'utf8'))
  for (const k of ['id', 'grade', 'subject', 'title', 'steps']) if (!(k in l)) throw new Error(`${p}: missing "${k}"`)
  writeFileSync(join(out, 'lessons', `${l.id}.json`), JSON.stringify(l))
  lessons.push({ id: l.id, grade: l.grade, subject: l.subject, title: l.title, summary: l.summary ?? null,
    duration_min: l.duration_min ?? null, steps: l.steps.length, has3d: l.steps.some((s) => s.type === 'scene'),
    hasVideo: l.steps.some((s) => s.type === 'video' && s.url) })
}
writeFileSync(join(out, 'lessons.json'), JSON.stringify(lessons))
console.log(`synced ${entries.length} catalog entries and ${lessons.length} lessons → web/public/data`)
