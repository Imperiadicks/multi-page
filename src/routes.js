import AuthPage from './pages/AuthPage';
import CreateRecordPage from './pages/CreateRecordPage';
import EditRecordPage from './pages/EditRecordPage';
import RecordsPage from './pages/RecordsPage';
import RegisterPage from './pages/RegisterPage';
import {
  CREATE_RECORD_ROUTE,
  EDIT_RECORD_ROUTE,
  LOGIN_ROUTE,
  RECORDS_ROUTE,
  REGISTRATION_ROUTE,
} from './utils/consts';

export const publicRoutes = [
  {
    path: LOGIN_ROUTE,
    Component: AuthPage
  },
  {
    path: REGISTRATION_ROUTE,
    Component: RegisterPage
  }
];

export const authRoutes = [
  {
    path: RECORDS_ROUTE,
    Component: RecordsPage
  },
  {
    path: CREATE_RECORD_ROUTE,
    Component: CreateRecordPage
  },
  {
    path: `${EDIT_RECORD_ROUTE}/:id`,
    Component: EditRecordPage
  }
];