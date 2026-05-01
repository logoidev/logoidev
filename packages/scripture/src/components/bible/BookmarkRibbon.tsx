import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Pattern, Rect, Stop } from 'react-native-svg';

import { tokens } from '@/theme/bookTokens';

type BookmarkRibbonProps = {
  progress: SharedValue<number>;
  onRibbonDrag?: (progress: number) => void;
  left: number;
  top: number;
  width: number;
  height: number;
};

function clamp(value: number) {
  'worklet';
  return Math.max(0, Math.min(1, value));
}

export function BookmarkRibbon({ progress, onRibbonDrag, left, top, width, height }: BookmarkRibbonProps) {
  const dragStart = useSharedValue(0);
  const pullDistance = height * 0.88;

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .onBegin(() => {
          dragStart.value = progress.value;
        })
        .onUpdate((event) => {
          const next = clamp(dragStart.value + event.translationY / pullDistance);
          progress.value = next;
          if (onRibbonDrag) {
            runOnJS(onRibbonDrag)(next);
          }
        })
        .onEnd((event) => {
          const shouldOpen = progress.value > 0.42 || event.velocityY > 240;
          progress.value = withSpring(shouldOpen ? 1 : 0, {
            damping: 12,
            mass: 0.75,
            stiffness: 110,
            velocity: event.velocityY / 1000,
          });
        }),
    [dragStart, onRibbonDrag, progress, pullDistance],
  );

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = -height - 18 + progress.value * (height + 40);
    const rotate = interpolate(progress.value, [0, 0.45, 0.75, 1], [-1.4, 2.2, -1.2, -0.25]);
    const shadowOpacity = interpolate(progress.value, [0, 1], [0.08, 0.28]);

    return {
      opacity: interpolate(progress.value, [0, 0.04, 1], [0, 1, 1]),
      shadowOpacity,
      transform: [{ translateY }, { rotateZ: `${rotate}deg` }],
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          styles.ribbon,
          animatedStyle,
          {
            left,
            top,
            width,
            height,
          },
        ]}>
        <Svg width={width} height={height} viewBox="0 0 100 360">
          <Defs>
            <LinearGradient id="ribbonBody" x1="0" x2="1" y1="0" y2="0">
              <Stop offset="0" stopColor={tokens.colors.ribbonDark} />
              <Stop offset="0.22" stopColor="#86111d" />
              <Stop offset="0.5" stopColor={tokens.colors.ribbonHighlight} />
              <Stop offset="0.78" stopColor={tokens.colors.ribbon} />
              <Stop offset="1" stopColor="#590913" />
            </LinearGradient>
            <LinearGradient id="ribbonShade" x1="0" x2="0" y1="0" y2="1">
              <Stop offset="0" stopColor="#ffffff" stopOpacity="0.26" />
              <Stop offset="0.18" stopColor="#ffffff" stopOpacity="0" />
              <Stop offset="0.82" stopColor="#000000" stopOpacity="0.04" />
              <Stop offset="1" stopColor="#000000" stopOpacity="0.28" />
            </LinearGradient>
            <Pattern id="woven" width="12" height="12" patternUnits="userSpaceOnUse">
              <Rect width="1.4" height="12" x="1" fill="#ffffff" opacity="0.16" />
              <Rect width="12" height="1.2" y="5" fill="#2f0208" opacity="0.14" />
              <Rect width="1" height="12" x="8" fill="#2f0208" opacity="0.16" />
            </Pattern>
          </Defs>
          <Path d="M9 0H91V320L50 286L9 320Z" fill="url(#ribbonBody)" />
          <Path d="M9 0H91V320L50 286L9 320Z" fill="url(#woven)" opacity="0.76" />
          <Path d="M9 0H91V320L50 286L9 320Z" fill="url(#ribbonShade)" />
          <Path d="M18 10V296" stroke="#f3a0a8" strokeDasharray="2 10" strokeLinecap="round" strokeWidth="4" opacity="0.82" />
          <Path d="M82 10V296" stroke="#4a060f" strokeDasharray="2 10" strokeLinecap="round" strokeWidth="4" opacity="0.62" />
          <Path d="M9 0H91" stroke="#f5b4ba" strokeWidth="5" opacity="0.34" />
          <Path d="M12 0H88V22H12Z" fill="#580812" opacity="0.28" />
        </Svg>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  ribbon: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 10 },
    shadowRadius: 12,
    elevation: 8,
  },
});
