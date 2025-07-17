import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import {
  spacing,
  fontSize,
  borderRadius,
  iconSize,
  buttonSize,
  inputSize,
  cardSize,
  imageSize,
  fabSize,
  isTablet,
} from '../utils/responsive';

// Responsive Container
export const ResponsiveContainer = ({ children, style, ...props }) => (
  <View
    style={[
      styles.container,
      isTablet && styles.containerTablet,
      style,
    ]}
    {...props}
  >
    {children}
  </View>
);

// Responsive Card
export const ResponsiveCard = ({ children, style, size = 'medium', ...props }) => (
  <View
    style={[
      styles.card,
      cardSize[size],
      isTablet && styles.cardTablet,
      style,
    ]}
    {...props}
  >
    {children}
  </View>
);

// Responsive Button
export const ResponsiveButton = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  ...props
}) => (
  <TouchableOpacity
    style={[
      styles.button,
      styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
      buttonSize[size],
      disabled && styles.buttonDisabled,
      isTablet && styles.buttonTablet,
      style,
    ]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.8}
    {...props}
  >
    {icon && iconPosition === 'left' && (
      <Ionicons
        name={icon}
        size={iconSize.sm}
        color={variant === 'primary' ? colors.surface : colors.primary}
        style={styles.buttonIconLeft}
      />
    )}
    <Text
      style={[
        styles.buttonText,
        styles[`buttonText${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
        disabled && styles.buttonTextDisabled,
        textStyle,
      ]}
    >
      {title}
    </Text>
    {icon && iconPosition === 'right' && (
      <Ionicons
        name={icon}
        size={iconSize.sm}
        color={variant === 'primary' ? colors.surface : colors.primary}
        style={styles.buttonIconRight}
      />
    )}
  </TouchableOpacity>
);

// Responsive Input
export const ResponsiveInput = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  size = 'medium',
  error,
  style,
  ...props
}) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={[
        styles.input,
        inputSize[size],
        error && styles.inputError,
        isTablet && styles.inputTablet,
        style,
      ]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      placeholderTextColor={colors.textSecondary}
      {...props}
    />
    {error && <Text style={styles.inputErrorText}>{error}</Text>}
  </View>
);

// Responsive Text
export const ResponsiveText = ({
  children,
  variant = 'body',
  style,
  numberOfLines,
  ...props
}) => (
  <Text
    style={[
      styles.text,
      styles[`text${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
      style,
    ]}
    numberOfLines={numberOfLines}
    {...props}
  >
    {children}
  </Text>
);

// Responsive Icon Button
export const ResponsiveIconButton = ({
  icon,
  onPress,
  size = 'medium',
  variant = 'primary',
  disabled = false,
  style,
  ...props
}) => (
  <TouchableOpacity
    style={[
      styles.iconButton,
      styles[`iconButton${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
      { width: iconSize[size], height: iconSize[size] },
      disabled && styles.iconButtonDisabled,
      style,
    ]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.8}
    {...props}
  >
    <Ionicons
      name={icon}
      size={iconSize[size] * 0.6}
      color={variant === 'primary' ? colors.surface : colors.primary}
    />
  </TouchableOpacity>
);

// Responsive FAB (Floating Action Button)
export const ResponsiveFAB = ({
  icon,
  onPress,
  size = 'medium',
  style,
  ...props
}) => (
  <TouchableOpacity
    style={[
      styles.fab,
      fabSize[size],
      isTablet && styles.fabTablet,
      style,
    ]}
    onPress={onPress}
    activeOpacity={0.8}
    {...props}
  >
    <Ionicons
      name={icon}
      size={iconSize.lg}
      color={colors.surface}
    />
  </TouchableOpacity>
);

// Responsive Image Container
export const ResponsiveImageContainer = ({
  children,
  size = 'medium',
  style,
  ...props
}) => (
  <View
    style={[
      styles.imageContainer,
      imageSize[size],
      isTablet && styles.imageContainerTablet,
      style,
    ]}
    {...props}
  >
    {children}
  </View>
);

// Responsive Header
export const ResponsiveHeader = ({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  style,
  ...props
}) => (
  <View
    style={[
      styles.header,
      isTablet && styles.headerTablet,
      style,
    ]}
    {...props}
  >
    {leftIcon && (
      <ResponsiveIconButton
        icon={leftIcon}
        onPress={onLeftPress}
        variant="secondary"
        size="lg"
      />
    )}
    <ResponsiveText variant="title" style={styles.headerTitle}>
      {title}
    </ResponsiveText>
    {rightIcon && (
      <ResponsiveIconButton
        icon={rightIcon}
        onPress={onRightPress}
        variant="secondary"
        size="lg"
      />
    )}
  </View>
);

// Responsive Empty State
export const ResponsiveEmptyState = ({
  icon,
  title,
  subtitle,
  actionTitle,
  onAction,
  style,
  ...props
}) => (
  <View
    style={[
      styles.emptyState,
      isTablet && styles.emptyStateTablet,
      style,
    ]}
    {...props}
  >
    <Ionicons
      name={icon}
      size={iconSize.xxxl}
      color={colors.textSecondary}
      style={styles.emptyStateIcon}
    />
    <ResponsiveText variant="title" style={styles.emptyStateTitle}>
      {title}
    </ResponsiveText>
    <ResponsiveText variant="body" style={styles.emptyStateSubtitle}>
      {subtitle}
    </ResponsiveText>
    {actionTitle && onAction && (
      <ResponsiveButton
        title={actionTitle}
        onPress={onAction}
        style={styles.emptyStateButton}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  containerTablet: {
    paddingHorizontal: spacing.xl,
  },

  // Card styles
  card: {
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: spacing.md,
  },
  cardTablet: {
    marginBottom: spacing.lg,
  },

  // Button styles
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonTablet: {
    borderRadius: borderRadius.lg,
  },
  buttonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  buttonTextPrimary: {
    color: colors.surface,
  },
  buttonTextSecondary: {
    color: colors.primary,
  },
  buttonTextOutline: {
    color: colors.text,
  },
  buttonTextDisabled: {
    color: colors.textSecondary,
  },
  buttonIconLeft: {
    marginRight: spacing.sm,
  },
  buttonIconRight: {
    marginLeft: spacing.sm,
  },

  // Input styles
  inputContainer: {
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    fontSize: fontSize.md,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputTablet: {
    fontSize: fontSize.lg,
    borderRadius: borderRadius.lg,
  },
  inputErrorText: {
    color: colors.error,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },

  // Text styles
  text: {
    color: colors.text,
  },
  textBody: {
    fontSize: fontSize.md,
  },
  textCaption: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  textTitle: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
  },
  textSubtitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  textLarge: {
    fontSize: fontSize.xl,
  },

  // Icon Button styles
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.round,
  },
  iconButtonPrimary: {
    backgroundColor: colors.primary,
  },
  iconButtonSecondary: {
    backgroundColor: 'transparent',
  },
  iconButtonDisabled: {
    opacity: 0.6,
  },

  // FAB styles
  fab: {
    position: 'absolute',
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabTablet: {
    shadowRadius: 12,
    elevation: 12,
  },

  // Image Container styles
  imageContainer: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.background,
  },
  imageContainerTablet: {
    borderRadius: borderRadius.lg,
  },

  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTablet: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.md,
  },

  // Empty State styles
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyStateTablet: {
    paddingHorizontal: spacing.xxl,
  },
  emptyStateIcon: {
    marginBottom: spacing.lg,
  },
  emptyStateTitle: {
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    textAlign: 'center',
    marginBottom: spacing.xl,
    color: colors.textSecondary,
  },
  emptyStateButton: {
    minWidth: 200,
  },
}); 