import { useEffect, useState } from 'react'
import type { Bi } from '../i18n'

export type CatalogFile = { source: string; source_page: string; url: string; drive_id: string | null; filename: string | null; bytes: number | null; title: string | null }
export type Entry = {
  id: string; grade: string; subject: string; subject_label: string; kind: string; part: number | null
  curriculum: 'new' | 'old'; language: string; publisher: string; off_curriculum: boolean; title: string; files: CatalogFile[]; needs_review?: boolean
  cover?: string | null
}
export type Catalog = { version: number; generated: string; entries: Entry[] }
export type LessonStep =
  | { type: 'text'; title?: Bi; body: Bi }
  | { type: 'video'; title?: Bi; url: string | null; provider?: 'youtube' | 'file' }
  | { type: 'scene'; title?: Bi; scene: string; params?: Record<string, unknown>; narration?: Bi }
  | { type: 'quiz'; question: Bi; choices: Bi[]; answer: number; explain?: Bi }
export type Lesson = {
  id: string; grade: string; subject: string; title: Bi; summary?: Bi; duration_min?: number
  textbook_ref?: { catalog_id?: string; chapter?: string | null; pages?: string | null }
  steps: LessonStep[]; contributors?: string[]; license?: string
}
export type LessonSummary = { id: string; grade: string; subject: string; title: Bi; summary: Bi | null; duration_min: number | null; steps: number; has3d: boolean; hasVideo: boolean }

const base = import.meta.env.BASE_URL.replace(/\/$/, '')
const cache = new Map<string, Promise<unknown>>()
function getJSON<T>(path: string): Promise<T> {
  if (!cache.has(path)) cache.set(path, fetch(`${base}${path}`).then((r) => { if (!r.ok) throw new Error(`${r.status} ${path}`); return r.json() }))
  return cache.get(path) as Promise<T>
}
export const loadCatalog = () => getJSON<Catalog>('/data/catalog.json')
export const loadLessons = () => getJSON<LessonSummary[]>('/data/lessons.json')
export const loadLesson = (id: string) => getJSON<Lesson>(`/data/lessons/${id}.json`)

export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]) {
  const [state, set] = useState<{ data?: T; error?: string }>({})
  useEffect(() => { let on = true; set({}); fn().then((data) => on && set({ data })).catch((e) => on && set({ error: String(e) })); return () => { on = false } }, deps) // eslint-disable-line react-hooks/exhaustive-deps
  return state
}
export const useCatalog = () => useAsync(loadCatalog, [])
export const useLessons = () => useAsync(loadLessons, [])

const PROXY = (import.meta.env.VITE_PDF_PROXY as string | undefined) ?? (import.meta.env.DEV ? '/proxy' : '')
/** URL pdf.js can fetch: the original hosts send no CORS headers, so go through a proxy when one is configured. Drive files: null (use viewUrl). */
export function readerUrl(f: CatalogFile): string | null {
  if (f.drive_id) return null
  if (!PROXY) return f.url
  try { const u = new URL(f.url); return `${PROXY}/${u.host}${u.pathname}${u.search}` } catch { return f.url }
}
export function viewUrl(f: CatalogFile) {
  return f.drive_id ? `https://drive.google.com/file/d/${f.drive_id}/view` : f.url
}
export const REPO_URL = (import.meta.env.VITE_REPO_URL as string | undefined) || 'https://github.com/Thiha-Lynn/BackBenchersAcademy'
export const coverSrc = (e: { cover?: string | null }) => (!e.cover ? null : e.cover.startsWith('http') ? e.cover : `${base}/${e.cover}`)
export const mb = (b: number | null | undefined) => (b ? `${(b / 1e6).toFixed(b > 1e8 ? 0 : 1)} MB` : '')
export const kindOrder = ['textbook', 'teacher_guide', 'workbook', 'answer_guide', 'exam_guide', 'interactive', 'learning_guide', 'syllabus']
