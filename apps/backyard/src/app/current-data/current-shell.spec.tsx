import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import { useCurrentChampionship } from '@/hooks/current-data/use-current-championship';
import { Championship } from 'lib';
import CurrentShell from './current-shell';

vi.mock('@/hooks/current-data/use-current-championship', () => ({
  useCurrentChampionship: vi.fn(),
}));

const router = createMemoryRouter([{ path: '', element: <CurrentShell /> }]);

describe('with no championship', () => {
  beforeAll(() => {
    vi.mocked(useCurrentChampionship, { partial: true }).mockReturnValue({
      currentChampionship: undefined,
    });
    render(<RouterProvider router={router}></RouterProvider>);
  });

  afterAll(() => cleanup());

  it('should render hinterhof title', () => {
    expect(screen.getByRole('heading', { level: 2 }).textContent).toContain(
      'Hinterhof'
    );
  });
});

describe('with new current championship', () => {
  const championshipMock: Championship = {
    id: '',
    nr: 17,
    name: 'Hinrunde 2019/20',
    published: false,
    completed: false,
    rulesId: '',
  };

  beforeAll(() => {
    vi.mocked(useCurrentChampionship, { partial: true }).mockReturnValue({
      currentChampionship: championshipMock,
    });
    render(<RouterProvider router={router}></RouterProvider>);
  });

  afterAll(() => cleanup());

  it('should render championship name as title', () => {
    expect(screen.getByRole('heading', { level: 2 }).textContent).toContain(
      championshipMock.name
    );
  });
});
