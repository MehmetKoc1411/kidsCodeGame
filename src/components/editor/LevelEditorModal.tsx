import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
  Alert,
} from 'react-native';
import { useEditorStore, BrushMode } from '../../store/useEditorStore';
import { useGameStore } from '../../store/useGameStore';
import { LEVELS } from '../../core/levels';

const BRUSHES: { id: BrushMode; label: string; icon: string; color: string }[] = [
  { id: 'WALL', label: 'Duvar', icon: '🧱', color: '#64748B' },
  { id: 'STAR', label: 'Yıldız', icon: '⭐', color: '#F59E0B' },
  { id: 'START', label: 'Robot', icon: '🤖', color: '#3B82F6' },
  { id: 'TARGET', label: 'Bayrak', icon: '🚩', color: '#10B981' },
  { id: 'ERASE', label: 'Silgi', icon: '🧹', color: '#EF4444' },
];

export const LevelEditorModal = () => {
  const isEditorOpen = useEditorStore((s) => s.isEditorOpen);
  const setEditorOpen = useEditorStore((s) => s.setEditorOpen);
  const selectedBrush = useEditorStore((s) => s.selectedBrush);
  const setSelectedBrush = useEditorStore((s) => s.setSelectedBrush);
  const customLevel = useEditorStore((s) => s.customLevel);
  const handleCellPress = useEditorStore((s) => s.handleCellPress);
  const resetEditorGrid = useEditorStore((s) => s.resetEditorGrid);
  const exportLevelAsJSON = useEditorStore((s) => s.exportLevelAsJSON);

  // Tasarlanan bölümü hemen oyuna aktar ve test et
  const handlePlayLevel = () => {
    const customIndex = LEVELS.length; // 21. dinamik slot
    LEVELS[customIndex] = customLevel;

    useGameStore.setState({
      currentLevelIndex: customIndex,
      character: { ...customLevel.start },
      collectedStars: [],
      workspaceBlocks: [],
      activeBlockId: null,
      status: 'IDLE',
    });

    setEditorOpen(false);
  };

  const handleShareJSON = async () => {
    try {
      const json = exportLevelAsJSON();
      await Share.share({
        message: json,
        title: 'KidsCode Özel Seviye JSON',
      });
    } catch {
      Alert.alert('Hata', 'JSON dışa aktarılamadı');
    }
  };

  return (
    <Modal visible={isEditorOpen} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Başlık ve Kapat */}
          <View style={styles.header}>
            <Text style={styles.title}>🛠️ Bölüm Tasarım Atölyesi</Text>
            <TouchableOpacity onPress={() => setEditorOpen(false)}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* 5x5 Çizim Izgarası */}
          <View style={styles.gridBoard}>
            {Array.from({ length: 5 }).map((_, r) => (
              <View key={`row_${r}`} style={styles.gridRow}>
                {Array.from({ length: 5 }).map((_, c) => {
                  const isRobot = customLevel.start.x === c && customLevel.start.y === r;
                  const isTarget = customLevel.target.x === c && customLevel.target.y === r;
                  const isWall = customLevel.walls.some((w) => w.x === c && w.y === r);
                  const isStar = customLevel.stars.some((s) => s.x === c && s.y === r);

                  return (
                    <TouchableOpacity
                      key={`col_${c}`}
                      style={[styles.gridCell, isWall && styles.wallCell]}
                      onPress={() => handleCellPress(c, r)}
                      activeOpacity={0.7}
                    >
                      {isRobot && <Text style={styles.cellIcon}>🤖</Text>}
                      {isTarget && <Text style={styles.cellIcon}>🚩</Text>}
                      {isWall && <Text style={styles.cellIcon}>🧱</Text>}
                      {isStar && <Text style={styles.cellIcon}>⭐</Text>}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          {/* Fırça Seçim Araç Çubuğu */}
          <View style={styles.brushRow}>
            {BRUSHES.map((b) => {
              const isSelected = selectedBrush === b.id;
              return (
                <TouchableOpacity
                  key={b.id}
                  style={[
                    styles.brushBtn,
                    isSelected && { backgroundColor: b.color, borderColor: b.color },
                  ]}
                  onPress={() => setSelectedBrush(b.id)}
                >
                  <Text style={styles.brushIcon}>{b.icon}</Text>
                  <Text
                    style={[styles.brushLabel, isSelected && styles.brushLabelActive]}
                  >
                    {b.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Aksiyon Butonları */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.clearBtn} onPress={resetEditorGrid}>
              <Text style={styles.clearBtnText}>Temizle</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareBtn} onPress={handleShareJSON}>
              <Text style={styles.shareBtnText}>JSON Paylaş</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.playBtn} onPress={handlePlayLevel}>
              <Text style={styles.playBtnText}>Oyna ▶</Text>
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
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '800',
    padding: 4,
  },
  gridBoard: {
    backgroundColor: '#F1F5F9',
    padding: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    width: 48,
    height: 48,
    margin: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  wallCell: {
    backgroundColor: '#E2E8F0',
  },
  cellIcon: {
    fontSize: 22,
  },
  brushRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    width: '100%',
  },
  brushBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  brushIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  brushLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  brushLabelActive: {
    color: '#FFFFFF',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    marginTop: 4,
  },
  clearBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  clearBtnText: {
    color: '#64748B',
    fontWeight: '700',
    fontSize: 12,
  },
  shareBtn: {
    flex: 1,
    backgroundColor: '#EEF2FF',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  shareBtnText: {
    color: '#4F46E5',
    fontWeight: '700',
    fontSize: 12,
  },
  playBtn: {
    flex: 1.5,
    backgroundColor: '#10B981',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  playBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
});