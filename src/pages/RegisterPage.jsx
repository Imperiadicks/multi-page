import { useState } from 'react';

import { observer } from 'mobx-react-lite';
import {
  Link,
  useNavigate,
} from 'react-router-dom';

import { useSalon } from '../context/SalonContext';
import {
  LOGIN_ROUTE,
  RECORDS_ROUTE,
} from '../utils/consts';

const allServices = [
  'Стрижка',
  'Окрашивание',
  'Укладка',
  'Маникюр',
  'Брови',
  'Массаж'
];

const RegisterPage = observer(() => {
  const navigate = useNavigate();
  const salon = useSalon();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    services: []
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

    const result = salon.registerEmployee(form);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate(RECORDS_ROUTE);
  };

  return (
    <div className="page center-page">
      <form className="form" onSubmit={onSubmit}>
        <h1>Регистрация сотрудника</h1>

        <input
          type="text"
          placeholder="ФИО"
          value={form.fullName}
          onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
        />

        <input
          type="password"
          placeholder="Пароль"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
        />

        <div>
          <p><b>Услуги сотрудника:</b></p>
          <div className="checkbox-list">
            {allServices.map((service) => (
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

        {error && <div className="error">{error}</div>}

        <button type="submit">Зарегистрироваться</button>

        <p className="text-center">
          Уже есть аккаунт? <Link to={LOGIN_ROUTE}>Войти</Link>
        </p>
      </form>
    </div>
  );
});

export default RegisterPage;