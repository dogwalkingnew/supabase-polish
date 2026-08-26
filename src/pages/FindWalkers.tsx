import { Header } from "@/components/ui/header";
/**
 * DogWalking — Confiance canine de proximité : page de recherche factuelle,
 * orientée vers les profils, services et disponibilités réellement renseignés.
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
        title="Trouver un Accompagnateur de Confiance"
        description="Trouvez un Accompagnateur près de chez vous. Consultez les profils, services et disponibilités renseignés pour organiser votre demande."
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
