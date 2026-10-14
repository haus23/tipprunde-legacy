import { Form, Field as FormField, useForm } from '@formisch/react';
import { useState } from 'react';
import { Navigate } from 'react-router';
import * as v from 'valibot';

import AppTitle from '#/components/app-title';
import Button from '#/components/button';
import { Card } from '#/components/card';
import TextField from '#/components/form/text-field';
import { signIn } from '#/firebase/auth';
import { useSessionStore } from '#/state/session-store';

const requiredMessage = 'Bitte ausfüllen.';

const LoginFormSchema = v.object({
  email: v.pipe(v.string(), v.trim(), v.nonEmpty(requiredMessage)),
  password: v.pipe(v.string(), v.nonEmpty(requiredMessage)),
});

export default function Login() {
  const profile = useSessionStore((state) => state.profile);
  const [error, setError] = useState('');
  const loginForm = useForm({
    schema: LoginFormSchema,
    initialInput: { email: '', password: '' },
  });

  function login({ email, password }: v.InferOutput<typeof LoginFormSchema>) {
    signIn(email, password).catch(() =>
      setError('Email und/oder Passwort falsch!'),
    );
  }

  return profile ? (
    <Navigate to="/" replace />
  ) : (
    <div className="flex flex-col">
      <div className="flex h-16 shrink-0 border-border border-b bg-card px-4 sm:px-6 md:px-8">
        <div className="flex flex-1 items-center gap-x-2">
          <AppTitle />
          <h1 className="xs:hidden font-semibold text-2xl">runde.tips</h1>
        </div>
      </div>
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <div className="flex min-h-full flex-col justify-center py-12">
              <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center font-semibold text-3xl text-foreground tracking-tight">
                  Hinterhof
                </h2>
              </div>
              <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="px-4 py-8 sm:px-10">
                  <Form of={loginForm} onSubmit={login} className="space-y-6">
                    <FormField of={loginForm} path={['email']}>
                      {(field) => (
                        <TextField
                          {...field.props}
                          label="Email"
                          required={true}
                          type="email"
                          value={field.input ?? ''}
                          error={field.errors?.[0]}
                        />
                      )}
                    </FormField>
                    <FormField of={loginForm} path={['password']}>
                      {(field) => (
                        <TextField
                          {...field.props}
                          label="Passwort"
                          required={true}
                          type="password"
                          value={field.input ?? ''}
                          error={field.errors?.[0]}
                        />
                      )}
                    </FormField>
                    <div>
                      <Button
                        variant="primary"
                        type="submit"
                        className="w-full justify-center"
                      >
                        Anmelden
                      </Button>
                    </div>
                    {error && (
                      <p role="alert" className="text-center text-destructive">
                        {error}
                      </p>
                    )}
                  </Form>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
