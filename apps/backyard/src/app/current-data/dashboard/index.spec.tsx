import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

import Dashboard from '.';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import { useCurrentChampionship } from '@/hooks/use-current-championship';
import { Championship } from 'lib';
vi.mock('@/hooks/use-current-championship', () => ({
  useCurrentChampionship: vi.fn(),
}));

const router = createMemoryRouter([{ path: '', element: <Dashboard /> }]);

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

  it('should display create-championship link', () => {
    expect(screen.getByRole('link', { name: /Neues Turnier/ })).toBeDefined();
  });

  it('should display just this single list item', () => {
    expect(screen.getAllByRole('listitem').length).toBe(1);
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

  it('should display create-championship link', () => {
    expect(screen.getByRole('link', { name: /Neues Turnier/ })).toBeDefined();
  });

  it('should display create-round link', () => {
    expect(screen.getByRole('link', { name: /Neue Runde/ })).toBeDefined();
  });

  it('should display championship-players link', () => {
    expect(screen.getByRole('link', { name: /Mitspieler/ })).toBeDefined();
  });

  it('should display just this three list items', () => {
    expect(screen.getAllByRole('listitem').length).toBe(3);
  });
});
