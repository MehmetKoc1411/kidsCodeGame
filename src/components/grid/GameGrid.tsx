import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useGameStore } from '../../store/useGameStore';
import { LEVELS } from '../../core/levels';

const { width } = Dimensions.get('window');
// Hem küçük ekranlarda hem tabletlerde taşmayı ve ezilmeyi önleyen dengeli boyut
const GRID_SIZE = Math.min(width - 40, 330);

export const GameGrid = () => {
  const currentLevelIndex = useGameStore((s) => s.currentLevelIndex);
  const character = useGameStore((s) => s.character);
  const collectedStars = useGameStore((s) => s.collectedStars);

  const level = LEVELS[currentLevelIndex];
  const cellSize = GRID_SIZE / level.gridSize.cols;

  const getRotationAngle = () => {
    switch (character.direction) {
      case 'UP': return '0deg';
      case 'RIGHT': return '90deg';
      case 'DOWN': return '180deg';
      case 'LEFT': return '270deg';
    }
  };

  return (
    <View style={[styles.board, { width: GRID_SIZE, height: GRID_SIZE }]}>
      {Array.from({ length: level.gridSize.rows }).map((_, r) => (
        <View key={`row-${r}`} style={[styles.row, { height: cellSize }]}>
          {Array.from({ length: level.gridSize.cols }).map((_, c) => {
            const isTarget = level.target.x === c && level.target.y === r;
            const isWall = level.walls.some((w) => w.x === c && w.y === r);
            const hasStar =
              level.stars.some((s) => s.x === c && s.y === r) &&
              !collectedStars.some((s) => s.x === c && s.y === r);
            const isChar = character.x === c && character.y === r;

            return (
              <View
                key={`cell-${r}-${c}`}
                style={[
                  styles.cell,
                  { width: cellSize, height: cellSize },
                  (r + c) % 2 === 0 ? styles.cellEven : styles.cellOdd,
                  isWall && styles.wallCell,
                  isTarget && styles.targetCell,
                ]}
              >
                {/* Hedef Bayrağı */}
                {isTarget && !isChar && (
                  <View style={styles.targetBadge}>
                    <Ionicons name="flag" size={cellSize * 0.42} color="#10B981" />
                  </View>
                )}

                {/* Engel / Bariyer Kutusu */}
                {isWall && (
                  <View style={styles.obstacleContainer}>
                    <MaterialCommunityIcons
                      name="cube-outline"
                      size={cellSize * 0.45}
                      color="#475569"
                    />
                  </View>
                )}

                {/* Yıldız */}
                {hasStar && !isChar && (
                  <View style={styles.starContainer}>
                    <Ionicons name="star" size={cellSize * 0.42} color="#FBBF24" />
                  </View>
                )}

                {/* Robot Karakter */}
                {isChar && (
                  <View
                    style={[
                      styles.characterAvatar,
                      {
                        width: cellSize * 0.74,
                        height: cellSize * 0.74,
                        borderRadius: (cellSize * 0.74) / 2,
                        transform: [{ rotate: getRotationAngle() }],
                      },
                    ]}
                  >
                    <View style={styles.directionNose} />
                    <FontAwesome5 name="robot" size={cellSize * 0.4} color="#FFFFFF" />
                  </View>
                )}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    elevation: 3,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellEven: {
    backgroundColor: '#FFFFFF',
  },
  cellOdd: {
    backgroundColor: '#F1F5F9',
  },
  wallCell: {
    backgroundColor: '#E2E8F0',
  },
  targetCell: {
    backgroundColor: '#ECFDF5',
  },
  obstacleContainer: {
    backgroundColor: '#CBD5E1',
    padding: 5,
    borderRadius: 8,
  },
  starContainer: {
    shadowColor: '#F59E0B',
    shadowOpacity: 0.35,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
  targetBadge: {
    padding: 5,
    borderRadius: 8,
    backgroundColor: '#D1FAE5',
  },
  characterAvatar: {
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    position: 'relative',
  },
  directionNose: {
    position: 'absolute',
    top: 2,
    width: 5,
    height: 5,
    backgroundColor: '#38BDF8',
    borderRadius: 2.5,
  },
});