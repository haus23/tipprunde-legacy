import { OTPInput, OTPInputContext, type OTPInputProps } from 'input-otp';
import { type ComponentProps, useContext } from 'react';

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.join(' ');
}

namespace OTPField {
  export type Props = OTPInputProps;
}

function OTPField({ className, ...props }: OTPField.Props) {
  return (
    <OTPInput
      containerClassName={cn(
        'mx-auto flex items-center gap-2 has-disabled:opacity-50',
      )}
      className={cn('disabled:cursor-not-allowed', className)}
      {...props}
    />
  );
}

namespace OTPFieldGroup {
  export interface Props extends ComponentProps<'div'> {}
}

function OTPFieldGroup({ className, ...props }: OTPFieldGroup.Props) {
  return <div className={cn('flex items-center', className)} {...props} />;
}

namespace OTPFieldSlot {
  export interface Props extends ComponentProps<'div'> {
    index: number;
  }
}

function OTPFieldSlot({ index, className, ...props }: OTPFieldSlot.Props) {
  const OTPFieldContext = useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = OTPFieldContext.slots[index];

  return (
    <div
      className={cn(
        'relative flex size-12 items-center justify-center border-line border-y border-r font-semibold text-sm shadow-xs transition-all first:rounded-l-md first:border-l last:rounded-r-md',
        isActive && 'z-10 ring-1 ring-ring',
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
}

export { OTPField, OTPFieldGroup, OTPFieldSlot };
