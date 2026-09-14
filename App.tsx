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
import { TRANSLATIONS } from './src/core/translations';

export default function App() {
  const currentLevelIndex = useGameStore((s) => s.currentLevelIndex);
  const completedLevels = useGameStore((s) => s.completedLevels);
  const language = useGameStore((s) => s.language);
  const setLanguage = useGameStore((s) => s.setLanguage);
  const loadProgress = useGameStore((s) => s.loadProgress);

  const currentLevel = LEVELS[currentLevelIndex] || LEVELS[0];
  const t = TRANSLATIONS[language];

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
            {/* Üst Bar: Bölüm Bilgisi ve Dil Değiştirici */}
            <View style={styles.header}>
              <View style={styles.topRow}>
                <View>
                  <Text style={styles.levelBadge}>
                    {t.levelPrefix} {currentLevel.id}
                  </Text>
                  <Text style={styles.levelTitle}>{currentLevel.title}</Text>
                </View>

                {/* TR / EN Dil Geçiş Butonu */}
                <TouchableOpacity
                  style={styles.langButton}
                  onPress={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.langButtonText}>
                    {language === 'tr' ? '🇬🇧 EN' : '🇹🇷 TR'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Bölüm Seçim Butonları Barı */}
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

            {/* Oynat / Yenile / Sil / Kod Önizleme Butonları */}
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
    paddingTop: 6,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  levelBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6366F1',
    letterSpacing: 1.2,
  },
  levelTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  langButton: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  langButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4F46E5',
  },
  levelSelector: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  levelDot: {
    paddingHorizontal: 11,
    height: 34,
    borderRadius: 10,
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