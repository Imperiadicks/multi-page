import { makeAutoObservable } from 'mobx';

const defaultClients = [
  { id: 'cl_1', fullName: 'Анна Смирнова', phone: '+7 999 111-11-11' },
  { id: 'cl_2', fullName: 'Мария Иванова', phone: '+7 999 222-22-22' },
  { id: 'cl_3', fullName: 'Елена Петрова', phone: '+7 999 333-33-33' }
];

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function generateId(prefix = 'id') {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

class SalonStore {
  employees = readStorage('employees', []);
  clients = readStorage('clients', defaultClients);
  records = readStorage('records', []);
  currentEmployee = readStorage('currentEmployee', null);

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    if (!localStorage.getItem('clients')) {
      this.persist();
    }
  }

  persist() {
    localStorage.setItem('employees', JSON.stringify(this.employees));
    localStorage.setItem('clients', JSON.stringify(this.clients));
    localStorage.setItem('records', JSON.stringify(this.records));
    localStorage.setItem('currentEmployee', JSON.stringify(this.currentEmployee));
  }

  get isAuth() {
    return Boolean(this.currentEmployee);
  }

  get currentEmployeeRecords() {
    if (!this.currentEmployee) return [];
    return this.records.filter((record) => record.employeeId === this.currentEmployee.id);
  }

  registerEmployee({ fullName, email, password, services }) {
    if (!fullName || !email || !password || !services.length) {
      return {
        ok: false,
        message: 'Заполни все поля и выбери хотя бы одну услугу.'
      };
    }

    const normalizedEmail = email.trim().toLowerCase();

    const exists = this.employees.some(
      (employee) => employee.email.trim().toLowerCase() === normalizedEmail
    );

    if (exists) {
      return {
        ok: false,
        message: 'Сотрудник с таким email уже существует.'
      };
    }

    const newEmployee = {
      id: generateId('emp'),
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: password.trim(),
      services
    };

    this.employees.push(newEmployee);
    this.currentEmployee = newEmployee;
    this.persist();

    return { ok: true };
  }

  loginEmployee({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase();

    const employee = this.employees.find(
      (item) =>
        item.email.trim().toLowerCase() === normalizedEmail &&
        item.password === password.trim()
    );

    if (!employee) {
      return {
        ok: false,
        message: 'Неверный email или пароль.'
      };
    }

    this.currentEmployee = employee;
    this.persist();

    return { ok: true };
  }

  logoutEmployee() {
    this.currentEmployee = null;
    this.persist();
  }

  createRecord({ clientId, services, dateTime, comment }) {
    if (!this.currentEmployee) {
      return {
        ok: false,
        message: 'Сотрудник не авторизован.'
      };
    }

    if (!clientId || !services.length || !dateTime) {
      return {
        ok: false,
        message: 'Выбери клиента, услуги и время записи.'
      };
    }

    const newRecord = {
      id: generateId('rec'),
      employeeId: this.currentEmployee.id,
      clientId,
      services,
      dateTime,
      comment: comment?.trim() || ''
    };

    this.records.push(newRecord);
    this.persist();

    return {
      ok: true,
      record: newRecord
    };
  }

  updateRecord(recordId, patch) {
    const record = this.records.find((item) => item.id === recordId);

    if (!record) {
      return {
        ok: false,
        message: 'Запись не найдена.'
      };
    }

    if ('clientId' in patch) {
      record.clientId = patch.clientId;
    }

    if ('services' in patch) {
      record.services = patch.services;
    }

    if ('dateTime' in patch) {
      record.dateTime = patch.dateTime;
    }

    if ('comment' in patch) {
      record.comment = patch.comment;
    }

    this.persist();

    return {
      ok: true,
      record
    };
  }

  getClientById(clientId) {
    return this.clients.find((client) => client.id === clientId) || null;
  }

  getRecordById(recordId) {
    return this.records.find((record) => record.id === recordId) || null;
  }
}

export default SalonStore;