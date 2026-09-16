import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useGameStore } from '../../store/useGameStore';
import { TRANSLATIONS } from '../../core/translations';

export const PlayControls = () => {
  const status = useGameStore((s) => s.status);
  const language = useGameStore((s) => s.language);
  const runCode = useGameStore((s) => s.runCode);
  const stepNext = useGameStore((s) => s.stepNext);
  const resetGame = useGameStore((s) => s.resetGame);
  const clearWorkspace = useGameStore((s) => s.clearWorkspace);

  const t = TRANSLATIONS[language];
  const isRunning = status === 'RUNNING';

  return (
    <View style={styles.container}>
      {/* Kodu Çalıştır Butonu */}
      <TouchableOpacity
        style={[styles.primaryBtn, isRunning && styles.disabledBtn]}
        disabled={isRunning}
        onPress={runCode}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryBtnEmoji}>{isRunning ? '⏳' : '▶️'}</Text>
        <Text style={styles.primaryBtnText}>{isRunning ? t.running : t.runCode}</Text>
      </TouchableOpacity>

      {/* Adım Adım (Debugger) Butonu */}
      <TouchableOpacity
        style={[styles.secondaryBtn, isRunning && styles.disabledBtn]}
        disabled={isRunning}
        onPress={stepNext}
        activeOpacity={0.8}
      >
        <Text style={styles.secondaryBtnEmoji}>🐾</Text>
        <Text style={styles.secondaryBtnText}>{t.stepNext}</Text>
      </TouchableOpacity>

      {/* Sıfırla Butonu */}
      <TouchableOpacity
        style={styles.utilityBtn}
        onPress={resetGame}
        activeOpacity={0.8}
      >
        <Text style={styles.utilityBtnEmoji}>🔄</Text>
        <Text style={styles.utilityBtnText}>{t.reset}</Text>
      </TouchableOpacity>

      {/* Temizle Butonu */}
      <TouchableOpacity
        style={[styles.utilityBtn, styles.clearBtn]}
        onPress={clearWorkspace}
        activeOpacity={0.8}
      >
        <Text style={styles.utilityBtnEmoji}>🗑️</Text>
        <Text style={[styles.utilityBtnText, styles.clearBtnText]}>{t.clear}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  primaryBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 14,
    borderBottomWidth: 3,
    borderBottomColor: '#059669',
    gap: 6,
  },
  primaryBtnEmoji: {
    fontSize: 16,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  secondaryBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 3,
    borderBottomColor: '#CBD5E1',
    gap: 4,
  },
  secondaryBtnEmoji: {
    fontSize: 15,
  },
  secondaryBtnText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '800',
  },
  utilityBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 3,
    borderBottomColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtn: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderBottomColor: '#FCA5A5',
  },
  utilityBtnEmoji: {
    fontSize: 14,
  },
  utilityBtnText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#64748B',
    marginTop: 1,
  },
  clearBtnText: {
    color: '#DC2626',
  },
  disabledBtn: {
    opacity: 0.6,
  },
});