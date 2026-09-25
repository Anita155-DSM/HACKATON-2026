import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpenText,
  CheckCircle,
  CloudArrowDown,
  CloudCheck,
  HourglassMedium,
  SpeakerHigh,
  TextAlignLeft,
  Translate,
  Trash,
} from '@phosphor-icons/react';
import { useAnnouncer } from '../context/AnnouncerContext.jsx';
import { materials as materialsApi, versionesDe } from '../lib/api.js';
import { gradeLabel, levelLabel } from '../lib/config.js';
import { useOfflineStatus } from '../lib/hooks.js';
import { eliminarGuardado, guardarMaterial, marcarParaDescargar } from '../lib/offline/index.js';
import { Badge } from './ui.jsx';

export const VERSION_INFO = {
  texto: { label: 'Texto', icon: TextAlignLeft },
  lectura_facil: { label: 'Lectura fácil', icon: BookOpenText },
  audio: { label: 'Audio', icon: SpeakerHigh },
  wichi: { label: 'Wichí', icon: Translate },
};

export function VersionList({ versiones }) {
  const order = ['texto', 'lectura_facil', 'audio', 'wichi'];
  const list = order.filter((v) => versiones.includes(v));
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Versiones disponibles">
      {list.map((v) => {
        const { label, icon: Icon } = VERSION_INFO[v];
        return (
          <li
            key={v}
            className="inline-flex items-center gap-1.5 rounded-[10px] bg-surface-2 px-2.5 py-1 text-[0.85rem] font-bold hc:border hc:border-ink"
          >
            <Icon size={18} aria-hidden="true" />
            {label}
          </li>
        );
      })}
    </ul>
  );
}

export function materialMeta(m) {
  return [levelLabel(m.level), gradeLabel(m.level, m.grade), m.subject].filter(Boolean).join(', ');
}

// Botón "Guardar para usar sin internet" + indicador de estado (sección 6.1)
export function OfflineButton({ material, compact = false }) {
  const status = useOfflineStatus(material.id);
  const { notify } = useAnnouncer();
  const [busy, setBusy] = useState(false);

  const saveIt = async () => {
    setBusy(true);
    try {
      if (!navigator.onLine) {
        await marcarParaDescargar(material.id);
        notify('Se va a descargar cuando haya señal', 'info');
        return;
      }
      const full = material.accessibleText ? material : await materialsApi.get(material.id);
      await guardarMaterial(full);
      notify(`"${material.title}" quedó guardado en tu celular`, 'success');
    } catch {
      await marcarParaDescargar(material.id).catch(() => {});
      notify('No se pudo guardar ahora. Se va a descargar cuando haya señal', 'error');
    } finally {
      setBusy(false);
    }
  };

  const removeIt = async () => {
    await eliminarGuardado(material.id);
    notify('Lo quitamos de tu celular', 'info');
  };

  if (status.estado === 'guardado') {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="ok" icon={CloudCheck}>
          {status.mensaje}
        </Badge>
        {!compact && (
          <button type="button" className="btn btn-ghost !min-h-11 text-[0.9rem]" onClick={removeIt}>
            <Trash size={20} aria-hidden="true" />
            Quitar del celular
          </button>
        )}
      </div>
    );
  }
  if (status.estado === 'pendiente') {
    return (
      <Badge tone="warn" icon={HourglassMedium}>
        {status.mensaje}
      </Badge>
    );
  }
  if (status.estado === 'no-disponible') return <p className="hint">{status.mensaje}</p>;

  return (
    <button type="button" className="btn btn-secondary" onClick={saveIt} disabled={busy} aria-busy={busy}>
      <CloudArrowDown size={22} aria-hidden="true" />
      {busy ? 'Guardando' : 'Guardar para usar sin internet'}
    </button>
  );
}

export function MaterialCard({ material, headingLevel = 3, showSave = true }) {
  const H = `h${headingLevel}`;
  const meta = materialMeta(material);
  const versiones = versionesDe(material);
  return (
    <article className="box relative grid gap-3 p-5 transition-shadow hover:shadow-[0_10px_30px_rgb(var(--shadow-tint)/0.10)]">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <H className="text-[1.25rem] font-bold leading-snug">
          <Link to={`/material/${material.id}`} className="text-ink no-underline hover:underline">
            {material.title}
          </Link>
        </H>
        {material.ejemplo && <Badge tone="accent">Ejemplo</Badge>}
      </div>
      {meta && <p className="text-ink-2">{meta}</p>}
      <VersionList versiones={versiones} />
      {(material.source || material.license) && (
        <p className="text-[0.85rem] text-ink-2">
          {[material.author, material.license].filter(Boolean).join('. ')}
        </p>
      )}
      {showSave && (
        <div className="pt-1">
          <OfflineButton material={material} compact />
        </div>
      )}
    </article>
  );
}

// Reproductor para audio grabado (URL del servidor o Blob guardado en el celular)
export function RecordedAudio({ src, blob, label }) {
  const [url, setUrl] = useState(src || null);
  useEffect(() => {
    if (!blob) {
      setUrl(src || null);
      return undefined;
    }
    const u = URL.createObjectURL(blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [src, blob]);
  if (!url) return null;
  return (
    <figure className="grid gap-2">
      <figcaption className="font-bold">{label}</figcaption>
      <audio controls preload="none" src={url} className="w-full">
        Tu navegador no puede reproducir este audio.
      </audio>
    </figure>
  );
}

export function TranslationStatus({ tr }) {
  if (tr.simulated)
    return (
      <Badge tone="warn" icon={HourglassMedium}>
        Traducción simulada: no es una traducción real
      </Badge>
    );
  if (tr.validated)
    return (
      <Badge tone="ok" icon={CheckCircle}>
        Revisada por la comunidad
      </Badge>
    );
  return (
    <Badge tone="warn" icon={HourglassMedium}>
      Falta que la revise una persona hablante
    </Badge>
  );
}
