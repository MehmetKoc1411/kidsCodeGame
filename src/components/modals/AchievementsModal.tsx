import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useGameStore } from '../../store/useGameStore';
import { ACHIEVEMENTS } from '../../core/achievements';

export const AchievementsModal = () => {
  const isAchievementsOpen = useGameStore((s) => s.isAchievementsOpen);
  const setAchievementsOpen = useGameStore((s) => s.setAchievementsOpen);
  const unlockedAchievements = useGameStore((s) => s.unlockedAchievements);
  const language = useGameStore((s) => s.language);

  return (
    <Modal visible={isAchievementsOpen} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {language === 'tr' ? '🏆 Başarımlar' : '🏆 Achievements'}
            </Text>
            <TouchableOpacity onPress={() => setAchievementsOpen(false)}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
            {ACHIEVEMENTS.map((item) => {
              const isUnlocked = unlockedAchievements.includes(item.id);
              return (
                <View
                  key={item.id}
                  style={[styles.itemCard, isUnlocked && styles.unlockedCard]}
                >
                  <View style={[styles.iconWrap, isUnlocked && styles.unlockedIconWrap]}>
                    <Text style={styles.icon}>{isUnlocked ? item.icon : '🔒'}</Text>
                  </View>
                  <View style={styles.info}>
                    <Text style={[styles.itemTitle, !isUnlocked && styles.lockedText]}>
                      {language === 'tr' ? item.titleTR : item.titleEN}
                    </Text>
                    <Text style={styles.itemDesc}>
                      {language === 'tr' ? item.descTR : item.descEN}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
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
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    width: '100%',
    maxWidth: 350,
    maxHeight: '80%',
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  closeBtn: {
    fontSize: 18,
    fontWeight: '800',
    color: '#94A3B8',
  },
  list: {
    gap: 10,
    paddingVertical: 4,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 12,
    opacity: 0.6,
  },
  unlockedCard: {
    opacity: 1,
    backgroundColor: '#FEF9C3',
    borderColor: '#FACC15',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockedIconWrap: {
    backgroundColor: '#FFFFFF',
  },
  icon: {
    fontSize: 22,
  },
  info: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  lockedText: {
    color: '#64748B',
  },
  itemDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
});