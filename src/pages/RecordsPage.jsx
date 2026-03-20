import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

import RecordCard from '../components/RecordCard';
import { useSalon } from '../context/SalonContext';
import {
  CREATE_RECORD_ROUTE,
  LOGIN_ROUTE,
} from '../utils/consts';

const RecordsPage = observer(() => {
  const navigate = useNavigate();
  const salon = useSalon();

  const onLogout = () => {
    salon.logoutEmployee();
    navigate(LOGIN_ROUTE);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Мои записи</h1>
          <p><b>Сотрудник:</b> {salon.currentEmployee?.fullName}</p>
          <p><b>Email:</b> {salon.currentEmployee?.email}</p>
        </div>

        <div className="header-actions">
          <button type="button" onClick={() => navigate(CREATE_RECORD_ROUTE)}>
            + Новая запись
          </button>
          <button type="button" className="secondary-btn" onClick={onLogout}>
            Выйти
          </button>
        </div>
      </div>

      {!salon.currentEmployeeRecords.length ? (
        <div className="empty-block">
          Записей пока нет. Создай первую запись.
        </div>
      ) : (
        <div className="grid">
          {salon.currentEmployeeRecords.map((record) => (
            <RecordCard
              key={record.id}
              record={record}
              client={salon.getClientById(record.clientId)}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default RecordsPage;