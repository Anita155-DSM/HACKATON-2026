import { useCallback, useEffect, useRef, useState } from 'react';
import { getMode, onModeChange } from './api.js';
import { estadoMaterial, suscribirse } from './offline/index.js';
import { APP_NAME } from './config.js';

export function useOnline() {
  const [online, setOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  return online;
}

export function useApiMode() {
  const [mode, setMode] = useState(getMode);
  useEffect(() => onModeChange(setMode), []);
  return mode;
}

export function useOfflineStatus(id) {
  const [status, setStatus] = useState({ estado: 'cargando', mensaje: '' });
  const refresh = useCallback(() => {
    if (id) estadoMaterial(id).then(setStatus);
  }, [id]);
  useEffect(() => {
    refresh();
    return suscribirse(refresh);
  }, [refresh]);
  return status;
}

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${APP_NAME}` : `${APP_NAME}: materiales escolares accesibles`;
  }, [title]);
}

// Carga asíncrona con estados de carga / error / datos
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ loading: true, error: null, data: null });
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const run = useCallback(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    Promise.resolve()
      .then(() => fnRef.current())
      .then((data) => alive && setState({ loading: false, error: null, data }))
      .catch((error) => alive && setState({ loading: false, error, data: null }));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  useEffect(() => run(), [run]);
  return { ...state, reload: run, setData: (data) => setState((s) => ({ ...s, data })) };
}
