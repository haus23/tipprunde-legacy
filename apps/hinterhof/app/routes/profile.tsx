import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Form, TextField } from '#/components/ui-justd';
import { updateProfile } from '#/lib/firebase/auth';
import { useUser } from '#/utils/state/auth';
import { toast } from '#/utils/toast';

export default function ProfileRoute() {
  const user = useUser();
  const navigate = useNavigate();
  const [isDirty, setDirty] = useState(false);

  const saveProfile = async (formData: FormData) => {
    const { displayName } = Object.fromEntries(formData);

    await updateProfile({
      displayName: String(displayName).trim(),
    });
    toast.success('Dein Profil wurde gespeichert');
    navigate('/');
  };

  return (
    <div>
      <Heading>Profil</Heading>
      <Form action={saveProfile}>
        <Card className="mt-4">
          <CardContent className="mt-4 flex flex-col gap-y-4">
            <TextField
              defaultValue={user.email}
              label="Email"
              name="email"
              type="email"
              isDisabled
            />
            <TextField
              defaultValue={user.displayName}
              label="Name"
              name="displayName"
              type="text"
              placeholder="Darf auch leer bleiben"
              onChange={() => setDirty(true)}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={!isDirty}>
              Speichern
            </Button>
          </CardFooter>
        </Card>
      </Form>
    </div>
  );
}
