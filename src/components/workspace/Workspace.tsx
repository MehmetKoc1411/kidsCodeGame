import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useGameStore } from '../../store/useGameStore';
import { LEVELS } from '../../core/levels';
import { TRANSLATIONS } from '../../core/translations';
import { CodeBlock, CommandType } from '../../core/types';

const BLOCK_COLORS: Record<CommandType, { bg: string; border: string; text: string }> = {
  FORWARD: { bg: '#3B82F6', border: '#1D4ED8', text: '#FFFFFF' },
  TURN_RIGHT: { bg: '#F59E0B', border: '#B45309', text: '#FFFFFF' },
  TURN_LEFT: { bg: '#10B981', border: '#047857', text: '#FFFFFF' },
  REPEAT: { bg: '#EC4899', border: '#BE185D', text: '#FFFFFF' },
  IF_WALL: { bg: '#6366F1', border: '#4338CA', text: '#FFFFFF' },
  FUNCTION: { bg: '#8B5CF6', border: '#6D28D9', text: '#FFFFFF' },
  CALL_FUNCTION: { bg: '#A855F7', border: '#7E22CE', text: '#FFFFFF' },
};

const BLOCK_ICONS: Record<CommandType, string> = {
  FORWARD: '⬆️',
  TURN_RIGHT: '➡️',
  TURN_LEFT: '⬅️',
  REPEAT: '🔁',
  IF_WALL: '🧱❓',
  FUNCTION: '🧩',
  CALL_FUNCTION: '⚡',
};

export const Workspace = () => {
  const currentLevelIndex = useGameStore((s) => s.currentLevelIndex);
  const workspaceBlocks = useGameStore((s) => s.workspaceBlocks);
  const activeBlockId = useGameStore((s) => s.activeBlockId);
  const language = useGameStore((s) => s.language);
  const addBlock = useGameStore((s) => s.addBlock);
  const addChildBlock = useGameStore((s) => s.addChildBlock);
  const removeBlock = useGameStore((s) => s.removeBlock);

  const level = LEVELS[currentLevelIndex] || LEVELS[0];
  const t = TRANSLATIONS[language];

  const countTotalBlocks = (blocks: CodeBlock[]): number => {
    return blocks.reduce((acc, b) => acc + 1 + (b.children ? countTotalBlocks(b.children) : 0), 0);
  };

  const totalUsed = countTotalBlocks(workspaceBlocks);
  const isOverTarget = totalUsed > level.maxBlocks;

  const getLabel = (type: CommandType): string => {
    switch (type) {
      case 'FORWARD': return t.cmdForward;
      case 'TURN_RIGHT': return t.cmdTurnRight;
      case 'TURN_LEFT': return t.cmdTurnLeft;
      case 'REPEAT': return t.cmdRepeat;
      case 'IF_WALL': return t.cmdIfWall;
      case 'FUNCTION': return t.cmdFunction;
      case 'CALL_FUNCTION': return t.cmdCallFunction;
    }
  };

  const renderBlock = (block: CodeBlock, isChild = false) => {
    const isContainer = block.type === 'REPEAT' || block.type === 'IF_WALL' || block.type === 'FUNCTION';
    const color = BLOCK_COLORS[block.type];
    const isActive = activeBlockId === block.id;

    return (
      <View
        key={block.id}
        style={[
          styles.blockCard,
          { backgroundColor: color.bg, borderColor: color.border },
          isActive && styles.activeCard,
          isChild && styles.childCard,
        ]}
      >
        <View style={styles.blockRow}>
          <Text style={styles.blockIcon}>{BLOCK_ICONS[block.type]}</Text>
          <Text style={styles.blockText}>
            {getLabel(block.type)}
            {block.type === 'REPEAT' && ` (${block.value || 3}x)`}
          </Text>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => removeBlock(block.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.deleteBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        {isContainer && (
          <View style={styles.containerContent}>
            {block.children && block.children.map((child) => renderBlock(child, true))}

            <View style={styles.childAddPalette}>
              {level.availableBlocks
                .filter((b) => b !== 'REPEAT' && b !== 'IF_WALL' && b !== 'FUNCTION')
                .map((cmd) => (
                  <TouchableOpacity
                    key={`child_add_${cmd}`}
                    style={styles.childAddChip}
                    onPress={() => addChildBlock(block.id, cmd)}
                  >
                    <Text style={styles.childAddText}>
                      + {BLOCK_ICONS[cmd]} {getLabel(cmd)}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Üst Bilgi Barı */}
      <View style={styles.header}>
        <Text style={styles.title}>{t.workspaceTitle}</Text>
        <View style={[styles.badge, isOverTarget && styles.badgeTargetExceeded]}>
          <Text style={[styles.badgeText, isOverTarget && styles.badgeTextTargetExceeded]}>
            {language === 'tr' ? 'Kullanılan Blok' : 'Used Blocks'}: {totalUsed} / {level.maxBlocks} ⭐
          </Text>
        </View>
      </View>

      {/* Blok Dizilim Listesi */}
      <View style={styles.workspaceBox}>
        <ScrollView style={styles.scrollArea} nestedScrollEnabled showsVerticalScrollIndicator={false}>
          {workspaceBlocks.length === 0 ? (
            <Text style={styles.hint}>{t.emptyWorkspaceHint}</Text>
          ) : (
            workspaceBlocks.map((b) => renderBlock(b))
          )}
        </ScrollView>
      </View>

      {/* Komut Paleti */}
      <Text style={styles.paletteTitle}>{t.availablePalette}</Text>
      <View style={styles.paletteRow}>
        {level.availableBlocks.map((cmd) => {
          const color = BLOCK_COLORS[cmd];

          return (
            <TouchableOpacity
              key={cmd}
              style={[
                styles.paletteBtn,
                { backgroundColor: color.bg, borderColor: color.border },
              ]}
              onPress={() => addBlock(cmd)}
              activeOpacity={0.8}
            >
              <Text style={styles.paletteIcon}>{BLOCK_ICONS[cmd]}</Text>
              <Text style={styles.paletteText}>{getLabel(cmd)}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },
  badge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  badgeTargetExceeded: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4F46E5',
  },
  badgeTextTargetExceeded: {
    color: '#B45309',
  },
  workspaceBox: {
    minHeight: 110,
    maxHeight: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 8,
  },
  scrollArea: {
    flex: 1,
  },
  hint: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 36,
  },
  blockCard: {
    borderRadius: 12,
    padding: 8,
    marginBottom: 6,
    borderWidth: 1.5,
    borderBottomWidth: 3,
  },
  childCard: {
    marginLeft: 12,
    marginTop: 4,
    marginBottom: 4,
  },
  activeCard: {
    borderColor: '#FACC15',
    borderWidth: 2.5,
  },
  blockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  blockIcon: {
    fontSize: 15,
  },
  blockText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  deleteBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  containerContent: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    gap: 4,
  },
  childAddPalette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  childAddChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  childAddText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  paletteTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    marginTop: 2,
  },
  paletteRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  paletteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1.5,
    borderBottomWidth: 3,
    gap: 5,
  },
  paletteIcon: {
    fontSize: 13,
  },
  paletteText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});