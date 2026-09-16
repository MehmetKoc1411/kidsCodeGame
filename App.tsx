import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GameGrid } from './src/components/grid/GameGrid';
import { Workspace } from './src/components/workspace/Workspace';
import { PlayControls } from './src/components/controls/PlayControls';
import { VictoryModal } from './src/components/modals/VictoryModal';
import { LevelEditorModal } from './src/components/editor/LevelEditorModal';
import { ShopModal } from './src/components/modals/ShopModal';
import { ThemeModal } from './src/components/modals/ThemeModal';
import { AchievementsModal } from './src/components/modals/AchievementsModal';
import { CodePreviewModal } from './src/components/workspace/CodePreviewModal';
import { useGameStore } from './src/store/useGameStore';
import { useEditorStore } from './src/store/useEditorStore';
import { LEVELS } from './src/core/levels';
import { TRANSLATIONS } from './src/core/translations';

export default function App() {
  const [showCode, setShowCode] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);

  const currentLevelIndex = useGameStore((s) => s.currentLevelIndex);
  const completedLevels = useGameStore((s) => s.completedLevels);
  const language = useGameStore((s) => s.language);
  const totalStars = useGameStore((s) => s.totalStars);
  const setLanguage = useGameStore((s) => s.setLanguage);
  const loadProgress = useGameStore((s) => s.loadProgress);
  const setShopOpen = useGameStore((s) => s.setShopOpen);
  const setAchievementsOpen = useGameStore((s) => s.setAchievementsOpen);
  const setEditorOpen = useEditorStore((s) => s.setEditorOpen);

  const currentLevel = LEVELS[currentLevelIndex] || LEVELS[0];
  const t = TRANSLATIONS[language];

  useEffect(() => {
    loadProgress();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Üst Navigasyon Çubuğu */}
            <View style={styles.navBar}>
              <View style={styles.levelInfo}>
                <View style={styles.levelPill}>
                  <Text style={styles.levelPillText}>
                    {t.levelPrefix} {currentLevel.id}
                  </Text>
                </View>
                <Text style={styles.levelHeading} numberOfLines={1}>
                  {currentLevel.title}
                </Text>
              </View>

              {/* Sağ Aksiyon Kapsülleri */}
              <View style={styles.navActions}>
                <TouchableOpacity
                  style={styles.starBadge}
                  onPress={() => setShopOpen(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.starBadgeIcon}>⭐</Text>
                  <Text style={styles.starBadgeText}>{totalStars}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setAchievementsOpen(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.iconButtonEmoji}>🏆</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setShowThemeModal(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.iconButtonEmoji}>🎨</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setShowCode(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.iconButtonEmoji}>💻</Text>
                </TouchableOpacity>

                {/* Atölye / Studio */}
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setEditorOpen(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.iconButtonEmoji}>🛠️</Text>
                </TouchableOpacity>

                {/* Dil */}
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.langText}>{language === 'tr' ? 'EN' : 'TR'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Yatay Bölüm Seçici Çubuğu */}
            <View style={styles.levelSelectorContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.levelSelectorScroll}
              >
                {LEVELS.map((lvl, index) => {
                  const isSelected = index === currentLevelIndex;
                  const isCompleted = completedLevels.includes(lvl.id);

                  return (
                    <TouchableOpacity
                      key={lvl.id}
                      style={[
                        styles.levelChip,
                        isSelected && styles.levelChipActive,
                        isCompleted && !isSelected && styles.levelChipCompleted,
                      ]}
                      onPress={() => {
                        useGameStore.setState({
                          currentLevelIndex: index,
                          character: { ...lvl.start },
                          collectedStars: [],
                          collectedKeys: [],
                          openedDoors: [],
                          workspaceBlocks: [],
                          activeBlockId: null,
                          status: 'IDLE',
                          debugSteps: [],
                          currentDebugIndex: 0,
                        });
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.levelChipText,
                          isSelected && styles.levelChipTextActive,
                          isCompleted && !isSelected && styles.levelChipTextCompleted,
                        ]}
                      >
                        {isCompleted && !isSelected ? `✓ ${lvl.id}` : `${lvl.id}`}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* 5x5 Izgara */}
            <View style={styles.boardCard}>
              <GameGrid />
            </View>

            {/* Kod Dizilimi ve Komut Blokları */}
            <View style={styles.workspaceWrapper}>
              <Workspace />
            </View>

            {/* Kontrol Butonları */}
            <View style={styles.controlsWrapper}>
              <PlayControls />
            </View>
          </ScrollView>

          {/* Modallar */}
          <VictoryModal />
          <LevelEditorModal />
          <ShopModal />
          <ThemeModal visible={showThemeModal} onClose={() => setShowThemeModal(false)} />
          <AchievementsModal />
          <CodePreviewModal visible={showCode} onClose={() => setShowCode(false)} />
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
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelInfo: {
    flex: 1,
    marginRight: 6,
  },
  levelPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 7,
    marginBottom: 2,
  },
  levelPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 0.5,
  },
  levelHeading: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  starBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    gap: 3,
  },
  starBadgeIcon: {
    fontSize: 11,
  },
  starBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#B45309',
  },
  iconButton: {
    width: 34,
    height: 34,
    backgroundColor: '#FFFFFF',
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonEmoji: {
    fontSize: 14,
  },
  langText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#475569',
  },
  levelSelectorContainer: {
    marginBottom: 8,
  },
  levelSelectorScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  levelChip: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#CBD5E1',
  },
  levelChipActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
    borderBottomColor: '#3730A3',
  },
  levelChipCompleted: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderBottomColor: '#6EE7B7',
  },
  levelChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  levelChipTextActive: {
    color: '#FFFFFF',
  },
  levelChipTextCompleted: {
    color: '#059669',
  },
  boardCard: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  workspaceWrapper: {
    marginTop: 6,
  },
  controlsWrapper: {
    marginTop: 4,
  },
});