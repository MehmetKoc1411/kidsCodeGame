import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useGameStore } from '../../store/useGameStore';

export const PlayControls = () => {
  const status = useGameStore((s) => s.status);
  const runCode = useGameStore((s) => s.runCode);
  const resetGame = useGameStore((s) => s.resetGame);
  const clearWorkspace = useGameStore((s) => s.clearWorkspace);
  const nextLevel = useGameStore((s) => s.nextLevel);

  return (
    <View style={styles.container}>
      {status === 'SUCCESS' ? (
        <TouchableOpacity style={[styles.btn, styles.successBtn]} onPress={nextLevel}>
          <Text style={styles.btnText}>Tebrikler! Sonraki Seviye 🚀</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.btn, styles.runBtn, status === 'RUNNING' && styles.disabledBtn]}
            onPress={runCode}
            disabled={status === 'RUNNING'}
          >
            <Text style={styles.btnText}>
              {status === 'RUNNING' ? 'Çalışıyor...' : '▶ Kodu Çalıştır'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btn, styles.secondaryBtn]} onPress={resetGame}>
            <Text style={styles.secondaryBtnText}>Yenile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btn, styles.clearBtn]} onPress={clearWorkspace}>
            <Text style={styles.clearBtnText}>Sil</Text>
          </TouchableOpacity>
        </View>
      )}

      {status === 'FAILED' && (
        <Text style={styles.failText}>Hedefe ulaşılamadı veya engele çarptı. Tekrar dene!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  runBtn: {
    flex: 2,
    backgroundColor: '#10B981',
    elevation: 3,
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: '#E2E8F0',
  },
  clearBtn: {
    flex: 1,
    backgroundColor: '#FEE2E2',
  },
  disabledBtn: {
    opacity: 0.6,
  },
  successBtn: {
    backgroundColor: '#10B981',
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  secondaryBtnText: {
    color: '#475569',
    fontWeight: '700',
    fontSize: 14,
  },
  clearBtnText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 14,
  },
  failText: {
    textAlign: 'center',
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
});