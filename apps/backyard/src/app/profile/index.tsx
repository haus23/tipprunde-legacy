import Button from '@/components/button';
import TextField from '@/components/form/text-field';
import { useProfile } from '@/hooks/use-profile';
import { Profile, ROLES } from '@/model/profile';
import { notify } from '@/utils/notify';
import { useForm, Controller } from 'react-hook-form';
import { SelectField } from 'ui';

export default function ProfileView() {
  /* TODO: disable or remove role editing here! */

  const { profile, updateDisplayName, updateRole } = useProfile();
  const {
    control,
    handleSubmit,
    register,
    formState: { isDirty, dirtyFields, errors },
  } = useForm<Profile>({ defaultValues: profile });

  const roleOptions = ROLES.map((role) => ({ id: role, name: role }));

  async function saveProfile(profile: Profile) {
    if (dirtyFields.displayName) {
      notify(
        updateDisplayName(profile.displayName || ''),
        'Dein Name wurde geändert.'
      );
    }
    if (dirtyFields.role) {
      notify(updateRole(profile.role), 'Rolle wurde geändert.');
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Profil</h2>
      <div className="mt-5">
        <div className="shadow rounded-md bg-white">
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
              <SelectField
                label="Rolle"
                control={control}
                name="role"
                options={roleOptions}
              />
            </div>
            <div className="bg-gray-50 px-4 py-3 text-right sm:px-6 space-x-4">
              <Button disabled={!isDirty} primary type="submit">
                Speichern
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
