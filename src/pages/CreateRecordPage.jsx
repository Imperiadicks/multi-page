import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useSalon } from '../context/SalonContext';
import { RECORDS_ROUTE } from '../utils/consts';

function CreateRecordPage() {
  const navigate = useNavigate();
  const { clients, currentEmployee, createRecord } = useSalon();

  const [form, setForm] = useState({
    clientId: '',
    services: [],
    dateTime: '',
    comment: ''
  });

  const [error, setError] = useState('');

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

    const result = createRecord(form);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate(RECORDS_ROUTE);
  };

  return (
    <div className="page center-page">
      <form className="form" onSubmit={onSubmit}>
        <h1>Оформление записи</h1>

        <select
          value={form.clientId}
          onChange={(e) => setForm((prev) => ({ ...prev, clientId: e.target.value }))}
        >
          <option value="">Выбери клиента</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.fullName} ({client.phone})
            </option>
          ))}
        </select>

        <div>
          <p><b>Услуги:</b></p>
          <div className="checkbox-list">
            {currentEmployee?.services.map((service) => (
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
          placeholder="Комментарий"
          rows="4"
          value={form.comment}
          onChange={(e) => setForm((prev) => ({ ...prev, comment: e.target.value }))}
        />

        {error && <div className="error">{error}</div>}

        <div className="form-actions">
          <button type="submit">Сохранить запись</button>
          <button type="button" className="secondary-btn" onClick={() => navigate(RECORDS_ROUTE)}>
            Назад
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateRecordPage;