import { Logo } from '../components/logo';
import {
  Button,
  Card,
  Container,
  Form,
  Heading,
  TextField,
} from '../components/ui';

export default function LoginRoute() {
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
        <Card className="mx-2 grow sm:mx-0 md:min-w-md md:self-center">
          <Card.Header>
            <Heading>Anmeldung</Heading>
          </Card.Header>
          <Card.Content>
            <Form className="flex flex-col gap-y-2">
              <TextField label="Email *" />
              <TextField label="Passwort *" type="password" isRevealable />
            </Form>
          </Card.Content>
          <Card.Footer>
            <Button className="w-full">Anmelden</Button>
          </Card.Footer>
        </Card>
      </div>
    </Container>
  );
}
