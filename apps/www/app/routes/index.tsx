import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: ({ context: { championships } }) => {
    throw redirect({
      to: '/$turnier',
      params: { turnier: championships[0].id },
      mask: {
        to: '/',
      },
    });
  },
});
