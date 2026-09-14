import React from 'react';
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
  const resetGame = useGameStore((s) => s.resetGame);
  const currentLevel = LEVELS[currentLevelIndex] || LEVELS[0];

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Üst Başlık ve Bölüm Seçimi */}
            <View style={styles.header}>
              <Text style={styles.levelBadge}>BÖLÜM {currentLevel.id}</Text>
              <Text style={styles.levelTitle}>{currentLevel.title}</Text>

              {/* Bölüm Butonları */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.levelSelector}
              >
                {LEVELS.map((lvl, index) => {
                  const isSelected = index === currentLevelIndex;
                  return (
                    <TouchableOpacity
                      key={lvl.id}
                      style={[
                        styles.levelDot,
                        isSelected && styles.levelDotActive,
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
                        ]}
                      >
                        #{lvl.id}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* 5x5 Izgara Alanı */}
            <View style={styles.gridSection}>
              <GameGrid />
            </View>

            {/* Sürükle-Bırak Çalışma Alanı ve Bloklar */}
            <View style={styles.workspaceSection}>
              <Workspace />
            </View>

            {/* Oynat / Sıfırla Kontrolleri */}
            <View style={styles.controlsSection}>
              <PlayControls />
            </View>
          </ScrollView>

          {/* Başarı Modalı */}
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
    paddingTop: 12,
    paddingBottom: 28,
  },
  header: {
    alignItems: 'center',
    marginBottom: 14,
  },
  levelBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6366F1',
    letterSpacing: 1.2,
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
    marginBottom: 10,
  },
  levelSelector: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  levelDot: {
    width: 44,
    height: 38,
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
  levelDotText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  levelDotTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  gridSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  workspaceSection: {
    marginTop: 8,
  },
  controlsSection: {
    marginTop: 10,
  },
});
