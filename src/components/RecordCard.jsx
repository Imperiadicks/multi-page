import { useNavigate } from 'react-router-dom';

import { EDIT_RECORD_ROUTE } from '../utils/consts';

function RecordCard({ record, client }) {
  const navigate = useNavigate();

  return (
    <div className="card">
      <div className="card__body">
        <h3>{client?.fullName || 'Клиент не найден'}</h3>
        <p><b>Телефон:</b> {client?.phone || '—'}</p>
        <p><b>Услуги:</b> {record.services.join(', ')}</p>
        <p><b>Дата и время:</b> {new Date(record.dateTime).toLocaleString('ru-RU')}</p>
        <p><b>Комментарий:</b> {record.comment || '—'}</p>
      </div>

      <button
        className="edit-btn"
        onClick={() => navigate(`${EDIT_RECORD_ROUTE}/${record.id}`)}
        title="Редактировать запись"
      >
        ✏
      </button>
    </div>
  );
}

export default RecordCard;