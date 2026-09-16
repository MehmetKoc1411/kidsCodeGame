export interface AchievementDef {
  id: string;
  titleTR: string;
  titleEN: string;
  descTR: string;
  descEN: string;
  icon: string;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'FIRST_STEP',
    titleTR: 'İlk Kod Satırı',
    titleEN: 'First Line of Code',
    descTR: 'İlk bölümü başarıyla tamamla.',
    descEN: 'Complete your first level successfully.',
    icon: '🐣',
  },
  {
    id: 'KEY_MASTER',
    titleTR: 'Çilingir',
    titleEN: 'Locksmith',
    descTR: 'Bir anahtar topla ve kilitli kapıyı aç.',
    descEN: 'Collect a key and open a locked door.',
    icon: '🗝️',
  },
  {
    id: 'DEBUGGER',
    titleTR: 'Hata Avcısı',
    titleEN: 'Bug Hunter',
    descTR: 'Adım adım yürütme (Debug) özelliğini kullan.',
    descEN: 'Use the step-by-step debug feature.',
    icon: '🔍',
  },
  {
    id: 'STAR_COLLECTOR',
    titleTR: 'Yıldız Avcısı',
    titleEN: 'Star Collector',
    descTR: 'Toplamda en az 15 yıldız biriktir.',
    descEN: 'Collect at least 15 stars in total.',
    icon: '⭐',
  },
  {
    id: 'STUDIO_ARCHITECT',
    titleTR: 'Bölüm Mimarı',
    titleEN: 'Level Architect',
    descTR: 'Atölye modunda kendi bölümünü test et.',
    descEN: 'Test your own level in Studio mode.',
    icon: '📐',
  },
];