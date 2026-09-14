import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useGameStore } from '../../store/useGameStore';
import { CodePreviewModal } from '../workspace/CodePreviewModal';
import { TRANSLATIONS } from '../../core/translations';

export const PlayControls = () => {
  const [showCode, setShowCode] = useState(false);
  const language = useGameStore((s) => s.language);
  const runCode = useGameStore((s) => s.runCode);
  const resetGame = useGameStore((s) => s.resetGame);
  const clearWorkspace = useGameStore((s) => s.clearWorkspace);
  const status = useGameStore((s) => s.status);
  const workspaceBlocks = useGameStore((s) => s.workspaceBlocks);

  const t = TRANSLATIONS[language];
  const isRunning = status === 'RUNNING';

  return (
    <View style={styles.container}>
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.btn, styles.runBtn, isRunning && styles.btnDisabled]}
          onPress={runCode}
          disabled={isRunning || workspaceBlocks.length === 0}
          activeOpacity={0.8}
        >
          <Text style={styles.runBtnText}>
            {isRunning ? t.running : t.runCode}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.secondaryBtn]}
          onPress={resetGame}
          disabled={isRunning}
        >
          <Text style={styles.secondaryBtnText}>{t.reset}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.clearBtn]}
          onPress={clearWorkspace}
          disabled={isRunning}
        >
          <Text style={styles.clearBtnText}>{t.clear}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.codePreviewBtn}
        onPress={() => setShowCode(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.codePreviewText}>{t.viewCode}</Text>
      </TouchableOpacity>

      <CodePreviewModal visible={showCode} onClose={() => setShowCode(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  runBtn: {
    flex: 2,
    backgroundColor: '#10B981',
    borderBottomWidth: 4,
    borderBottomColor: '#059669',
  },
  runBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    borderBottomWidth: 3,
    borderBottomColor: '#CBD5E1',
  },
  secondaryBtnText: {
    color: '#334155',
    fontWeight: '700',
    fontSize: 13,
  },
  clearBtn: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    borderBottomWidth: 3,
    borderBottomColor: '#FCA5A5',
  },
  clearBtnText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 13,
  },
  codePreviewBtn: {
    backgroundColor: '#1E293B',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#0F172A',
  },
  codePreviewText: {
    color: '#38BDF8',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.4,
  },
  btnDisabled: {
    opacity: 0.6,
  },
});