import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useGameStore } from '../../store/useGameStore';
import { CommandType, CodeBlock } from '../../core/types';
import { DraggableBlock } from './DraggableBlock';

const BLOCK_CONFIG: Record<
  CommandType,
  { label: string; color: string; shadowColor: string; icon: string }
> = {
  FORWARD: { label: 'İleri', color: '#3B82F6', shadowColor: '#1D4ED8', icon: '⬆️' },
  TURN_RIGHT: { label: 'Sağa', color: '#8B5CF6', shadowColor: '#6D28D9', icon: '↪️' },
  TURN_LEFT: { label: 'Sola', color: '#EC4899', shadowColor: '#BE185D', icon: '↩️' },
  REPEAT: { label: '3x Döngü', color: '#F59E0B', shadowColor: '#B45309', icon: '🔁' },
};

export const Workspace = () => {
  const workspaceBlocks = useGameStore((s) => s.workspaceBlocks);
  const activeBlockId = useGameStore((s) => s.activeBlockId);
  const addBlock = useGameStore((s) => s.addBlock);
  const addChildBlock = useGameStore((s) => s.addChildBlock);
  const removeBlock = useGameStore((s) => s.removeBlock);

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
    const conf = BLOCK_CONFIG[block.type];
    const isActive = activeBlockId === block.id;

    if (block.type === 'REPEAT') {
      return (
        <View
          key={block.id}
          style={[styles.repeatCard, isActive && styles.activeContainer]}
        >
          <View style={styles.repeatHeader}>
            <Text style={styles.repeatHeaderText}>🔁 3x Tekrarla</Text>
            <TouchableOpacity
              onPress={() => removeBlock(block.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.deleteBadge}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Döngü İçi Komutlar */}
          <View style={styles.childBlocksArea}>
            {block.children && block.children.length > 0 ? (
              block.children.map((child) => {
                const childConf = BLOCK_CONFIG[child.type];
                const isChildActive = activeBlockId === child.id;

                return (
                  <TouchableOpacity
                    key={child.id}
                    style={[
                      styles.childTag,
                      { backgroundColor: childConf.color, borderBottomColor: childConf.shadowColor },
                      isChildActive && styles.activeChildTag,
                    ]}
                    onPress={() => removeBlock(child.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.blockIconText}>{childConf.icon}</Text>
                    <Text style={styles.childLabel}>{childConf.label}</Text>
                    <Text style={styles.childDeleteBadge}>✕</Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={styles.emptyChildText}>Döngüye komut ekleyin</Text>
            )}
          </View>

          {/* Döngüye Hızlı Komut Ekleme Butonları */}
          <View style={styles.addChildRow}>
            <TouchableOpacity
              style={[styles.addChildBtn, { backgroundColor: '#3B82F6' }]}
              onPress={() => addChildBlock(block.id, 'FORWARD')}
            >
              <Text style={styles.addChildText}>+ İleri</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addChildBtn, { backgroundColor: '#8B5CF6' }]}
              onPress={() => addChildBlock(block.id, 'TURN_RIGHT')}
            >
              <Text style={styles.addChildText}>+ Sağa</Text>
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
          { backgroundColor: conf.color, borderBottomColor: conf.shadowColor },
          isActive && styles.activeBlockTag,
        ]}
        onPress={() => removeBlock(block.id)}
        activeOpacity={0.8}
      >
        <Text style={styles.indexBadge}>{index + 1}</Text>
        <Text style={styles.blockIconText}>{conf.icon}</Text>
        <Text style={styles.blockLabel}>{conf.label}</Text>
        <Text style={styles.deleteBadge}>✕</Text>
        <View style={[styles.puzzleNub, { backgroundColor: conf.color }]} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Kod Dizilim Alanı (Drop Zone) */}
      <View
        ref={dropZoneRef}
        onLayout={onDropZoneLayout}
        style={[styles.dropZone, dropZoneLayout ? styles.dropZoneReady : null]}
      >
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>KOD DİZİLİMİ ({workspaceBlocks.length})</Text>
          <Text style={styles.hintText}>Sürükleyin veya dokunun</Text>
        </View>

        {/* Ekrana sığarak alt alta geçen sarıcı yapı */}
        <View style={styles.sequenceWrapContainer}>
          {workspaceBlocks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Komutları buraya sürükleyip bırakın...</Text>
            </View>
          ) : (
            workspaceBlocks.map((block, idx) => renderBlockItem(block, idx))
          )}
        </View>
      </View>

      {/* Komut Blokları Paleti */}
      <View style={styles.paletteSection}>
        <Text style={styles.paletteTitle}>KOMUT BLOKLARI</Text>
        <View style={styles.paletteRow}>
          {(['FORWARD', 'TURN_RIGHT', 'TURN_LEFT', 'REPEAT'] as CommandType[]).map((type) => {
            const conf = BLOCK_CONFIG[type];
            return (
              <DraggableBlock
                key={type}
                type={type}
                label={conf.label}
                color={conf.color}
                shadowColor={conf.shadowColor}
                icon={conf.icon}
                dropZoneLayout={dropZoneLayout}
                onDropSuccess={addBlock}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  hintText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
  },
  dropZone: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 10,
    minHeight: 110,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    justifyContent: 'center',
  },
  dropZoneReady: {
    borderColor: '#818CF8',
    backgroundColor: '#F8FAFC',
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
    fontStyle: 'italic',
  },
  puzzleBlockTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    borderBottomWidth: 3,
    gap: 5,
    position: 'relative',
  },
  activeBlockTag: {
    transform: [{ scale: 1.05 }],
    borderColor: '#FACC15',
    borderWidth: 2,
  },
  indexBadge: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 10,
    opacity: 0.75,
  },
  blockIconText: {
    fontSize: 12,
  },
  blockLabel: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
  },
  deleteBadge: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    marginLeft: 3,
    opacity: 0.75,
  },
  puzzleNub: {
    position: 'absolute',
    right: -3,
    top: '36%',
    width: 4,
    height: 8,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
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
  activeContainer: {
    borderColor: '#B45309',
    transform: [{ scale: 1.03 }],
  },
  repeatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  repeatHeaderText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400E',
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
    fontWeight: '700',
    fontSize: 10,
  },
  childDeleteBadge: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
    marginLeft: 2,
    opacity: 0.8,
  },
  emptyChildText: {
    fontSize: 9,
    color: '#B45309',
    fontStyle: 'italic',
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
  },
  paletteTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  paletteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    zIndex: 100,
  },
});