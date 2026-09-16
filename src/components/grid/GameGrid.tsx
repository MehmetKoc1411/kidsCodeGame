import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useGameStore } from '../../store/useGameStore';
import { LEVELS } from '../../core/levels';
import { Direction } from '../../core/types';
import { THEMES } from '../../core/themes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_PADDING = 12;
const BOARD_SIZE = Math.min(SCREEN_WIDTH - 32, 350);
const CELL_SIZE = (BOARD_SIZE - GRID_PADDING * 2) / 5;

const DIRECTION_ROTATION: Record<Direction, number> = {
  UP: 0,
  RIGHT: 90,
  DOWN: 180,
  LEFT: 270,
};

const SKIN_ICONS: Record<string, string> = {
  ROBOT: '🤖',
  CAT: '🐱',
  DOG: '🐶',
  UFO: '🛸',
};

export const GameGrid = () => {
  const currentLevelIndex = useGameStore((s) => s.currentLevelIndex);
  const character = useGameStore((s) => s.character);
  const collectedStars = useGameStore((s) => s.collectedStars);
  const collectedKeys = useGameStore((s) => s.collectedKeys);
  const openedDoors = useGameStore((s) => s.openedDoors);
  const selectedSkin = useGameStore((s) => s.selectedSkin);
  const selectedTheme = useGameStore((s) => s.selectedTheme);

  const level = LEVELS[currentLevelIndex] || LEVELS[0];
  const theme = THEMES[selectedTheme] || THEMES.CLASSIC;

  const posX = useSharedValue(character.x * CELL_SIZE);
  const posY = useSharedValue(character.y * CELL_SIZE);
  const rotation = useSharedValue(DIRECTION_ROTATION[character.direction]);

  useEffect(() => {
    posX.value = withSpring(character.x * CELL_SIZE, { damping: 14, stiffness: 140 });
    posY.value = withSpring(character.y * CELL_SIZE, { damping: 14, stiffness: 140 });
    rotation.value = withSpring(DIRECTION_ROTATION[character.direction], {
      damping: 12,
      stiffness: 150,
    });
  }, [character.x, character.y, character.direction]);

  const animatedCharacterStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: posX.value },
      { translateY: posY.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const activeIcon = SKIN_ICONS[selectedSkin] || '🤖';

  return (
    <View
      style={[
        styles.boardContainer,
        { backgroundColor: theme.boardBg, borderColor: theme.boardBorder },
      ]}
    >
      <View style={styles.gridWrapper}>
        {Array.from({ length: 5 }).map((_, r) => (
          <View key={`row_${r}`} style={styles.row}>
            {Array.from({ length: 5 }).map((_, c) => {
              const isWall = level.walls.some((w) => w.x === c && w.y === r);
              const isTarget = level.target.x === c && level.target.y === r;

              const isStar = level.stars.some(
                (s) =>
                  s.x === c &&
                  s.y === r &&
                  !collectedStars.some((cs) => cs.x === c && cs.y === r)
              );

              const isKey = level.keys?.some(
                (k) =>
                  k.x === c &&
                  k.y === r &&
                  !collectedKeys.some((ck) => ck.x === c && ck.y === r)
              );

              const isDoor = level.doors?.some(
                (d) =>
                  d.x === c &&
                  d.y === r &&
                  !openedDoors.some((od) => od.x === c && od.y === r)
              );

              const isAlternate = (r + c) % 2 === 1;

              return (
                <View
                  key={`cell_${c}_${r}`}
                  style={[
                    styles.cell,
                    {
                      backgroundColor: isAlternate ? theme.cellAltBg : theme.cellBg,
                      borderColor: theme.cellBorder,
                    },
                    isWall && {
                      backgroundColor: theme.wallBg,
                      borderColor: theme.wallBorder,
                      borderBottomColor: theme.wallShadow,
                      borderBottomWidth: 3,
                    },
                    isDoor && {
                      backgroundColor: theme.doorBg,
                      borderColor: theme.doorBorder,
                      borderBottomWidth: 3,
                    },
                    isTarget && {
                      backgroundColor: theme.targetBg,
                      borderColor: theme.targetBorder,
                    },
                  ]}
                >
                  {isWall && <Text style={styles.wallEmoji}>🧱</Text>}
                  {isDoor && <Text style={styles.doorEmoji}>🚪</Text>}
                  {isKey && <Text style={styles.keyEmoji}>🔑</Text>}
                  {isStar && <Text style={styles.starEmoji}>⭐</Text>}
                  {isTarget && !isStar && <Text style={styles.targetEmoji}>🚩</Text>}
                </View>
              );
            })}
          </View>
        ))}

        <Animated.View
          style={[
            styles.characterContainer,
            { width: CELL_SIZE, height: CELL_SIZE },
            animatedCharacterStyle,
          ]}
        >
          <View style={styles.characterBubble}>
            <Text style={styles.characterEmoji}>{activeIcon}</Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  boardContainer: {
    padding: GRID_PADDING,
    borderRadius: 24,
    shadowColor: '#64748B',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
    borderWidth: 1.5,
  },
  gridWrapper: {
    position: 'relative',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 12,
    margin: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  wallEmoji: {
    fontSize: CELL_SIZE * 0.44,
  },
  doorEmoji: {
    fontSize: CELL_SIZE * 0.46,
  },
  keyEmoji: {
    fontSize: CELL_SIZE * 0.44,
  },
  starEmoji: {
    fontSize: CELL_SIZE * 0.44,
  },
  targetEmoji: {
    fontSize: CELL_SIZE * 0.46,
  },
  characterContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  characterBubble: {
    width: CELL_SIZE * 0.82,
    height: CELL_SIZE * 0.82,
    borderRadius: (CELL_SIZE * 0.82) / 2,
    backgroundColor: '#EEF2FF',
    borderWidth: 2,
    borderColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  characterEmoji: {
    fontSize: CELL_SIZE * 0.5,
  },
});