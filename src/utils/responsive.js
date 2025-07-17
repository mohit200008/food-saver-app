import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions for design (using iPhone 11 Pro as base)
const baseWidth = 375;
const baseHeight = 812;

// Responsive scaling functions
export const scale = (size) => {
  const newSize = size * (SCREEN_WIDTH / baseWidth);
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

export const verticalScale = (size) => {
  const newSize = size * (SCREEN_HEIGHT / baseHeight);
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

export const moderateScale = (size, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

// Screen dimensions
export const screenWidth = SCREEN_WIDTH;
export const screenHeight = SCREEN_HEIGHT;

// Responsive spacing
export const spacing = {
  xs: scale(4),
  sm: scale(8),
  md: scale(16),
  lg: scale(24),
  xl: scale(32),
  xxl: scale(48),
};

// Responsive font sizes
export const fontSize = {
  xs: scale(10),
  sm: scale(12),
  md: scale(14),
  lg: scale(16),
  xl: scale(18),
  xxl: scale(20),
  xxxl: scale(24),
  title: scale(28),
  largeTitle: scale(32),
};

// Responsive padding/margin
export const padding = {
  xs: scale(4),
  sm: scale(8),
  md: scale(16),
  lg: scale(24),
  xl: scale(32),
  xxl: scale(48),
};

export const margin = {
  xs: scale(4),
  sm: scale(8),
  md: scale(16),
  lg: scale(24),
  xl: scale(32),
  xxl: scale(48),
};

// Responsive border radius
export const borderRadius = {
  xs: scale(4),
  sm: scale(8),
  md: scale(12),
  lg: scale(16),
  xl: scale(24),
  round: scale(50),
};

// Responsive icon sizes
export const iconSize = {
  xs: scale(12),
  sm: scale(16),
  md: scale(20),
  lg: scale(24),
  xl: scale(32),
  xxl: scale(48),
  xxxl: scale(64),
};

// Screen size breakpoints
export const isSmallDevice = SCREEN_WIDTH < 375;
export const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
export const isLargeDevice = SCREEN_WIDTH >= 414;
export const isTablet = SCREEN_WIDTH >= 768;

// Responsive container widths
export const containerWidth = {
  small: SCREEN_WIDTH * 0.9,
  medium: SCREEN_WIDTH * 0.85,
  large: SCREEN_WIDTH * 0.8,
  tablet: Math.min(SCREEN_WIDTH * 0.7, 600),
};

// Responsive button sizes
export const buttonSize = {
  small: {
    height: scale(36),
    paddingHorizontal: spacing.md,
  },
  medium: {
    height: scale(44),
    paddingHorizontal: spacing.lg,
  },
  large: {
    height: scale(52),
    paddingHorizontal: spacing.xl,
  },
};

// Responsive input sizes
export const inputSize = {
  small: {
    height: scale(36),
    paddingHorizontal: spacing.md,
  },
  medium: {
    height: scale(44),
    paddingHorizontal: spacing.md,
  },
  large: {
    height: scale(52),
    paddingHorizontal: spacing.md,
  },
};

// Responsive card sizes
export const cardSize = {
  small: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  medium: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  large: {
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
  },
};

// Responsive image sizes
export const imageSize = {
  thumbnail: {
    width: scale(60),
    height: scale(60),
  },
  small: {
    width: scale(80),
    height: scale(80),
  },
  medium: {
    width: scale(120),
    height: scale(120),
  },
  large: {
    width: scale(200),
    height: scale(200),
  },
  profile: {
    width: scale(100),
    height: scale(100),
  },
};

// Responsive FAB (Floating Action Button) sizes
export const fabSize = {
  small: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
  },
  medium: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
  },
  large: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
  },
};

// Safe area helpers
export const getSafeAreaPadding = (insets) => ({
  paddingTop: insets?.top || spacing.lg,
  paddingBottom: insets?.bottom || spacing.md,
  paddingLeft: insets?.left || spacing.md,
  paddingRight: insets?.right || spacing.md,
});

// Responsive grid helpers
export const getGridColumns = () => {
  if (isTablet) return 2;
  if (isLargeDevice) return 1;
  return 1;
};

export const getGridSpacing = () => {
  if (isTablet) return spacing.lg;
  return spacing.md;
};

// Responsive header height
export const headerHeight = Platform.OS === 'ios' 
  ? verticalScale(88) 
  : verticalScale(64);

// Responsive bottom tab height
export const bottomTabHeight = verticalScale(83);

// Responsive keyboard avoiding view offset
export const keyboardOffset = Platform.OS === 'ios' 
  ? verticalScale(20) 
  : verticalScale(0); 