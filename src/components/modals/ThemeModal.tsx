import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useGameStore } from '../../store/useGameStore';
import { THEMES, ThemeId } from '../../core/themes';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const ThemeModal: React.FC<Props> = ({ visible, onClose }) => {
  const selectedTheme = useGameStore((s) => s.selectedTheme);
  const setTheme = useGameStore((s) => s.setTheme);
  const language = useGameStore((s) => s.language);

  const themeList = Object.values(THEMES);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {language === 'tr' ? '🎨 Zemin Teması' : '🎨 Grid Theme'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.themeList}>
            {themeList.map((t) => {
              const isSelected = selectedTheme === t.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  style={[
                    styles.themeOption,
                    { backgroundColor: t.cellBg, borderColor: t.boardBorder },
                    isSelected && styles.selectedOption,
                  ]}
                  onPress={() => {
                    setTheme(t.id as ThemeId);
                    onClose();
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.icon}>{t.icon}</Text>
                  <Text
                    style={[
                      styles.themeName,
                      t.id === 'SPACE' && { color: '#F8FAFC' },
                      isSelected && styles.selectedText,
                    ]}
                  >
                    {language === 'tr' ? t.nameTR : t.nameEN}
                  </Text>
                  {isSelected && <Text style={styles.check}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    width: '100%',
    maxWidth: 320,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    fontSize: 16,
    fontWeight: '800',
    color: '#94A3B8',
    padding: 4,
  },
  themeList: {
    gap: 8,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 2,
    gap: 10,
  },
  selectedOption: {
    borderColor: '#6366F1',
  },
  icon: {
    fontSize: 20,
  },
  themeName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
    flex: 1,
  },
  selectedText: {
    color: '#4F46E5',
  },
  check: {
    fontSize: 14,
    fontWeight: '900',
    color: '#4F46E5',
  },
});