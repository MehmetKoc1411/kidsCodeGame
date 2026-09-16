import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CodeBlock, CommandType, Direction, GameStatus, Position } from '../core/types';
import { LEVELS } from '../core/levels';
import { sounds } from '../core/soundManager';
import { haptics } from '../core/hapticManager';
import { Language } from '../core/translations';
import { CHARACTER_SKINS } from '../core/skins';
import { ThemeId } from '../core/themes';

const STORAGE_KEY = '@kids_code_completed_levels';
const LANG_STORAGE_KEY = '@kids_code_language';
const SKINS_STORAGE_KEY = '@kids_code_unlocked_skins';
const SELECTED_SKIN_KEY = '@kids_code_selected_skin';
const TOTAL_STARS_KEY = '@kids_code_total_stars';
const ACHIEVEMENTS_STORAGE_KEY = '@kids_code_achievements';
const THEME_STORAGE_KEY = '@kids_code_selected_theme';

interface FlattenedStep {
  blockId: string;
  type: 'FORWARD' | 'TURN_RIGHT' | 'TURN_LEFT';
}

interface GameState {
  currentLevelIndex: number;
  completedLevels: number[];
  character: Position & { direction: Direction };
  collectedStars: Position[];
  collectedKeys: Position[];
  openedDoors: Position[];
  workspaceBlocks: CodeBlock[];
  activeBlockId: string | null;
  status: GameStatus;
  earnedScoreStars: number;
  language: Language;

  // Tema Yönetimi
  selectedTheme: ThemeId;

  // Mağaza & Kostüm Durumları
  totalStars: number;
  unlockedSkins: string[];
  selectedSkin: string;
  isShopOpen: boolean;

  // Başarımlar
  unlockedAchievements: string[];
  isAchievementsOpen: boolean;

  // Adım Adım Yürütme (Debugger)
  debugSteps: FlattenedStep[];
  currentDebugIndex: number;

  // Eylemler
  setTheme: (theme: ThemeId) => void;
  setLanguage: (lang: Language) => void;
  setShopOpen: (open: boolean) => void;
  setAchievementsOpen: (open: boolean) => void;
  selectSkin: (skinId: string) => void;
  buySkin: (skinId: string) => boolean;
  unlockAchievement: (achId: string) => void;
  addBlock: (type: CommandType) => void;
  addChildBlock: (parentId: string, type: CommandType) => void;
  removeBlock: (id: string) => void;
  clearWorkspace: () => void;
  resetGame: () => void;
  nextLevel: () => void;
  runCode: () => Promise<void>;
  stepNext: () => Promise<void>;
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
    collectedKeys: [],
    openedDoors: [],
    workspaceBlocks: [],
    activeBlockId: null,
    status: 'IDLE',
    earnedScoreStars: 3,
    language: 'tr',
    selectedTheme: 'CLASSIC',

    totalStars: 0,
    unlockedSkins: ['ROBOT'],
    selectedSkin: 'ROBOT',
    isShopOpen: false,

    unlockedAchievements: [],
    isAchievementsOpen: false,

    debugSteps: [],
    currentDebugIndex: 0,

    setTheme: (theme) => {
      haptics.triggerDrop();
      set({ selectedTheme: theme });
      AsyncStorage.setItem(THEME_STORAGE_KEY, theme).catch(() => {});
    },

    setShopOpen: (open) => set({ isShopOpen: open }),
    setAchievementsOpen: (open) => set({ isAchievementsOpen: open }),

    unlockAchievement: (achId) => {
      const { unlockedAchievements } = get();
      if (!unlockedAchievements.includes(achId)) {
        const updated = [...unlockedAchievements, achId];
        set({ unlockedAchievements: updated });
        haptics.triggerSuccess();
        AsyncStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
      }
    },

    selectSkin: (skinId) => {
      haptics.triggerDrop();
      set({ selectedSkin: skinId });
      AsyncStorage.setItem(SELECTED_SKIN_KEY, skinId).catch(() => {});
    },

    buySkin: (skinId) => {
      const skin = CHARACTER_SKINS.find((s) => s.id === skinId);
      const { totalStars, unlockedSkins } = get();

      if (!skin || unlockedSkins.includes(skinId) || totalStars < skin.price) {
        haptics.triggerError();
        return false;
      }

      const updatedStars = totalStars - skin.price;
      const updatedSkins = [...unlockedSkins, skinId];

      haptics.triggerSuccess();
      set({
        totalStars: updatedStars,
        unlockedSkins: updatedSkins,
        selectedSkin: skinId,
      });

      AsyncStorage.setItem(TOTAL_STARS_KEY, updatedStars.toString()).catch(() => {});
      AsyncStorage.setItem(SKINS_STORAGE_KEY, JSON.stringify(updatedSkins)).catch(() => {});
      AsyncStorage.setItem(SELECTED_SKIN_KEY, skinId).catch(() => {});
      return true;
    },

    setLanguage: (lang) => {
      set({ language: lang });
      AsyncStorage.setItem(LANG_STORAGE_KEY, lang).catch(() => {});
    },

    loadProgress: async () => {
      try {
        const [savedLevels, savedLang, savedStars, savedSkins, savedSelected, savedAchs, savedTheme] =
          await Promise.all([
            AsyncStorage.getItem(STORAGE_KEY),
            AsyncStorage.getItem(LANG_STORAGE_KEY),
            AsyncStorage.getItem(TOTAL_STARS_KEY),
            AsyncStorage.getItem(SKINS_STORAGE_KEY),
            AsyncStorage.getItem(SELECTED_SKIN_KEY),
            AsyncStorage.getItem(ACHIEVEMENTS_STORAGE_KEY),
            AsyncStorage.getItem(THEME_STORAGE_KEY),
          ]);

        if (savedLevels) {
          const parsed = JSON.parse(savedLevels);
          if (Array.isArray(parsed) && parsed.length > 0) {
            set({ completedLevels: parsed });
          }
        }

        if (savedLang === 'tr' || savedLang === 'en') {
          set({ language: savedLang });
        }

        if (savedStars) {
          set({ totalStars: parseInt(savedStars, 10) || 0 });
        }

        if (savedSkins) {
          set({ unlockedSkins: JSON.parse(savedSkins) });
        }

        if (savedSelected) {
          set({ selectedSkin: savedSelected });
        }

        if (savedAchs) {
          set({ unlockedAchievements: JSON.parse(savedAchs) });
        }

        const validThemes = ['CLASSIC', 'NATURE', 'SPACE', 'DESERT', 'ARCTIC', 'CANDY'];
        if (savedTheme && validThemes.includes(savedTheme)) {
          set({ selectedTheme: savedTheme as ThemeId });
        }
      } catch {}
    },

    addBlock: (type) => {
      haptics.triggerDrop();
      const isContainer = type === 'REPEAT' || type === 'IF_WALL';
      const newBlock: CodeBlock = {
        id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        type,
        value: type === 'REPEAT' ? 3 : undefined,
        children: isContainer ? [] : undefined,
      };
      set((state) => ({
        workspaceBlocks: [...state.workspaceBlocks, newBlock],
        debugSteps: [],
        currentDebugIndex: 0,
      }));
    },

    addChildBlock: (parentId, type) => {
      haptics.triggerDrop();
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
        debugSteps: [],
        currentDebugIndex: 0,
      }));
    },

    removeBlock: (id) => {
      haptics.triggerDrop();
      set((state) => ({
        workspaceBlocks: state.workspaceBlocks
          .filter((b) => b.id !== id)
          .map((b) =>
            b.children ? { ...b, children: b.children.filter((c) => c.id !== id) } : b
          ),
        debugSteps: [],
        currentDebugIndex: 0,
      }));
    },

    clearWorkspace: () => {
      haptics.triggerDrop();
      set({ workspaceBlocks: [], debugSteps: [], currentDebugIndex: 0 });
    },

    resetGame: () => {
      const currentLevel = LEVELS[get().currentLevelIndex] || LEVELS[0];
      set({
        character: { ...currentLevel.start },
        collectedStars: [],
        collectedKeys: [],
        openedDoors: [],
        activeBlockId: null,
        status: 'IDLE',
        debugSteps: [],
        currentDebugIndex: 0,
      });
    },

    nextLevel: () => {
      const nextIdx = (get().currentLevelIndex + 1) % LEVELS.length;
      const nextLevel = LEVELS[nextIdx];

      set({
        currentLevelIndex: nextIdx,
        character: { ...nextLevel.start },
        collectedStars: [],
        collectedKeys: [],
        openedDoors: [],
        workspaceBlocks: [],
        activeBlockId: null,
        status: 'IDLE',
        debugSteps: [],
        currentDebugIndex: 0,
      });
    },

    stepNext: async () => {
      const {
        workspaceBlocks,
        currentLevelIndex,
        character,
        collectedStars,
        collectedKeys,
        openedDoors,
        debugSteps,
        currentDebugIndex,
        completedLevels,
        unlockAchievement,
      } = get();

      unlockAchievement('DEBUGGER');

      let steps = debugSteps;
      if (steps.length === 0) {
        if (workspaceBlocks.length === 0) return;

        const flatten = (blocks: CodeBlock[]): FlattenedStep[] => {
          const list: FlattenedStep[] = [];
          blocks.forEach((b) => {
            if (b.type === 'FORWARD' || b.type === 'TURN_RIGHT' || b.type === 'TURN_LEFT') {
              list.push({ blockId: b.id, type: b.type });
            } else if (b.type === 'REPEAT' && b.children) {
              const count = b.value || 3;
              for (let i = 0; i < count; i++) {
                list.push(...flatten(b.children));
              }
            } else if (b.type === 'IF_WALL' && b.children) {
              list.push(...flatten(b.children));
            }
          });
          return list;
        };

        steps = flatten(workspaceBlocks);
        set({ debugSteps: steps, currentDebugIndex: 0 });
      }

      if (currentDebugIndex >= steps.length) {
        set({ activeBlockId: null });
        return;
      }

      const step = steps[currentDebugIndex];
      set({ activeBlockId: step.blockId, status: 'RUNNING' });

      const level = LEVELS[currentLevelIndex] || LEVELS[0];
      let currentPos = { ...character };
      let newStars = [...collectedStars];
      let newKeys = [...collectedKeys];
      let newDoors = [...openedDoors];

      if (step.type === 'TURN_LEFT' || step.type === 'TURN_RIGHT') {
        currentPos.direction = getNextDirection(
          currentPos.direction,
          step.type === 'TURN_RIGHT' ? 'RIGHT' : 'LEFT'
        );
        sounds.play('STEP');
      } else if (step.type === 'FORWARD') {
        const next = getNextPosition(currentPos, currentPos.direction);

        const isOutOfBounds =
          next.x < 0 || next.x >= level.gridSize.cols ||
          next.y < 0 || next.y >= level.gridSize.rows;

        const isHitWall = level.walls.some((w) => w.x === next.x && w.y === next.y);

        const isDoorAhead = level.doors?.some(
          (d) => d.x === next.x && d.y === next.y && !newDoors.some((od) => od.x === d.x && od.y === d.y)
        );

        if (isDoorAhead) {
          if (newKeys.length > newDoors.length) {
            const doorObj = level.doors!.find((d) => d.x === next.x && d.y === next.y)!;
            newDoors.push(doorObj);
            unlockAchievement('KEY_MASTER');
            sounds.play('STAR');
          } else {
            sounds.play('FAIL');
            haptics.triggerError();
            set({ status: 'FAILED', activeBlockId: null });
            return;
          }
        }

        if (isOutOfBounds || isHitWall) {
          sounds.play('FAIL');
          haptics.triggerError();
          set({ status: 'FAILED', activeBlockId: null });
          return;
        }

        currentPos.x = next.x;
        currentPos.y = next.y;
        sounds.play('STEP');

        const keyHit = level.keys?.find(
          (k) => k.x === next.x && k.y === next.y && !newKeys.some((ck) => ck.x === k.x && ck.y === k.y)
        );
        if (keyHit) {
          newKeys.push(keyHit);
          sounds.play('STAR');
          haptics.triggerStar();
        }

        const starHit = level.stars.find(
          (s) => s.x === next.x && s.y === next.y && !newStars.some((c) => c.x === s.x && c.y === s.y)
        );
        if (starHit) {
          newStars.push(starHit);
          sounds.play('STAR');
          haptics.triggerStar();
        }
      }

      set({
        character: currentPos,
        collectedStars: newStars,
        collectedKeys: newKeys,
        openedDoors: newDoors,
        currentDebugIndex: currentDebugIndex + 1,
      });

      if (currentPos.x === level.target.x && currentPos.y === level.target.y) {
        sounds.play('WIN');
        haptics.triggerSuccess();
        unlockAchievement('FIRST_STEP');

        const updatedCompleted = Array.from(new Set([...completedLevels, level.id]));
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCompleted)).catch(() => {});

        set({
          status: 'SUCCESS',
          earnedScoreStars: Math.max(1, newStars.length),
          completedLevels: updatedCompleted,
        });
      }
    },

    runCode: async () => {
      const {
        workspaceBlocks,
        currentLevelIndex,
        resetGame,
        completedLevels,
        unlockAchievement,
      } = get();

      if (workspaceBlocks.length === 0) return;

      resetGame();
      set({ status: 'RUNNING' });

      const level = LEVELS[currentLevelIndex] || LEVELS[0];
      let currentPos = { ...level.start };
      let starsCollected: Position[] = [];
      let keysCollected: Position[] = [];
      let doorsOpened: Position[] = [];

      const executeBlock = async (block: CodeBlock): Promise<boolean> => {
        set({ activeBlockId: block.id });

        if (block.type === 'REPEAT' && block.children) {
          const repeatCount = block.value || 3;
          for (let i = 0; i < repeatCount; i++) {
            for (const child of block.children) {
              const ok = await executeBlock(child);
              if (!ok) return false;
            }
          }
          return true;
        }

        if (block.type === 'IF_WALL' && block.children) {
          const ahead = getNextPosition(currentPos, currentPos.direction);
          const isAheadWall =
            ahead.x < 0 || ahead.x >= level.gridSize.cols ||
            ahead.y < 0 || ahead.y >= level.gridSize.rows ||
            level.walls.some((w) => w.x === ahead.x && w.y === ahead.y);

          if (isAheadWall) {
            for (const child of block.children) {
              const ok = await executeBlock(child);
              if (!ok) return false;
            }
          }
          return true;
        }

        if (block.type === 'TURN_LEFT' || block.type === 'TURN_RIGHT') {
          currentPos.direction = getNextDirection(
            currentPos.direction,
            block.type === 'TURN_RIGHT' ? 'RIGHT' : 'LEFT'
          );
          sounds.play('STEP');
        } else if (block.type === 'FORWARD') {
          const next = getNextPosition(currentPos, currentPos.direction);

          const isOutOfBounds =
            next.x < 0 || next.x >= level.gridSize.cols ||
            next.y < 0 || next.y >= level.gridSize.rows;

          const isHitWall = level.walls.some((w) => w.x === next.x && w.y === next.y);

          const isDoorAhead = level.doors?.some(
            (d) => d.x === next.x && d.y === next.y && !doorsOpened.some((od) => od.x === d.x && od.y === d.y)
          );

          if (isDoorAhead) {
            if (keysCollected.length > doorsOpened.length) {
              const doorObj = level.doors!.find((d) => d.x === next.x && d.y === next.y)!;
              doorsOpened = [...doorsOpened, doorObj];
              unlockAchievement('KEY_MASTER');
              sounds.play('STAR');
            } else {
              sounds.play('FAIL');
              haptics.triggerError();
              set({ status: 'FAILED', activeBlockId: null });
              return false;
            }
          }

          if (isOutOfBounds || isHitWall) {
            sounds.play('FAIL');
            haptics.triggerError();
            set({ status: 'FAILED', activeBlockId: null });
            return false;
          }

          currentPos.x = next.x;
          currentPos.y = next.y;
          sounds.play('STEP');

          const keyHit = level.keys?.find(
            (k) => k.x === next.x && k.y === next.y && !keysCollected.some((ck) => ck.x === k.x && ck.y === k.y)
          );
          if (keyHit) {
            keysCollected = [...keysCollected, keyHit];
            sounds.play('STAR');
            haptics.triggerStar();
          }

          const starHit = level.stars.find(
            (s) => s.x === next.x && s.y === next.y && !starsCollected.some((c) => c.x === s.x && c.y === s.y)
          );
          if (starHit) {
            starsCollected = [...starsCollected, starHit];
            sounds.play('STAR');
            haptics.triggerStar();
          }
        }

        set({
          character: { ...currentPos },
          collectedStars: [...starsCollected],
          collectedKeys: [...keysCollected],
          openedDoors: [...doorsOpened],
        });

        await new Promise((res) => setTimeout(res, 380));
        return true;
      };

      for (const block of workspaceBlocks) {
        const ok = await executeBlock(block);
        if (!ok) return;
      }

      set({ activeBlockId: null });

      if (currentPos.x === level.target.x && currentPos.y === level.target.y) {
        sounds.play('WIN');
        haptics.triggerSuccess();
        unlockAchievement('FIRST_STEP');

        const updatedCompleted = Array.from(new Set([...completedLevels, level.id]));
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCompleted)).catch(() => {});

        const starsWon = Math.max(1, starsCollected.length);
        const newTotal = get().totalStars + starsWon;
        if (newTotal >= 15) {
          unlockAchievement('STAR_COLLECTOR');
        }

        AsyncStorage.setItem(TOTAL_STARS_KEY, newTotal.toString()).catch(() => {});

        set({
          status: 'SUCCESS',
          earnedScoreStars: starsWon,
          totalStars: newTotal,
          completedLevels: updatedCompleted,
        });
      } else {
        sounds.play('FAIL');
        haptics.triggerError();
        set({ status: 'FAILED' });
      }
    },
  };
});