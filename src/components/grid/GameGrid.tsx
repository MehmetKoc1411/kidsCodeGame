import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useGameStore } from '../../store/useGameStore';
import { LEVELS } from '../../core/levels';

const { width } = Dimensions.get('window');
const GRID_SIZE = width - 36;

export const GameGrid = () => {
  const currentLevelIndex = useGameStore((s) => s.currentLevelIndex);
  const character = useGameStore((s) => s.character);
  const collectedStars = useGameStore((s) => s.collectedStars);

  const level = LEVELS[currentLevelIndex];
  const cellSize = GRID_SIZE / level.gridSize.cols;

  // Akıcı hareket ve dönüş değerleri
  const charX = useSharedValue(character.x * cellSize);
  const charY = useSharedValue(character.y * cellSize);
  const charRotate = useSharedValue(0);

  // Açı hesaplama (Her zaman en kısa yoldan dönmesi için)
  const getTargetAngle = () => {
    switch (character.direction) {
      case 'UP': return 0;
      case 'RIGHT': return 90;
      case 'DOWN': return 180;
      case 'LEFT': return 270;
    }
  };

  useEffect(() => {
    // Koordinat geçişi: Yaylanarak yumuşak kayma
    charX.value = withSpring(character.x * cellSize, { damping: 14, stiffness: 100 });
    charY.value = withSpring(character.y * cellSize, { damping: 14, stiffness: 100 });

    // Açı geçişi
    charRotate.value = withTiming(getTargetAngle(), {
      duration: 250,
      easing: Easing.out(Easing.quad),
    });
  }, [character.x, character.y, character.direction, cellSize]);

  const animatedBotStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: charX.value },
        { translateY: charY.value },
        { rotate: `${charRotate.value}deg` },
      ],
    };
  });

  return (
    <View style={[styles.boardContainer, { width: GRID_SIZE, height: GRID_SIZE }]}>
      {/* Zemin Izgarası */}
      {Array.from({ length: level.gridSize.rows }).map((_, r) => (
        <View key={`row-${r}`} style={styles.row}>
          {Array.from({ length: level.gridSize.cols }).map((_, c) => {
            const isTarget = level.target.x === c && level.target.y === r;
            const isWall = level.walls.some((w) => w.x === c && w.y === r);
            const hasStar =
              level.stars.some((s) => s.x === c && s.y === r) &&
              !collectedStars.some((s) => s.x === c && s.y === r);

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
                {isTarget && (
                  <View style={styles.targetBadge}>
                    <Ionicons name="flag" size={cellSize * 0.45} color="#10B981" />
                  </View>
                )}

                {isWall && (
                  <View style={styles.obstacleContainer}>
                    <MaterialCommunityIcons name="cube-outline" size={cellSize * 0.48} color="#64748B" />
                  </View>
                )}

                {hasStar && (
                  <View style={styles.starContainer}>
                    <Ionicons name="star" size={cellSize * 0.46} color="#F59E0B" />
                  </View>
                )}
              </View>
            );
          })}
        </View>
      ))}

      {/* Akıcı Hareket Eden Karakter Katmanı */}
      <Animated.View
        style={[
          styles.botWrapper,
          { width: cellSize, height: cellSize },
          animatedBotStyle,
        ]}
      >
        <View
          style={[
            styles.characterAvatar,
            {
              width: cellSize * 0.78,
              height: cellSize * 0.78,
              borderRadius: (cellSize * 0.78) / 2,
            },
          ]}
        >
          <View style={styles.directionNose} />
          <FontAwesome5 name="robot" size={cellSize * 0.42} color="#FFFFFF" />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  boardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#E2E8F0',
    borderBottomWidth: 7, // 3D zemin hissi
    position: 'relative',
    elevation: 6,
    shadowColor: '#64748B',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  row: {
    flex: 1,
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
    backgroundColor: '#F8FAFC',
  },
  wallCell: {
    backgroundColor: '#E2E8F0',
  },
  targetCell: {
    backgroundColor: '#ECFDF5',
  },
  obstacleContainer: {
    backgroundColor: '#CBD5E1',
    padding: 6,
    borderRadius: 10,
    borderBottomWidth: 3,
    borderColor: '#94A3B8',
  },
  starContainer: {
    shadowColor: '#F59E0B',
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  targetBadge: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: '#D1FAE5',
  },
  botWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  characterAvatar: {
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    borderBottomWidth: 4,
    borderColor: '#4338CA', // Buton basma derinliği
    position: 'relative',
  },
  directionNose: {
    position: 'absolute',
    top: 2,
    width: 6,
    height: 6,
    backgroundColor: '#38BDF8',
    borderRadius: 3,
  },
});