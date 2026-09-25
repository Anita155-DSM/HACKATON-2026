// Utilidades de texto: partir en bloques, frases y partes cortas.

// Convierte el texto plano del backend en bloques.
// Formato acordado: títulos en una línea sola, listas con "- " al inicio.
export function parseBlocks(text = '') {
  const blocks = [];
  const paragraphs = String(text).replace(/\r/g, '').split(/\n\s*\n/);
  for (const para of paragraphs) {
    const lines = para.split('\n').map((l) => l.trim()).filter(Boolean);
    let listBuffer = null;
    const flushList = () => {
      if (listBuffer) blocks.push({ type: 'list', items: listBuffer });
      listBuffer = null;
    };
    lines.forEach((line, i) => {
      if (/^[-•]\s+/.test(line)) {
        listBuffer = listBuffer || [];
        listBuffer.push(line.replace(/^[-•]\s+/, ''));
        return;
      }
      flushList();
      const isHeading =
        line.length <= 60 && !/[.:;,?!]$/.test(line) && (lines.length === 1 || i === 0 || /^\d+\.\s/.test(line));
      blocks.push({ type: isHeading ? 'heading' : 'paragraph', text: line });
    });
    flushList();
  }
  // Si el primer bloque repite el título del material, lo marcamos para no duplicarlo.
  return blocks;
}

// Agrupa bloques en partes cortas (una parte empieza en cada título).
export function splitParts(blocks, maxBlocks = 6) {
  const parts = [];
  let current = [];
  blocks.forEach((b, i) => {
    const startsNew = (b.type === 'heading' && current.length > 0 && i > 0) || current.length >= maxBlocks;
    if (startsNew) {
      parts.push(current);
      current = [];
    }
    current.push(b);
  });
  if (current.length) parts.push(current);
  // Si un título quedó solo al principio, lo unimos a la parte siguiente.
  if (parts.length > 1 && parts[0].length === 1 && parts[0][0].type === 'heading') {
    parts[1] = [...parts[0], ...parts[1]];
    parts.shift();
  }
  return parts;
}

export function splitSentences(text) {
  return (
    String(text)
      .match(/[^.!?]+[.!?]+["»)]?|[^.!?]+$/g)
      ?.map((s) => s.trim())
      .filter(Boolean) || []
  );
}

// Versión simple de lectura fácil hecha en el dispositivo. Solo para el modo demostración:
// una frase por línea y frases largas cortadas en comas. No reemplaza al LLM ni a una revisión humana.
export function simpleEasyRead(text) {
  return parseBlocks(text)
    .map((b) => {
      if (b.type === 'heading') return b.text;
      if (b.type === 'list') return b.items.map((it) => `- ${it}`).join('\n');
      return splitSentences(b.text)
        .flatMap((s) => {
          const words = s.split(/\s+/);
          if (words.length <= 18) return [s];
          return s
            .split(/,\s+/)
            .map((p) => p.trim())
            .filter(Boolean)
            .map((p) => (/[.!?]$/.test(p) ? p : `${p}.`))
            .map((p) => p.charAt(0).toUpperCase() + p.slice(1));
        })
        .join('\n');
    })
    .join('\n\n');
}

export function plainText(blocks) {
  return blocks
    .map((b) => (b.type === 'list' ? b.items.join('. ') : b.text))
    .join('\n');
}
