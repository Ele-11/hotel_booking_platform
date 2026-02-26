import { lazy, Suspense } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
const Login = lazy(() => import('@/views/login'));
import AHotel from '@/views/hotel/adminHotel';
import HotelAuditPage from '@/views/hotel/adminHotel/HotelAudit';
import HotelDetailPage from '@/views/hotel/adminHotel/HotelDetail';
import LayoutA from '@/views/hotel/adminHotel/layout';
import AddHotel from '@/views/hotel/merchantHotel/AddHotel';
import Home from '@/views/hotel/merchantHotel/Home';
import HotelInfo from '@/views/hotel/merchantHotel/HotelInfo';
import Layout from '@/views/hotel/merchantHotel/layout';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<div>加载中...</div>}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/merchant',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={'加载中...'}>
            <Home />
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
  {
    path: '/admin',
    element: <LayoutA />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={'加载中...'}>
            <AHotel />
          </Suspense>
        ),
      },
      {
        path: '/audit',
        element: (
          <Suspense fallback={'加载中...'}>
            <HotelAuditPage />
          </Suspense>
        ),
      },
      {
        path: '/detail/:id',
        element: (
          <Suspense fallback={'加载中...'}>
            <HotelDetailPage />
          </Suspense>
        ),
      },
    ],
  },
];

export default routes;
