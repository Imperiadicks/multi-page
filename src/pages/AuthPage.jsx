import { useState } from 'react';

import { observer } from 'mobx-react-lite';
import {
  Link,
  useNavigate,
} from 'react-router-dom';

import { useSalon } from '../context/SalonContext';
import {
  RECORDS_ROUTE,
  REGISTRATION_ROUTE,
} from '../utils/consts';

const AuthPage = observer(() => {
  const navigate = useNavigate();
  const salon = useSalon();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    setError('');

    const result = salon.loginEmployee(form);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate(RECORDS_ROUTE);
  };

  return (
    <div className="page center-page">
      <form className="form" onSubmit={onSubmit}>
        <h1>Авторизация</h1>

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

        {error && <div className="error">{error}</div>}

        <button type="submit">Войти</button>

        <p className="text-center">
          Нет аккаунта? <Link to={REGISTRATION_ROUTE}>Регистрация</Link>
        </p>
      </form>
    </div>
  );
});

export default AuthPage;