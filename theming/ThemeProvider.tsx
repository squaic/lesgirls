import { ReactNode, createContext, useState, useMemo, useContext, useCallback } from 'react';
import { Theme } from './Theme';
import lightTheme from './themes/light';
import { View } from 'react-native';
import { vars } from 'nativewind';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (name: string) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  setTheme: () => {},
});

export const ThemeProvider = ({
  initialThemeName,
  themes,
  children,
}: {
  initialThemeName: string;
  themes: Theme[];
  children: ReactNode;
}) => {
  if (themes.length === 0) {
    throw new Error('At least one theme must be provided in the ThemeProvider');
  }

  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const theme = themes.find((theme) => theme.name === initialThemeName);
    if (!theme) {
      console.warn(`Theme '${initialThemeName}' not found, falling back to ${themes[0].name}`);
      return themes[0];
    }
    return theme;
  });

  const setTheme = useCallback(
    (name: string) => {
      const theme = themes.find((theme) => theme.name === name);
      if (!theme) {
        console.warn(`Theme '${name}' not found, skipping setting theme`);
        return;
      }
      setCurrentTheme(theme);
    },
    [themes]
  );

  const themeContextValue: ThemeContextValue = useMemo(
    () => ({ theme: currentTheme, setTheme }),
    [currentTheme, setTheme]
  );

  const flattenedTypographyVariables = useMemo(() => {
    const flattened: Record<string, string> = {};
    Object.entries(currentTheme.typography).forEach(([typographyItem, values]) => {
      if (values) {
        Object.entries(values).forEach(([key, value]) => {
          if (value !== undefined) flattened[`${typographyItem}-${key}`] = value;
        });
      }
    });
    return flattened;
  }, [currentTheme.typography]);

  const strippedHslColors = useMemo(() => {
    const stripped: Record<string, string> = {};
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      if (typeof value === 'string' && value.startsWith('hsl(')) {
        stripped[key] = value.replace('hsl(', '').replace(')', '');
      }
    });
    return stripped;
  }, [currentTheme.colors]);

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <View
        className="h-full w-full"
        style={vars({ ...strippedHslColors, ...flattenedTypographyVariables })}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
