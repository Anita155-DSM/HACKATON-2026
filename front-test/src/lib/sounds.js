// Sonidos del sistema con Web Audio (sin archivos: no pesan nada).
// Siempre acompañan a un aviso visual; nunca son la única señal (WCAG 1.3.3).

let ctx;
let enabled = true;
export const setSoundsEnabled = (v) => (enabled = v);

function tone(notes, type = 'sine', volume = 0.18) {
  if (!enabled) return;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    let t = ctx.currentTime;
    for (const [freq, dur] of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(volume, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.02);
      t += dur * 0.85;
    }
  } catch {
    /* sin Web Audio: no pasa nada */
  }
}

export const sounds = {
  success: () => tone([[523, 0.12], [784, 0.2]], 'triangle'),
  error: () => tone([[330, 0.16], [247, 0.26]], 'square', 0.08),
  tap: () => tone([[660, 0.06]], 'sine', 0.08),
  toggleOn: () => tone([[587, 0.08], [880, 0.1]], 'sine', 0.12),
  toggleOff: () => tone([[880, 0.08], [587, 0.1]], 'sine', 0.12),
  info: () => tone([[698, 0.14]], 'triangle', 0.12),
};
