import { useEffect, useRef, useState } from 'react';
import { ArrowCounterClockwise, Backspace, Microphone, Record, Stop, Trash } from '@phosphor-icons/react';
import { canListen, listen } from '../lib/speech.js';

/* Teclado de números grandes para el código de 4 dígitos */
export function NumericKeypad({ onDigit, onDelete, disabled }) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const cls =
    'control grid h-16 place-items-center rounded-[var(--radius-control)] border-2 border-control bg-surface text-[1.7rem] font-bold text-ink active:scale-[0.97] hover:bg-surface-2 disabled:opacity-50';
  return (
    <div className="grid grid-cols-3 gap-2.5" role="group" aria-label="Teclado de números">
      {keys.map((k) => (
        <button key={k} type="button" className={cls} onClick={() => onDigit(k)} disabled={disabled}>
          {k}
        </button>
      ))}
      <span aria-hidden="true" />
      <button type="button" className={cls} onClick={() => onDigit('0')} disabled={disabled}>
        0
      </button>
      <button type="button" className={cls} onClick={onDelete} disabled={disabled}>
        <Backspace size={30} aria-hidden="true" />
        <span className="sr-only">Borrar el último número</span>
      </button>
    </div>
  );
}

/* Botón para dictar por voz */
export function VoiceInputButton({ onResult, onError, label = 'Decirlo en voz alta', className = '' }) {
  const [listening, setListening] = useState(false);
  if (!canListen) return null;
  const start = async () => {
    setListening(true);
    try {
      const text = await listen();
      if (text) onResult(text);
    } catch (err) {
      onError?.(err.message);
    } finally {
      setListening(false);
    }
  };
  return (
    <button type="button" className={`btn btn-secondary ${className}`} onClick={start} disabled={listening} aria-live="polite">
      <Microphone size={24} weight={listening ? 'fill' : 'regular'} aria-hidden="true" />
      {listening ? 'Escuchando' : label}
    </button>
  );
}

/* Grabador de audio para traductores (MediaRecorder).
   El backend acepta audio/webm, audio/mp4, audio/ogg y audio/mpeg. */
const TIPOS = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus', 'audio/ogg'];

export function AudioRecorder({ value, onChange }) {
  const [state, setState] = useState('idle'); // idle | recording | error
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [url, setUrl] = useState(null);
  const recRef = useRef(null);
  const chunks = useRef([]);
  const timer = useRef(null);

  useEffect(() => {
    if (!value) {
      setUrl(null);
      return undefined;
    }
    const u = URL.createObjectURL(value);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [value]);

  useEffect(
    () => () => {
      clearInterval(timer.current);
      recRef.current?.stream?.getTracks().forEach((t) => t.stop());
    },
    [],
  );

  if (typeof window === 'undefined' || !window.MediaRecorder || !navigator.mediaDevices?.getUserMedia) {
    return <p className="hint">Este navegador no permite grabar audio. Probá con Chrome en el celular.</p>;
  }

  const start = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      const mimeType = TIPOS.find((t) => MediaRecorder.isTypeSupported(t));
      // Calidad de voz: bitrate bajo para ahorrar datos (sección 6.1)
      const rec = new MediaRecorder(stream, { ...(mimeType && { mimeType }), audioBitsPerSecond: 32000 });
      chunks.current = [];
      rec.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const type = (rec.mimeType || 'audio/webm').split(';')[0];
        onChange(new Blob(chunks.current, { type }));
        setState('idle');
        clearInterval(timer.current);
      };
      recRef.current = rec;
      rec.start();
      setSeconds(0);
      timer.current = setInterval(() => setSeconds((s) => s + 1), 1000);
      setState('recording');
    } catch {
      setError('No pudimos usar el micrófono. Revisá el permiso del navegador.');
      setState('error');
    }
  };

  const stop = () => recRef.current?.state === 'recording' && recRef.current.stop();
  const mmss = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-3">
        {state === 'recording' ? (
          <button type="button" className="btn btn-danger btn-lg" onClick={stop}>
            <Stop size={24} weight="fill" aria-hidden="true" />
            Terminar de grabar
          </button>
        ) : (
          <button type="button" className="btn btn-secondary btn-lg" onClick={start}>
            {value ? <ArrowCounterClockwise size={24} aria-hidden="true" /> : <Record size={24} weight="fill" className="text-danger" aria-hidden="true" />}
            {value ? 'Grabar de nuevo' : 'Grabar audio'}
          </button>
        )}
        {state === 'recording' && (
          <p role="status" className="font-bold text-danger">
            Grabando {mmss}
          </p>
        )}
      </div>
      {error && <p className="error-text">{error}</p>}
      {url && state !== 'recording' && (
        <div className="grid gap-2">
          <audio controls src={url} className="w-full">
            Tu navegador no puede reproducir este audio.
          </audio>
          <div>
            <button type="button" className="btn btn-ghost" onClick={() => onChange(null)}>
              <Trash size={20} aria-hidden="true" />
              Borrar grabación
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
