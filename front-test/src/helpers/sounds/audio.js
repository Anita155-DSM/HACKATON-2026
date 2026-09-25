export const playSound = (type) => {
  const isSoundEnabled = localStorage.getItem("sounds") !== "false";
  if (!isSoundEnabled) return;

  // Si es la primera vez que entra, lo ponemos en 0.8 (80%) para que suene fuerte de entrada
  const savedVolume = localStorage.getItem("volume");
  const volumeLevel = savedVolume !== null ? parseFloat(savedVolume) : 0.8;
  
  // Eliminamos la restricción. Multiplicamos por 1.5 para dar un overboost al 100% de la barra.
  const actualGain = volumeLevel * 1.5;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    if (type === 'success') {
      // Cambiamos 'sine' (onda pura) por 'triangle' (onda con armónicos impares).
      // Es mucho más fácil de percibir para alguien con pérdida auditiva.
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(440, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(actualGain, ctx.currentTime);
      // Alargamos un poco el tiempo de decaimiento (de 0.3 a 0.4) para que el sonido no muera tan rápido
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.4);
      
    } else {
      // 'square' ya es muy agresiva por naturaleza, ideal para errores
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(300, ctx.currentTime); 
      oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.2); 
      
      gainNode.gain.setValueAtTime(actualGain, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.4);
    }
  } catch (error) {
    console.warn("Web Audio API no soportada.", error);
  }
};