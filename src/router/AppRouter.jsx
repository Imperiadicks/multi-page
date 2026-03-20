import { observer } from 'mobx-react-lite';
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

const AppRouter = observer(() => {
  const salon = useSalon();

  return (
    <Routes>
      {salon.isAuth &&
        authRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}

      {publicRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={salon.isAuth ? <Navigate to={RECORDS_ROUTE} replace /> : <Component />}
        />
      ))}

      <Route
        path="*"
        element={<Navigate to={salon.isAuth ? RECORDS_ROUTE : LOGIN_ROUTE} replace />}
      />
    </Routes>
  );
});

export default AppRouter;