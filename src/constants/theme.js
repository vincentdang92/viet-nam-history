export const THEMES = {
  tran_dynasty: {
    primary: '#8B1A1A',
    secondary: '#D4A017',
    background: '#1A0F0A',
    cardBg: '#2D1F1A',
    text: '#F5E6D0',
    textMuted: '#A08070',
    danger: '#FF4444',
    safe: '#4CAF50',
    border: '#5A3020',
  },
}

export const getTheme = (chapter = 'tran_dynasty') => THEMES[chapter] ?? THEMES.tran_dynasty
