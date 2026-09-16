import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { useEditorStore, BrushMode } from '../../store/useEditorStore';
import { useGameStore } from '../../store/useGameStore';
import { CommandType } from '../../core/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_PADDING = 8;
const BOARD_SIZE = Math.min(SCREEN_WIDTH - 48, 300);
const CELL_SIZE = (BOARD_SIZE - GRID_PADDING * 2) / 5;

const BRUSHES: { mode: BrushMode; labelTR: string; labelEN: string; icon: string }[] = [
  { mode: 'WALL', labelTR: 'Duvar', labelEN: 'Wall', icon: '🧱' },
  { mode: 'STAR', labelTR: 'Yıldız', labelEN: 'Star', icon: '⭐' },
  { mode: 'KEY', labelTR: 'Anahtar', labelEN: 'Key', icon: '🔑' },
  { mode: 'DOOR', labelTR: 'Kapı', labelEN: 'Door', icon: '🚪' },
  { mode: 'START', labelTR: 'Robot', labelEN: 'Start', icon: '🤖' },
  { mode: 'TARGET', labelTR: 'Bayrak', labelEN: 'Flag', icon: '🚩' },
  { mode: 'ERASE', labelTR: 'Silgi', labelEN: 'Eraser', icon: '🧹' },
];

export const LevelEditorModal = () => {
  const isEditorOpen = useEditorStore((s) => s.isEditorOpen);
  const setEditorOpen = useEditorStore((s) => s.setEditorOpen);
  const selectedBrush = useEditorStore((s) => s.selectedBrush);
  const setSelectedBrush = useEditorStore((s) => s.setSelectedBrush);
  const customLevel = useEditorStore((s) => s.customLevel);
  const handleCellClick = useEditorStore((s) => s.handleCellClick);
  const toggleAvailableBlock = useEditorStore((s) => s.toggleAvailableBlock);
  const resetEditor = useEditorStore((s) => s.resetEditor);
  const exportJSON = useEditorStore((s) => s.exportJSON);
  const testCustomLevel = useEditorStore((s) => s.testCustomLevel);
  const language = useGameStore((s) => s.language);

  if (!customLevel) return null;

  const handleExport = () => {
    const json = exportJSON();
    Alert.alert(
      language === 'tr' ? 'Bölüm JSON Kodu' : 'Level JSON Export',
      json,
      [{ text: 'Tamam' }]
    );
  };

  return (
    <Modal visible={isEditorOpen} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Başlık */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {language === 'tr' ? '🛠️ Bölüm Tasarımcısı' : '🛠️ Level Studio'}
            </Text>
            <TouchableOpacity onPress={() => setEditorOpen(false)}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Fırça Seçimi */}
            <View style={styles.brushRow}>
              {BRUSHES.map((b) => (
                <TouchableOpacity
                  key={b.mode}
                  style={[
                    styles.brushBtn,
                    selectedBrush === b.mode && styles.brushBtnActive,
                  ]}
                  onPress={() => setSelectedBrush(b.mode)}
                >
                  <Text style={styles.brushIcon}>{b.icon}</Text>
                  <Text
                    style={[
                      styles.brushLabel,
                      selectedBrush === b.mode && styles.brushLabelActive,
                    ]}
                  >
                    {language === 'tr' ? b.labelTR : b.labelEN}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 5x5 Tasarım Izgarası */}
            <View style={styles.gridCard}>
              {Array.from({ length: 5 }).map((_, r) => (
                <View key={`row_${r}`} style={styles.row}>
                  {Array.from({ length: 5 }).map((_, c) => {
                    const isRobot =
                      customLevel.start.x === c && customLevel.start.y === r;
                    const isTarget =
                      customLevel.target.x === c && customLevel.target.y === r;
                    const isWall = customLevel.walls.some(
                      (w) => w.x === c && w.y === r
                    );
                    const isStar = customLevel.stars.some(
                      (s) => s.x === c && s.y === r
                    );
                    const isKey = customLevel.keys?.some(
                      (k) => k.x === c && k.y === r
                    );
                    const isDoor = customLevel.doors?.some(
                      (d) => d.x === c && d.y === r
                    );

                    return (
                      <TouchableOpacity
                        key={`cell_${c}_${r}`}
                        style={[
                          styles.cell,
                          isWall && styles.wallCell,
                          isDoor && styles.doorCell,
                        ]}
                        onPress={() => handleCellClick(c, r)}
                        activeOpacity={0.7}
                      >
                        {isRobot && <Text style={styles.cellEmoji}>🤖</Text>}
                        {isTarget && <Text style={styles.cellEmoji}>🚩</Text>}
                        {isWall && <Text style={styles.cellEmoji}>🧱</Text>}
                        {isStar && <Text style={styles.cellEmoji}>⭐</Text>}
                        {isKey && <Text style={styles.cellEmoji}>🔑</Text>}
                        {isDoor && <Text style={styles.cellEmoji}>🚪</Text>}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>

            {/* İzin Verilen Bloklar */}
            <Text style={styles.sectionTitle}>
              {language === 'tr' ? 'Kullanılabilir Bloklar:' : 'Available Blocks:'}
            </Text>
            <View style={styles.blocksToggleRow}>
              {(['FORWARD', 'TURN_RIGHT', 'TURN_LEFT', 'REPEAT', 'IF_WALL'] as CommandType[]).map(
                (cmd) => {
                  const isChecked = customLevel.availableBlocks.includes(cmd);
                  return (
                    <TouchableOpacity
                      key={cmd}
                      style={[
                        styles.blockToggleChip,
                        isChecked && styles.blockToggleChipActive,
                      ]}
                      onPress={() => toggleAvailableBlock(cmd)}
                    >
                      <Text
                        style={[
                          styles.blockToggleText,
                          isChecked && styles.blockToggleTextActive,
                        ]}
                      >
                        {cmd}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              )}
            </View>

            {/* Alt İşlem Butonları */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.btn, styles.testBtn]}
                onPress={testCustomLevel}
              >
                <Text style={styles.btnTextWhite}>
                  {language === 'tr' ? '▶ Bölümü Dene' : '▶ Playtest'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.exportBtn]}
                onPress={handleExport}
              >
                <Text style={styles.btnTextDark}>
                  {language === 'tr' ? '📋 JSON Al' : '📋 Export'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.resetBtn]}
                onPress={resetEditor}
              >
                <Text style={styles.btnTextRed}>
                  {language === 'tr' ? 'Temizle' : 'Reset'}
                </Text>
              </TouchableOpacity>
            </View>
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
    padding: 16,
    width: '100%',
    maxWidth: 380,
    maxHeight: '90%',
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  closeBtn: {
    fontSize: 18,
    fontWeight: '800',
    color: '#94A3B8',
    padding: 4,
  },
  brushRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  brushBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  brushBtnActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  brushIcon: {
    fontSize: 14,
  },
  brushLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  brushLabelActive: {
    color: '#4F46E5',
  },
  gridCard: {
    alignSelf: 'center',
    padding: GRID_PADDING,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginVertical: 4,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 8,
    margin: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wallCell: {
    backgroundColor: '#CBD5E1',
    borderColor: '#94A3B8',
  },
  doorCell: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  cellEmoji: {
    fontSize: CELL_SIZE * 0.45,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    marginTop: 8,
    marginBottom: 6,
  },
  blocksToggleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  blockToggleChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  blockToggleChipActive: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
  },
  blockToggleText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
  },
  blockToggleTextActive: {
    color: '#FFFFFF',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 14,
  },
  btn: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testBtn: {
    backgroundColor: '#4F46E5',
  },
  exportBtn: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  resetBtn: {
    backgroundColor: '#FEE2E2',
  },
  btnTextWhite: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  btnTextDark: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '800',
  },
  btnTextRed: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '800',
  },
});