import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
import ResetPassword from './ResetPassword';

const NotFound = Loadable(lazy(() => import('./NotFound')));
const ForgotPassword = Loadable(lazy(() => import('./ForgotPassword')));
const JwtLogin = Loadable(lazy(() => import('./JwtLogin')));

const sessionRoutes = [
  { path: '/session/signin', element: <JwtLogin /> },
  { path: '/session/forgot-password', element: <ForgotPassword /> },
  { path: '/session/404', element: <NotFound /> },
  { path: '/session/resetPassword', element: <ResetPassword /> },
];

export default sessionRoutes;
