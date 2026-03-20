import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import { useSalon } from '../context/SalonContext';
import {
  authRoutes,
  publicRoutes,
} from '../routes';
import {
  LOGIN_ROUTE,
  RECORDS_ROUTE,
} from '../utils/consts';

function AppRouter() {
  const { currentEmployee } = useSalon();

  return (
    <Routes>
      {currentEmployee &&
        authRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}

      {publicRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={currentEmployee ? <Navigate to={RECORDS_ROUTE} replace /> : <Component />}
        />
      ))}

      <Route
        path="*"
        element={
          <Navigate to={currentEmployee ? RECORDS_ROUTE : LOGIN_ROUTE} replace />
        }
      />
    </Routes>
  );
}

export default AppRouter;