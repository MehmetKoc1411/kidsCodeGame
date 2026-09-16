import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useGameStore } from '../../store/useGameStore';
import { TRANSLATIONS } from '../../core/translations';

export const PlayControls = () => {
  const language = useGameStore((s) => s.language);
  const runCode = useGameStore((s) => s.runCode);
  const resetGame = useGameStore((s) => s.resetGame);
  const clearWorkspace = useGameStore((s) => s.clearWorkspace);
  const status = useGameStore((s) => s.status);
  const workspaceBlocks = useGameStore((s) => s.workspaceBlocks);

  const t = TRANSLATIONS[language];
  const isRunning = status === 'RUNNING';

  return (
    <View style={styles.actionRow}>
      <TouchableOpacity
        style={[styles.btn, styles.runBtn, isRunning && styles.btnDisabled]}
        onPress={runCode}
        disabled={isRunning || workspaceBlocks.length === 0}
        activeOpacity={0.85}
      >
        <Text style={styles.runBtnText}>
          {isRunning ? t.running : t.runCode}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, styles.secondaryBtn]}
        onPress={resetGame}
        disabled={isRunning}
        activeOpacity={0.7}
      >
        <Text style={styles.secondaryBtnText}>{t.reset}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, styles.clearBtn]}
        onPress={clearWorkspace}
        disabled={isRunning}
        activeOpacity={0.7}
      >
        <Text style={styles.clearBtnText}>{t.clear}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  btn: {
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  runBtn: {
    flex: 2.2,
    backgroundColor: '#10B981',
    borderBottomWidth: 4,
    borderBottomColor: '#047857',
  },
  runBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.3,
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
  },
  secondaryBtnText: {
    color: '#475569',
    fontWeight: '800',
    fontSize: 13,
  },
  clearBtn: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    borderWidth: 1.5,
    borderColor: '#FECACA',
    borderBottomWidth: 4,
    borderBottomColor: '#F87171',
  },
  clearBtnText: {
    color: '#B91C1C',
    fontWeight: '800',
    fontSize: 13,
  },
  btnDisabled: {
    opacity: 0.5,
  },
});