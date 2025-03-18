import { type VariantProps, tv } from 'tailwind-variants';

import { focusStyles } from '../focus-styles';

const buttonStyles = tv({
  extend: focusStyles,
  base: 'inline-flex items-center justify-center font-medium text-sm transition-colors',
  variants: {
    variant: {
      default:
        'border bg-accent-9 px-4 py-2 text-white transition-transform hover:bg-accent-10 active:scale-[0.98]',
      toolbar: 'p-2 hover:bg-accent-4',
      tableHead: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

namespace Button {
  export interface Props
    extends React.ComponentProps<'button'>,
      VariantProps<typeof buttonStyles> {}
}

export function Button({ className, variant, ...props }: Button.Props) {
  return <button className={buttonStyles({ variant, className })} {...props} />;
}
