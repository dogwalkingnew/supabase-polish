/**
 * DogWalking — Confiance canine de proximité : page de promenade informative,
 * sans avis, paiement, garanties, statistiques ou preuves de mission simulés.
 */
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { SEOHead } from "@/components/ui/seo-head";
import { SEOFAQ } from "@/components/ui/seo-faq";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ServiceHero } from "@/components/ui/service-hero";
import { Dog, Clock, MapPin, Heart, ArrowRight, Search, MessageCircle, CheckCircle, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import servicePromenadeImg from "@/assets/service-promenade.jpg";

const promenadeFAQs = [
  { question: "Comment déposer une demande de promenade ?", answer: "Décrivez les besoins de votre animal, indiquez votre ville ou zone et consultez les profils disponibles. Confirmez ensuite le créneau et les modalités avec l’Accompagnateur." },
  { question: "Quelle durée choisir ?", answer: "La durée dépend du besoin de votre chien et du service organisé. Précisez votre préférence dans la demande puis convenez de la durée finale avec l’Accompagnateur." },
  { question: "Puis-je indiquer des besoins particuliers ?", answer: "Oui. Renseignez les consignes utiles, habitudes et contraintes de votre animal avant la mission afin d’échanger sur les conditions adaptées." },
  { question: "Puis-je payer dans DogWalking ?", answer: "Le traitement de paiement en ligne n’est pas encore disponible. Le prix et le moyen de règlement doivent être confirmés entre les personnes concernées avant la mission." },
];

const ServicePromenade = () => {
  const navigate = useNavigate();
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Promenade de chien",
    "description": "Organisation de demandes de promenade de chien avec des Accompagnateurs dont les services et disponibilités sont renseignés dans DogWalking.",
    "provider": { "@type": "Organization", "name": "DogWalking", "url": "https://dogwalking.fr" },
    "areaServed": { "@type": "Country", "name": "France" },
  };

  return (
    <div className="min-h-dvh bg-background">
      <SEOHead title="Promenade de chien | DogWalking" description="Organisez une demande de promenade de chien et consultez les profils disponibles dans votre zone." keywords="promenade chien, accompagnateur canin, balade chien" canonicalUrl="https://dogwalking.fr/services/promenade" structuredData={serviceJsonLd} ogImage={servicePromenadeImg} />
      <Header />
      <main>
        <ServiceHero
          backgroundImage={servicePromenadeImg}
          badgeIcon={Dog}
          badgeText="Organiser une promenade"
          title={<>Promenade de Chien près de <span className="text-gradient">chez vous</span></>}
          description="Présentez les besoins de votre chien, consultez les profils et organisez les modalités d’une promenade avec un Accompagnateur."
          ctaText="Trouver un Accompagnateur"
          ctaLink="/walkers?service=promenade"
          imageAlt="Personne promenant un chien dans un parc"
          trustIndicators={[
            { icon: Search, text: "Profils à consulter" },
            { icon: Clock, text: "Créneau à confirmer" },
            { icon: MessageCircle, text: "Modalités à convenir" },
          ]}
        />

        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 max-w-2xl mx-auto"><Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Préparer une promenade</Badge><h2 className="text-3xl md:text-4xl font-bold mb-4">Des informations utiles avant de confirmer la mission</h2><p className="text-base md:text-lg text-muted-foreground">Une demande précise aide à organiser une promenade adaptée avec l’Accompagnateur choisi.</p></div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <InfoCard icon={Heart} title="Besoins de votre chien" text="Renseignez habitudes, contraintes et consignes utiles pour la promenade." />
              <InfoCard icon={MapPin} title="Ville ou zone" text="Indiquez une zone générale et confirmez les détails nécessaires avec l’Accompagnateur." />
              <InfoCard icon={Camera} title="Modalités de mission" text="Convenez ensemble du créneau, de la durée, des conditions et des informations à partager." />
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4"><div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-bold mb-4">Organiser une promenade en 3 étapes</h2><p className="text-lg text-muted-foreground max-w-2xl mx-auto">Un parcours simple pour structurer la demande avant la mission.</p></div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Step number="1" title="Recherchez" text="Consultez les profils, services et informations disponibles dans votre zone." />
              <Step number="2" title="Décrivez" text="Ajoutez les besoins de votre animal et votre préférence de créneau." />
              <Step number="3" title="Confirmez" text="Convenez du prix, de la durée et des conditions avec l’Accompagnateur avant la mission." />
            </div>
            <div className="text-center mt-12"><Button size="lg" onClick={() => navigate("/walkers?service=promenade")}>Voir les Accompagnateurs <ArrowRight className="ml-2 h-5 w-5" /></Button></div>
          </div>
        </section>

        <section className="py-16 bg-muted/30"><div className="container mx-auto px-4"><div className="grid lg:grid-cols-2 gap-10 items-center max-w-5xl mx-auto"><div><h2 className="text-3xl md:text-4xl font-bold mb-6">Préparer une demande adaptée</h2><p className="text-lg text-muted-foreground mb-7">Une promenade peut être organisée pour répondre à différents besoins. Décrivez votre situation et vérifiez que l’Accompagnateur peut répondre à vos attentes avant de confirmer.</p><div className="space-y-4"><ListItem title="Journée de travail" text="Précisez les créneaux souhaités et le rythme habituel de votre chien." /><ListItem title="Mobilité temporairement réduite" text="Décrivez les besoins et conditions d’accès à prendre en compte." /><ListItem title="Besoins spécifiques" text="Indiquez les consignes utiles pour l’animal et discutez des modalités." /></div></div><Card className="border"><CardContent className="p-7"><h3 className="text-2xl font-bold mb-4">À confirmer avant la mission</h3><ul className="space-y-3 text-muted-foreground"><li className="flex gap-2"><CheckCircle className="h-5 w-5 text-primary shrink-0" /> Durée et créneau</li><li className="flex gap-2"><CheckCircle className="h-5 w-5 text-primary shrink-0" /> Besoins et consignes de l’animal</li><li className="flex gap-2"><CheckCircle className="h-5 w-5 text-primary shrink-0" /> Prix et moyen de règlement</li><li className="flex gap-2"><CheckCircle className="h-5 w-5 text-primary shrink-0" /> Informations nécessaires au rendez-vous</li></ul></CardContent></Card></div></div></section>

        <SEOFAQ title="Questions fréquentes sur la promenade" subtitle="Les informations utiles avant de déposer une demande." faqs={promenadeFAQs} className="bg-background" />

        <section className="py-16 bg-primary text-primary-foreground"><div className="container mx-auto px-4 text-center"><h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à préparer une promenade pour votre chien ?</h2><p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">Consultez les profils et échangez sur les conditions adaptées aux besoins de votre compagnon.</p><div className="flex flex-wrap justify-center gap-4"><Button size="lg" variant="secondary" onClick={() => navigate("/walkers?service=promenade")}>Trouver un Accompagnateur <ArrowRight className="ml-2 h-5 w-5" /></Button><Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" onClick={() => navigate("/walker/register")}>Proposer mes services</Button></div></div></section>
      </main>
      <Footer />
    </div>
  );
};

const InfoCard = ({ icon: Icon, title, text }: { icon: typeof Heart; title: string; text: string }) => <Card className="border-2 hover:border-primary/50 transition-colors text-center"><CardContent className="p-6"><div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 mx-auto"><Icon className="h-6 w-6 text-primary" /></div><h3 className="text-xl font-bold mb-2">{title}</h3><p className="text-muted-foreground text-sm">{text}</p></CardContent></Card>;
const Step = ({ number, title, text }: { number: string; title: string; text: string }) => <div className="text-center"><div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">{number}</div><h3 className="text-xl font-bold mb-2">{title}</h3><p className="text-muted-foreground">{text}</p></div>;
const ListItem = ({ title, text }: { title: string; text: string }) => <div className="flex items-start gap-4"><CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" /><div><h3 className="font-semibold">{title}</h3><p className="text-muted-foreground">{text}</p></div></div>;

export default ServicePromenade;
