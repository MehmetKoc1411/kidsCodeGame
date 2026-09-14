import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { CommandType } from '../../core/types';

interface DropAreaLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DraggableBlockProps {
  type: CommandType;
  label: string;
  color: string;
  shadowColor: string;
  icon: string;
  dropZoneLayout: DropAreaLayout | null;
  onDropSuccess: (type: CommandType) => void;
}

export const DraggableBlock = ({
  type,
  label,
  color,
  shadowColor,
  icon,
  dropZoneLayout,
  onDropSuccess,
}: DraggableBlockProps) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      isDragging.value = true;
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      isDragging.value = false;

      if (dropZoneLayout) {
        const dropAbsoluteX = event.absoluteX;
        const dropAbsoluteY = event.absoluteY;

        const isInside =
          dropAbsoluteX >= dropZoneLayout.x &&
          dropAbsoluteX <= dropZoneLayout.x + dropZoneLayout.width &&
          dropAbsoluteY >= dropZoneLayout.y &&
          dropAbsoluteY <= dropZoneLayout.y + dropZoneLayout.height;

        if (isInside) {
          runOnJS(onDropSuccess)(type);
        }
      }

      translateX.value = withSpring(0, { damping: 15, stiffness: 120 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 120 });
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: isDragging.value ? 1.12 : 1 },
      ],
      zIndex: isDragging.value ? 999 : 1,
      elevation: isDragging.value ? 10 : 3,
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          styles.block,
          { backgroundColor: color, borderBottomColor: shadowColor },
          animatedStyle,
        ]}
      >
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.label}>{label}</Text>
        {/* Sağ kenardaki yapboz tırnağı hissi */}
        <View style={[styles.puzzleTab, { backgroundColor: color }]} />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  block: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 4, // 3D Plastik oyuncak tuş efekti
    position: 'relative',
    overflow: 'visible',
  },
  icon: {
    fontSize: 18,
    marginBottom: 2,
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.3,
  },
  puzzleTab: {
    position: 'absolute',
    right: -4,
    top: '40%',
    width: 6,
    height: 10,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    opacity: 0.7,
  },
});