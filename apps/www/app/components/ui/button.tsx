import {
  type ButtonProps,
  type PressEvent,
  Button as _Button,
} from 'react-aria-components';
import { type VariantProps, tv } from 'tailwind-variants';

import { componentHoverStyles, focusVisibleStyles } from './_styles';
import { useActionContext } from './action-context';

const buttonStyles = tv({
  base: [
    focusVisibleStyles,
    'inline-flex items-center justify-center font-medium text-sm transition-colors',
    'p-2',
  ],
  variants: {
    variant: {
      primary:
        'border bg-accent-9 px-4 text-white transition-transform hover:bg-accent-10 active:scale-[0.98]',
      secondary: '',
      ghost: componentHoverStyles,
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

namespace Button {
  export interface Props
    extends ButtonProps,
      VariantProps<typeof buttonStyles> {
    className?: string;
  }
}

export function Button({
  className,
  variant,
  onPress,
  type = 'button',
  ...props
}: Button.Props) {
  const ctx = useActionContext();

  function handlePress(e: PressEvent) {
    onPress?.(e);
    ctx?.onAction();
  }

  return (
    <_Button
      onPress={handlePress}
      className={buttonStyles({ variant, className })}
      type={type}
      {...props}
    />
  );
}
