import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useGameStore } from '../../store/useGameStore';
import { LEVELS } from '../../core/levels';

export const VictoryModal = () => {
  const status = useGameStore((s) => s.status);
  const currentLevelIndex = useGameStore((s) => s.currentLevelIndex);
  const earnedScoreStars = useGameStore((s) => s.earnedScoreStars);
  const nextLevel = useGameStore((s) => s.nextLevel);
  const resetGame = useGameStore((s) => s.resetGame);

  const level = LEVELS[currentLevelIndex];
  const isVisible = status === 'SUCCESS';

  const getPerformanceMessage = () => {
    switch (earnedScoreStars) {
      case 3:
        return 'Mükemmel! En verimli kodla tüm yıldızları topladın!';
      case 2:
        return 'Çok iyi! Hedefe ulaştın ve harika bir iş çıkardın.';
      default:
        return 'Bölümü geçtin! Daha az blok kullanarak 3 yıldız almayı dene.';
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.badge}>🎉 TEBRİKLER!</Text>
          <Text style={styles.title}>{level?.title || 'Bölüm Tamamlandı'}</Text>

          {/* 3 Yıldızlı Performans Gösterimi */}
          <View style={styles.starsRow}>
            {[1, 2, 3].map((starIndex) => {
              const isEarned = starIndex <= earnedScoreStars;
              return (
                <Text
                  key={starIndex}
                  style={[styles.starIcon, !isEarned && styles.starDimmed]}
                >
                  ⭐
                </Text>
              );
            })}
          </View>

          <Text style={styles.subtext}>{getPerformanceMessage()}</Text>

          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.replayButton} onPress={resetGame}>
              <Text style={styles.replayText}>Tekrar Dene</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.nextButton} onPress={nextLevel}>
              <Text style={styles.nextText}>Sonraki Bölüm ➜</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
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
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  badge: {
    fontSize: 13,
    fontWeight: '800',
    color: '#10B981',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
    textAlign: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  starIcon: {
    fontSize: 36,
  },
  starDimmed: {
    opacity: 0.2,
  },
  subtext: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 18,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  replayButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  replayText: {
    color: '#475569',
    fontWeight: '700',
    fontSize: 14,
  },
  nextButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});