import { PageHeader } from '../components/ui.jsx';
import { REPO_URL } from '../lib/config.js';
import { useDocumentTitle } from '../lib/hooks.js';

export default function Accessibility() {
  useDocumentTitle('Declaración de accesibilidad');
  const hechos = [
    'Contraste de al menos 4.5 a 1 en textos, y modo de alto contraste.',
    'Letra base de 18 px y botones de al menos 48 por 48 px. Todo se puede agrandar desde Preferencias.',
    'Navegación completa con teclado, foco siempre visible y enlace para saltar al contenido.',
    'Compatible con lectores de pantalla (TalkBack, VoiceOver, NVDA): encabezados ordenados, etiquetas en todos los controles y avisos anunciados.',
    'Lectura en voz alta con la frase resaltada, guía de voz y dictado del código y de la búsqueda.',
    'Modo concentración, menos movimiento y letra con más espacio.',
    'Sin tiempos límite ni gestos obligatorios. Los avisos de error se quedan hasta que los cerrás.',
    'Los avisos con sonido siempre aparecen también escritos.',
    'Funciona sin internet una vez guardado el material. La portada se puede leer sin JavaScript.',
  ];
  const pendientes = [
    'Subtítulos para videos: la demo no incluye videos todavía.',
    'La interfaz todavía no está traducida al wichí: falta la traducción de una persona hablante.',
    'La descripción de imágenes depende de que el PDF se lea con la opción "Leer también las imágenes".',
    'Falta una revisión con personas usuarias y con una auditoría externa.',
  ];
  return (
    <div className="wrap py-10 md:py-14">
      <div className="reading">
        <PageHeader title="Declaración de accesibilidad">
          Nuestro objetivo es cumplir las pautas WCAG 2.2 nivel AA, sobre todo en la vista del alumno. Esto es lo que ya hace la
          plataforma y lo que falta.
        </PageHeader>
        <h2 className="mb-3 text-[1.35rem] font-bold">Lo que ya hace</h2>
        <ul className="mb-10 grid list-disc gap-2 pl-6">
          {hechos.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <h2 className="mb-3 text-[1.35rem] font-bold">Lo que falta</h2>
        <ul className="mb-10 grid list-disc gap-2 pl-6">
          {pendientes.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <h2 className="mb-3 text-[1.35rem] font-bold">Datos personales</h2>
        <p className="mb-10">
          No pedimos diagnósticos ni datos de salud. Las preferencias se guardan solo en tu celular. El alumno no necesita registrarse.
        </p>
        <h2 className="mb-3 text-[1.35rem] font-bold">Contacto</h2>
        <p>
          Si encontrás una barrera, contanos en el{' '}
          <a href={REPO_URL} target="_blank" rel="noreferrer">
            repositorio del proyecto
          </a>
          .
        </p>
      </div>
    </div>
  );
}
