import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { auth, getSession, setSession } from '../lib/api.js';

// Sesión del docente o traductor. El alumno no se registra: entra con el código del curso.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSessionState] = useState(getSession);

  const persist = useCallback((s) => {
    setSession(s);
    setSessionState(s);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const r = await auth.login(email, password);
      const { user, accessToken, refreshToken } = r.data;
      persist({ user, accessToken, refreshToken, demo: accessToken === 'demo' });
      return r;
    },
    [persist],
  );

  // Con REQUIRE_EMAIL_VERIFICATION=true el backend no devuelve tokens: hay que verificar el email.
  const register = useCallback(
    async (body) => {
      const r = await auth.register(body);
      const { user, accessToken, refreshToken } = r.data || {};
      if (accessToken) persist({ user, accessToken, refreshToken, demo: accessToken === 'demo' });
      return { ...r, necesitaVerificar: !accessToken };
    },
    [persist],
  );

  const logout = useCallback(async () => {
    if (session && !session.demo) await auth.logout();
    persist(null);
  }, [session, persist]);

  const updateUser = useCallback((user) => persist({ ...getSession(), user }), [persist]);

  const value = useMemo(
    () => ({ user: session?.user || null, isDemo: Boolean(session?.demo), login, register, logout, updateUser }),
    [session, login, register, logout, updateUser],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
