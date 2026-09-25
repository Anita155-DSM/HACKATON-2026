/* Service worker de FormA: offline-first.
 * - App (HTML, JS, CSS, fuentes, íconos): se guarda toda al instalar, usando precache-manifest.json.
 * - Navegación: intenta la red y, sin señal, responde con el index.html guardado.
 * - Archivos del build: primero la caché (tienen hash en el nombre, no cambian).
 * - Los materiales NO pasan por acá: se guardan en IndexedDB (src/lib/offline). */

const CACHE = 'puente-app-v1';
const BASE = ['/', '/index.html', '/manifest.webmanifest', '/icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await cache.addAll(BASE);
      try {
        const res = await fetch('/precache-manifest.json', { cache: 'no-store' });
        const { files } = await res.json();
        await cache.addAll(files);
      } catch {
        // En desarrollo no existe el manifest: se cachea a medida que se usa.
      }
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // la API la maneja la app

  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          const cache = await caches.open(CACHE);
          cache.put('/index.html', fresh.clone());
          return fresh;
        } catch {
          return (await caches.match('/index.html')) || (await caches.match('/'));
        }
      })(),
    );
    return;
  }

  event.respondWith(
    (async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      try {
        const res = await fetch(request);
        if (res.ok) (await caches.open(CACHE)).put(request, res.clone());
        return res;
      } catch {
        return new Response('', { status: 504, statusText: 'Sin conexión' });
      }
    })(),
  );
});
