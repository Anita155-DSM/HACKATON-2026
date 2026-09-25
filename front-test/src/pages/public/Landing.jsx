import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ProblemSection from "./components/ProblemSection";
import HowItWorksSection from "./components/HowItWorkSection";
import AccessibilitySection from "./components/AccesibilitySection";
import FAQSection from "./components/FAQSection";
import FooterSection from "./components/FooterSection";

export default function Landing() {
  return (
    <div className="min-h-screen bg-forma-dark text-white selection:bg-forma-teal selection:text-forma-dark flex flex-col">
      {/* 1. El Header fijo que flota sobre todo */}
      <Header />
      {/* 2. TU DIV ESPACIADOR: Ocupa los 64px (h-16) exactos del Header para que el contenido no quede tapado */}
      <div className="h-16 w-full shrink-0"></div>

      {/* 3. El contenido real de la página */}
      <main className="flex-1">
        <HeroSection />
        <ProblemSection />
        <HowItWorksSection />
        <AccessibilitySection />
        <FAQSection />
      </main>

      <FooterSection />

    </div>
  );
}