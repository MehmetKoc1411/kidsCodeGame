import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { useGameStore } from '../../store/useGameStore';
import { generateCodeFromBlocks, TargetLanguage } from '../../core/codeGenerator';

interface CodePreviewModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CodePreviewModal = ({ visible, onClose }: CodePreviewModalProps) => {
  const [lang, setLang] = useState<TargetLanguage>('javascript');
  const workspaceBlocks = useGameStore((s) => s.workspaceBlocks);

  const generatedCode = generateCodeFromBlocks(workspaceBlocks, lang);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Üst Bar */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={styles.headerTitle}>💻 Gerçek Kod Görünümü</Text>
            </View>

            {/* Dil Değiştirici */}
            <View style={styles.langToggleGroup}>
              <TouchableOpacity
                style={[styles.langBtn, lang === 'javascript' && styles.langBtnActive]}
                onPress={() => setLang('javascript')}
              >
                <Text style={[styles.langText, lang === 'javascript' && styles.langTextActive]}>
                  JavaScript
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.langBtn, lang === 'python' && styles.langBtnActive]}
                onPress={() => setLang('python')}
              >
                <Text style={[styles.langText, lang === 'python' && styles.langTextActive]}>
                  Python
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Kod Görüntüleme Penceresi (Terminal Teması) */}
          <View style={styles.editorFrame}>
            <View style={styles.macControls}>
              <View style={[styles.circle, { backgroundColor: '#EF4444' }]} />
              <View style={[styles.circle, { backgroundColor: '#F59E0B' }]} />
              <View style={[styles.circle, { backgroundColor: '#10B981' }]} />
              <Text style={styles.editorFileName}>
                bot_controller.{lang === 'javascript' ? 'js' : 'py'}
              </Text>
            </View>

            <ScrollView style={styles.codeScroll} showsVerticalScrollIndicator>
              <Text style={styles.codeText}>{generatedCode}</Text>
            </ScrollView>
          </View>

          {/* Kapat Butonu */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '75%',
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
  },
  langToggleGroup: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 3,
  },
  langBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  langBtnActive: {
    backgroundColor: '#4F46E5',
  },
  langText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
  langTextActive: {
    color: '#FFFFFF',
  },
  editorFrame: {
    backgroundColor: '#030712',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    overflow: 'hidden',
  },
  macControls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#111827',
    gap: 6,
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  editorFileName: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 6,
  },
  codeScroll: {
    padding: 14,
    minHeight: 140,
    maxHeight: 220,
  },
  codeText: {
    fontFamily: 'monospace',
    color: '#38BDF8',
    fontSize: 13,
    lineHeight: 20,
  },
  closeButton: {
    backgroundColor: '#1E293B',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: 14,
  },
});