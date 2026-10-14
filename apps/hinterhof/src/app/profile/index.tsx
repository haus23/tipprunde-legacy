import {
  Form,
  Field as FormField,
  isDirty,
  reset,
  useForm,
} from '@formisch/react';
import * as v from 'valibot';

import Button from '#/components/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/card';
import TextField from '#/components/form/text-field';
import { useProfile } from '#/hooks/use-profile';
import { notify } from '#/utils/notify';

const ProfileFormSchema = v.object({
  displayName: v.pipe(
    v.string(),
    v.trim(),
    v.check(
      (name) => name === '' || name.length >= 3,
      'Drei Zeichen sollten es schon sein ;-)',
    ),
  ),
});

type ProfileForm = v.InferOutput<typeof ProfileFormSchema>;

export default function ProfileView() {
  const { profile, updateDisplayName } = useProfile();

  const profileForm = useForm({
    schema: ProfileFormSchema,
    initialInput: { displayName: profile.displayName ?? '' },
  });

  async function saveProfile({ displayName }: ProfileForm) {
    if (!isDirty(profileForm, { path: ['displayName'] })) return;

    await notify(updateDisplayName(displayName), 'Dein Name wurde geändert.');
    reset(profileForm, { initialInput: { displayName } });
  }

  return (
    <div className="mt-5">
      <Card>
        <Form of={profileForm} onSubmit={saveProfile}>
          <CardHeader>
            <CardTitle>Profil</CardTitle>
            <p className="mt-1 text-muted-foreground text-sm">
              Dein Name in der Navigation. Die Email lässt sich hier nicht
              ändern.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <TextField
              disabled={true}
              readOnly={true}
              required={true}
              label="Email"
              name="email"
              value={profile.email ?? ''}
            />
            <FormField of={profileForm} path={['displayName']}>
              {(field) => (
                <TextField
                  {...field.props}
                  label="Name"
                  placeholder="Darf auch leer bleiben"
                  value={field.input ?? ''}
                  error={field.errors?.[0]}
                />
              )}
            </FormField>
          </CardContent>
          <CardFooter className="justify-end">
            <Button
              disabled={!isDirty(profileForm) || profileForm.isSubmitting}
              variant="primary"
              type="submit"
            >
              Speichern
            </Button>
          </CardFooter>
        </Form>
      </Card>
    </div>
  );
}
