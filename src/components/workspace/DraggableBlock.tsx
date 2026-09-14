import React from 'react';
import { StyleSheet, Text } from 'react-native';
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
  icon: string;
  dropZoneLayout: DropAreaLayout | null;
  onDropSuccess: (type: CommandType) => void;
}

export const DraggableBlock = ({
  type,
  label,
  color,
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

        // Bırakılan noktanın DropZone sınırları içinde olup olmadığının kontrolü
        const isInside =
          dropAbsoluteX >= dropZoneLayout.x &&
          dropAbsoluteX <= dropZoneLayout.x + dropZoneLayout.width &&
          dropAbsoluteY >= dropZoneLayout.y &&
          dropAbsoluteY <= dropZoneLayout.y + dropZoneLayout.height;

        if (isInside) {
          runOnJS(onDropSuccess)(type);
        }
      }

      // Bloğu yayınlanmış orijinal konumuna yaylanarak geri döndür
      translateX.value = withSpring(0, { damping: 15, stiffness: 120 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 120 });
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: isDragging.value ? 1.08 : 1 },
      ],
      zIndex: isDragging.value ? 999 : 1,
      elevation: isDragging.value ? 8 : 2,
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.block, { backgroundColor: color }, animatedStyle]}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.label}>{label}</Text>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  block: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  icon: {
    fontSize: 18,
    marginBottom: 2,
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
});