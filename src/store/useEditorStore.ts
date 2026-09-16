import { create } from 'zustand';
import { LevelConfig, Position, Direction } from '../core/types';
import { haptics } from '../core/hapticManager';

export type BrushMode = 'START' | 'TARGET' | 'WALL' | 'STAR' | 'ERASE';

interface EditorState {
  isEditorOpen: boolean;
  selectedBrush: BrushMode;
  customLevel: LevelConfig;
  setEditorOpen: (open: boolean) => void;
  setSelectedBrush: (brush: BrushMode) => void;
  handleCellPress: (x: number, y: number) => void;
  resetEditorGrid: () => void;
  exportLevelAsJSON: () => string;
}

const DEFAULT_CUSTOM_LEVEL: LevelConfig = {
  id: 999,
  title: 'Özel Tasarım Bölüm',
  gridSize: { rows: 5, cols: 5 },
  start: { x: 0, y: 4, direction: 'UP' },
  target: { x: 4, y: 0 },
  walls: [],
  stars: [],
  availableBlocks: ['FORWARD', 'TURN_RIGHT', 'TURN_LEFT', 'REPEAT', 'IF_WALL'],
  maxBlocks: 10,
};

export const useEditorStore = create<EditorState>((set, get) => ({
  isEditorOpen: false,
  selectedBrush: 'WALL',
  customLevel: { ...DEFAULT_CUSTOM_LEVEL },

  setEditorOpen: (open) => set({ isEditorOpen: open }),

  setSelectedBrush: (brush) => {
    haptics.triggerDrop();
    set({ selectedBrush: brush });
  },

  handleCellPress: (x, y) => {
    const { selectedBrush, customLevel } = get();
    haptics.triggerDrop();

    let newStart = { ...customLevel.start };
    let newTarget = { ...customLevel.target };
    let newWalls = [...customLevel.walls];
    let newStars = [...customLevel.stars];

    // Önceki izleri silme filtresi
    const removeCollisions = () => {
      newWalls = newWalls.filter((w) => !(w.x === x && w.y === y));
      newStars = newStars.filter((s) => !(s.x === x && s.y === y));
    };

    switch (selectedBrush) {
      case 'START':
        removeCollisions();
        newStart = { x, y, direction: 'UP' };
        break;
      case 'TARGET':
        removeCollisions();
        newTarget = { x, y };
        break;
      case 'WALL':
        if ((newStart.x === x && newStart.y === y) || (newTarget.x === x && newTarget.y === y)) break;
        removeCollisions();
        newWalls.push({ x, y });
        break;
      case 'STAR':
        if ((newStart.x === x && newStart.y === y) || (newTarget.x === x && newTarget.y === y)) break;
        removeCollisions();
        newStars.push({ x, y });
        break;
      case 'ERASE':
        removeCollisions();
        break;
    }

    set({
      customLevel: {
        ...customLevel,
        start: newStart,
        target: newTarget,
        walls: newWalls,
        stars: newStars,
      },
    });
  },

  resetEditorGrid: () => {
    haptics.triggerDrop();
    set({ customLevel: { ...DEFAULT_CUSTOM_LEVEL } });
  },

  exportLevelAsJSON: () => {
    return JSON.stringify(get().customLevel, null, 2);
  },
}));