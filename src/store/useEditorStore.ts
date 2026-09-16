import { create } from 'zustand';
import { CommandType, Direction, LevelConfig, Position } from '../core/types';
import { useGameStore } from './useGameStore';
import { haptics } from '../core/hapticManager';

export type BrushMode = 'START' | 'TARGET' | 'WALL' | 'STAR' | 'KEY' | 'DOOR' | 'ERASE';

export interface CustomLevelData {
  start: Position & { direction: Direction };
  target: Position;
  walls: Position[];
  stars: Position[];
  keys: Position[];
  doors: Position[];
  availableBlocks: CommandType[];
  maxBlocks: number;
}

interface EditorState {
  isEditorOpen: boolean;
  selectedBrush: BrushMode;
  customLevel: CustomLevelData;

  // Actions
  setEditorOpen: (open: boolean) => void;
  setSelectedBrush: (brush: BrushMode) => void;
  handleCellClick: (x: number, y: number) => void;
  toggleAvailableBlock: (type: CommandType) => void;
  setMaxBlocks: (count: number) => void;
  resetEditor: () => void;
  exportJSON: () => string;
  testCustomLevel: () => void;
}

const DEFAULT_LEVEL: CustomLevelData = {
  start: { x: 0, y: 0, direction: 'RIGHT' },
  target: { x: 4, y: 4 },
  walls: [],
  stars: [],
  keys: [],
  doors: [],
  availableBlocks: ['FORWARD', 'TURN_RIGHT', 'TURN_LEFT', 'REPEAT', 'IF_WALL'],
  maxBlocks: 10,
};

export const useEditorStore = create<EditorState>((set, get) => ({
  isEditorOpen: false,
  selectedBrush: 'WALL',
  customLevel: { ...DEFAULT_LEVEL },

  setEditorOpen: (open) => {
    haptics.triggerDrop();
    set({ isEditorOpen: open });
  },

  setSelectedBrush: (brush) => {
    haptics.triggerDrop();
    set({ selectedBrush: brush });
  },

  handleCellClick: (x, y) => {
    const { selectedBrush, customLevel } = get();
    const { start, target, walls, stars, keys, doors } = customLevel;
    haptics.triggerDrop();

    // Silgi Modu
    if (selectedBrush === 'ERASE') {
      set({
        customLevel: {
          ...customLevel,
          walls: walls.filter((w) => !(w.x === x && w.y === y)),
          stars: stars.filter((s) => !(s.x === x && s.y === y)),
          keys: keys.filter((k) => !(k.x === x && k.y === y)),
          doors: doors.filter((d) => !(d.x === x && d.y === y)),
        },
      });
      return;
    }

    // Başlangıç Noktası (Kendi üzerine tıklandıkça yön değiştirir)
    if (selectedBrush === 'START') {
      if (start.x === x && start.y === y) {
        const dirs: Direction[] = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
        const nextDir = dirs[(dirs.indexOf(start.direction) + 1) % 4];
        set({
          customLevel: {
            ...customLevel,
            start: { x, y, direction: nextDir },
          },
        });
      } else {
        set({
          customLevel: {
            ...customLevel,
            start: { x, y, direction: 'RIGHT' },
            walls: walls.filter((w) => !(w.x === x && w.y === y)),
            stars: stars.filter((s) => !(s.x === x && s.y === y)),
            keys: keys.filter((k) => !(k.x === x && k.y === y)),
            doors: doors.filter((d) => !(d.x === x && d.y === y)),
          },
        });
      }
      return;
    }

    // Hedef Bayrak
    if (selectedBrush === 'TARGET') {
      if (start.x === x && start.y === y) return;
      set({
        customLevel: {
          ...customLevel,
          target: { x, y },
          walls: walls.filter((w) => !(w.x === x && w.y === y)),
          stars: stars.filter((s) => !(s.x === x && s.y === y)),
          keys: keys.filter((k) => !(k.x === x && k.y === y)),
          doors: doors.filter((d) => !(d.x === x && d.y === y)),
        },
      });
      return;
    }

    // Başlangıç ve Bitiş hücresine nesne koymayı engelle
    if ((start.x === x && start.y === y) || (target.x === x && target.y === y)) {
      return;
    }

    // Duvar
    if (selectedBrush === 'WALL') {
      const exists = walls.some((w) => w.x === x && w.y === y);
      set({
        customLevel: {
          ...customLevel,
          walls: exists
            ? walls.filter((w) => !(w.x === x && w.y === y))
            : [...walls, { x, y }],
          stars: stars.filter((s) => !(s.x === x && s.y === y)),
          keys: keys.filter((k) => !(k.x === x && k.y === y)),
          doors: doors.filter((d) => !(d.x === x && d.y === y)),
        },
      });
      return;
    }

    // Yıldız (En fazla 3 adet)
    if (selectedBrush === 'STAR') {
      const exists = stars.some((s) => s.x === x && s.y === y);
      if (!exists && stars.length >= 3) return;
      set({
        customLevel: {
          ...customLevel,
          stars: exists
            ? stars.filter((s) => !(s.x === x && s.y === y))
            : [...stars, { x, y }],
          walls: walls.filter((w) => !(w.x === x && w.y === y)),
          keys: keys.filter((k) => !(k.x === x && k.y === y)),
          doors: doors.filter((d) => !(d.x === x && d.y === y)),
        },
      });
      return;
    }

    // Anahtar
    if (selectedBrush === 'KEY') {
      const exists = keys.some((k) => k.x === x && k.y === y);
      set({
        customLevel: {
          ...customLevel,
          keys: exists
            ? keys.filter((k) => !(k.x === x && k.y === y))
            : [...keys, { x, y }],
          walls: walls.filter((w) => !(w.x === x && w.y === y)),
          stars: stars.filter((s) => !(s.x === x && s.y === y)),
          doors: doors.filter((d) => !(d.x === x && d.y === y)),
        },
      });
      return;
    }

    // Kapı
    if (selectedBrush === 'DOOR') {
      const exists = doors.some((d) => d.x === x && d.y === y);
      set({
        customLevel: {
          ...customLevel,
          doors: exists
            ? doors.filter((d) => !(d.x === x && d.y === y))
            : [...doors, { x, y }],
          walls: walls.filter((w) => !(w.x === x && w.y === y)),
          stars: stars.filter((s) => !(s.x === x && s.y === y)),
          keys: keys.filter((k) => !(k.x === x && k.y === y)),
        },
      });
      return;
    }
  },

  toggleAvailableBlock: (type) => {
    const { customLevel } = get();
    haptics.triggerDrop();
    const blocks = customLevel.availableBlocks;
    if (blocks.includes(type)) {
      if (blocks.length > 1) {
        set({
          customLevel: {
            ...customLevel,
            availableBlocks: blocks.filter((b) => b !== type),
          },
        });
      }
    } else {
      set({
        customLevel: {
          ...customLevel,
          availableBlocks: [...blocks, type],
        },
      });
    }
  },

  setMaxBlocks: (count) => {
    const { customLevel } = get();
    set({
      customLevel: {
        ...customLevel,
        maxBlocks: Math.max(1, count),
      },
    });
  },

  resetEditor: () => {
    haptics.triggerDrop();
    set({
      selectedBrush: 'WALL',
      customLevel: { ...DEFAULT_LEVEL },
    });
  },

  exportJSON: () => {
    const { customLevel } = get();
    const config: LevelConfig = {
      id: 999,
      title: 'Özel Bölüm',
      gridSize: { rows: 5, cols: 5 },
      ...customLevel,
    };
    return JSON.stringify(config, null, 2);
  },

  testCustomLevel: () => {
    const { customLevel, setEditorOpen } = get();
    haptics.triggerSuccess();

    useGameStore.setState({
      character: { ...customLevel.start },
      collectedStars: [],
      collectedKeys: [],
      openedDoors: [],
      workspaceBlocks: [],
      activeBlockId: null,
      status: 'IDLE',
      debugSteps: [],
      currentDebugIndex: 0,
    });

    useGameStore.getState().unlockAchievement('STUDIO_ARCHITECT');
    setEditorOpen(false);
  },
}));