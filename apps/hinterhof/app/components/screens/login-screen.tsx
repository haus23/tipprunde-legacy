import { valibotResolver } from '@hookform/resolvers/valibot';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as v from 'valibot';

import { Logo } from '@/components/logo';
import { Container } from '@/components/ui-justd';
import { signIn } from '@/lib/firebase/auth';

import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Heading } from '../ui/heading';
import { Input } from '../ui/input';

const LoginSchema = v.object({
  email: v.pipe(
    v.string(),
    v.nonEmpty('Email-Adresse angeben'),
    v.email('Ungültige Email-Adresse'),
  ),
  password: v.pipe(v.string(), v.nonEmpty('Passwort muss schon sein.')),
});

export function LoginScreen() {
  const form = useForm<v.InferInput<typeof LoginSchema>>({
    resolver: valibotResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [error, setError] = useState('');

  function handleLogin({ email, password }: v.InferOutput<typeof LoginSchema>) {
    signIn(String(email), String(password)).catch(() => {
      setError('Email und/oder Passwort falsch');
    });
  }

  return (
    <Container
      intent="constrained"
      className="grid min-h-svh place-items-center"
    >
      <div className="flex w-full flex-col gap-8 sm:flex-row md:flex-col">
        <div className="flex flex-col self-center">
          <Logo className="mx-auto size-32 text-secondary-fg" />
          <span className="mx-auto font-medium text-2xl">Hinterhof</span>
        </div>
        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(handleLogin)}
            className="mx-2 grow sm:mx-0 md:min-w-md md:self-center"
          >
            <Card>
              <CardHeader>
                <Heading>Anmeldung</Heading>
                {error && (
                  <span className="font-medium text-[0.8rem] text-destructive">
                    {error}
                  </span>
                )}
              </CardHeader>
              <CardContent className="flex flex-col gap-y-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passwort</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit">
                  Anmelden
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </Container>
  );
}
