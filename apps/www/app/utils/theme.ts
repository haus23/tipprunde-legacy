import * as v from 'valibot';
import { create } from 'zustand';

const colorSchemeSchema = v.fallback(v.picklist(['light', 'dark']), 'light');
type ColorScheme = v.InferOutput<typeof colorSchemeSchema>;

type ThemeState = {
  colorScheme: ColorScheme;
};

const useThemeStore = create<ThemeState>()(() => {
  const colorScheme = v.parse(
    colorSchemeSchema,
    localStorage.getItem('colorScheme'),
  );
  document.documentElement.classList.toggle('dark', colorScheme === 'dark');

  return {
    colorScheme,
  };
});

const setColorScheme = (colorScheme: ColorScheme) => {
  document.documentElement.classList.toggle('dark', colorScheme === 'dark');
  localStorage.setItem('colorScheme', colorScheme);
  useThemeStore.setState({ colorScheme });
};

export function useTheme() {
  const colorScheme = useThemeStore((state) => state.colorScheme);
  return { colorScheme, setColorScheme };
}
