export type ThemeId = 'CLASSIC' | 'NATURE' | 'SPACE' | 'DESERT' | 'ARCTIC' | 'CANDY';

export interface GridTheme {
  id: ThemeId;
  nameTR: string;
  nameEN: string;
  icon: string;
  boardBg: string;
  boardBorder: string;
  cellBg: string;
  cellAltBg: string;
  cellBorder: string;
  wallBg: string;
  wallBorder: string;
  wallShadow: string;
  doorBg: string;
  doorBorder: string;
  targetBg: string;
  targetBorder: string;
}

export const THEMES: Record<ThemeId, GridTheme> = {
  CLASSIC: {
    id: 'CLASSIC',
    nameTR: 'Laboratuvar',
    nameEN: 'Laboratory',
    icon: '🔬',
    boardBg: '#FFFFFF',
    boardBorder: '#E2E8F0',
    cellBg: '#F8FAFC',
    cellAltBg: '#F1F5F9',
    cellBorder: '#E2E8F0',
    wallBg: '#E2E8F0',
    wallBorder: '#CBD5E1',
    wallShadow: '#94A3B8',
    doorBg: '#FEF3C7',
    doorBorder: '#FDE68A',
    targetBg: '#ECFDF5',
    targetBorder: '#A7F3D0',
  },
  NATURE: {
    id: 'NATURE',
    nameTR: 'Çayır & Bahçe',
    nameEN: 'Meadow',
    icon: '🍀',
    boardBg: '#F0FDF4',
    boardBorder: '#BBF7D0',
    cellBg: '#DCFCE7',
    cellAltBg: '#D1FAE5',
    cellBorder: '#86EFAC',
    wallBg: '#78716C',
    wallBorder: '#57534E',
    wallShadow: '#44403C',
    doorBg: '#FEF08A',
    doorBorder: '#FACC15',
    targetBg: '#FEF3C7',
    targetBorder: '#FDE68A',
  },
  SPACE: {
    id: 'SPACE',
    nameTR: 'Uzay Üssü',
    nameEN: 'Space Station',
    icon: '🌌',
    boardBg: '#0F172A',
    boardBorder: '#1E293B',
    cellBg: '#1E293B',
    cellAltBg: '#182234',
    cellBorder: '#334155',
    wallBg: '#334155',
    wallBorder: '#475569',
    wallShadow: '#1E293B',
    doorBg: '#451A03',
    doorBorder: '#78350F',
    targetBg: '#064E3B',
    targetBorder: '#059669',
  },
  DESERT: {
    id: 'DESERT',
    nameTR: 'Çöl & Vaha',
    nameEN: 'Desert Oasis',
    icon: '🏜️',
    boardBg: '#FFFBEB',
    boardBorder: '#FDE68A',
    cellBg: '#FEF3C7',
    cellAltBg: '#FDE68A',
    cellBorder: '#FCD34D',
    wallBg: '#B45309',
    wallBorder: '#92400E',
    wallShadow: '#78350F',
    doorBg: '#E0E7FF',
    doorBorder: '#C7D2FE',
    targetBg: '#DCFCE7',
    targetBorder: '#86EFAC',
  },
  ARCTIC: {
    id: 'ARCTIC',
    nameTR: 'Kutup & Buzul',
    nameEN: 'Arctic Ice',
    icon: '❄️',
    boardBg: '#F0F9FF',
    boardBorder: '#BAE6FD',
    cellBg: '#E0F2FE',
    cellAltBg: '#BAE6FD',
    cellBorder: '#7DD3FC',
    wallBg: '#0284C7',
    wallBorder: '#0369A1',
    wallShadow: '#075985',
    doorBg: '#FEF08A',
    doorBorder: '#FDE047',
    targetBg: '#ECFDF5',
    targetBorder: '#A7F3D0',
  },
  CANDY: {
    id: 'CANDY',
    nameTR: 'Şeker Diyarı',
    nameEN: 'Candy Land',
    icon: '🍬',
    boardBg: '#FDF2F8',
    boardBorder: '#FBCFE8',
    cellBg: '#FCE7F3',
    cellAltBg: '#FBCFE8',
    cellBorder: '#F472B6',
    wallBg: '#DB2777',
    wallBorder: '#BE185D',
    wallShadow: '#9D174D',
    doorBg: '#FEF3C7',
    doorBorder: '#FDE68A',
    targetBg: '#F0FDF4',
    targetBorder: '#BBF7D0',
  },
};