import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ProblemSection from "./components/ProblemSection";
import HowItWorksSection from "./components/HowItWorkSection";
import AccessibilitySection from "./components/AccesibilitySection";
import FAQSection from "./components/FAQSection";
import FooterSection from "./components/FooterSection";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-forma-ink dark:bg-forma-night dark:text-white font-raleway selection:bg-forma-cyan selection:text-forma-navy flex flex-col">
      <Header />

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
