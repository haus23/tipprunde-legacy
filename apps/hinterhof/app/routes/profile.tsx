import { Button, Card, Form, Heading, TextField } from '#/components/ui';
import { updateProfile } from '#/lib/firebase/auth';
import { useUser } from '#/utils/state/auth';

export default function ProfileRoute() {
  const user = useUser();

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const { displayName } = Object.fromEntries(new FormData(ev.currentTarget));

    await updateProfile({
      displayName: String(displayName).trim(),
    });
  };

  return (
    <div>
      <Heading>Profil</Heading>
      <Form onSubmit={handleSubmit}>
        <Card className="mt-4">
          <Card.Content className="mt-4 flex flex-col gap-y-4">
            <TextField
              defaultValue={user.email}
              label="Email"
              name="email"
              type="email"
              isReadOnly
              isDisabled
            />
            <TextField
              defaultValue={user.displayName}
              label="Name"
              name="displayName"
              type="text"
              placeholder="Darf auch leer bleiben"
            />
          </Card.Content>
          <Card.Footer>
            <Button type="submit">Speichern</Button>
          </Card.Footer>
        </Card>
      </Form>
    </div>
  );
}
