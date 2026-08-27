import { Header } from "@/components/ui/header";
/**
 * DogWalking — Confiance canine de proximité : page de recherche factuelle,
 * orientée vers les profils et services renseignés, avec confirmation directe des créneaux.
 */
import { Footer } from "@/components/ui/footer";
import { SEOHead } from "@/components/seo/SEOHead";
import FindWalkersHero from "@/components/findwalkers/HeroSection";
import SearchSection from "@/components/findwalkers/SearchSection";
import DemandesSection, { DevenirAccompagnateurCTA } from "@/components/findwalkers/DemandesSection";

const FindWalkers = () => {
  return (
    <div className="min-h-dvh bg-background">
      <SEOHead
        title="Consulter les profils Accompagnateur"
        description="Consultez les profils et services renseignés, puis confirmez le créneau et les modalités directement avec l’Accompagnateur."
      />
      <Header />
      <FindWalkersHero />
      <DemandesSection />
      <SearchSection />
      <DevenirAccompagnateurCTA />
      <Footer />
    </div>
  );
};

export default FindWalkers;
