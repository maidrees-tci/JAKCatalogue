import { createContext, useContext, type ReactNode } from 'react';
import { seedCustomers } from '../data/users';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Customer } from '../types/models';

type AuthContextValue = {
  user: Customer | null;
  login: (email: string, _password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<Customer | null>('med-auth', null);

  const login = (email: string) => {
    const found = seedCustomers.find((c) => c.email.toLowerCase() === email.toLowerCase());
    if (!found) return false;
    setUser(found);
    return true;
  };

  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within AuthProvider');
  return context;
}
