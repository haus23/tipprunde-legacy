import { useState } from 'react';
import { Logo } from '#/components/logo';
import {
  Button,
  Card,
  Container,
  Form,
  Heading,
  TextField,
} from '#/components/ui-justd';
import { signIn } from '#/lib/firebase/auth';

export function LoginScreen() {
  const [error, setError] = useState('');

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const { email, password } = Object.fromEntries(
      new FormData(ev.currentTarget),
    );

    signIn(String(email), String(password)).catch(() => {
      setError('Email und/oder Passwort falsch');
    });
  };

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
        <Form
          onSubmit={handleSubmit}
          className="mx-2 grow sm:mx-0 md:min-w-md md:self-center"
        >
          <Card>
            <Card.Header>
              <Heading>Anmeldung</Heading>
              {error && <span className="text-danger">{error}</span>}
            </Card.Header>
            <Card.Content className="flex flex-col gap-y-2">
              <TextField name="email" label="Email *" isRequired type="email" />
              <TextField
                name="password"
                label="Passwort *"
                isRequired
                type="password"
                isRevealable
              />
            </Card.Content>
            <Card.Footer>
              <Button className="w-full" type="submit">
                Anmelden
              </Button>
            </Card.Footer>
          </Card>
        </Form>
      </div>
    </Container>
  );
}
