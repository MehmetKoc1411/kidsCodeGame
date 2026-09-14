import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useGameStore } from '../../store/useGameStore';
import { CommandType, CodeBlock } from '../../core/types';
import { DraggableBlock } from './DraggableBlock';

const BLOCK_CONFIG: Record<CommandType, { label: string; color: string; icon: string }> = {
  FORWARD: { label: 'İleri', color: '#3B82F6', icon: '⬆️' },
  TURN_RIGHT: { label: 'Sağa', color: '#8B5CF6', icon: '↪️' },
  TURN_LEFT: { label: 'Sola', color: '#EC4899', icon: '↩️' },
  REPEAT: { label: '3x Döngü', color: '#F59E0B', icon: '🔁' },
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
        <View key={block.id} style={[styles.repeatContainer, isActive && styles.activeContainer]}>
          <View style={styles.repeatHeader}>
            <Text style={styles.repeatHeaderText}>🔁 3 Kez Tekrarla:</Text>
            <TouchableOpacity onPress={() => removeBlock(block.id)}>
              <Text style={styles.deleteBadge}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* İç bloklar */}
          <View style={styles.childContainer}>
            {block.children && block.children.length > 0 ? (
              block.children.map((c, i) => (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.blockTag, { backgroundColor: BLOCK_CONFIG[c.type].color }, activeBlockId === c.id && styles.activeBlockTag]}
                  onPress={() => removeBlock(c.id)}
                >
                  <Text style={styles.blockTagIcon}>{BLOCK_CONFIG[c.type].icon}</Text>
                  <Text style={styles.blockTagText}>{BLOCK_CONFIG[c.type].label}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyChildText}>Döngüye komut eklemek için aşağıdan + İleri seçin</Text>
            )}
          </View>

          {/* Döngü içine komut ekleme kısayolu */}
          <TouchableOpacity
            style={styles.addChildBtn}
            onPress={() => addChildBlock(block.id, 'FORWARD')}
          >
            <Text style={styles.addChildText}>+ İleri Ekle</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={block.id}
        style={[
          styles.blockTag,
          { backgroundColor: conf.color },
          isActive && styles.activeBlockTag,
        ]}
        onPress={() => removeBlock(block.id)}
        activeOpacity={0.8}
      >
        <Text style={styles.blockTagIndex}>{index + 1}</Text>
        <Text style={styles.blockTagIcon}>{conf.icon}</Text>
        <Text style={styles.blockTagText}>{conf.label}</Text>
        <Text style={styles.deleteBadge}>✕</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Sürükle-Bırak Kod Dizilim Alanı */}
      <View
        ref={dropZoneRef}
        onLayout={onDropZoneLayout}
        style={[styles.sequenceArea, dropZoneLayout ? styles.dropZoneActive : null]}
      >
        <Text style={styles.sectionTitle}>Kod Dizilimi ({workspaceBlocks.length})</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sequenceList}
        >
          {workspaceBlocks.length === 0 ? (
            <View style={styles.placeholderContainer}>
              <Text style={styles.emptyText}>Blokları bu alana sürükleyip bırakın...</Text>
            </View>
          ) : (
            workspaceBlocks.map((b, i) => renderBlockItem(b, i))
          )}
        </ScrollView>
      </View>

      {/* Komut Paleti */}
      <View style={styles.paletteContainer}>
        <Text style={styles.paletteTitle}>Komut Blokları</Text>
        <View style={styles.palette}>
          {(['FORWARD', 'TURN_RIGHT', 'TURN_LEFT', 'REPEAT'] as CommandType[]).map((type) => {
            const conf = BLOCK_CONFIG[type];
            return (
              <DraggableBlock
                key={type}
                type={type}
                label={conf.label}
                color={conf.color}
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
    marginTop: 10,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  sequenceArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    minHeight: 110,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    justifyContent: 'center',
  },
  dropZoneActive: {
    borderColor: '#6366F1',
  },
  placeholderContainer: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  sequenceList: {
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 12,
    fontStyle: 'italic',
  },
  blockTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 5,
  },
  activeBlockTag: {
    transform: [{ scale: 1.08 }],
    borderWidth: 2,
    borderColor: '#FACC15',
  },
  blockTagIndex: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
    opacity: 0.8,
  },
  blockTagIcon: {
    fontSize: 13,
  },
  blockTagText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  deleteBadge: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 3,
    opacity: 0.7,
  },
  repeatContainer: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    borderRadius: 10,
    padding: 8,
    minWidth: 140,
    gap: 6,
  },
  activeContainer: {
    borderColor: '#D97706',
    borderWidth: 2,
  },
  repeatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  repeatHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
  },
  childContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  emptyChildText: {
    fontSize: 10,
    color: '#B45309',
    fontStyle: 'italic',
  },
  addChildBtn: {
    backgroundColor: '#FDE68A',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  addChildText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#78350F',
  },
  paletteContainer: {
    gap: 6,
  },
  paletteTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  palette: {
    flexDirection: 'row',
    gap: 6,
  },
});