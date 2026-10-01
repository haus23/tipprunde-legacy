import { useForm } from 'react-hook-form';

import Button from '#/components/button';
import TextField from '#/components/form/text-field';
import type { Profile } from '#/firebase/auth';
import { useProfile } from '#/hooks/use-profile';
import { notify } from '#/utils/notify';

export default function ProfileView() {
  const { profile, updateDisplayName } = useProfile();

  const {
    handleSubmit,
    register,
    reset,
    formState: { isDirty, dirtyFields, errors },
  } = useForm<Profile>({ defaultValues: profile });

  async function saveProfile(profile: Profile) {
    if (dirtyFields.displayName) {
      await notify(
        updateDisplayName(profile.displayName || ''),
        'Dein Name wurde geändert.',
      );
      reset(profile);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-2xl">Profil</h2>
      <div className="mt-5">
        <div className="rounded-md bg-white shadow-sm">
          <form onSubmit={handleSubmit(saveProfile)} noValidate>
            <div className="space-y-4 p-4">
              <TextField
                disabled
                required
                label="Email"
                {...register('email')}
              />
              <TextField
                label="Name"
                minLength={3}
                placeholder="Darf auch leer bleiben"
                error={errors.displayName?.message}
                {...register('displayName', {
                  validate: {
                    minChars: (name) =>
                      !name ||
                      name.trim().length >= 3 ||
                      'Drei Zeichen sollten es schon sein ;-)',
                  },
                })}
              />
            </div>
            <div className="space-x-4 bg-gray-50 px-4 py-3 text-right sm:px-6">
              <Button disabled={!isDirty} variant="primary" type="submit">
                Speichern
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
