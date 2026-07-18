export const colors = {
  primary: {
    brand: '#4F46E5', // Royal Indigo (hsl(243, 75%, 59%))
    light: '#EEF2F6',
    dark: '#312E81',
  },
  accent: {
    teal: '#0D9488', // Vivid Teal (hsl(173, 80%, 40%))
    tealLight: '#CCFBF1',
  },
  background: {
    light: '#F8FAFC', // Slate 50
    cardLight: '#FFFFFF',
    dark: '#0F172A', // Slate 900
    cardDark: '#1E293B', // Slate 800
  },
  text: {
    primaryLight: '#0F172A', // Slate 900
    secondaryLight: '#475569', // Slate 600
    mutedLight: '#94A3B8', // Slate 400
    primaryDark: '#F8FAFC', // Slate 50
    secondaryDark: '#CBD5E1', // Slate 300
    mutedDark: '#64748B', // Slate 500
  },
  status: {
    success: '#10B981', // Green 500
    successBg: '#D1FAE5',
    warning: '#F59E0B', // Amber 500
    warningBg: '#FEF3C7',
    error: '#EF4444', // Red 500
    errorBg: '#FEE2E2',
    info: '#3B82F6', // Blue 500
    infoBg: '#DBEAFE',
  },
  border: {
    light: '#E2E8F0', // Slate 200
    dark: '#334155', // Slate 700
  },
};

export type ThemeColors = typeof colors;
