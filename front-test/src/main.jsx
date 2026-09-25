import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { materials } from './lib/api.js';
import { API_URL } from './lib/config.js';
import { configurarOffline, iniciarSincronizacion } from './lib/offline/index.js';
import { load } from './lib/storage.js';
import './styles/index.css';

configurarOffline({
  apiUrl: API_URL,
  fetchMaterial: (id) => materials.get(id),
  soloWifi: () => Boolean(load('prefs', {}).wifiOnly),
});
iniciarSincronizacion();

// Service worker solo en producción (npm run build && npm run preview), para no pelear con la recarga de Vite.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
