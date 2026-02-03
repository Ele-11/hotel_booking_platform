import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Login = lazy(() => import('@/views/login'));
const MHotel = lazy(() => import('@/views/hotel/merchantHotel'));

const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/merchant/hotel',
    element: <MHotel />,
  },
];

export default routes;
