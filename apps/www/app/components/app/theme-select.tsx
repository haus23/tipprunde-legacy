import { MoonIcon, SunIcon } from 'lucide-react';

import { Button } from '#/components/ui/button';
import { toggleColorScheme } from '#/utils/theme';

export function ThemeSelect() {
  return (
    <Button
      type="button"
      onPress={toggleColorScheme}
      variant="ghost"
      aria-label="Hell-/Dunkel-Modus umschalten"
      className="overflow-clip"
    >
      <div className="relative size-5">
        <MoonIcon className="absolute inset-0 size-5 origin-[50%_100px] rotate-90 transform transition-transform duration-500 dark:rotate-0" />
        <SunIcon className="absolute inset-0 size-5 origin-[50%_100px] rotate-0 transform transition-transform duration-500 dark:-rotate-90" />
      </div>
    </Button>
  );
}
