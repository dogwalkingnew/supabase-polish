import { Header } from "@/components/ui/header";
import { HeroSection } from "@/components/ui/hero-section";
import { SearchForm } from "@/components/ui/search-form";
import { WhySection } from "@/components/ui/why-section";
import { HowItWorksSection } from "@/components/ui/how-it-works-section";
import { ServicesSection } from "@/components/ui/services-section";
import { UserTypesSection } from "@/components/ui/user-types-section";
import { UseCasesSection } from "@/components/ui/use-cases-section";
import { HomeFAQSection } from "@/components/ui/home-faq-section";
import { Footer } from "@/components/ui/footer";
import { FloatingContact } from "@/components/ui/floating-contact";
import { SEOHead } from "@/components/seo/SEOHead";
/**
 * DogWalking — Confiance canine de proximité : page publique éditoriale, calme et lisible,
 * fondée sur des informations de service réelles plutôt que des profils ou avis non vérifiés.
 */

const Index = () => {
  return (
    <div className="min-h-dvh bg-background">
      <SEOHead
        title="Promenades et gardes de proximité"
        description="Consultez les profils disponibles, organisez votre demande et confirmez les modalités de mission avec l’Accompagnateur choisi."
      />
      <Header />
      <main className="relative overflow-hidden">
        {/* 1. Hero + recherche */}
        <HeroSection />
        <section className="relative overflow-hidden bg-warm/80 px-4 py-10 md:py-14">
          <div aria-hidden="true" className="dogwalking-route absolute -left-10 top-5 -rotate-6" />
          <div className="container mx-auto max-w-6xl">
            <div className="grid items-center gap-8 md:grid-cols-[1.25fr_0.75fr]">
              <div className="max-w-2xl">
                <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-primary">Une mission commence par une demande claire</p>
                <h2 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">Votre quotidien change. Les besoins de votre animal aussi.</h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">Indiquez le service, le lieu et le créneau souhaité. Les informations affichées vous aident à engager l’échange ; les conditions se confirment ensuite entre les personnes concernées.</p>
              </div>
              <div className="rounded-2xl border border-primary/15 bg-background/80 p-5 shadow-soft backdrop-blur-sm">
                <p className="text-sm font-bold text-foreground">Le repère DogWalking</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Disponibilités renseignées, candidature accompagnée, et suivi de demande depuis un même espace — sans promesse automatique.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="relative z-10 bg-background px-4 py-10 md:py-14">
          <div className="container mx-auto">
            <SearchForm />
          </div>
        </section>

        {/* 2. Services proposés */}
        <ServicesSection />

        {/* 3. Déclencheurs concrets — quand on a besoin de la plateforme */}
        <UseCasesSection />

        {/* 4. Comment ça marche (3 étapes) */}
        <HowItWorksSection />

        {/* 5. Informations utiles — un seul bloc de confiance factuel */}
        <WhySection />

        {/* 6. Propriétaires / Accompagnateurs */}
        <UserTypesSection />

        {/* 7. FAQ */}
        <HomeFAQSection />

        {/* 8. Positionnement éditorial factuel */}
        <section className="relative py-14 md:py-18 bg-warm/65 overflow-hidden">
          <div aria-hidden="true" className="dogwalking-route absolute -right-12 top-8 rotate-[-8deg]" />
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-left md:pl-8 mb-8 md:mb-10 max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Une expérience pensée pour les besoins du quotidien
              </h2>
              <p className="text-base md:text-lg text-muted-foreground">
                DogWalking aide les Propriétaires et les Accompagnateurs à organiser leurs demandes, leurs informations de mission et leurs échanges depuis un même espace.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-primary/15 bg-card/95 p-6 md:p-8 shadow-soft">
              <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
                Les informations de disponibilité, de service et de mission doivent être confirmées entre les personnes concernées avant toute prestation. Les fonctionnalités annoncées sont volontairement limitées à celles disponibles dans l’application.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
};

export default Index;
