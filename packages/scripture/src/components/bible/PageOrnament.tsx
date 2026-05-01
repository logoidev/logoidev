import React from 'react';
import Svg, { G, Path } from 'react-native-svg';

import { tokens } from '@/theme/bookTokens';

type PageOrnamentProps = {
  width: number;
  height: number;
  flipped?: boolean;
};

export function PageOrnament({ width, height, flipped }: PageOrnamentProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 70 28" style={flipped ? { transform: [{ scaleX: -1 }] } : undefined}>
      <G fill="none" stroke={tokens.colors.red} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2}>
        <Path d="M5 18c9 4 16-1 22-7" />
        <Path d="M17 16c-4-8 7-12 10-4" />
        <Path d="M30 14c-2-6 8-10 12-2 3 7-6 10-12 2Z" fill={tokens.colors.red} strokeWidth={1} />
        <Path d="M42 15c7-6 13-5 23-10" />
        <Path d="M47 18c5 6 13 4 16-2" />
        <Path d="M23 22c8-3 16-3 25 0" strokeWidth={1.8} />
      </G>
    </Svg>
  );
}
