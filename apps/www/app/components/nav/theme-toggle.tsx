import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useTheme } from '#/utils/theme';
import { Button } from '../(ui)/atoms/button';

export function ThemeToggle(props: React.ComponentProps<'button'>) {
  const { theme, setColorScheme } = useTheme();

  function handleToggle(ev: React.MouseEvent<HTMLButtonElement>) {
    setColorScheme(theme.colorScheme === 'light' ? 'dark' : 'light');
    props.onClick?.call(null, ev);
  }

  return (
    <Button
      onClick={handleToggle}
      variant="toolbar"
      aria-label="Hell-/Dunkel-Modus umschalten"
      className="overflow-clip"
    >
      <div className="relative h-6 w-6">
        <MoonIcon className="absolute inset-0 h-6 origin-[50%_100px] rotate-90 transform transition-transform duration-500 dark:rotate-0" />
        <SunIcon className="absolute inset-0 h-6 origin-[50%_100px] rotate-0 transform transition-transform duration-500 dark:-rotate-90" />
      </div>
    </Button>
  );
}
