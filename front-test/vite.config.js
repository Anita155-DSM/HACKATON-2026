import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Emite precache-manifest.json con todos los archivos del build.
// El service worker (public/sw.js) lo lee al instalarse y guarda la app entera,
// así abre sin señal aunque el alumno nunca haya visitado todas las pantallas.
function precacheManifest() {
  return {
    name: 'precache-manifest',
    apply: 'build',
    generateBundle(_opts, bundle) {
      const files = Object.keys(bundle)
        .filter((f) => !f.endsWith('.map'))
        .map((f) => `/${f}`);
      this.emitFile({
        type: 'asset',
        fileName: 'precache-manifest.json',
        source: JSON.stringify({ version: Date.now(), files }),
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), precacheManifest()],
  server: { port: 5173 },
  build: { target: 'es2020' },
});
