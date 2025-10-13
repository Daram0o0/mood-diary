// Color Token System with Dark Mode Support

export const colors = {
  // Light Mode Colors
  light: {
    // Primary Colors
    primary: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
      contrast: '#FFFFFF',
    },
    // Secondary Colors
    secondary: {
      main: '#8B5CF6',
      light: '#A78BFA',
      dark: '#7C3AED',
      contrast: '#FFFFFF',
    },
    // Background Colors
    background: {
      default: '#FFFFFF',
      paper: '#F9FAFB',
      elevated: '#FFFFFF',
    },
    // Text Colors
    text: {
      primary: '#171717',
      secondary: '#525252',
      disabled: '#A3A3A3',
      hint: '#737373',
    },
    // Border Colors
    border: {
      default: '#E5E5E5',
      light: '#F5F5F5',
      dark: '#D4D4D4',
    },
    // Status Colors
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
  },
  
  // Dark Mode Colors
  dark: {
    // Primary Colors
    primary: {
      main: '#60A5FA',
      light: '#93C5FD',
      dark: '#3B82F6',
      contrast: '#0A0A0A',
    },
    // Secondary Colors
    secondary: {
      main: '#A78BFA',
      light: '#C4B5FD',
      dark: '#8B5CF6',
      contrast: '#0A0A0A',
    },
    // Background Colors
    background: {
      default: '#0A0A0A',
      paper: '#171717',
      elevated: '#262626',
    },
    // Text Colors
    text: {
      primary: '#EDEDED',
      secondary: '#A3A3A3',
      disabled: '#525252',
      hint: '#737373',
    },
    // Border Colors
    border: {
      default: '#404040',
      light: '#262626',
      dark: '#525252',
    },
    // Status Colors
    status: {
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      info: '#60A5FA',
    },
  },
} as const;

// Color Token Type
export type ColorMode = 'light' | 'dark';
export type ColorTokens = typeof colors.light;

// CSS Variable Names for Color Tokens
export const colorVarNames = {
  // Primary
  primaryMain: '--color-primary-main',
  primaryLight: '--color-primary-light',
  primaryDark: '--color-primary-dark',
  primaryContrast: '--color-primary-contrast',
  
  // Secondary
  secondaryMain: '--color-secondary-main',
  secondaryLight: '--color-secondary-light',
  secondaryDark: '--color-secondary-dark',
  secondaryContrast: '--color-secondary-contrast',
  
  // Background
  backgroundDefault: '--color-background-default',
  backgroundPaper: '--color-background-paper',
  backgroundElevated: '--color-background-elevated',
  
  // Text
  textPrimary: '--color-text-primary',
  textSecondary: '--color-text-secondary',
  textDisabled: '--color-text-disabled',
  textHint: '--color-text-hint',
  
  // Border
  borderDefault: '--color-border-default',
  borderLight: '--color-border-light',
  borderDark: '--color-border-dark',
  
  // Status
  statusSuccess: '--color-status-success',
  statusWarning: '--color-status-warning',
  statusError: '--color-status-error',
  statusInfo: '--color-status-info',
} as const;

// Helper function to get color value by mode and path
export const getColor = (
  mode: ColorMode,
  category: keyof ColorTokens,
  variant: string
): string => {
  const colorCategory = colors[mode][category] as Record<string, string>;
  return colorCategory[variant] || '';
};


