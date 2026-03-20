import {
  createContext,
  useContext,
} from 'react';

import SalonStore from '../store/SalonStore';

const salonStore = new SalonStore();
const SalonContext = createContext(salonStore);

export function SalonProvider({ children }) {
  return (
    <SalonContext.Provider value={salonStore}>
      {children}
    </SalonContext.Provider>
  );
}

export function useSalon() {
  return useContext(SalonContext);
}