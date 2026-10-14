import { Dialog } from '@base-ui/react/dialog';
import {
  Form,
  type FormSchema,
  type FormStore,
  type SubmitEventHandler,
} from '@formisch/react';
import Button from './button';

// Modal dialog around a Formisch form: title, fields and a footer with cancel
// and submit. The caller controls `open`; Escape, a click on the backdrop and
// the cancel button request closing via `onOpenChange`. Without
// `initialFocus` the first field gets the focus. Long forms scroll inside the
// dialog while title and footer stay visible. A FormDialog may be rendered
// inside another one (e.g. a new team from the match dialog): React bubbles
// the submit of the inner form along the component tree, so the popup stops
// it before it reaches the outer form.

type FormDialogProps<TSchema extends FormSchema> = {
  cancelLabel?: string;
  children: React.ReactNode;
  form: FormStore<TSchema>;
  initialFocus?: React.RefObject<HTMLElement | null>;
  onOpenChange: (open: boolean) => void;
  onSubmit: SubmitEventHandler<TSchema>;
  open: boolean;
  submitLabel: string;
  title: React.ReactNode;
};

export default function FormDialog<TSchema extends FormSchema>({
  cancelLabel = 'Abbrechen',
  children,
  form,
  initialFocus,
  onOpenChange,
  onSubmit,
  open,
  submitLabel,
  title,
}: FormDialogProps<TSchema>) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-overlay transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none" />
        <Dialog.Popup
          initialFocus={initialFocus}
          onSubmit={(event) => event.stopPropagation()}
          className="fixed top-[max(1rem,10vh)] left-1/2 z-40 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-lg border border-border bg-card text-card-foreground shadow-xl transition-[opacity,scale] duration-200 data-ending-style:scale-95 data-starting-style:scale-95 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none"
        >
          <Form
            of={form}
            onSubmit={onSubmit}
            className="flex max-h-[calc(100dvh-max(2rem,20vh))] flex-col"
          >
            <Dialog.Title className="px-4 pt-4 font-semibold text-lg sm:px-6 sm:pt-6">
              {title}
            </Dialog.Title>
            <div className="space-y-4 overflow-y-auto p-4 sm:p-6">
              {children}
            </div>
            <div className="flex shrink-0 justify-end gap-x-4 rounded-b-lg border-border border-t bg-surface-subtle px-4 py-3 sm:px-6">
              <Dialog.Close render={<Button />}>{cancelLabel}</Dialog.Close>
              <Button variant="primary" type="submit">
                {submitLabel}
              </Button>
            </div>
          </Form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
