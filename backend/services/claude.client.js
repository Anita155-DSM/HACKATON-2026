// Cliente mínimo para la API de Claude. Lo usan lecturaFacil y transcribir.
const API_URL = 'https://api.anthropic.com/v1/messages';

export const hayKey = () => Boolean(process.env.LLM_API_KEY);
export const modeloClaude = () => process.env.LLM_MODEL || 'claude-haiku-4-5-20251001';
const timeoutMs = () => Number(process.env.LLM_TIMEOUT_MS || 90000);

/**
 * Manda un pedido a Claude y devuelve el texto de la respuesta.
 * Lanza error si falla, si tarda demasiado o si la respuesta se cortó por largo.
 * @param {object} opciones
 * @param {string} opciones.system   instrucciones fijas
 * @param {string|Array} opciones.content  texto o bloques (por ejemplo, un PDF + texto)
 */
export async function pedirAClaude({ system, content, maxTokens = 8000, temperature = 0.3 }) {
  if (!hayKey()) throw new Error('No hay LLM_API_KEY configurada');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs());
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.LLM_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: modeloClaude(),
        max_tokens: maxTokens,
        temperature,
        system,
        messages: [{ role: 'user', content }],
      }),
    });
    if (!res.ok) throw new Error(`Claude respondió ${res.status}: ${await res.text()}`);

    const data = await res.json();
    // Si se cortó por largo, no devolvemos un texto incompleto.
    if (data.stop_reason === 'max_tokens') {
      throw new Error('La respuesta se cortó por largo (max_tokens)');
    }
    const salida = (data.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();
    if (!salida) throw new Error('Claude devolvió una respuesta vacía');
    return salida;
  } catch (err) {
    if (err.name === 'AbortError') throw new Error(`Claude tardó más de ${timeoutMs() / 1000} s`);
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
