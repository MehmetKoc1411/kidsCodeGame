import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useGameStore } from '../../store/useGameStore';
import { LEVELS } from '../../core/levels';

export const LevelSelector = () => {
  const currentLevelIndex = useGameStore((s) => s.currentLevelIndex);
  const setLevel = useGameStore((s) => s.resetGame);

  const selectLevel = (index: number) => {
    useGameStore.setState({
      currentLevelIndex: index,
      character: { ...LEVELS[index].start },
      collectedStars: [],
      workspaceBlocks: [],
      activeBlockId: null,
      status: 'IDLE',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollList}>
        {LEVELS.map((level, idx) => {
          const isSelected = currentLevelIndex === idx;
          return (
            <TouchableOpacity
              key={level.id}
              style={[styles.levelItem, isSelected && styles.activeLevelItem]}
              onPress={() => selectLevel(idx)}
            >
              <Text style={[styles.levelText, isSelected && styles.activeLevelText]}>
                #{level.id}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  scrollList: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 4,
  },
  levelItem: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeLevelItem: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
    elevation: 3,
  },
  levelText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  activeLevelText: {
    color: '#FFFFFF',
  },
});