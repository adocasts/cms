enum CaptionLanguages {
  ENGLISH = 'en',
  SPANISH = 'es',
  FRENCH = 'fr',
  GERMAN = 'de',
  PORTUGUESE = 'pt',
  PORTUGUESE_BRAZIL = 'pb',
  POLISH = 'pl',
}

export const CaptionLanguageDesc: Record<CaptionLanguages, string> = {
  [CaptionLanguages.ENGLISH]: 'English',
  [CaptionLanguages.SPANISH]: 'Spanish',
  [CaptionLanguages.FRENCH]: 'French',
  [CaptionLanguages.GERMAN]: 'German',
  [CaptionLanguages.PORTUGUESE]: 'Portuguese',
  [CaptionLanguages.PORTUGUESE_BRAZIL]: 'Portuguese Brazil',
  [CaptionLanguages.POLISH]: 'Polish',
}

export default CaptionLanguages
