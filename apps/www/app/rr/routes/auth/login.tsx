import { useAuthActions } from '@convex-dev/auth/react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '#/components/(ui)/button/button';
import { useAccounts } from '#/utils/app/accounts';
import { useAuthStore } from '#/utils/auth';

function LoginRoute() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn } = useAuthActions();
  const accounts = useAccounts();
  const prepareAuth = useAuthStore((state) => state.prepareAuth);

  async function handleEmail(formData: FormData) {
    const email = String(formData.get('email')).toLowerCase();
    const account = accounts.find((acc) => acc.email === email);
    if (!account) {
      setError('Unbekannte Email-Adresse. Wende dich an Micha.');
    } else {
      await signIn('postmark-otp', { email });
      prepareAuth(account);
      navigate('/login/code');
    }
  }

  return (
    <div>
      <header className="mx-2 flex items-center gap-x-2 pt-2 text-accent-foreground sm:mx-0 sm:gap-x-4">
        <title>Anmeldung - runde.tips</title>
        <h1 className="flex gap-x-2 font-semibold text-xl tracking-tight">
          Anmeldung
        </h1>
      </header>
      <div className="mx-2 mt-4 rounded-md border border-line bg-card p-4">
        <form action={handleEmail}>
          <div className="mb-4 flex flex-col gap-y-2">
            <label htmlFor="email" className="font-semibold text-sm">
              Email:
            </label>
            <input type="hidden" name="fname" value="Michael" />
            <input
              id="email"
              name="email"
              required
              className="boder-line rounded-md border px-4 py-2 outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            />
            <div className="text-sm">
              {error ? (
                <p className="text-red-600">{error}</p>
              ) : (
                <p className="text-subtle-foreground">
                  Die uns bekannte Email-Adresse
                </p>
              )}
            </div>
          </div>
          <div>
            <Button type="submit">Code anfordern</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { LoginRoute as Component };
