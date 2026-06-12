export const tokens = {
  colors: {
    paper: '#fffdf7',
    pageShadow: 'rgba(0,0,0,0.16)',
    text: '#111111',
    red: '#9b1720',
    creaseLight: '#f2f2ef',
    creaseMid: '#d9d9d6',
    background: '#f8f6f1',
    ribbonDark: '#6b0712',
    ribbon: '#a20e1e',
    ribbonHighlight: '#c51c2d',
    panelBorder: '#e0ddd6',
    panelText: '#2f3440',
    annotation: '#4f35ff',
    speaker: '#1c4f82',
  },
  typography: {
    bodySize: 26,
    lineHeight: 34,
    verseSize: 12,
    headerSize: 17,
    titleSize: 14.5,
    footerSize: 17,
  },
  layout: {
    designWidth: 1024,
    stageRatio: 4 / 3,
    pageOuterPadding: 54,
    pageInnerPadding: 36,
    gutterWidth: 22,
    pageRadius: 2,
  },
};

export type BookTokens = typeof tokens;
