import type { Bi } from '../i18n'

export type CurriculumChapter = {
  id: string
  grade: string
  subject: string
  chapter: number | string
  title: Bi
  topics?: Bi[]
  lesson_id?: string
}

export const CURRICULUM_CHAPTERS: CurriculumChapter[] = [
  // ---------------------------------------------------------------- Grade 10 Chemistry
  {
    id: 'g10-chem-ch1',
    grade: '10',
    subject: 'chemistry',
    chapter: 1,
    title: { my: 'အက်တမ်၏ ဖွဲ့စည်းပုံ', en: 'Structure of the Atom' },
    topics: [
      { my: 'ပရိုတွန်၊ နျူထရွန်နှင့် အီလက်ထရွန်', en: 'Protons, neutrons and electrons' },
      { my: 'အီလက်ထရွန်ခွံများ', en: 'Electron shells and configuration' },
      { my: 'အက်တမ်နံပါတ်နှင့် ဒြပ်ထုနံပါတ်', en: 'Atomic number and mass number' },
    ],
    lesson_id: 'g10-chemistry-atomic-structure',
  },
  {
    id: 'g10-chem-ch2',
    grade: '10',
    subject: 'chemistry',
    chapter: 2,
    title: { my: 'ဒြပ်စင်အလှည့်ကျဇယား', en: 'The Periodic Table' },
    topics: [
      { my: 'အုပ်စုများနှင့် အလှည့်များ', en: 'Groups and periods' },
      { my: 'သတ္တုများနှင့် သတ္တုမဟုတ်သော ဒြပ်စင်များ', en: 'Metals and non-metals' },
      { my: 'အလှည့်ကျ ဂုဏ်သတ္တိများ', en: 'Periodic trends' },
    ],
  },
  {
    id: 'g10-chem-ch3',
    grade: '10',
    subject: 'chemistry',
    chapter: 3,
    title: { my: 'ဓာတုစည်းနှောင်မှုနှင့် ဒြပ်ပေါင်းများ', en: 'Chemical Bonding and Compounds' },
    topics: [
      { my: 'အိုင်းယွန်းစည်းနှောင်မှု', en: 'Ionic bonding' },
      { my: 'ကိုဗေးလန့်စည်းနှောင်မှု', en: 'Covalent bonding' },
      { my: 'ဓာတုဖော်မြူလာများ', en: 'Chemical formulas' },
    ],
  },
  {
    id: 'g10-chem-ch4',
    grade: '10',
    subject: 'chemistry',
    chapter: 4,
    title: { my: 'ဓာတုဓာတ်ပြုခြင်းနှင့် ညီမျှခြင်းများ', en: 'Chemical Reactions and Equations' },
    topics: [
      { my: 'ဓာတုညီမျှခြင်း ညှိခြင်း', en: 'Balancing chemical equations' },
      { my: 'ဓာတ်ပြုမှု အမျိုးအစားများ', en: 'Types of chemical reactions' },
    ],
  },
  {
    id: 'g10-chem-ch5',
    grade: '10',
    subject: 'chemistry',
    chapter: 5,
    title: { my: 'အက်ဆစ်၊ ဘေ့စ်နှင့် ဆားများ', en: 'Acids, Bases and Salts' },
    topics: [
      { my: 'အက်ဆစ်နှင့် ဘေ့စ် ဂုဏ်သတ္တိများ', en: 'Properties of acids and bases' },
      { my: 'pH စကေး', en: 'The pH scale' },
      { my: 'ဆားများ ထုတ်လုပ်ခြင်း', en: 'Preparation of salts' },
    ],
  },
  {
    id: 'g10-chem-ch6',
    grade: '10',
    subject: 'chemistry',
    chapter: 6,
    title: { my: 'သတ္တုများ၏ ဓာတ်ပြုနိုင်စွမ်း', en: 'Reactivity of Metals' },
    topics: [
      { my: 'သတ္တုများ၏ ဓာတ်ပြုမှုအစဉ်', en: 'Reactivity series' },
      { my: 'သတ္တုထုတ်ယူခြင်း', en: 'Extraction of metals' },
    ],
  },

  // Grade 10 Physics
  {
    id: 'g10-phy-ch1',
    grade: '10',
    subject: 'physics',
    chapter: 1,
    title: { my: 'တိုင်းတာမှုနှင့် ယူနစ်များ', en: 'Measurement and Units' },
    topics: [
      { my: 'အခြေခံနှင့် တွဲဖက်ယူနစ်များ', en: 'Base and derived units' },
      { my: 'ဗာနီယာ ကာလီပါနှင့် မိုက်ခရိုမီတာ', en: 'Vernier calipers and micrometer' },
    ],
  },
  {
    id: 'g10-phy-ch2',
    grade: '10',
    subject: 'physics',
    chapter: 2,
    title: { my: 'မျဉ်းဖြောင့် ရွေ့လျားမှု', en: 'Motion in a Straight Line' },
    topics: [
      { my: 'အရွေ့၊ အလျင်နှင့် အရှိန်', en: 'Displacement, velocity and acceleration' },
      { my: 'ရွေ့လျားမှု ညီမျှခြင်းများ', en: 'Equations of motion' },
    ],
  },
  {
    id: 'g10-phy-ch3',
    grade: '10',
    subject: 'physics',
    chapter: 3,
    title: { my: 'အားနှင့် နယူတန်၏ နိယာမများ', en: 'Forces and Newton’s Laws' },
    topics: [
      { my: 'နယူတန်၏ ရွေ့လျားမှုနိယာမများ', en: 'Newton’s laws of motion' },
      { my: 'ဆွဲငင်အားနှင့် ဒြပ်ထု', en: 'Gravity and mass' },
      { my: 'ပွတ်တိုက်အား', en: 'Friction' },
    ],
  },
  {
    id: 'g10-phy-ch4',
    grade: '10',
    subject: 'physics',
    chapter: 4,
    title: { my: 'အလုပ်၊ စွမ်းအင်နှင့် စွမ်းအား', en: 'Work, Energy and Power' },
    topics: [
      { my: 'အရွေ့စွမ်းအင်နှင့် တည်အင်', en: 'Kinetic and potential energy' },
      { my: 'စွမ်းအင်တည်မြဲမှု နိယာမ', en: 'Conservation of energy' },
    ],
  },
  {
    id: 'g10-phy-ch5',
    grade: '10',
    subject: 'physics',
    chapter: 5,
    title: { my: 'ရိုးရှင်းသော ချိန်သီးနှင့် လည်မှုသက်ရောက်မှု', en: 'The Simple Pendulum and Turning Effects' },
    topics: [
      { my: 'ချိန်သီး၏ လွှဲကာလ', en: 'Period of a pendulum' },
      { my: 'အား၏ လည်မှုသက်ရောက်မှု (Moment)', en: 'Moment of a force' },
      { my: 'ဗဟိုဆွဲအား', en: 'Centre of gravity' },
    ],
    lesson_id: 'g10-physics-simple-pendulum',
  },
  {
    id: 'g10-phy-ch6',
    grade: '10',
    subject: 'physics',
    chapter: 6,
    title: { my: 'ဖိအားနှင့် သိပ်သည်းဆ', en: 'Pressure and Density' },
    topics: [
      { my: 'အရည်ဖိအားနှင့် လေထုဖိအား', en: 'Liquid pressure and atmospheric pressure' },
      { my: 'ဟိုက်ဒရောလစ်စနစ်', en: 'Hydraulic systems' },
    ],
  },
  {
    id: 'g10-phy-ch7',
    grade: '10',
    subject: 'physics',
    chapter: 7,
    title: { my: 'အပူစွမ်းအင်နှင့် အပူချိန်', en: 'Thermal Energy and Heat' },
    topics: [
      { my: 'အပူကူးယူခြင်းနည်းလမ်းများ', en: 'Conduction, convection and radiation' },
      { my: 'အပူချိန်တိုင်း ကိရိယာများ', en: 'Thermometers' },
    ],
  },
  {
    id: 'g10-phy-ch8',
    grade: '10',
    subject: 'physics',
    chapter: 8,
    title: { my: 'အလင်းနှင့် အလင်းပြန်ခြင်း', en: 'Light and Optics' },
    topics: [
      { my: 'အလင်းပြန်ခြင်းနှင့် အလင်းယိုင်ခြင်း', en: 'Reflection and refraction' },
      { my: 'မှန်ဘီလူးများ', en: 'Lenses and image formation' },
    ],
  },

  // Grade 10 Biology
  {
    id: 'g10-bio-ch1',
    grade: '10',
    subject: 'biology',
    chapter: 1,
    title: { my: 'ဆဲလ်တည်ဆောက်ပုံနှင့် သက်ရှိများ', en: 'Cell Structure and Organisation' },
    topics: [
      { my: 'အပင်ဆဲလ်နှင့် တိရစ္ဆာန်ဆဲလ်', en: 'Plant and animal cells' },
      { my: 'အဏုကြည့်မှန်ပြောင်း', en: 'Microscopy' },
      { my: 'တစ်ရှူးများနှင့် အင်္ဂါအစိတ်အပိုင်းများ', en: 'Tissues and organs' },
    ],
  },
  {
    id: 'g10-bio-ch2',
    grade: '10',
    subject: 'biology',
    chapter: 2,
    title: { my: 'အာဟာရရယူခြင်းနှင့် အစာခြေစနစ်', en: 'Nutrition and Digestive Systems' },
    topics: [
      { my: 'အလင်းမှီစုဖွဲ့ခြင်း', en: 'Photosynthesis' },
      { my: 'လူ့အစာခြေစနစ်နှင့် အင်ဇိုင်းများ', en: 'Human digestion and enzymes' },
    ],
  },
  {
    id: 'g10-bio-ch3',
    grade: '10',
    subject: 'biology',
    chapter: 3,
    title: { my: 'သယ်ယူပို့ဆောင်ရေးစနစ်', en: 'Transport in Living Things' },
    topics: [
      { my: 'အပင်များတွင် ရေနှင့် သတ္တုဓာတ် သယ်ယူခြင်း', en: 'Xylem and phloem in plants' },
      { my: 'လူ့သွေးလှည့်ပတ်စနစ်နှင့် နှလုံး', en: 'Circulatory system and heart' },
    ],
  },
  {
    id: 'g10-bio-ch4',
    grade: '10',
    subject: 'biology',
    chapter: 4,
    title: { my: 'အသက်ရှူခြင်းနှင့် ဓာတ်ငွေ့ဖလှယ်ခြင်း', en: 'Respiration and Gas Exchange' },
    topics: [
      { my: 'လေရှူအသက်ရှူခြင်းနှင့် လေမဲ့အသက်ရှူခြင်း', en: 'Aerobic and anaerobic respiration' },
      { my: 'အဆုတ်နှင့် အသက်ရှူလမ်းကြောင်း', en: 'Lungs and breathing' },
    ],
  },
  {
    id: 'g10-bio-ch5',
    grade: '10',
    subject: 'biology',
    chapter: 5,
    title: { my: 'မျိုးပွားခြင်းနှင့် မျိုးရိုးဗီဇ', en: 'Reproduction and Genetics' },
    topics: [
      { my: 'အပွင့်ရှိအပင်များ မျိုးပွားခြင်း', en: 'Reproduction in flowering plants' },
      { my: 'DNA နှင့် မျိုးရိုးဗီဇဆင်းသက်ခြင်း', en: 'DNA and inheritance' },
    ],
  },

  // Grade 10 Mathematics
  {
    id: 'g10-math-ch1',
    grade: '10',
    subject: 'mathematics',
    chapter: 1,
    title: { my: 'အစုနှင့် ဖန်ရှင်', en: 'Sets and Functions' },
    topics: [
      { my: 'ဗင်းပုံချပ်များ', en: 'Venn diagrams' },
      { my: 'ဖန်ရှင်အမျိုးအစားများ', en: 'Types of functions' },
    ],
  },
  {
    id: 'g10-math-ch2',
    grade: '10',
    subject: 'mathematics',
    chapter: 2,
    title: { my: 'နှစ်ထပ်ညီမျှခြင်းများ', en: 'Quadratic Equations' },
    topics: [
      { my: 'ဆခွဲကိန်းခွဲခြင်းနှင့် ဖော်မြူလာ', en: 'Factorisation and quadratic formula' },
      { my: 'ပါရာဘိုလာ ဂရပ်များ', en: 'Parabolic graphs' },
    ],
  },
  {
    id: 'g10-math-ch3',
    grade: '10',
    subject: 'mathematics',
    chapter: 3,
    title: { my: 'မက်ထရစ်နှင့် ဒစ်တာမီနန့်', en: 'Matrices and Determinants' },
    topics: [
      { my: 'မက်ထရစ် ပေါင်းခြင်း၊ နုတ်ခြင်း၊ မြှောက်ခြင်း', en: 'Matrix operations' },
      { my: 'ပြောင်းပြန်မက်ထရစ်', en: 'Inverse matrix' },
    ],
  },
  {
    id: 'g10-math-ch4',
    grade: '10',
    subject: 'mathematics',
    chapter: 4,
    title: { my: 'ကိန်းစဉ်နှင့် ကိန်းတန်း', en: 'Sequences and Series' },
    topics: [
      { my: 'အာရစ်မက်တစ် ကိန်းစဉ်', en: 'Arithmetic progression' },
      { my: 'ဂျီဩမေတြစ် ကိန်းစဉ်', en: 'Geometric progression' },
    ],
  },
  {
    id: 'g10-math-ch5',
    grade: '10',
    subject: 'mathematics',
    chapter: 5,
    title: { my: 'တြိဂိုနိုမေတြီ', en: 'Trigonometry' },
    topics: [
      { my: 'ဆိုင်း၊ ကိုဆိုင်းနှင့် တန်ဂျန့်', en: 'Sine, cosine and tangent' },
      { my: 'ထောင့်မှန်တြိဂံများ တွက်ချက်ခြင်း', en: 'Solving right triangles' },
    ],
  },
  {
    id: 'g10-math-ch6',
    grade: '10',
    subject: 'mathematics',
    chapter: 6,
    title: { my: 'ဂျီဩမေတြီ အခြေခံသဘောတရားများ', en: 'Coordinate Geometry and Circles' },
    topics: [
      { my: 'အမှတ်နှစ်ခုကြား အကွာအဝေးနှင့် လျှောစောက်', en: 'Distance and gradient' },
      { my: 'စက်ဝိုင်းဆိုင်ရာ သီအိုရမ်များ', en: 'Circle theorems' },
    ],
  },

  // ---------------------------------------------------------------- Grade 6 Science
  {
    id: 'g6-sci-ch1',
    grade: '6',
    subject: 'science',
    chapter: 1,
    title: { my: 'သက်ရှိဆဲလ်များနှင့် အပင်များ', en: 'Living Cells and Plants' },
    topics: [
      { my: 'ဆဲလ်တည်ဆောက်ပုံ', en: 'Cell structure' },
      { my: 'အပင်အစိတ်အပိုင်းများ', en: 'Plant organs' },
    ],
  },
  {
    id: 'g6-sci-ch2',
    grade: '6',
    subject: 'science',
    chapter: 2,
    title: { my: 'ဒြပ်ဝတ္ထုများ၏ အခြေအနေများနှင့် ပြောင်းလဲမှု', en: 'States of Matter and Changes' },
    topics: [
      { my: 'အစိုင်အခဲ၊ အရည်နှင့် ဓာတ်ငွေ့', en: 'Solids, liquids and gases' },
      { my: 'ရုပ်ပိုင်းဆိုင်ရာနှင့် ဓာတုပြောင်းလဲမှုများ', en: 'Physical and chemical changes' },
    ],
  },
  {
    id: 'g6-sci-ch3',
    grade: '6',
    subject: 'science',
    chapter: 3,
    title: { my: 'နေအဖွဲ့အစည်းနှင့် အာကာသ', en: 'The Solar System and Space' },
    topics: [
      { my: 'နေနှင့် ဂြိုဟ်ကြီး ၈ လုံး', en: 'The Sun and 8 planets' },
      { my: 'ကမ္ဘာ၏ လည်ပတ်မှုနှင့် နေ့ညဖြစ်ပေါ်ခြင်း', en: 'Earth rotation and day-night cycle' },
      { my: 'လနှင့် လဆန်းလဆုတ်အဆင့်များ', en: 'The Moon and lunar phases' },
    ],
    lesson_id: 'g6-science-solar-system',
  },
  {
    id: 'g6-sci-ch4',
    grade: '6',
    subject: 'science',
    chapter: 4,
    title: { my: 'အားနှင့် ရွေ့လျားမှု', en: 'Forces and Motion' },
    topics: [
      { my: 'အားအမျိုးအစားများ', en: 'Types of forces' },
      { my: 'ဆွဲငင်အားနှင့် ပွတ်တိုက်အား', en: 'Gravity and friction' },
    ],
  },
  {
    id: 'g6-sci-ch5',
    grade: '6',
    subject: 'science',
    chapter: 5,
    title: { my: 'စွမ်းအင်နှင့် စွမ်းအင်အရင်းအမြစ်များ', en: 'Energy and Energy Sources' },
    topics: [
      { my: 'စွမ်းအင်ပုံစံများ', en: 'Forms of energy' },
      { my: 'ပြန်လည်ပြည့်ဖြိုးမြဲစွမ်းအင်', en: 'Renewable energy' },
    ],
  },

  // ---------------------------------------------------------------- Grade 7 to 9 Middle School
  {
    id: 'g7-sci-ch1',
    grade: '7',
    subject: 'science',
    chapter: 1,
    title: { my: 'သက်ရှိများနှင့် ဂေဟစနစ်', en: 'Living Organisms and Ecosystems' },
    topics: [{ my: 'အစာကွင်းဆက်နှင့် အစာကွန်ရက်', en: 'Food chains and food webs' }],
  },
  {
    id: 'g7-sci-ch2',
    grade: '7',
    subject: 'science',
    chapter: 2,
    title: { my: 'ဒြပ်စင်၊ ဒြပ်ပေါင်းနှင့် အရောများ', en: 'Elements, Compounds and Mixtures' },
    topics: [{ my: 'အရောများကို ခွဲထုတ်ခြင်း', en: 'Separating mixtures' }],
  },
  {
    id: 'g7-sci-ch3',
    grade: '7',
    subject: 'science',
    chapter: 3,
    title: { my: 'အပူကူးယူခြင်းနှင့် အပူချိန်', en: 'Heat Transfer and Temperature' },
    topics: [{ my: 'အပူလျှောက်ကူးခြင်း၊ စီးကူးခြင်းနှင့် ဖြာထွက်ခြင်း', en: 'Conduction, convection and radiation' }],
  },

  {
    id: 'g8-sci-ch1',
    grade: '8',
    subject: 'science',
    chapter: 1,
    title: { my: 'လူ့ခန္ဓာကိုယ်စနစ်များ', en: 'Human Body Systems' },
    topics: [{ my: 'အရိုးစနစ်၊ ကြွက်သားစနစ်နှင့် အာရုံကြောစနစ်', en: 'Skeletal, muscular and nervous systems' }],
  },
  {
    id: 'g8-sci-ch2',
    grade: '8',
    subject: 'science',
    chapter: 2,
    title: { my: 'ဓာတုဓာတ်ပြုမှုများနှင့် ဒြပ်ထုတည်မြဲမှု', en: 'Chemical Reactions and Conservation of Mass' },
    topics: [{ my: 'ဓာတုပြောင်းလဲမှု လက္ခဏာများ', en: 'Indicators of chemical change' }],
  },
  {
    id: 'g8-sci-ch3',
    grade: '8',
    subject: 'science',
    chapter: 3,
    title: { my: 'အလင်းနှင့် အသံလှိုင်းများ', en: 'Light and Sound Waves' },
    topics: [{ my: 'အသံလှိုင်း ဂုဏ်သတ္တိများနှင့် အလင်းပြန့်လွင့်ခြင်း', en: 'Sound properties and propagation of light' }],
  },

  {
    id: 'g9-sci-ch1',
    grade: '9',
    subject: 'science',
    chapter: 1,
    title: { my: 'မျိုးရိုးဗီဇဆင်းသက်ခြင်းနှင့် ဆဲလ်ကွဲပွားခြင်း', en: 'Genetics and Cell Division' },
    topics: [{ my: 'မိုင်တိုးဆစ်နှင့် မီယိုးဆစ်', en: 'Mitosis and meiosis' }],
  },
  {
    id: 'g9-sci-ch2',
    grade: '9',
    subject: 'science',
    chapter: 2,
    title: { my: 'လျှပ်စစ်နှင့် သံလိုက်စွမ်းအင်', en: 'Electricity and Magnetism' },
    topics: [{ my: 'လျှပ်စစ်ပတ်လမ်းများနှင့် သံလိုက်စက်ကွင်း', en: 'Electric circuits and magnetic fields' }],
  },
  {
    id: 'g9-sci-ch3',
    grade: '9',
    subject: 'science',
    chapter: 3,
    title: { my: 'ကမ္ဘာမြေဖွဲ့စည်းပုံနှင့် ကျောက်လွှာများ', en: 'Earth Structure and Rocks' },
    topics: [{ my: 'ကျောက်ဖြစ်စဉ်နှင့် မြေငလျင်', en: 'Rock cycle and earthquakes' }],
  },

  // ---------------------------------------------------------------- Primary School (Grades 1 to 5)
  {
    id: 'g5-sci-ch1',
    grade: '5',
    subject: 'science',
    chapter: 1,
    title: { my: 'အပင်များ၏ အစိတ်အပိုင်းများနှင့် ကြီးထွားမှု', en: 'Plant Parts and Growth' },
    topics: [{ my: 'အမြစ်၊ ပင်စည်၊ အရွက်နှင့် အပွင့်', en: 'Roots, stems, leaves and flowers' }],
  },
  {
    id: 'g5-sci-ch2',
    grade: '5',
    subject: 'science',
    chapter: 2,
    title: { my: 'တိရစ္ဆာန်များ၏ နေထိုင်မှုနှင့် အစားအစာ', en: 'Animals and Their Habitats' },
    topics: [{ my: 'ကျောရိုးရှိနှင့် ကျောရိုးမဲ့ သတ္တဝါများ', en: 'Vertebrates and invertebrates' }],
  },
  {
    id: 'g5-sci-ch3',
    grade: '5',
    subject: 'science',
    chapter: 3,
    title: { my: 'အလင်း၊ အရိပ်နှင့် အသံ', en: 'Light, Shadows and Sound' },
    topics: [{ my: 'အလင်းဖြတ်သန်းမှုနှင့် အရိပ်ဖြစ်ပေါ်ခြင်း', en: 'Light transmission and shadows' }],
  },
  {
    id: 'g5-sci-ch4',
    grade: '5',
    subject: 'science',
    chapter: 4,
    title: { my: 'လျှပ်စစ်သဘောတရားနှင့် သံလိုက်', en: 'Simple Electricity and Magnets' },
    topics: [{ my: 'ရိုးရှင်းသော လျှပ်စစ်ပတ်လမ်း', en: 'Simple electrical circuits' }],
  },

  {
    id: 'g4-sci-ch1',
    grade: '4',
    subject: 'science',
    chapter: 1,
    title: { my: 'ကျွန်ုပ်တို့၏ ခန္ဓာကိုယ်နှင့် ကျန်းမာရေး', en: 'Our Body and Health' },
    topics: [{ my: 'အာရုံခံအင်္ဂါ ၅ ပါးနှင့် အာဟာရ', en: 'The five senses and healthy diet' }],
  },
  {
    id: 'g4-sci-ch2',
    grade: '4',
    subject: 'science',
    chapter: 2,
    title: { my: 'အပင်များနှင့် သဘာဝပတ်ဝန်းကျင်', en: 'Plants and the Environment' },
    topics: [{ my: 'အပင်များ ရေနှင့် နေရောင်ခြည် လိုအပ်ပုံ', en: 'Plant needs for water and sunlight' }],
  },
  {
    id: 'g4-sci-ch3',
    grade: '4',
    subject: 'science',
    chapter: 3,
    title: { my: 'ရေ၊ လေနှင့် မြေထု', en: 'Water, Air and Soil' },
    topics: [{ my: 'ရေသံသရာနှင့် လေထုသန့်ရှင်းရေး', en: 'The water cycle and clean air' }],
  },

  {
    id: 'g3-sci-ch1',
    grade: '3',
    subject: 'science',
    chapter: 1,
    title: { my: 'သက်ရှိများနှင့် သက်မဲ့များ', en: 'Living and Non-living Things' },
    topics: [{ my: 'သက်ရှိများ၏ လက္ခဏာများ', en: 'Characteristics of life' }],
  },
  {
    id: 'g2-sci-ch1',
    grade: '2',
    subject: 'science',
    chapter: 1,
    title: { my: 'ပတ်ဝန်းကျင်ရှိ အရာဝတ္ထုများ', en: 'Materials Around Us' },
    topics: [{ my: 'သစ်သား၊ ပလတ်စတစ်၊ သတ္တု', en: 'Wood, plastic, metal and glass' }],
  },
  {
    id: 'g1-sci-ch1',
    grade: '1',
    subject: 'science',
    chapter: 1,
    title: { my: 'ကျွန်ုပ်တို့နှင့် ပတ်ဝန်းကျင်သဘာဝ', en: 'Ourselves and Nature' },
    topics: [{ my: 'ခန္ဓာကိုယ်အစိတ်အပိုင်းများ', en: 'Parts of the body' }],
  },
  {
    id: 'gkg-sci-ch1',
    grade: 'KG',
    subject: 'science',
    chapter: 1,
    title: { my: 'သဘာဝကို ရှာဖွေစူးစမ်းခြင်း', en: 'Exploring Nature' },
    topics: [{ my: 'အရောင်များ၊ ပုံသဏ္ဌာန်များနှင့် ရာသီဥတု', en: 'Colours, shapes and weather' }],
  },

  // ---------------------------------------------------------------- High School Grades 11 & 12
  {
    id: 'g11-chem-ch1',
    grade: '11',
    subject: 'chemistry',
    chapter: 1,
    title: { my: 'ဓာတ်ငွေ့နိယာမများနှင့် အခြေအနေများ', en: 'Gas Laws and States of Matter' },
    topics: [{ my: 'ဘွိုင်လ်နိယာမနှင့် ချားလ်စ်နိယာမ', en: 'Boyle’s law and Charles’s law' }],
  },
  {
    id: 'g11-chem-ch2',
    grade: '11',
    subject: 'chemistry',
    chapter: 2,
    title: { my: 'အပူဓာတုဗေဒနှင့် စွမ်းအင်ပြောင်းလဲမှု', en: 'Thermochemistry and Enthalpy' },
    topics: [{ my: 'အပူစုပ်ဓာတ်ပြုမှုနှင့် အပူထုတ်ဓာတ်ပြုမှု', en: 'Endothermic and exothermic reactions' }],
  },
  {
    id: 'g11-chem-ch3',
    grade: '11',
    subject: 'chemistry',
    chapter: 3,
    title: { my: 'အော်ဂဲနစ်ဓာတုဗေဒ အခြေခံ', en: 'Introduction to Organic Chemistry' },
    topics: [{ my: 'ဟိုက်ဒရိုကာဗွန်များ — အယ်လ်ကိန်း၊ အယ်လ်ကင်း', en: 'Hydrocarbons: alkanes and alkenes' }],
  },

  {
    id: 'g11-phy-ch1',
    grade: '11',
    subject: 'physics',
    chapter: 1,
    title: { my: 'ဗဟိုဆွဲအားနှင့် စက်ဝိုင်းပုံရွေ့လျားမှု', en: 'Circular Motion and Gravitation' },
    topics: [{ my: 'ဗဟိုဆွဲအရှိန်နှင့် ဂြိုဟ်တုများ', en: 'Centripetal force and satellites' }],
  },
  {
    id: 'g11-phy-ch2',
    grade: '11',
    subject: 'physics',
    chapter: 2,
    title: { my: 'လျှပ်စစ်စက်ကွင်းနှင့် လျှပ်စစ်စီးဆင်းမှု', en: 'Electric Fields and Current Electricity' },
    topics: [{ my: 'အုမ်းနိယာမနှင့် ခုခံမှု', en: 'Ohm’s law and electrical resistance' }],
  },
  {
    id: 'g11-phy-ch3',
    grade: '11',
    subject: 'physics',
    chapter: 3,
    title: { my: 'သံလိုက်စက်ကွင်းနှင့် လျှပ်စစ်သံလိုက်ညှို့မှု', en: 'Magnetic Fields and Electromagnetic Induction' },
    topics: [{ my: 'ဖာရာဒေးနိယာမနှင့် လျှပ်စစ်မော်တာ', en: 'Faraday’s law and electric motors' }],
  },

  {
    id: 'g12-chem-ch1',
    grade: '12',
    subject: 'chemistry',
    chapter: 1,
    title: { my: 'ဓာတုမျှခြေနှင့် အလျင်', en: 'Chemical Equilibrium and Kinetics' },
    topics: [{ my: 'မျှခြေကိန်းသေနှင့် ဓာတ်ပြုနှုန်း', en: 'Equilibrium constant and reaction rates' }],
  },
  {
    id: 'g12-chem-ch2',
    grade: '12',
    subject: 'chemistry',
    chapter: 2,
    title: { my: 'အဆင့်မြင့် အော်ဂဲနစ်ဒြပ်ပေါင်းများ', en: 'Functional Groups and Polymers' },
    topics: [{ my: 'အယ်လ်ကိုဟော၊ အယ်လ်ဒီဟိုက်နှင့် ပေါ်လီမာများ', en: 'Alcohols, aldehydes and polymers' }],
  },

  {
    id: 'g12-phy-ch1',
    grade: '12',
    subject: 'physics',
    chapter: 1,
    title: { my: 'အီလက်ထရွန်းနစ်နှင့် လျှပ်စစ်သံလိုက်လှိုင်းများ', en: 'Electronics and Electromagnetic Waves' },
    topics: [{ my: 'ဆီမီးကွန်ဒပ်တာ၊ ဒိုင်အုတ်နှင့် ထရန်စစ္စတာ', en: 'Semiconductors, diodes and transistors' }],
  },
  {
    id: 'g12-phy-ch2',
    grade: '12',
    subject: 'physics',
    chapter: 2,
    title: { my: 'နျူကလီးယား ရူပဗေဒနှင့် ရေဒီယိုသတ္တိကြွခြင်း', en: 'Nuclear Physics and Radioactivity' },
    topics: [{ my: 'အယ်လ်ဖာ၊ ဘီတာ၊ ဂမ်မာ ဖြာထွက်ခြင်းနှင့် နျူကလီးယားစွမ်းအင်', en: 'Alpha, beta, gamma decay and nuclear energy' }],
  },
]
