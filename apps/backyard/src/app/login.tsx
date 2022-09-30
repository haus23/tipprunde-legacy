import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { signIn, auth } from 'lib';
import { AppTitle } from 'ui';

import Button from '@/components/button';
import TextField from '@/components/form/text-field';

type LoginFormType = {
  email: string;
  password: string;
};

export default function Login() {
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>();

  useEffect(
    () =>
      auth.onAuthStateChanged((user) => {
        user && navigate('/', { replace: true });
      }),
    []
  );

  const onSubmit: SubmitHandler<LoginFormType> = ({ email, password }) => {
    signIn(email, password).catch(() =>
      setError('Email und/oder Passwort falsch!')
    );
  };

  return (
    <div className="flex flex-col">
      <div className="flex h-16 flex-shrink-0 px-4 sm:px-6 md:px-8 bg-white shadow">
        <div className="flex items-center flex-1 gap-x-2">
          <AppTitle />
          <h1 className="xs:hidden text-2xl font-semibold">runde.tips</h1>
        </div>
      </div>
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <div className="flex min-h-full flex-col justify-center py-12">
              <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-semibold tracking-tight text-gray-900">
                  Hinterhof
                </h2>
              </div>
              <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
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
