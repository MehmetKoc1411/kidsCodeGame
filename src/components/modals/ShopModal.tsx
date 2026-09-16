import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useGameStore } from '../../store/useGameStore';
import { CHARACTER_SKINS } from '../../core/skins';

export const ShopModal = () => {
  const isShopOpen = useGameStore((s) => s.isShopOpen);
  const setShopOpen = useGameStore((s) => s.setShopOpen);
  const totalStars = useGameStore((s) => s.totalStars);
  const unlockedSkins = useGameStore((s) => s.unlockedSkins);
  const selectedSkin = useGameStore((s) => s.selectedSkin);
  const selectSkin = useGameStore((s) => s.selectSkin);
  const buySkin = useGameStore((s) => s.buySkin);
  const language = useGameStore((s) => s.language);

  return (
    <Modal visible={isShopOpen} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Üst Kısım & Bakiye */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>
                {language === 'tr' ? '🤖 Karakter Mağazası' : '🤖 Character Shop'}
              </Text>
              <Text style={styles.starsBadge}>⭐ {totalStars}</Text>
            </View>
            <TouchableOpacity onPress={() => setShopOpen(false)}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Kostüm Kartları */}
          <ScrollView contentContainerStyle={styles.skinsList} showsVerticalScrollIndicator={false}>
            {CHARACTER_SKINS.map((skin) => {
              const isUnlocked = unlockedSkins.includes(skin.id);
              const isSelected = selectedSkin === skin.id;
              const canAfford = totalStars >= skin.price;

              return (
                <View
                  key={skin.id}
                  style={[styles.skinCard, isSelected && styles.selectedSkinCard]}
                >
                  <View style={styles.iconBox}>
                    <Text style={styles.skinIcon}>{skin.icon}</Text>
                  </View>

                  <View style={styles.infoBox}>
                    <Text style={styles.skinName}>{skin.name}</Text>
                    <Text style={styles.skinDesc}>{skin.description}</Text>
                  </View>

                  <View style={styles.actionBox}>
                    {isSelected ? (
                      <View style={styles.activeTag}>
                        <Text style={styles.activeTagText}>
                          {language === 'tr' ? 'SEÇİLİ' : 'ACTIVE'}
                        </Text>
                      </View>
                    ) : isUnlocked ? (
                      <TouchableOpacity
                        style={styles.selectBtn}
                        onPress={() => selectSkin(skin.id)}
                      >
                        <Text style={styles.selectBtnText}>
                          {language === 'tr' ? 'Seç' : 'Select'}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[styles.buyBtn, !canAfford && styles.buyBtnDisabled]}
                        onPress={() => buySkin(skin.id)}
                        disabled={!canAfford}
                      >
                        <Text style={styles.buyBtnText}>⭐ {skin.price}</Text>
                      </TouchableOpacity>
                    )}
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
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  starsBadge: {
    fontSize: 14,
    fontWeight: '800',
    color: '#D97706',
    marginTop: 2,
  },
  closeBtn: {
    fontSize: 18,
    fontWeight: '800',
    color: '#94A3B8',
    padding: 4,
  },
  skinsList: {
    gap: 10,
    paddingVertical: 4,
  },
  skinCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  selectedSkinCard: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  skinIcon: {
    fontSize: 26,
  },
  infoBox: {
    flex: 1,
  },
  skinName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  skinDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  actionBox: {
    alignItems: 'flex-end',
  },
  activeTag: {
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  activeTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  selectBtn: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  selectBtnText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '700',
  },
  buyBtn: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  buyBtnDisabled: {
    opacity: 0.4,
  },
  buyBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});