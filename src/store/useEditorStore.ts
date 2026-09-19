import { create } from 'zustand';
import { CommandType, Direction, LevelConfig, Position, PortalPair, TriggerPair } from '../core/types';
import { useGameStore } from './useGameStore';
import { haptics } from '../core/hapticManager';

export type BrushMode =
  | 'START'
  | 'TARGET'
  | 'WALL'
  | 'STAR'
  | 'KEY'
  | 'DOOR'
  | 'PORTAL_A'
  | 'PORTAL_B'
  | 'PLATE'
  | 'BARRIER'
  | 'ERASE';

export interface CustomLevelData {
  start: Position & { direction: Direction };
  target: Position;
  walls: Position[];
  stars: Position[];
  keys: Position[];
  doors: Position[];
  portals?: PortalPair[];
  triggers?: TriggerPair[];
  availableBlocks: CommandType[];
  maxBlocks: number;
}

interface EditorState {
  isEditorOpen: boolean;
  selectedBrush: BrushMode;
  customLevel: CustomLevelData;

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
  portals: [],
  triggers: [],
  availableBlocks: ['FORWARD', 'TURN_RIGHT', 'TURN_LEFT', 'REPEAT', 'IF_WALL'],
  maxBlocks: 16,
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
    const { start, target, walls, stars, keys, doors, portals = [], triggers = [] } = customLevel;
    haptics.triggerDrop();

    if (selectedBrush === 'ERASE') {
      set({
        customLevel: {
          ...customLevel,
          walls: walls.filter((w) => !(w.x === x && w.y === y)),
          stars: stars.filter((s) => !(s.x === x && s.y === y)),
          keys: keys.filter((k) => !(k.x === x && k.y === y)),
          doors: doors.filter((d) => !(d.x === x && d.y === y)),
          portals: portals.filter((p) => !(p.entry.x === x && p.entry.y === y) && !(p.exit.x === x && p.exit.y === y)),
          triggers: triggers.filter((t) => !(t.plate.x === x && t.plate.y === y) && !(t.barrier.x === x && t.barrier.y === y)),
        },
      });
      return;
    }

    if (selectedBrush === 'START') {
      if (start.x === x && start.y === y) {
        const dirs: Direction[] = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
        const nextDir = dirs[(dirs.indexOf(start.direction) + 1) % 4];
        set({ customLevel: { ...customLevel, start: { x, y, direction: nextDir } } });
      } else {
        set({ customLevel: { ...customLevel, start: { x, y, direction: 'RIGHT' } } });
      }
      return;
    }

    if (selectedBrush === 'TARGET') {
      if (start.x === x && start.y === y) return;
      set({ customLevel: { ...customLevel, target: { x, y } } });
      return;
    }

    if ((start.x === x && start.y === y) || (target.x === x && target.y === y)) return;

    if (selectedBrush === 'WALL') {
      const exists = walls.some((w) => w.x === x && w.y === y);
      set({
        customLevel: {
          ...customLevel,
          walls: exists ? walls.filter((w) => !(w.x === x && w.y === y)) : [...walls, { x, y }],
        },
      });
      return;
    }

    if (selectedBrush === 'STAR') {
      const exists = stars.some((s) => s.x === x && s.y === y);
      if (!exists && stars.length >= 3) return;
      set({
        customLevel: {
          ...customLevel,
          stars: exists ? stars.filter((s) => !(s.x === x && s.y === y)) : [...stars, { x, y }],
        },
      });
      return;
    }

    if (selectedBrush === 'KEY') {
      const exists = keys.some((k) => k.x === x && k.y === y);
      set({
        customLevel: {
          ...customLevel,
          keys: exists ? keys.filter((k) => !(k.x === x && k.y === y)) : [...keys, { x, y }],
        },
      });
      return;
    }

    if (selectedBrush === 'DOOR') {
      const exists = doors.some((d) => d.x === x && d.y === y);
      set({
        customLevel: {
          ...customLevel,
          doors: exists ? doors.filter((d) => !(d.x === x && d.y === y)) : [...doors, { x, y }],
        },
      });
      return;
    }

    // Portal A (Giriş)
    if (selectedBrush === 'PORTAL_A') {
      const currentPortal = portals[0] || { entry: { x, y }, exit: { x: 4, y: 0 } };
      set({
        customLevel: {
          ...customLevel,
          portals: [{ ...currentPortal, entry: { x, y } }],
        },
      });
      return;
    }

    // Portal B (Çıkış)
    if (selectedBrush === 'PORTAL_B') {
      const currentPortal = portals[0] || { entry: { x: 0, y: 0 }, exit: { x, y } };
      set({
        customLevel: {
          ...customLevel,
          portals: [{ ...currentPortal, exit: { x, y } }],
        },
      });
      return;
    }

    // Basınç Plakası (Düğme)
    if (selectedBrush === 'PLATE') {
      const currentTrigger = triggers[0] || { plate: { x, y }, barrier: { x: 2, y: 2 } };
      set({
        customLevel: {
          ...customLevel,
          triggers: [{ ...currentTrigger, plate: { x, y } }],
        },
      });
      return;
    }

    // Bariyer (Açılacak Yol)
    if (selectedBrush === 'BARRIER') {
      const currentTrigger = triggers[0] || { plate: { x: 0, y: 0 }, barrier: { x, y } };
      set({
        customLevel: {
          ...customLevel,
          triggers: [{ ...currentTrigger, barrier: { x, y } }],
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
        set({ customLevel: { ...customLevel, availableBlocks: blocks.filter((b) => b !== type) } });
      }
    } else {
      set({ customLevel: { ...customLevel, availableBlocks: [...blocks, type] } });
    }
  },

  setMaxBlocks: (count) => {
    const { customLevel } = get();
    set({ customLevel: { ...customLevel, maxBlocks: Math.max(1, count) } });
  },

  resetEditor: () => {
    haptics.triggerDrop();
    set({ selectedBrush: 'WALL', customLevel: { ...DEFAULT_LEVEL } });
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
      activePlates: [],
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