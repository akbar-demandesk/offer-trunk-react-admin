import { Navigate } from 'react-router-dom';
import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
import useAuth from 'app/hooks/useAuth';

const Blank = Loadable(lazy(() => import('./pages/Blank')));
// Network
const NetworkTable = Loadable(lazy(() => import('./pages/Network/NetworkTable')));
const AddUpdateNetwork = Loadable(lazy(() => import('./pages/Network/AddUpdateNetwork')));

// Offer
const OfferTable = Loadable(lazy(() => import('./pages/Network/Offer/OfferTable')));
const AddUpdateOffer = Loadable(lazy(() => import('./pages/Network/Offer/AddUpdateOffer')));

// Categories
const CategoriesTable = Loadable(lazy(() => import('./pages/Categories/CategoriesTable')));

// Traffic Sources
const TrafficSourcesTable = Loadable(
  lazy(() => import('./pages/TrafficSources/TrafficSourcesTable'))
);
const AddUpdateTrafficSources = Loadable(
  lazy(() => import('./pages/TrafficSources/AddUpdateTrafficSources'))
);
const Profile = Loadable(lazy(() => import('./pages/Profile/Profile')));

// Students
const StudentTable = Loadable(lazy(() => import('./pages/Students/StudentTable')));
const AddUpdateStudent = Loadable(lazy(() => import('./pages/Students/AddUpdateStudent')));

// Admissions
const AdmissionTable = Loadable(lazy(() => import('./pages/Admissions/AdmissionTable')));
const AddUpdateAdmission = Loadable(lazy(() => import('./pages/Admissions/AddUpdateAdmission')));

// Receipts
const ReceiptTable = Loadable(lazy(() => import('./pages/Admissions/Receipts/ReceiptTable')));
const AddUpdateReceipt = Loadable(
  lazy(() => import('./pages/Admissions/Receipts/AddUpdateReceipt'))
);

// Statement
const Statement = Loadable(lazy(() => import('./pages/Statement')));

const MasterLogout = () => {
  const { logout } = useAuth();
  logout();
  return <Navigate to="/" />;
};

const masterRoutes = [
  {
    path: '/master/blank',
    element: <Blank />,
  },
  {
    path: '/statements',
    element: <Statement />,
  },
  // Network
  {
    path: '/network',
    element: <NetworkTable />,
  },
  {
    path: '/AddUpdateNetwork',
    element: <AddUpdateNetwork />,
  },
  // Offer
  {
    path: '/offer',
    element: <OfferTable />,
  },
  {
    path: '/AddUpdateOffer',
    element: <AddUpdateOffer />,
  },

  // Categories

  {
    path: '/categories',
    element: <CategoriesTable />,
  },
  // Network
  {
    path: '/traffic-sources',
    element: <TrafficSourcesTable />,
  },
  {
    path: '/AddUpdateTrafficSources',
    element: <AddUpdateTrafficSources />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },

  // Students
  {
    path: '/students',
    element: <StudentTable />,
  },
  {
    path: '/AddUpdateStudent',
    element: <AddUpdateStudent />,
  },

  // Admissions
  {
    path: '/admissions',
    element: <AdmissionTable />,
  },
  {
    path: '/AddUpdateAdmission',
    element: <AddUpdateAdmission />,
  },

  // Receipts
  {
    path: '/receipts',
    element: <ReceiptTable />,
  },
  {
    path: '/AddUpdateReceipt',
    element: <AddUpdateReceipt />,
  },
  // Logout
  {
    path: '/master/logout',
    element: <MasterLogout />,
  },
];

export default masterRoutes;
