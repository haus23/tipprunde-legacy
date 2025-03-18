import * as DialogPrimitive from '@radix-ui/react-dialog';
import { tv } from 'tailwind-variants';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogTitle = DialogPrimitive.Title;
const DialogClose = DialogPrimitive.Close;
const DialogDescription = DialogPrimitive.Description;

const styles = tv({
  base: 'data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-bottom-10 sm:zoom-in-90 data-[state=open]:sm:slide-in-from-bottom-0 fixed inset-4 z-20 mx-auto max-w-xl animate-in rounded-md bg-background shadow-md ring-1 ring-gray-6 focus:outline-hidden',
});

namespace DialogContent {
  export interface Props extends DialogPrimitive.DialogContentProps {}
}

function DialogContent({ children, className, ...props }: DialogContent.Props) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="data-[state=closed]:fade-out data-[state=open]:fade-in fixed inset-0 z-20 bg-background/20 backdrop-blur-xs transition-all duration-100 data-[state=closed]:animate-out" />
      <DialogPrimitive.Content className={styles({ className })} {...props}>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogClose,
};
