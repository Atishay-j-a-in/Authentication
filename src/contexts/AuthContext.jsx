import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AuthContext } from './AuthContextValue';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const token = localStorage.getItem('accessToken');
    const promise = token
      ? api.currentUser()
      : Promise.resolve(null);

    promise
      .then((res) => {
        if (!cancelled) setUser(res?.data?.user || null);
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const register = async (email, password, username, role = 'USER') => {
    const res = await api.register({ email, password, username, role });
    return res;
  };

  const login = async (username, password) => {
    const res = await api.login({ username, password });
    setUser(res.data?.user || null);
    return res;
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
