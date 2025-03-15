import { OTPInput } from 'input-otp';
import { useRef } from 'react';
import { Button } from '#/components/(ui)/atoms/button';
import {
  OTPField,
  OTPFieldGroup,
  OTPFieldSlot,
} from '#/components/(ui)/elements/otp-field';

function OTPRoute() {
  const formRef = useRef<HTMLFormElement>(null);
  function handleOTP(formData: FormData) {
    console.log(formData.get('otp'));
  }

  return (
    <div>
      <header className="mx-2 flex items-center gap-x-2 pt-2 text-accent-foreground sm:mx-0 sm:gap-x-4">
        <title>Anmeldung - runde.tips</title>
        <h1 className="flex gap-x-2 font-semibold text-xl tracking-tight">
          Code Eingabe zur Anmeldung
        </h1>
      </header>
      <div className="mx-2 mt-4 rounded-md border border-line bg-card p-4">
        <form action={handleOTP} ref={formRef}>
          <div className="mb-4 flex flex-col items-center gap-y-2">
            <label htmlFor="otp" className="font-semibold text-sm">
              Dein Code
            </label>
            <OTPField
              maxLength={6}
              name="otp"
              id="otp"
              onComplete={() => formRef.current?.requestSubmit()}
            >
              <OTPFieldGroup>
                <OTPFieldSlot index={0} />
                <OTPFieldSlot index={1} />
                <OTPFieldSlot index={2} />
                <OTPFieldSlot index={3} />
                <OTPFieldSlot index={4} />
                <OTPFieldSlot index={5} />
              </OTPFieldGroup>
            </OTPField>
          </div>
          <div className="flex flex-col items-center">
            <Button type="submit">Prüfen</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { OTPRoute as Component };
