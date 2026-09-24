import { signIn } from 'lib';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { Navigate } from 'react-router';
import { AppTitle } from 'ui-legacy';

import Button from '#/components/button';
import TextField from '#/components/form/text-field';
import { useSessionStore } from '#/state/session-store';

type LoginFormType = {
  email: string;
  password: string;
};

export default function Login() {
  const profile = useSessionStore((state) => state.profile);
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>();

  const onSubmit: SubmitHandler<LoginFormType> = ({ email, password }) => {
    signIn(email, password).catch(() =>
      setError('Email und/oder Passwort falsch!'),
    );
  };

  return profile ? (
    <Navigate to="/" replace />
  ) : (
    <div className="flex flex-col">
      <div className="flex h-16 shrink-0 bg-white px-4 shadow-sm sm:px-6 md:px-8">
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
                <h2 className="mt-6 text-center font-semibold text-3xl text-gray-900 tracking-tight">
                  Hinterhof
                </h2>
              </div>
              <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white px-4 py-8 shadow-sm sm:rounded-lg sm:px-10">
                  <form
                    className="space-y-6"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                  >
                    <TextField
                      label="Email"
                      required
                      type="email"
                      error={errors.email?.message}
                      {...register('email', { required: true })}
                    />
                    <TextField
                      label="Passwort"
                      required
                      type="password"
                      error={errors.password?.message}
                      {...register('password', { required: true })}
                    />
                    <div>
                      <Button
                        primary
                        type="submit"
                        className="w-full justify-center"
                      >
                        Anmelden
                      </Button>
                    </div>
                    {error && (
                      <div className="text-center text-red-500">
                        <p>{error}</p>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
