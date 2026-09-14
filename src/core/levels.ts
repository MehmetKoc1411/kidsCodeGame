import { LevelConfig } from './types';

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    title: 'Düz İlerle',
    gridSize: { rows: 5, cols: 5 },
    start: { x: 0, y: 2, direction: 'RIGHT' },
    target: { x: 4, y: 2 },
    walls: [],
    stars: [{ x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }],
    availableBlocks: ['FORWARD'],
    maxBlocks: 5,
  },
  {
    id: 2,
    title: 'Köşeyi Dön',
    gridSize: { rows: 5, cols: 5 },
    start: { x: 1, y: 1, direction: 'RIGHT' },
    target: { x: 3, y: 3 },
    walls: [{ x: 2, y: 1 }, { x: 2, y: 2 }],
    stars: [{ x: 3, y: 1 }, { x: 3, y: 2 }],
    availableBlocks: ['FORWARD', 'TURN_RIGHT', 'TURN_LEFT'],
    maxBlocks: 6,
  },
  {
    id: 3,
    title: 'Labirentten Kaçış',
    gridSize: { rows: 5, cols: 5 },
    start: { x: 0, y: 0, direction: 'RIGHT' },
    target: { x: 4, y: 4 },
    walls: [
      { x: 1, y: 0 }, { x: 3, y: 0 },
      { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 },
      { x: 1, y: 4 }, { x: 3, y: 4 },
    ],
    stars: [{ x: 2, y: 0 }, { x: 4, y: 2 }],
    availableBlocks: ['FORWARD', 'TURN_RIGHT', 'TURN_LEFT'],
    maxBlocks: 8,
  },
  {
    id: 4,
    title: 'Döngü Gücü: Düz Çizgi',
    gridSize: { rows: 5, cols: 5 },
    start: { x: 0, y: 4, direction: 'UP' },
    target: { x: 0, y: 0 },
    walls: [
      { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 },
    ],
    stars: [{ x: 0, y: 3 }, { x: 0, y: 2 }, { x: 0, y: 1 }],
    availableBlocks: ['FORWARD', 'REPEAT'],
    maxBlocks: 3,
  },
  {
    id: 5,
    title: 'Zikzak Merdiven',
    gridSize: { rows: 5, cols: 5 },
    start: { x: 0, y: 4, direction: 'RIGHT' },
    target: { x: 4, y: 0 },
    walls: [
      { x: 1, y: 3 }, { x: 3, y: 1 },
    ],
    stars: [{ x: 2, y: 2 }, { x: 4, y: 2 }],
    availableBlocks: ['FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'REPEAT'],
    maxBlocks: 8,
  },
  {
    id: 6,
    title: 'Büyük Kare Turu',
    gridSize: { rows: 5, cols: 5 },
    start: { x: 0, y: 0, direction: 'RIGHT' },
    target: { x: 1, y: 0 },
    walls: [
      { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 },
      { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 },
      { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 },
    ],
    stars: [{ x: 4, y: 0 }, { x: 4, y: 4 }, { x: 0, y: 4 }],
    availableBlocks: ['FORWARD', 'TURN_RIGHT', 'REPEAT'],
    maxBlocks: 7,
  },
  {
    id: 7,
    title: 'Spiral Girdap',
    gridSize: { rows: 5, cols: 5 },
    start: { x: 0, y: 0, direction: 'RIGHT' },
    target: { x: 2, y: 2 },
    walls: [
      { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 },
      { x: 1, y: 2 }, { x: 1, y: 3 },
      { x: 3, y: 2 }, { x: 3, y: 3 },
    ],
    stars: [{ x: 4, y: 0 }, { x: 4, y: 4 }, { x: 0, y: 4 }],
    availableBlocks: ['FORWARD', 'TURN_RIGHT', 'REPEAT'],
    maxBlocks: 10,
  },
  {
    id: 8,
    title: 'Yıldız Yağmuru',
    gridSize: { rows: 5, cols: 5 },
    start: { x: 2, y: 4, direction: 'UP' },
    target: { x: 2, y: 0 },
    walls: [
      { x: 1, y: 1 }, { x: 3, y: 1 },
      { x: 1, y: 3 }, { x: 3, y: 3 },
    ],
    stars: [
      { x: 0, y: 2 },
      { x: 2, y: 2 },
      { x: 4, y: 2 },
      { x: 2, y: 1 },
    ],
    availableBlocks: ['FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'REPEAT'],
    maxBlocks: 12,
  },
  {
    id: 9,
    title: 'İç İçe Zikzak',
    gridSize: { rows: 5, cols: 5 },
    start: { x: 0, y: 4, direction: 'UP' },
    target: { x: 4, y: 0 },
    walls: [
      { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 },
      { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 },
    ],
    stars: [{ x: 3, y: 1 }, { x: 1, y: 3 }],
    availableBlocks: ['FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'REPEAT'],
    maxBlocks: 10,
  },
{
    id: 10,
    title: 'Büyük Final: Kod Ustası',
    gridSize: { rows: 5, cols: 5 },
    start: { x: 0, y: 4, direction: 'UP' },
    target: { x: 4, y: 0 },
    // Geçitleri açık, S şeklinde rota sunan duvar dizilimi:
    walls: [
      { x: 1, y: 3 }, { x: 1, y: 2 }, { x: 1, y: 1 }, // Sol bariyer (alt ve üstten geçit açık)
      { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }, // Sağ bariyer (orta ve köşelerden dolanılabilir)
    ],
    stars: [
      { x: 0, y: 0 }, // Sol üst yıldız
      { x: 2, y: 2 }, // Merkez gizli yıldız
      { x: 4, y: 4 }, // Sağ alt köşe yıldızı
    ],
    availableBlocks: ['FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'REPEAT'],
    maxBlocks: 14,
  },
];