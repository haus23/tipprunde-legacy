import { useEffect, useState } from 'react';

import { auth } from '#/firebase/auth';
import { useSessionStore } from '#/state/session-store';

export function useAuthBootstrap() {
  const [isResolved, setResolved] = useState(false);
  const setProfile = useSessionStore((state) => state.setProfile);

  useEffect(
    () =>
      auth.onAuthStateChanged((user) => {
        setProfile(
          user
            ? {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
              }
            : null,
        );
        setResolved(true);
      }),
    [setProfile],
  );

  return isResolved;
}
