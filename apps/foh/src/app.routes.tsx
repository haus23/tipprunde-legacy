import { RouteObject } from 'react-router-dom';

import Layout from '@/app/layout';

import HomePage from '@/app/home/page';

const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [{ index: true, element: <HomePage /> }],
  },
];

export default appRoutes;
