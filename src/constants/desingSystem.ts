import { Dimensions, I18nManager } from 'react-native';

export const widthRatio = Dimensions.get('window').width / 360;
export const heightRatio = Dimensions.get('window').height / 800;
const isRTL = I18nManager.isRTL;

// Border widths
export const borders = {
  xs: widthRatio * 1,
  sm: widthRatio * 2,
  md: widthRatio * 4,
  lg: widthRatio * 8,
};

// Border radius
export const radius = {
  sm: widthRatio * 4,
  xsm: widthRatio * 8,
  md: widthRatio * 10,
  lg: widthRatio * 12,
  xl: widthRatio * 18,
  xxl: widthRatio * 24,
  full: widthRatio * 9999,
};

export const flexDirectionRow = isRTL ? 'row' : 'row-reverse';

// Fonts
export const fonts = {
  body: 'Roboto-Regular',
  heading: 'Roboto-Bold',
  mono: 'RobotoMono-Regular',
};

// Icon sizes
export const iconSizes = {
  xs: widthRatio * 8,
  sm: widthRatio * 10,
  md: widthRatio * 12,
  lg: widthRatio * 16,
  xl: widthRatio * 20,
  '2xl': widthRatio * 24,
  '3xl': widthRatio * 28,
  '4xl': widthRatio * 36,
  '5xl': widthRatio * 44,
};

// Font sizes
export const fontSizes = {
  xs: widthRatio * 8,
  sm: widthRatio * 10,
  md: widthRatio * 12,
  f14: widthRatio * 14,
  lg: widthRatio * 16,
  xl: widthRatio * 18,
  '2xl': widthRatio * 24,
  '3xl': widthRatio * 28,
  '4xl': widthRatio * 36,
  '5xl': widthRatio * 48,
  '6xl': widthRatio * 64,
};

// Line heights
export const lineHeights = {
  xs: widthRatio * 10,
  sm: widthRatio * 14,
  md: widthRatio * 18,
  lg: widthRatio * 20,
  xl: widthRatio * 28,
  '2xl': widthRatio * 32,
  '3xl': widthRatio * 40,
  '4xl': widthRatio * 48,
  '5xl': widthRatio * 60,
};

// Paddings
export const paddings = {
  tiny: 3,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 70,
  '5xl': 100,
};

// Margins
export const margins = {
  tiny: 3,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 60,
  '5xl': 100,
};

// Widths
export const widths = {
  tiny: widthRatio * 32,
  xTiny: widthRatio * 54,
  xs: widthRatio * 67,
  xsm: widthRatio * 90,
  w75: widthRatio * 75,
  sm: widthRatio * 120,
  md: widthRatio * 200,
  lg: widthRatio * 250,
  xl: widthRatio * 350,
  '2xl': widthRatio * 450,
  '3xl': widthRatio * 550,
};

// Heights
export const heights = {
  tiny: heightRatio * 10,
  xs: heightRatio * 12,
  sm: heightRatio * 16,
  md: heightRatio * 24,
  lg: heightRatio * 36,
  xl: heightRatio * 48,
  '2xl': heightRatio * 56,
  '3xl': heightRatio * 64,
  h70: heightRatio * 70,
  '4xl': heightRatio * 120,
};

// Image Heights
export const imageHeights = {
  xs: heightRatio * 120,
  sm: heightRatio * 140,
  md: heightRatio * 180,
  lg: heightRatio * 250,
  xl: heightRatio * 350,
  '2xl': heightRatio * 500,
};

// Circles
export const circles = {
  tiny: widthRatio * 10,
  xs: widthRatio * 24,
  sm: widthRatio * 32,
  md: widthRatio * 42,
  sp: widthRatio * 67,
  lg: widthRatio * 120,
  xl: widthRatio * 160,
  '2xl': widthRatio * 220,
};

// font family names
export const fontFamilyNames = {
  bold: 'Gilroy-Bold',
  light: 'Gilroy-Light',
  medium: 'Gilroy-Medium',
  regular: 'Gilroy-Regular',
  semiBold: 'Gilroy-SemiBold',
};

// shadow style
export const shadowStyle = {
  shadowOffset: { width: 8, height: 8 },
  shadowOpacity: 0.12,
  shadowRadius: 24,
  elevation: 8,
};
