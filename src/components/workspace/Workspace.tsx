import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useGameStore } from '../../store/useGameStore';
import { CommandType, CodeBlock } from '../../core/types';
import { DraggableBlock } from './DraggableBlock';
import { TRANSLATIONS } from '../../core/translations';

const BLOCK_COLORS: Record<
  CommandType,
  { color: string; shadowColor: string; icon: string }
> = {
  FORWARD: { color: '#3B82F6', shadowColor: '#1D4ED8', icon: '⬆️' },
  TURN_RIGHT: { color: '#8B5CF6', shadowColor: '#6D28D9', icon: '↪️' },
  TURN_LEFT: { color: '#EC4899', shadowColor: '#BE185D', icon: '↩️' },
  REPEAT: { color: '#F59E0B', shadowColor: '#B45309', icon: '🔁' },
  IF_WALL: { color: '#EF4444', shadowColor: '#B91C1C', icon: '🧱' },
};

export const Workspace = () => {
  const language = useGameStore((s) => s.language);
  const workspaceBlocks = useGameStore((s) => s.workspaceBlocks);
  const activeBlockId = useGameStore((s) => s.activeBlockId);
  const addBlock = useGameStore((s) => s.addBlock);
  const addChildBlock = useGameStore((s) => s.addChildBlock);
  const removeBlock = useGameStore((s) => s.removeBlock);

  const t = TRANSLATIONS[language];

  const dropZoneRef = useRef<View>(null);
  const [dropZoneLayout, setDropZoneLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const onDropZoneLayout = () => {
    if (dropZoneRef.current) {
      dropZoneRef.current.measure((_x, _y, width, height, pageX, pageY) => {
        setDropZoneLayout({ x: pageX, y: pageY, width, height });
      });
    }
  };

  const renderBlockItem = (block: CodeBlock, index: number) => {
    const visual = BLOCK_COLORS[block.type];
    const label = t.blocks[block.type];
    const isActive = activeBlockId === block.id;

    if (block.type === 'REPEAT') {
      return (
        <View key={block.id} style={[styles.repeatCard, isActive && styles.activeContainer]}>
          <View style={styles.repeatHeader}>
            <Text style={styles.repeatHeaderText}>🔁 {label}</Text>
            <TouchableOpacity onPress={() => removeBlock(block.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.deleteBadge}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.childBlocksArea}>
            {block.children && block.children.length > 0 ? (
              block.children.map((child) => {
                const childVisual = BLOCK_COLORS[child.type];
                const childLabel = t.blocks[child.type];
                return (
                  <TouchableOpacity
                    key={child.id}
                    style={[
                      styles.childTag,
                      { backgroundColor: childVisual.color, borderBottomColor: childVisual.shadowColor },
                      activeBlockId === child.id && styles.activeChildTag,
                    ]}
                    onPress={() => removeBlock(child.id)}
                  >
                    <Text style={styles.blockIconText}>{childVisual.icon}</Text>
                    <Text style={styles.childLabel}>{childLabel}</Text>
                    <Text style={styles.childDeleteBadge}>✕</Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={styles.emptyChildText}>
                {language === 'tr' ? '+ Komut ekleyin' : '+ Add action'}
              </Text>
            )}
          </View>

          <View style={styles.addChildRow}>
            <TouchableOpacity
              style={[styles.addChildBtn, { backgroundColor: '#3B82F6' }]}
              onPress={() => addChildBlock(block.id, 'FORWARD')}
            >
              <Text style={styles.addChildText}>+ {t.blocks.FORWARD}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addChildBtn, { backgroundColor: '#8B5CF6' }]}
              onPress={() => addChildBlock(block.id, 'TURN_RIGHT')}
            >
              <Text style={styles.addChildText}>+ {t.blocks.TURN_RIGHT}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (block.type === 'IF_WALL') {
      return (
        <View key={block.id} style={[styles.ifCard, isActive && styles.activeContainer]}>
          <View style={styles.ifHeader}>
            <Text style={styles.ifHeaderText}>🧱 {label}</Text>
            <TouchableOpacity onPress={() => removeBlock(block.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.deleteBadge}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.childBlocksArea}>
            {block.children && block.children.length > 0 ? (
              block.children.map((child) => {
                const childVisual = BLOCK_COLORS[child.type];
                const childLabel = t.blocks[child.type];
                return (
                  <TouchableOpacity
                    key={child.id}
                    style={[
                      styles.childTag,
                      { backgroundColor: childVisual.color, borderBottomColor: childVisual.shadowColor },
                      activeBlockId === child.id && styles.activeChildTag,
                    ]}
                    onPress={() => removeBlock(child.id)}
                  >
                    <Text style={styles.blockIconText}>{childVisual.icon}</Text>
                    <Text style={styles.childLabel}>{childLabel}</Text>
                    <Text style={styles.childDeleteBadge}>✕</Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={styles.emptyChildText}>
                {language === 'tr' ? '+ Dönüş seçin' : '+ Add turn'}
              </Text>
            )}
          </View>

          <View style={styles.addChildRow}>
            <TouchableOpacity
              style={[styles.addChildBtn, { backgroundColor: '#8B5CF6' }]}
              onPress={() => addChildBlock(block.id, 'TURN_RIGHT')}
            >
              <Text style={styles.addChildText}>+ {t.blocks.TURN_RIGHT}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addChildBtn, { backgroundColor: '#EC4899' }]}
              onPress={() => addChildBlock(block.id, 'TURN_LEFT')}
            >
              <Text style={styles.addChildText}>+ {t.blocks.TURN_LEFT}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={block.id}
        style={[
          styles.puzzleBlockTag,
          { backgroundColor: visual.color, borderBottomColor: visual.shadowColor },
          isActive && styles.activeBlockTag,
        ]}
        onPress={() => removeBlock(block.id)}
        activeOpacity={0.8}
      >
        <Text style={styles.indexBadge}>{index + 1}</Text>
        <Text style={styles.blockIconText}>{visual.icon}</Text>
        <Text style={styles.blockLabel}>{label}</Text>
        <Text style={styles.deleteBadge}>✕</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Kod Dizilim Alanı */}
      <View
        ref={dropZoneRef}
        onLayout={onDropZoneLayout}
        style={[styles.dropZone, dropZoneLayout ? styles.dropZoneReady : null]}
      >
        <View style={styles.headerRow}>
          <View style={styles.badgeLabelRow}>
            <View style={styles.dotIndicator} />
            <Text style={styles.sectionTitle}>{t.codeSequence}</Text>
            <View style={styles.countPill}>
              <Text style={styles.countPillText}>{workspaceBlocks.length}</Text>
            </View>
          </View>
          <Text style={styles.hintText}>{t.dragHint}</Text>
        </View>

        <View style={styles.sequenceWrapContainer}>
          {workspaceBlocks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t.emptyWorkspace}</Text>
            </View>
          ) : (
            workspaceBlocks.map((block, idx) => renderBlockItem(block, idx))
          )}
        </View>
      </View>

      {/* Komut Paleti: Eşit Dağıtılmış Tek Sıra */}
      <View style={styles.paletteSection}>
        <Text style={styles.paletteTitle}>{t.commandPalette}</Text>
        <View style={styles.paletteRow}>
          {(['FORWARD', 'TURN_RIGHT', 'TURN_LEFT', 'REPEAT', 'IF_WALL'] as CommandType[]).map((type) => {
            const visual = BLOCK_COLORS[type];
            return (
              <View key={type} style={styles.paletteItem}>
                <DraggableBlock
                  type={type}
                  label={t.blocks[type]}
                  color={visual.color}
                  shadowColor={visual.shadowColor}
                  icon={visual.icon}
                  dropZoneLayout={dropZoneLayout}
                  onDropSuccess={addBlock}
                />
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  badgeLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dotIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6366F1',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#334155',
    letterSpacing: 0.5,
  },
  countPill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4F46E5',
  },
  hintText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  dropZone: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 10,
    minHeight: 100,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  dropZoneReady: {
    borderColor: '#818CF8',
    backgroundColor: '#FAFAFF',
  },
  sequenceWrapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  emptyContainer: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  puzzleBlockTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    borderBottomWidth: 3,
    gap: 5,
  },
  activeBlockTag: {
    transform: [{ scale: 1.05 }],
    borderColor: '#FACC15',
    borderWidth: 2,
  },
  indexBadge: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 10,
    opacity: 0.8,
  },
  blockIconText: {
    fontSize: 12,
  },
  blockLabel: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 11,
  },
  deleteBadge: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    marginLeft: 2,
    opacity: 0.7,
  },
  repeatCard: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    borderBottomWidth: 3,
    borderBottomColor: '#D97706',
    borderRadius: 12,
    padding: 6,
    minWidth: 140,
    gap: 4,
  },
  ifCard: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1.5,
    borderColor: '#EF4444',
    borderBottomWidth: 3,
    borderBottomColor: '#B91C1C',
    borderRadius: 12,
    padding: 6,
    minWidth: 140,
    gap: 4,
  },
  activeContainer: {
    borderColor: '#4338CA',
    borderWidth: 2,
  },
  repeatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  repeatHeaderText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#92400E',
  },
  ifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ifHeaderText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#991B1B',
  },
  childBlocksArea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  childTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    borderBottomWidth: 2,
    gap: 3,
  },
  activeChildTag: {
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  childLabel: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 10,
  },
  childDeleteBadge: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
    marginLeft: 2,
  },
  emptyChildText: {
    fontSize: 9,
    color: '#B45309',
    fontWeight: '700',
    paddingVertical: 2,
  },
  addChildRow: {
    flexDirection: 'row',
    gap: 4,
  },
  addChildBtn: {
    flex: 1,
    paddingVertical: 3,
    borderRadius: 5,
    alignItems: 'center',
  },
  addChildText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  paletteSection: {
    gap: 6,
    marginTop: 2,
  },
  paletteTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  paletteRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
  },
  paletteItem: {
    flex: 1,
  },
});