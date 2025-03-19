import { type ButtonProps, Button as _Button } from 'react-aria-components';
import { type VariantProps, tv } from 'tailwind-variants';

import { focusStyles } from './_styles';

const buttonStyles = tv({
  extend: focusStyles,
  base: 'inline-flex items-center justify-center font-medium text-sm transition-colors',
  variants: {
    variant: {
      primary:
        'border bg-accent-9 px-4 py-2 text-white transition-transform hover:bg-accent-10 active:scale-[0.98]',
      secondary: '',
      ghost: 'p-2 hover:bg-accent-4',
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

export function Button({ className, variant, ...props }: Button.Props) {
  return (
    <_Button className={buttonStyles({ variant, className })} {...props} />
  );
}
