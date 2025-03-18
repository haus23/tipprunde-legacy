import { createContext, use, useCallback, useState } from 'react';
import * as v from 'valibot';

const ColorSchemeSchema = v.picklist(['light', 'dark']);
type ColorScheme = v.InferOutput<typeof ColorSchemeSchema>;

type Theme = {
  colorScheme: ColorScheme;
};

type ThemeContextType = {
  theme: Theme;
  setColorScheme: (colorScheme: ColorScheme) => void;
};

const ThemeContext = createContext<ThemeContextType>(undefined as never);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(() => {
    const persistedColorScheme = v.safeParse(
      ColorSchemeSchema,
      localStorage.getItem('colorScheme'),
    );
    const effectiveColorScheme = persistedColorScheme.success
      ? persistedColorScheme.output
      : 'light';
    document.documentElement.classList.toggle(
      'dark',
      effectiveColorScheme === 'dark',
    );
    return effectiveColorScheme;
  });

  const setColorScheme = useCallback((colorScheme: ColorScheme) => {
    document.documentElement.classList.toggle('dark', colorScheme === 'dark');
    localStorage.setItem('colorScheme', colorScheme);
    setColorSchemeState(colorScheme);
  }, []);

  return (
    <ThemeContext value={{ theme: { colorScheme }, setColorScheme }}>
      {children}
    </ThemeContext>
  );
}

export function useTheme() {
  return use(ThemeContext);
}
