import { createContext, use, useCallback, useState } from 'react';
import { z } from 'zod';

const ColorSchemeSchema = z.enum(['light', 'dark']);
type ColorScheme = z.infer<typeof ColorSchemeSchema>;

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
    const persistedColorScheme = ColorSchemeSchema.safeParse(
      localStorage.getItem('colorScheme'),
    );
    const effectiveColorScheme = persistedColorScheme.success
      ? persistedColorScheme.data
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
