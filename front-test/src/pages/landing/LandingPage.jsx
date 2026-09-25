import { useDocumentTitle } from '../../lib/hooks.js';
import Faq from './Faq.jsx';
import Features from './Features.jsx';
import Hero from './Hero.jsx';
import HowItWorks from './HowItWorks.jsx';
import LandingFooter from './LandingFooter.jsx';
import LandingHeader from './LandingHeader.jsx';
import Platform from './Platform.jsx';
import Problem from './Problem.jsx';

// Portada pública. Vive fuera del Layout de la app: tiene su propia barra y su propio pie.
export default function LandingPage() {
  useDocumentTitle(null);

  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip">
      <a
        href="#contenido"
        className="sr-only-focusable fixed left-4 top-3 z-50 rounded-[var(--radius-control)] bg-accent px-4 py-3 font-bold text-on-accent"
      >
        Ir al contenido
      </a>
      <LandingHeader />
      <main id="contenido" className="flex-1">
        <Hero />
        <Problem />
        <HowItWorks />
        <Features />
        <Platform />
        <Faq />
      </main>
      <LandingFooter />
    </div>
  );
}
