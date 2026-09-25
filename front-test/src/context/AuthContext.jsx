import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { auth, getSession, health, setSession } from '../lib/api.js';
import { DEMO_FORCED } from '../lib/config.js';

// Sesión del docente o traductor. El alumno no se registra: entra con el código del curso.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSessionState] = useState(getSession);

  const persist = useCallback((s) => {
    setSession(s);
    setSessionState(s);
  }, []);

  // Una sesión de demostración (se inició con el servidor apagado) no sirve contra el servidor real:
  // si el servidor ya responde, se descarta para que se vuelva a ingresar con una cuenta de verdad.
  useEffect(() => {
    if (!session?.demo || DEMO_FORCED) return;
    health().then((ok) => ok && persist(null));
  }, [session?.demo, persist]);

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
