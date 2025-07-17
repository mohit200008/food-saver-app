import React, { useState, useEffect } from 'react';
import { View, Dimensions, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  spacing,
  isTablet,
  getSafeAreaPadding,
  fontSize,
  borderRadius,
} from '../utils/responsive';
import { colors } from '../constants/colors';

// Responsive Layout Component
export const ResponsiveLayout = ({ 
  children, 
  style, 
  padding = true,
  safeArea = true,
  ...props 
}) => {
  const insets = useSafeAreaInsets();
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const isLandscape = dimensions.width > dimensions.height;
  const isTabletLandscape = isTablet && isLandscape;

  return (
    <View
      style={[
        styles.container,
        safeArea && getSafeAreaPadding(insets),
        padding && styles.padding,
        isTabletLandscape && styles.tabletLandscape,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

// Responsive Grid Layout
export const ResponsiveGrid = ({ 
  children, 
  columns = 'auto',
  spacing: gridSpacing = 'md',
  style,
  ...props 
}) => {
  const getColumnCount = () => {
    if (typeof columns === 'number') return columns;
    if (isTablet) return 2;
    return 1;
  };

  const columnCount = getColumnCount();
  const spacingValue = spacing[gridSpacing] || spacing.md;

  return (
    <View
      style={[
        styles.grid,
        {
          gap: spacingValue,
        },
        style,
      ]}
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <View
          key={index}
          style={[
            styles.gridItem,
            {
              flex: columnCount > 1 ? `0 0 calc(50% - ${spacingValue / 2}px)` : 1,
            },
          ]}
        >
          {child}
        </View>
      ))}
    </View>
  );
};

// Responsive Section Layout
export const ResponsiveSection = ({ 
  children, 
  title,
  subtitle,
  style,
  ...props 
}) => {
  return (
    <View style={[styles.section, style]} {...props}>
      {title && (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
        </View>
      )}
      {children}
    </View>
  );
};

// Responsive Card Layout
export const ResponsiveCardLayout = ({ 
  children, 
  variant = 'default',
  style,
  ...props 
}) => {
  return (
    <View
      style={[
        styles.cardLayout,
        styles[`card${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

// Responsive List Layout
export const ResponsiveList = ({ 
  children, 
  spacing: listSpacing = 'md',
  style,
  ...props 
}) => {
  const spacingValue = spacing[listSpacing] || spacing.md;

  return (
    <View
      style={[
        styles.list,
        {
          gap: spacingValue,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

// Responsive Form Layout
export const ResponsiveForm = ({ 
  children, 
  spacing: formSpacing = 'lg',
  style,
  ...props 
}) => {
  const spacingValue = spacing[formSpacing] || spacing.lg;

  return (
    <View
      style={[
        styles.form,
        {
          gap: spacingValue,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

// Responsive Header Layout
export const ResponsiveHeaderLayout = ({ 
  children, 
  variant = 'default',
  style,
  ...props 
}) => {
  return (
    <View
      style={[
        styles.headerLayout,
        styles[`header${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

// Responsive Footer Layout
export const ResponsiveFooterLayout = ({ 
  children, 
  variant = 'default',
  style,
  ...props 
}) => {
  return (
    <View
      style={[
        styles.footerLayout,
        styles[`footer${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

// Responsive Sidebar Layout
export const ResponsiveSidebar = ({ 
  children, 
  position = 'left',
  width = 'auto',
  style,
  ...props 
}) => {
  const sidebarWidth = width === 'auto' ? (isTablet ? 280 : 240) : width;

  return (
    <View
      style={[
        styles.sidebar,
        {
          width: sidebarWidth,
          [position]: 0,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

// Responsive Content Area
export const ResponsiveContent = ({ 
  children, 
  sidebar = false,
  style,
  ...props 
}) => {
  return (
    <View
      style={[
        styles.content,
        sidebar && styles.contentWithSidebar,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  padding: {
    paddingHorizontal: spacing.md,
  },
  tabletLandscape: {
    paddingHorizontal: spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    marginBottom: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  cardLayout: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardDefault: {
    // Default card styling
  },
  cardCompact: {
    padding: spacing.md,
  },
  cardLarge: {
    padding: spacing.xl,
  },
  list: {
    // List container styling
  },
  form: {
    // Form container styling
  },
  headerLayout: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  headerDefault: {
    // Default header styling
  },
  headerCompact: {
    paddingVertical: spacing.sm,
  },
  headerLarge: {
    paddingVertical: spacing.lg,
  },
  footerLayout: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  footerDefault: {
    // Default footer styling
  },
  footerCompact: {
    paddingVertical: spacing.sm,
  },
  footerLarge: {
    paddingVertical: spacing.lg,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    padding: spacing.lg,
  },
  content: {
    flex: 1,
  },
  contentWithSidebar: {
    marginLeft: isTablet ? 280 : 240,
  },
}); 