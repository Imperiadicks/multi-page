import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const SalonContext = createContext(null);

export const SERVICES = [
  'Стрижка',
  'Окрашивание',
  'Укладка',
  'Маникюр',
  'Брови',
  'Массаж'
];

const defaultClients = [
  { id: 'cl-1', fullName: 'Анна Смирнова', phone: '+7 999 111-11-11' },
  { id: 'cl-2', fullName: 'Мария Иванова', phone: '+7 999 222-22-22' },
  { id: 'cl-3', fullName: 'Елена Петрова', phone: '+7 999 333-33-33' }
];

function readLocalStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function SalonProvider({ children }) {
  const [employees, setEmployees] = useState(() => readLocalStorage('employees', []));
  const [clients] = useState(() => readLocalStorage('clients', defaultClients));
  const [records, setRecords] = useState(() => readLocalStorage('records', []));
  const [currentEmployee, setCurrentEmployee] = useState(() =>
    readLocalStorage('currentEmployee', null)
  );

  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('currentEmployee', JSON.stringify(currentEmployee));
  }, [currentEmployee]);

  useEffect(() => {
    if (!currentEmployee) return;
    const freshEmployee = employees.find((item) => item.id === currentEmployee.id);
    if (freshEmployee) {
      setCurrentEmployee(freshEmployee);
    }
  }, [employees]);

  const registerEmployee = ({ fullName, email, password, services }) => {
    if (!fullName || !email || !password || !services.length) {
      return { ok: false, message: 'Заполни все поля и выбери хотя бы одну услугу.' };
    }

    const exists = employees.some(
      (employee) => employee.email.trim().toLowerCase() === email.trim().toLowerCase()
    );

    if (exists) {
      return { ok: false, message: 'Сотрудник с таким email уже существует.' };
    }

    const newEmployee = {
      id: crypto.randomUUID(),
      fullName: fullName.trim(),
      email: email.trim(),
      password: password.trim(),
      services
    };

    setEmployees((prev) => [...prev, newEmployee]);
    setCurrentEmployee(newEmployee);

    return { ok: true };
  };

  const loginEmployee = ({ email, password }) => {
    const employee = employees.find(
      (item) =>
        item.email.trim().toLowerCase() === email.trim().toLowerCase() &&
        item.password === password.trim()
    );

    if (!employee) {
      return { ok: false, message: 'Неверный email или пароль.' };
    }

    setCurrentEmployee(employee);
    return { ok: true };
  };

  const logoutEmployee = () => {
    setCurrentEmployee(null);
  };

  const createRecord = ({ clientId, services, dateTime, comment }) => {
    if (!currentEmployee) {
      return { ok: false, message: 'Сотрудник не авторизован.' };
    }

    if (!clientId || !services.length || !dateTime) {
      return { ok: false, message: 'Выбери клиента, услуги и время записи.' };
    }

    const newRecord = {
      id: crypto.randomUUID(),
      employeeId: currentEmployee.id,
      clientId,
      services,
      dateTime,
      comment: comment?.trim() || ''
    };

    setRecords((prev) => [...prev, newRecord]);
    return { ok: true, record: newRecord };
  };

  const updateRecord = (recordId, patch) => {
    let updatedRecord = null;

    setRecords((prev) =>
      prev.map((record) => {
        if (record.id !== recordId) return record;

        updatedRecord = {
          ...record,
          ...patch,
          id: record.id
        };

        return updatedRecord;
      })
    );

    return { ok: true, record: updatedRecord };
  };

  const getEmployeeRecords = (employeeId) => {
    return records.filter((record) => record.employeeId === employeeId);
  };

  const getClientById = (clientId) => {
    return clients.find((client) => client.id === clientId) || null;
  };

  const getRecordById = (recordId) => {
    return records.find((record) => record.id === recordId) || null;
  };

  const value = useMemo(
    () => ({
      employees,
      clients,
      records,
      currentEmployee,
      registerEmployee,
      loginEmployee,
      logoutEmployee,
      createRecord,
      updateRecord,
      getEmployeeRecords,
      getClientById,
      getRecordById
    }),
    [employees, clients, records, currentEmployee]
  );

  return <SalonContext.Provider value={value}>{children}</SalonContext.Provider>;
}

export function useSalon() {
  const context = useContext(SalonContext);

  if (!context) {
    throw new Error('useSalon должен использоваться внутри SalonProvider');
  }

  return context;
}