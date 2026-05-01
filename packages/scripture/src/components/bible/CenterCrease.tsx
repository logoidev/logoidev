import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Pattern, Rect, Stop } from 'react-native-svg';

import { tokens } from '@/theme/bookTokens';

type CenterCreaseProps = {
  width: number;
  height: number;
};

function clamp(value: number, min: number, max: number) {
  'worklet';
  return Math.max(min, Math.min(max, value));
}

export function CenterCrease({ width, height }: CenterCreaseProps) {
  const edgeWidth = Math.max(1.5, width * 0.14);
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .onUpdate((event) => {
          rotateY.value = clamp(event.translationX / Math.max(width * 0.9, 1), -1, 1);
          rotateX.value = clamp(-event.translationY / Math.max(height * 0.22, 1), -0.8, 0.8);
        })
        .onEnd(() => {
          rotateX.value = withSpring(0, { damping: 14, stiffness: 130 });
          rotateY.value = withSpring(0, { damping: 14, stiffness: 130 });
        }),
    [height, rotateX, rotateY, width],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 220 },
      { rotateX: `${rotateX.value * 8}deg` },
      { rotateY: `${rotateY.value * 18}deg` },
      { scaleX: 1 + Math.abs(rotateY.value) * 0.05 },
    ],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        accessibilityLabel="Interactive cloth bookmark"
        accessibilityRole="imagebutton"
        style={[styles.container, animatedStyle, { width, height }]}>
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id="clothBody" x1="0" x2="1" y1="0" y2="0">
              <Stop offset="0" stopColor="#3d0309" />
              <Stop offset="0.12" stopColor={tokens.colors.ribbonDark} />
              <Stop offset="0.38" stopColor={tokens.colors.ribbon} />
              <Stop offset="0.52" stopColor={tokens.colors.ribbonHighlight} />
              <Stop offset="0.76" stopColor="#8a101a" />
              <Stop offset="1" stopColor="#340207" />
            </LinearGradient>
            <LinearGradient id="clothFalloff" x1="0" x2="0" y1="0" y2="1">
              <Stop offset="0" stopColor="#000000" stopOpacity="0.22" />
              <Stop offset="0.08" stopColor="#000000" stopOpacity="0.02" />
              <Stop offset="0.9" stopColor="#000000" stopOpacity="0.03" />
              <Stop offset="1" stopColor="#000000" stopOpacity="0.26" />
            </LinearGradient>
            <Pattern id="clothWeave" width="8" height="8" patternUnits="userSpaceOnUse">
              <Rect width="0.8" height="8" x="1.2" fill="#fff4f4" opacity="0.08" />
              <Rect width="0.9" height="8" x="5.6" fill="#260105" opacity="0.16" />
              <Rect width="8" height="0.8" y="1.8" fill="#fff4f4" opacity="0.06" />
              <Rect width="8" height="1" y="5.6" fill="#250105" opacity="0.13" />
              <Path d="M-2 8L8 -2M3 10L10 3" stroke="#fff4f4" strokeOpacity="0.035" strokeWidth="0.8" />
            </Pattern>
          </Defs>
          <Rect width={width} height={height} fill="url(#clothBody)" />
          <Rect width={width} height={height} fill="url(#clothWeave)" />
          <Rect width={width} height={height} fill="url(#clothFalloff)" />
          <Rect width={edgeWidth} height={height} fill="#130103" opacity="0.32" />
          <Rect x={width - edgeWidth} width={edgeWidth} height={height} fill="#130103" opacity="0.36" />
          <Rect x={edgeWidth} width={Math.max(1, width * 0.1)} height={height} fill="#f1a2a8" opacity="0.08" />
        </Svg>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.ribbonDark,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.26)',
    overflow: 'hidden',
    zIndex: 2,
  },
});
