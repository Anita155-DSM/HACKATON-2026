// Voz del navegador (Web Speech API).
// - Síntesis: usa las voces instaladas en el celular, así funciona también sin internet.
// - Reconocimiento: dictar el código o una búsqueda. En Chrome necesita conexión.

import { splitSentences } from './easyRead.js';

export const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

const Recognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
export const canListen = Boolean(Recognition);

let voiceCache = null;
function pickVoice() {
  if (!canSpeak) return null;
  const voices = speechSynthesis.getVoices();
  if (!voices.length) return null;
  if (voiceCache && voices.includes(voiceCache)) return voiceCache;
  voiceCache =
    voices.find((v) => v.lang === 'es-AR') ||
    voices.find((v) => v.lang === 'es-US' || v.lang === 'es-419') ||
    voices.find((v) => v.lang?.startsWith('es') && v.localService) ||
    voices.find((v) => v.lang?.startsWith('es')) ||
    null;
  return voiceCache;
}
if (canSpeak) speechSynthesis.addEventListener?.('voiceschanged', () => (voiceCache = null));

let rate = 1;
export const setRate = (r) => (rate = r);

export function stop() {
  if (canSpeak) speechSynthesis.cancel();
}

export const isSpeaking = () => canSpeak && speechSynthesis.speaking;

// Dice un texto corto (guía de voz, avisos). Corta lo que se estaba diciendo.
export function say(text, { interrupt = true } = {}) {
  if (!canSpeak || !text) return;
  if (interrupt) speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'es-AR';
  const v = pickVoice();
  if (v) u.voice = v;
  u.rate = rate;
  speechSynthesis.speak(u);
}

// Lee una lista de frases una por una, avisando cuál va para poder resaltarla.
// Devuelve un control { stop, pause, resume }.
export function readSentences(sentences, { start = 0, onSentence, onEnd } = {}) {
  if (!canSpeak) return null;
  speechSynthesis.cancel();
  let index = start;
  let cancelled = false;

  const next = () => {
    if (cancelled) return;
    if (index >= sentences.length) {
      onSentence?.(-1);
      onEnd?.();
      return;
    }
    const u = new SpeechSynthesisUtterance(sentences[index]);
    u.lang = 'es-AR';
    const v = pickVoice();
    if (v) u.voice = v;
    u.rate = rate;
    onSentence?.(index);
    u.onend = () => {
      index += 1;
      next();
    };
    u.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        index += 1;
        next();
      }
    };
    speechSynthesis.speak(u);
  };
  // Chrome a veces ignora speak() justo después de cancel()
  setTimeout(next, 60);

  return {
    stop() {
      cancelled = true;
      speechSynthesis.cancel();
      onSentence?.(-1);
    },
    pause: () => speechSynthesis.pause(),
    resume: () => speechSynthesis.resume(),
    get index() {
      return index;
    },
  };
}

export function readText(text, opts) {
  return readSentences(splitSentences(text), opts);
}

// Escucha una frase y la devuelve como texto.
export function listen({ lang = 'es-AR', onInterim } = {}) {
  return new Promise((resolve, reject) => {
    if (!Recognition) {
      reject(new Error('Este navegador no permite dictar por voz'));
      return;
    }
    const r = new Recognition();
    r.lang = lang;
    r.interimResults = Boolean(onInterim);
    r.maxAlternatives = 3;
    let finalText = '';
    r.onresult = (e) => {
      const res = e.results[e.results.length - 1];
      if (res.isFinal) finalText = res[0].transcript;
      else onInterim?.(res[0].transcript);
    };
    r.onerror = (e) => {
      const msg =
        e.error === 'not-allowed'
          ? 'Hace falta permitir el micrófono'
          : e.error === 'network'
            ? 'Para dictar hace falta conexión'
            : e.error === 'no-speech'
              ? 'No escuchamos nada. Probá de nuevo'
              : 'No pudimos escuchar. Probá de nuevo';
      reject(new Error(msg));
    };
    r.onend = () => resolve(finalText.trim());
    r.start();
  });
}

// "cuatro ocho dos siete", "4 8 2 7", "cuatro mil ochocientos veintisiete" -> "4827"
const DIGITOS = {
  cero: '0', uno: '1', una: '1', dos: '2', tres: '3', cuatro: '4',
  cinco: '5', seis: '6', siete: '7', ocho: '8', nueve: '9',
};
export function digitsFromSpeech(text) {
  const t = text.toLowerCase();
  const direct = t.replace(/\D/g, '');
  if (direct.length >= 4) return direct.slice(0, 4);
  const words = t.split(/[\s,.-]+/).map((w) => DIGITOS[w]).filter(Boolean).join('');
  return (direct + words).slice(0, 4);
}
