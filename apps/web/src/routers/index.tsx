import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
const Login = lazy(() => import('@/views/login'));
import Layout from '@/views/hotel/merchantHotel/layout';
const MHotel = lazy(() => import('@/views/hotel/merchantHotel'));

const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/merchant',
    element: <Layout />,
    children: [
      {
        path: 'list',
        element: (
          <Suspense fallback={'加载中...'}>
            <MHotel />
          </Suspense>
        ),
      },
    ],
  },
];

export default routes;
