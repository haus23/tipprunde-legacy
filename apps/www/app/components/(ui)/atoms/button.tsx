import { useFocusRing } from 'react-aria';
import { type VariantProps, tv } from 'tailwind-variants';
import { focusRingStyles } from '../styles';

const styles = tv({
  extend: focusRingStyles,
  base: 'inline-flex items-center justify-center font-medium cursor-default',
  variants: {
    variant: {
      default: 'rounded-md',
      toolbar: 'bg-primary rounded-lg hover:bg-primary-hover',
    },
    size: {
      default: 'px-4 py-2',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
  compoundVariants: [{ variant: 'toolbar', size: 'default', class: 'px-2' }],
});

namespace Button {
  export interface Props
    extends React.ComponentProps<'button'>,
      VariantProps<typeof styles> {}
}

export function Button({ className, size, variant, ...props }: Button.Props) {
  const { isFocusVisible, focusProps } = useFocusRing(props);

  return (
    <button
      className={styles({ className, size, variant })}
      {...props}
      {...focusProps}
      {...{ 'data-focus-visible': isFocusVisible || undefined }}
    />
  );
}
