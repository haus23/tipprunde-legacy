import {
  Form,
  Field as FormField,
  isDirty,
  reset,
  useForm,
} from '@formisch/react';
import * as v from 'valibot';

import Button from '#/components/button';
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
    <div className="space-y-4">
      <h2 className="font-semibold text-2xl">Profil</h2>
      <div className="mt-5">
        <div className="rounded-md bg-white shadow-sm">
          <Form of={profileForm} onSubmit={saveProfile}>
            <div className="space-y-4 p-4">
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
            </div>
            <div className="space-x-4 bg-gray-50 px-4 py-3 text-right sm:px-6">
              <Button
                disabled={!isDirty(profileForm)}
                variant="primary"
                type="submit"
              >
                Speichern
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
