import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GameGrid } from './src/components/grid/GameGrid';
import { Workspace } from './src/components/workspace/Workspace';
import { PlayControls } from './src/components/controls/PlayControls';
import { VictoryModal } from './src/components/modals/VictoryModal';
import { useGameStore } from './src/store/useGameStore';
import { LEVELS } from './src/core/levels';

export default function App() {
  const currentLevelIndex = useGameStore((s) => s.currentLevelIndex);
  const completedLevels = useGameStore((s) => s.completedLevels);
  const loadProgress = useGameStore((s) => s.loadProgress);
  const currentLevel = LEVELS[currentLevelIndex] || LEVELS[0];

  useEffect(() => {
    loadProgress();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Üst Başlık ve Bölüm Seçici */}
            <View style={styles.header}>
              <Text style={styles.levelBadge}>BÖLÜM {currentLevel.id}</Text>
              <Text style={styles.levelTitle}>{currentLevel.title}</Text>

              {/* Bölüm Butonları Barı */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.levelSelector}
              >
                {LEVELS.map((lvl, index) => {
                  const isSelected = index === currentLevelIndex;
                  const isCompleted = completedLevels.includes(lvl.id);

                  return (
                    <TouchableOpacity
                      key={lvl.id}
                      style={[
                        styles.levelDot,
                        isSelected && styles.levelDotActive,
                        isCompleted && !isSelected && styles.levelDotCompleted,
                      ]}
                      onPress={() => {
                        useGameStore.setState({
                          currentLevelIndex: index,
                          character: { ...lvl.start },
                          collectedStars: [],
                          workspaceBlocks: [],
                          activeBlockId: null,
                          status: 'IDLE',
                        });
                      }}
                    >
                      <Text
                        style={[
                          styles.levelDotText,
                          isSelected && styles.levelDotTextActive,
                          isCompleted && !isSelected && styles.levelDotTextCompleted,
                        ]}
                      >
                        {isCompleted && !isSelected ? `✓ #${lvl.id}` : `#${lvl.id}`}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* 5x5 Izgara */}
            <View style={styles.gridSection}>
              <GameGrid />
            </View>

            {/* Çalışma Alanı ve Komut Paleti */}
            <View style={styles.workspaceSection}>
              <Workspace />
            </View>

            {/* Oynat / Yenile / Sil Kontrolleri */}
            <View style={styles.controlsSection}>
              <PlayControls />
            </View>
          </ScrollView>

          {/* Zafer Modalı */}
          <VictoryModal />
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  levelBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6366F1',
    letterSpacing: 1.2,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
    marginBottom: 8,
  },
  levelSelector: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  levelDot: {
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelDotActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  levelDotCompleted: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  levelDotText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  levelDotTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  levelDotTextCompleted: {
    color: '#059669',
    fontWeight: '800',
  },
  gridSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  workspaceSection: {
    marginTop: 6,
  },
  controlsSection: {
    marginTop: 8,
  },
});