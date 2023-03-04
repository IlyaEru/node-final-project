export type Theme = typeof theme;

const theme = {
  colors: {
    primaryDarkBlue: '#063251',
    primaryBlue: '#49a6e9',
    primaryBlue2: '#2caeba',
    primaryLightBlue: '#c5e5fc',
    primaryLightBlue2: '#bff8fd',
    primaryLightBlue3: '#88ebf2',
    blueStage1: '#1890ff',
    blueStage2: '#096dd9',
    blueStage3: '#0050b3',
    navbarBlue: '#21333d',

    darkRed: '#a80000',
    red: '#ff0000',
    lightRed: '#ffcccc',
    redStage1: '#ff4d4f',
    redStage2: '#ff1f1f',
    redStage3: '#a8071a',

    darkGreen: '#006400',
    green: '#00ff00',
    lightGreen: '#ccffcc',
    greenStage1: '#52c41a',
    greenStage2: '#389e0d',
    greenStage3: '#237804',

    darkGrey: '#333',
    blueGrey: '#617d98',
    grey: '#ccc',
    lightGrey: '#f1f5f8',
    lightGrey2: '#dae2ec',
    lightGrey3: '#f5f5f5',
    textGrey: '#757575',

    darkWhite: '#B9B9B9',
    white: '#e6e6e6',
    brightWhite: '#fff',
    black: '#000',

    darkPurple: '#3f007d',
    purple: '#4b145b',
    lightPurple: '#c5b3d9',

    darkGold: '#b58900',
    gold: '#c59d5f',
    lightGold: '#f1e5d8',

    yellow: '#fedc11',
    darkYellow: '#f1c40f',

    darkBrown: '#8b4513',
    brown: '#ba5d2c',
    lightBrown: '#f1e5d8',
  },

  breakpoints: {
    xSmall: '576px',
    small: '768px',
    medium: '992px',
    large: '1200px',
  },

  fonts: {
    primary: 'Roboto,-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
    secondary: 'Montserrat, sans-serif',
  },

  lightShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
  darkShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
  transition: 'all 0.3s linear',
  borderRadius: '0.25rem',

  formMaxWidth: '600px',
  smallMaxWidth: '920px',
  largeMaxWidth: '1200px',

  letterSpacing: '0.1rem',
};

export default theme;
