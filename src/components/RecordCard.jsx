import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

import { EDIT_RECORD_ROUTE } from '../utils/consts';

const RecordCard = observer(({ record, client }) => {
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
        type="button"
        title="Редактировать запись"
        onClick={() => navigate(`${EDIT_RECORD_ROUTE}/${record.id}`)}
      >
        ✏
      </button>
    </div>
  );
});

export default RecordCard;