import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ProblemSection from "./components/ProblemSection";

export default function Landing() {
  return (
    <div className="min-h-screen bg-forma-dark text-white selection:bg-forma-teal selection:text-forma-dark">
      <Header />
      <HeroSection />
      <ProblemSection />
    </div>
  );
}