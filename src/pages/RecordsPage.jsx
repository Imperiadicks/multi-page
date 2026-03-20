import { useNavigate } from 'react-router-dom';

import RecordCard from '../components/RecordCard';
import { useSalon } from '../context/SalonContext';
import {
  CREATE_RECORD_ROUTE,
  LOGIN_ROUTE,
} from '../utils/consts';

function RecordsPage() {
  const navigate = useNavigate();
  const { currentEmployee, getEmployeeRecords, getClientById, logoutEmployee } = useSalon();

  const records = currentEmployee ? getEmployeeRecords(currentEmployee.id) : [];

  const onLogout = () => {
    logoutEmployee();
    navigate(LOGIN_ROUTE);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Мои записи</h1>
          <p>
            <b>Сотрудник:</b> {currentEmployee?.fullName}
          </p>
        </div>

        <div className="header-actions">
          <button onClick={() => navigate(CREATE_RECORD_ROUTE)}>+ Новая запись</button>
          <button className="secondary-btn" onClick={onLogout}>Выйти</button>
        </div>
      </div>

      {!records.length ? (
        <div className="empty-block">
          Записей пока нет. Создай первую запись.
        </div>
      ) : (
        <div className="grid">
          {records.map((record) => (
            <RecordCard
              key={record.id}
              record={record}
              client={getClientById(record.clientId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default RecordsPage;