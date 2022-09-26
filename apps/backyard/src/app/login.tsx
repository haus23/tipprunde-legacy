import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/hooks/use-auth';
import Button from '@/components/button';
import TextField from '@/components/form/text-field';

type LoginFormType = {
  email: string;
  password: string;
};

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>();

  const onSubmit: SubmitHandler<LoginFormType> = ({ email, password }) => {
    signIn(email, password)
      .then(() => navigate('/', { replace: true }))
      .catch(() => setError('Email und/oder Passwort falsch!'));
  };

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
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
              <Button primary type="submit" className="w-full justify-center">
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
  );
}
