import {
  useEffect,
  useState,
} from 'react';

import { observer } from 'mobx-react-lite';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import { useSalon } from '../context/SalonContext';
import { RECORDS_ROUTE } from '../utils/consts';

const EditRecordPage = observer(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const salon = useSalon();

  const record = salon.getRecordById(id);

  const [form, setForm] = useState({
    clientId: '',
    services: [],
    dateTime: '',
    comment: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (!record) return;

    setForm({
      clientId: record.clientId,
      services: record.services,
      dateTime: record.dateTime,
      comment: record.comment || ''
    });
  }, [record]);

  if (!record || record.employeeId !== salon.currentEmployee?.id) {
    return (
      <div className="page center-page">
        <div className="form">
          <h1>Запись не найдена</h1>
          <button type="button" onClick={() => navigate(RECORDS_ROUTE)}>
            Назад
          </button>
        </div>
      </div>
    );
  }

  const toggleService = (service) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((item) => item !== service)
        : [...prev.services, service]
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.clientId || !form.services.length || !form.dateTime) {
      setError('Заполни клиента, услуги и дату.');
      return;
    }

    const patch = {};

    if (form.clientId !== record.clientId) {
      patch.clientId = form.clientId;
    }

    if (form.dateTime !== record.dateTime) {
      patch.dateTime = form.dateTime;
    }

    if (form.comment !== (record.comment || '')) {
      patch.comment = form.comment;
    }

    const oldServices = [...record.services].sort().join('|');
    const newServices = [...form.services].sort().join('|');

    if (oldServices !== newServices) {
      patch.services = form.services;
    }

    const result = salon.updateRecord(record.id, patch);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate(RECORDS_ROUTE);
  };

  return (
    <div className="page center-page">
      <form className="form" onSubmit={onSubmit}>
        <h1>Обновление записи</h1>

        <select
          value={form.clientId}
          onChange={(e) => setForm((prev) => ({ ...prev, clientId: e.target.value }))}
        >
          <option value="">Выбери клиента</option>
          {salon.clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.fullName} ({client.phone})
            </option>
          ))}
        </select>

        <div>
          <p><b>Услуги:</b></p>
          <div className="checkbox-list">
            {(salon.currentEmployee?.services || []).map((service) => (
              <label key={service} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={form.services.includes(service)}
                  onChange={() => toggleService(service)}
                />
                {service}
              </label>
            ))}
          </div>
        </div>

        <input
          type="datetime-local"
          value={form.dateTime}
          onChange={(e) => setForm((prev) => ({ ...prev, dateTime: e.target.value }))}
        />

        <textarea
          rows="4"
          placeholder="Комментарий"
          value={form.comment}
          onChange={(e) => setForm((prev) => ({ ...prev, comment: e.target.value }))}
        />

        {error && <div className="error">{error}</div>}

        <div className="form-actions">
          <button type="submit">Обновить</button>
          <button type="button" className="secondary-btn" onClick={() => navigate(RECORDS_ROUTE)}>
            Назад
          </button>
        </div>
      </form>
    </div>
  );
});

export default EditRecordPage;