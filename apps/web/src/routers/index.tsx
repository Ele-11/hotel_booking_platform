import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
const Login = lazy(() => import('@/views/login'));
import AddHotel from '@/views/hotel/merchantHotel/AddHotel';
import HotelInfo from '@/views/hotel/merchantHotel/HotelInfo';
import Layout from '@/views/hotel/merchantHotel/layout';
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
        path: '/',
        element: (
          <Suspense fallback={'加载中...'}>
            <HotelInfo />
          </Suspense>
        ),
      },
      {
        path: 'list',
        element: (
          <Suspense fallback={'加载中...'}>
            <HotelInfo />
          </Suspense>
        ),
      },
      {
        path: 'add',
        element: (
          <Suspense fallback={'加载中...'}>
            <AddHotel />
          </Suspense>
        ),
      },
    ],
  },
];

export default routes;
