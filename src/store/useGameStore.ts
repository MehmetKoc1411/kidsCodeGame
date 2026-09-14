import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CodeBlock, CommandType, Direction, GameStatus, Position } from '../core/types';
import { LEVELS } from '../core/levels';
import { sounds } from '../core/soundManager';

const STORAGE_KEY = '@kids_code_completed_levels';

interface GameState {
  currentLevelIndex: number;
  completedLevels: number[];
  character: Position & { direction: Direction };
  collectedStars: Position[];
  workspaceBlocks: CodeBlock[];
  activeBlockId: string | null;
  status: GameStatus;

  // Eylemler
  addBlock: (type: CommandType) => void;
  addChildBlock: (parentId: string, type: CommandType) => void;
  removeBlock: (id: string) => void;
  clearWorkspace: () => void;
  resetGame: () => void;
  nextLevel: () => void;
  runCode: () => Promise<void>;
  loadProgress: () => Promise<void>;
}

const getNextDirection = (current: Direction, turn: 'LEFT' | 'RIGHT'): Direction => {
  const directions: Direction[] = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
  const index = directions.indexOf(current);
  return turn === 'RIGHT' ? directions[(index + 1) % 4] : directions[(index + 3) % 4];
};

const getNextPosition = (pos: Position, dir: Direction): Position => {
  switch (dir) {
    case 'UP': return { x: pos.x, y: pos.y - 1 };
    case 'DOWN': return { x: pos.x, y: pos.y + 1 };
    case 'LEFT': return { x: pos.x - 1, y: pos.y };
    case 'RIGHT': return { x: pos.x + 1, y: pos.y };
  }
};

export const useGameStore = create<GameState>((set, get) => {
  const initialLevel = LEVELS[0];

  return {
    currentLevelIndex: 0,
    completedLevels: [1],
    character: { ...initialLevel.start },
    collectedStars: [],
    workspaceBlocks: [],
    activeBlockId: null,
    status: 'IDLE',

    loadProgress: async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            set({ completedLevels: parsed });
          }
        }
      } catch {}
    },

    addBlock: (type) => {
      const newBlock: CodeBlock = {
        id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        type,
        value: type === 'REPEAT' ? 3 : undefined,
        children: type === 'REPEAT' ? [] : undefined,
      };
      set((state) => ({ workspaceBlocks: [...state.workspaceBlocks, newBlock] }));
    },

    addChildBlock: (parentId, type) => {
      const newChild: CodeBlock = {
        id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        type,
      };
      set((state) => ({
        workspaceBlocks: state.workspaceBlocks.map((b) =>
          b.id === parentId
            ? { ...b, children: [...(b.children || []), newChild] }
            : b
        ),
      }));
    },

    removeBlock: (id) => {
      set((state) => ({
        workspaceBlocks: state.workspaceBlocks
          .filter((b) => b.id !== id)
          .map((b) =>
            b.children ? { ...b, children: b.children.filter((c) => c.id !== id) } : b
          ),
      }));
    },

    clearWorkspace: () => {
      set({ workspaceBlocks: [] });
    },

    resetGame: () => {
      const currentLevel = LEVELS[get().currentLevelIndex];
      set({
        character: { ...currentLevel.start },
        collectedStars: [],
        activeBlockId: null,
        status: 'IDLE',
      });
    },

    nextLevel: () => {
      const nextIdx = (get().currentLevelIndex + 1) % LEVELS.length;
      const nextLevel = LEVELS[nextIdx];
      const nextId = nextLevel.id;

      const updatedCompleted = Array.from(new Set([...get().completedLevels, nextId]));
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCompleted)).catch(() => {});

      set({
        currentLevelIndex: nextIdx,
        completedLevels: updatedCompleted,
        character: { ...nextLevel.start },
        collectedStars: [],
        workspaceBlocks: [],
        activeBlockId: null,
        status: 'IDLE',
      });
    },

    runCode: async () => {
      const { workspaceBlocks, currentLevelIndex, resetGame } = get();
      if (workspaceBlocks.length === 0) return;

      resetGame();
      set({ status: 'RUNNING' });

      const level = LEVELS[currentLevelIndex];
      let currentPos = { ...level.start };
      let starsCollected: Position[] = [];

      const queue: { id: string; type: CommandType }[] = [];
      const parseBlock = (block: CodeBlock) => {
        if (block.type === 'REPEAT' && block.children) {
          const repeatCount = block.value || 3;
          for (let i = 0; i < repeatCount; i++) {
            for (const child of block.children) {
              parseBlock(child);
            }
          }
        } else {
          queue.push({ id: block.id, type: block.type });
        }
      };

      workspaceBlocks.forEach(parseBlock);

      for (const cmd of queue) {
        set({ activeBlockId: cmd.id });

        if (cmd.type === 'TURN_LEFT' || cmd.type === 'TURN_RIGHT') {
          currentPos.direction = getNextDirection(
            currentPos.direction,
            cmd.type === 'TURN_RIGHT' ? 'RIGHT' : 'LEFT'
          );
          sounds.play('STEP');
        } else if (cmd.type === 'FORWARD') {
          const next = getNextPosition(currentPos, currentPos.direction);

          const isOutOfBounds =
            next.x < 0 || next.x >= level.gridSize.cols ||
            next.y < 0 || next.y >= level.gridSize.rows;

          const isHitWall = level.walls.some((w) => w.x === next.x && w.y === next.y);

          if (isOutOfBounds || isHitWall) {
            sounds.play('FAIL');
            set({ status: 'FAILED', activeBlockId: null });
            return;
          }

          currentPos.x = next.x;
          currentPos.y = next.y;
          sounds.play('STEP');

          const starHit = level.stars.find(
            (s) => s.x === next.x && s.y === next.y && !starsCollected.some((c) => c.x === s.x && c.y === s.y)
          );
          if (starHit) {
            starsCollected = [...starsCollected, starHit];
            sounds.play('STAR');
          }
        }

        set({
          character: { ...currentPos },
          collectedStars: [...starsCollected],
        });

        await new Promise((res) => setTimeout(res, 400));
      }

      set({ activeBlockId: null });

      if (currentPos.x === level.target.x && currentPos.y === level.target.y) {
        sounds.play('WIN');
        set({ status: 'SUCCESS' });
      } else {
        sounds.play('FAIL');
        set({ status: 'FAILED' });
      }
    },
  };
});