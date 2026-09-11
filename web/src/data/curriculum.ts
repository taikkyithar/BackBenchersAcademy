import type { Bi } from '../i18n'

export const GRADES = ['KG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] as const
export type Grade = (typeof GRADES)[number]

export function levelOf(g: string): 'primary' | 'middle' | 'high' {
  if (g === 'KG' || Number(g) <= 5) return 'primary'
  if (Number(g) <= 9) return 'middle'
  return 'high'
}
export const LEVEL_COLOR = { primary: '#2ec4b6', middle: '#3a86ff', high: '#ffb703' } as const

export const SUBJECTS: Record<string, Bi & { color: string; icon: string }> = {
  myanmar: { my: 'မြန်မာစာ', en: 'Myanmar', color: '#ffb703', icon: '📖' },
  english: { my: 'အင်္ဂလိပ်စာ', en: 'English', color: '#3a86ff', icon: '🔤' },
  mathematics: { my: 'သင်္ချာ', en: 'Mathematics', color: '#8338ec', icon: '➗' },
  science: { my: 'သိပ္ပံ', en: 'Science', color: '#2ec4b6', icon: '🔬' },
  social_studies: { my: 'လူမှုရေး', en: 'Social Studies', color: '#fb8500', icon: '🌏' },
  geography: { my: 'ပထဝီဝင်', en: 'Geography', color: '#06d6a0', icon: '🗺️' },
  history: { my: 'သမိုင်း', en: 'History', color: '#bc6c25', icon: '🏛️' },
  geography_history: { my: 'ပထဝီဝင်နှင့် သမိုင်း', en: 'Geography & History', color: '#80b918', icon: '🧭' },
  economics: { my: 'ဘောဂဗေဒ', en: 'Economics', color: '#ffd166', icon: '📈' },
  biology: { my: 'ဇီဝဗေဒ', en: 'Biology', color: '#57cc99', icon: '🧬' },
  chemistry: { my: 'ဓာတုဗေဒ', en: 'Chemistry', color: '#ef476f', icon: '⚗️' },
  physics: { my: 'ရူပဗေဒ', en: 'Physics', color: '#4cc9f0', icon: '🧲' },
  morality_civics: { my: 'ကိုယ်ကျင့်တရားနှင့် ပြည်သူ့နီတိ', en: 'Morality & Civics', color: '#f4a261', icon: '🤝' },
  life_skills: { my: 'ဘဝတွက်တာ ကျွမ်းကျင်စရာ', en: 'Life Skills', color: '#e76f51', icon: '🌱' },
  physical_education: { my: 'ကာယပညာ', en: 'Physical Education', color: '#a8dadc', icon: '⚽' },
  visual_arts: { my: 'ပန်းချီ', en: 'Visual Arts', color: '#ff70a6', icon: '🎨' },
  performing_arts: { my: 'ဂီတ / အနုပညာ', en: 'Performing Arts', color: '#c77dff', icon: '🎵' },
  arts: { my: 'အနုပညာ', en: 'Arts', color: '#ffafcc', icon: '🎭' },
  ict: { my: 'ICT', en: 'ICT', color: '#90e0ef', icon: '💻' },
  optional_myanmar: { my: 'စိတ်ကြိုက်မြန်မာစာ', en: 'Optional Myanmar', color: '#ffc300', icon: '📜' },
  general: { my: 'အထွေထွေ', en: 'General', color: '#adb5bd', icon: '📚' },
}
export function subjectInfo(id: string) {
  return SUBJECTS[id] ?? { my: id, en: id, color: '#556', icon: '📘' }
}

export const KINDS: Record<string, Bi> = {
  textbook: { my: 'ဖတ်စာအုပ်', en: 'Textbook' },
  teacher_guide: { my: 'ဆရာလမ်းညွှန်', en: 'Teacher guide' },
  answer_guide: { my: 'အဖြေ', en: 'Answers' },
  workbook: { my: 'လက်တွေ့ / လေ့ကျင့်ခန်း', en: 'Workbook' },
  exam_guide: { my: 'စာမေးပွဲလမ်းညွှန်', en: 'Exam guide' },
  interactive: { my: 'အပြန်အလှန်', en: 'Interactive' },
  syllabus: { my: 'သင်ရိုးညွှန်းတမ်း', en: 'Syllabus' },
  learning_guide: { my: 'သင်ယူမှုလမ်းညွှန်', en: 'Learning guide' },
}
