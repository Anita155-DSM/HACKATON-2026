export const playSound = (type) => {
  try {
    // Inicializamos el sintetizador nativo del navegador
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    if (type === 'success') {
      // Configuración para sonido de ÉXITO (Tono alegre que sube)
      oscillator.type = 'sine'; // Onda suave
      oscillator.frequency.setValueAtTime(440, ctx.currentTime); // Nota A4
      oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1); // Sube rápido a A5
      
      // Control de volumen (Fade out)
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime); // Volumen al 10%
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
      
    } else {
      // Configuración para sonido de ERROR (Tono grave que baja)
      oscillator.type = 'square'; // Onda más rústica/alerta
      oscillator.frequency.setValueAtTime(300, ctx.currentTime); 
      oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.2); 
      
      // Control de volumen (Fade out)
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime); // Volumen al 10%
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    }
  } catch (error) {
    console.warn("El navegador no soporta Web Audio API o está silenciado.", error);
  }
};