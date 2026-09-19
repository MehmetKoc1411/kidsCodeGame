import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGameStore } from '../../store/useGameStore';
import { LEVELS } from '../../core/levels';
import { TUTORIAL_HINTS, TutorialHint } from '../../core/tutorials';

const SEEN_TUTORIALS_KEY = '@kids_code_seen_tutorials_v1';

export const TutorialModal = () => {
  const currentLevelIndex = useGameStore((s) => s.currentLevelIndex);
  const language = useGameStore((s) => s.language);
  const currentLevel = LEVELS[currentLevelIndex] || LEVELS[0];

  const [activeHint, setActiveHint] = useState<TutorialHint | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkTutorial = async () => {
      const hint = TUTORIAL_HINTS.find((h) => h.levelId === currentLevel.id);
      if (!hint) {
        if (isMounted) setActiveHint(null);
        return;
      }

      try {
        const stored = await AsyncStorage.getItem(SEEN_TUTORIALS_KEY);
        const seenList: number[] = stored ? JSON.parse(stored) : [];

        if (!seenList.includes(currentLevel.id)) {
          if (isMounted) setActiveHint(hint);
        } else {
          if (isMounted) setActiveHint(null);
        }
      } catch {
        if (isMounted) setActiveHint(hint);
      }
    };

    checkTutorial();

    return () => {
      isMounted = false;
    };
  }, [currentLevelIndex, currentLevel.id]);

  const handleDismiss = async () => {
    if (!activeHint) return;
    const dismissedId = activeHint.levelId;
    setActiveHint(null);

    try {
      const stored = await AsyncStorage.getItem(SEEN_TUTORIALS_KEY);
      const seenList: number[] = stored ? JSON.parse(stored) : [];
      if (!seenList.includes(dismissedId)) {
        seenList.push(dismissedId);
        await AsyncStorage.setItem(SEEN_TUTORIALS_KEY, JSON.stringify(seenList));
      }
    } catch {}
  };

  if (!activeHint) return null;

  return (
    <Modal visible={true} transparent animationType="fade" onRequestClose={handleDismiss}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.icon}>{activeHint.icon}</Text>
          <Text style={styles.title}>
            {language === 'tr' ? activeHint.titleTR : activeHint.titleEN}
          </Text>
          <Text style={styles.desc}>
            {language === 'tr' ? activeHint.descTR : activeHint.descEN}
          </Text>

          <TouchableOpacity style={styles.button} onPress={handleDismiss} activeOpacity={0.85}>
            <Text style={styles.buttonText}>
              {language === 'tr' ? 'Anladım, Başla! 🚀' : "Got it, Let's go! 🚀"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  icon: {
    fontSize: 54,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  desc: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginTop: 6,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#3730A3',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});