import { create } from 'zustand'

export type Lang = 'my' | 'en'
export type Bi = { my: string; en: string }

const en = {
  appName: 'BackBenchers Academy',
  tagline: "Myanmar's national KG–12 curriculum, free, in immersive 3D.",
  chooseGrade: 'Choose a grade', chooseSubject: 'Choose a subject', kg: 'KG', grade: 'Grade', subjects: 'Subjects',
  textbooks: 'Textbooks', teacherGuides: 'Teacher guides', answerGuides: 'Answer guides', workbooks: 'Workbooks & practicals', others: 'Other',
  lessons: '3D lessons', read: 'Read', download: 'Download', openOriginal: 'Open original',
  noLessonsYet: 'No 3D lessons for this subject yet — help us build one.', contribute: 'Contribute',
  threeD: '3D', on: 'on', off: 'off', back: 'Back', next: 'Next', prev: 'Prev', start: 'Start', finish: 'Finish', restart: 'Restart',
  correct: 'Correct!', wrong: 'Not quite — try again.', loading: 'Loading…', source: 'Source', part: 'Part', pages: 'Pages', page: 'Page',
  unavailableInApp: "This book can't be rendered inside the app (the original server blocks it). Open it with the link below.",
  license: 'Textbooks © Ministry of Education, Myanmar — redistributed free for education. Code: MIT · Lessons: CC BY 4.0',
  home3dHint: 'Tap a grade · drag to look around', shelfHint: 'Tap a book', publisher: 'Publisher', curriculumOld: 'Old curriculum',
  videoExplainer: 'Video explainer', scene3d: '3D scene', readingText: 'Reading', quiz: 'Quiz', progressSaved: 'Progress saved',
  textbookRef: 'In the textbook', min: 'min', videoWanted: 'No video yet for this step — record a 3–8 minute explainer in Burmese and add its link.',
  primary: 'Primary', middle: 'Middle', high: 'High school', books: 'books', offline: 'Works offline once loaded', twoD: '2D mode (low-end phones)',
}
const my: typeof en = {
  appName: 'BackBenchers Academy',
  tagline: 'မြန်မာနိုင်ငံ သူငယ်တန်းမှ ၁၂ တန်းအထိ အမျိုးသားသင်ရိုးကို အခမဲ့၊ 3D immersive ပုံစံဖြင့် သင်ယူပါ။',
  chooseGrade: 'အတန်း ရွေးပါ', chooseSubject: 'ဘာသာရပ် ရွေးပါ', kg: 'သူငယ်တန်း', grade: 'အတန်း', subjects: 'ဘာသာရပ်များ',
  textbooks: 'ကျောင်းသုံးဖတ်စာအုပ်', teacherGuides: 'ဆရာလမ်းညွှန်', answerGuides: 'အဖြေလမ်းညွှန်', workbooks: 'လက်တွေ့ / လေ့ကျင့်ခန်း', others: 'အခြား',
  lessons: '3D သင်ခန်းစာများ', read: 'ဖတ်ရန်', download: 'ဒေါင်းလုဒ်', openOriginal: 'မူရင်းလင့်ခ်',
  noLessonsYet: 'ဤဘာသာရပ်အတွက် 3D သင်ခန်းစာ မရှိသေးပါ — အတူတကွ တည်ဆောက်ကြပါစို့။', contribute: 'ပါဝင်ကူညီရန်',
  threeD: '3D', on: 'ဖွင့်', off: 'ပိတ်', back: 'နောက်သို့', next: 'ရှေ့သို့', prev: 'နောက်', start: 'စတင်မည်', finish: 'ပြီးပါပြီ', restart: 'အစမှ ပြန်စ',
  correct: 'မှန်ပါသည်!', wrong: 'မှားနေပါသည် — ထပ်ကြိုးစားပါ။', loading: 'ဖွင့်နေသည်…', source: 'ရင်းမြစ်', part: 'အပိုင်း', pages: 'စာမျက်နှာ', page: 'စာမျက်နှာ',
  unavailableInApp: 'ဤစာအုပ်ကို app အတွင်း ဖွင့်၍မရပါ (မူရင်းဆာဗာက ခွင့်မပြုပါ)။ အောက်ပါလင့်ခ်ဖြင့် ဖွင့်ပါ။',
  license: 'ကျောင်းသုံးစာအုပ်များသည် ပညာရေးဝန်ကြီးဌာန၏ မူပိုင်ဖြစ်ပြီး ပညာရေးအတွက် အခမဲ့ ပြန်လည်ဖြန့်ဝေထားပါသည်။ Code: MIT · သင်ခန်းစာများ: CC BY 4.0',
  home3dHint: 'အတန်းကို နှိပ်ပါ · ဆွဲ၍ လှည့်ကြည့်နိုင်သည်', shelfHint: 'စာအုပ်ကို နှိပ်ပါ', publisher: 'ထုတ်ဝေသူ', curriculumOld: 'သင်ရိုးဟောင်း',
  videoExplainer: 'ဗီဒီယို ရှင်းလင်းချက်', scene3d: '3D မြင်ကွင်း', readingText: 'ဖတ်စရာ', quiz: 'မေးခွန်း', progressSaved: 'တိုးတက်မှု သိမ်းဆည်းပြီး',
  textbookRef: 'ဖတ်စာအုပ်တွင်', min: 'မိနစ်', videoWanted: 'ဤအဆင့်အတွက် ဗီဒီယို မရှိသေးပါ — မြန်မာလို ၃–၈ မိနစ် ရှင်းလင်းချက် ရိုက်ကူးပြီး လင့်ခ်ထည့်ပေးပါ။',
  primary: 'မူလတန်း', middle: 'အလယ်တန်း', high: 'အထက်တန်း', books: 'စာအုပ်', offline: 'တစ်ကြိမ်ဖွင့်ပြီးလျှင် အင်တာနက်မရှိလည်း အလုပ်လုပ်သည်', twoD: '2D မုဒ် (ဖုန်းအဟောင်းများအတွက်)',
}
export type Key = keyof typeof en
const dict: Record<Lang, typeof en> = { en, my }

function readLS(k: string): string | null { try { return localStorage.getItem(k) } catch { return null } }
function writeLS(k: string, v: string) { try { localStorage.setItem(k, v) } catch { /* private mode */ } }

function detectLowEnd(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number }
  if (nav.deviceMemory && nav.deviceMemory <= 2) return true
  try {
    const c = document.createElement('canvas')
    if (!c.getContext('webgl2') && !c.getContext('webgl')) return true
  } catch { return true }
  return false
}

type Settings = { lang: Lang; use3D: boolean; setLang: (l: Lang) => void; setUse3D: (v: boolean) => void }
export const useSettings = create<Settings>((set) => ({
  lang: (readLS('lang') as Lang) || 'my',
  use3D: readLS('use3D') ? readLS('use3D') === '1' : !detectLowEnd(),
  setLang: (lang) => { writeLS('lang', lang); set({ lang }) },
  setUse3D: (v) => { writeLS('use3D', v ? '1' : '0'); set({ use3D: v }) },
}))

export function useT() {
  const lang = useSettings((s) => s.lang)
  const t = (k: Key) => dict[lang][k] ?? dict.en[k]
  const bi = (b: Bi | string | null | undefined) => (!b ? '' : typeof b === 'string' ? b : b[lang] || b.en || b.my)
  return { t, bi, lang }
}

const MY_DIGITS = '၀၁၂၃၄၅၆၇၈၉'
export function num(n: number | string, lang: Lang): string {
  const s = String(n)
  return lang === 'my' ? s.replace(/\d/g, (d) => MY_DIGITS[Number(d)]) : s
}
