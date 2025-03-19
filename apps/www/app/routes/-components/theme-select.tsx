import { MoonIcon, SunIcon } from 'lucide-react';

import { Button } from '#/components/ui/button';
import { useTheme } from '#/utils/theme';

export function ThemeSelect() {
  const { colorScheme, setColorScheme } = useTheme();

  function handleToggle() {
    setColorScheme(colorScheme === 'light' ? 'dark' : 'light');
  }

  return (
    <Button
      type="button"
      onPress={handleToggle}
      variant="ghost"
      aria-label="Hell-/Dunkel-Modus umschalten"
      className="overflow-clip"
    >
      <div className="relative size-5">
        <MoonIcon className="absolute inset-0 size-5 origin-[50%_100px] rotate-90 transform transition-transform duration-500 dark:rotate-0" />
        <SunIcon className="dark:-rotate-90 absolute inset-0 size-5 origin-[50%_100px] rotate-0 transform transition-transform duration-500" />
      </div>
    </Button>
  );
}
