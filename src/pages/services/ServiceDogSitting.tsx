/**
 * DogWalking — Confiance canine de proximité : garde à domicile expliquée avec prudence,
 * sans avis, sélection, garanties, présence continue, paiement ou suivi simulés.
 */
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { SEOHead } from "@/components/ui/seo-head";
import { SEOFAQ } from "@/components/ui/seo-faq";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ServiceHero } from "@/components/ui/service-hero";
import { Heart, Clock, Home, CheckCircle, ArrowRight, Search, MessageCircle, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dogSittingHero from "@/assets/services/dog-sitting-hero.jpg";
import dogSittingConfort from "@/assets/services/dog-sitting-confort.jpg";
import dogSittingJeu from "@/assets/services/dog-sitting-jeu-jardin.jpg";

const dogSittingFAQs = [
  { question: "Comment organiser une garde à domicile ?", answer: "Décrivez les besoins de votre animal, le créneau souhaité et votre ville ou zone. Consultez les profils puis confirmez les conditions avec l’Accompagnateur avant la mission." },
  { question: "Puis-je demander une présence chez moi ?", answer: "Décrivez votre besoin dans la demande. La durée, le lieu, les accès et les conditions doivent être convenus explicitement avec l’Accompagnateur avant la mission." },
  { question: "Comment partager les habitudes de mon chien ?", answer: "Indiquez les consignes utiles, repas, sorties, contacts pertinents et contraintes dans la demande. Vérifiez que l’Accompagnateur accepte les conditions avant de confirmer." },
  { question: "Puis-je payer dans DogWalking ?", answer: "Le traitement de paiement en ligne n’est pas encore disponible. Le prix et le moyen de règlement doivent être confirmés entre les personnes concernées avant la mission." },
];

const ServiceDogSitting = () => {
  const navigate = useNavigate();
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Garde à domicile",
    "description": "Organisation de demandes de garde à domicile pour animaux avec des Accompagnateurs dont les informations sont renseignées dans DogWalking.",
    "provider": { "@type": "Organization", "name": "DogWalking", "url": "https://dogwalking.fr" },
    "areaServed": { "@type": "Country", "name": "France" },
  };

  return (
    <div className="min-h-dvh bg-background">
      <SEOHead title="Garde à domicile | DogWalking" description="Organisez une demande de garde à domicile et consultez les profils disponibles dans votre zone." keywords="garde domicile chien, accompagnateur, garde animal" canonicalUrl="https://dogwalking.fr/services/garde-domicile" structuredData={serviceJsonLd} ogImage={dogSittingHero} />
      <Header />
      <main>
        <ServiceHero backgroundImage={dogSittingHero} badgeIcon={Home} badgeText="Organiser une garde à domicile" title={<>Garde à domicile pour votre <span className="text-gradient">animal</span></>} description="Décrivez les besoins de votre animal, consultez les profils et convenez des modalités d’une garde avec l’Accompagnateur choisi." ctaText="Voir les Accompagnateurs" ctaLink="/walkers?service=garde" imageAlt="Personne assise avec des chiens dans un intérieur" trustIndicators={[{ icon: Home, text: "Lieu à confirmer" }, { icon: Clock, text: "Créneau à définir" }, { icon: MessageCircle, text: "Modalités à convenir" }]} />

        <section className="py-16 bg-muted/30"><div className="container mx-auto px-4"><div className="text-center mb-12 max-w-3xl mx-auto"><Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Préparer une garde</Badge><h2 className="text-3xl md:text-4xl font-bold mb-4">Une demande claire pour organiser les conditions adaptées</h2><p className="text-lg text-muted-foreground">Les informations utiles doivent être confirmées avec l’Accompagnateur avant toute mission à domicile.</p></div><div className="grid lg:grid-cols-2 gap-8 items-center max-w-5xl mx-auto"><img src={dogSittingConfort} alt="Chien dans un environnement familier" className="rounded-2xl shadow-lg w-full object-cover aspect-video" /><div className="space-y-5"><Feature icon={Heart} title="Habitudes de l’animal" text="Précisez repas, sorties, environnement, besoins et contraintes utiles." /><Feature icon={MapPin} title="Lieu et accès" text="Confirmez les informations nécessaires avec prudence, sans partager de donnée sensible avant l’échange approprié." /><Feature icon={MessageCircle} title="Conditions de mission" text="Convenez du créneau, de la durée, des services et du moyen de règlement avant la mission." /></div></div></div></section>

        <section className="py-16"><div className="container mx-auto px-4"><div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-bold mb-4">Organiser la garde en 3 étapes</h2><p className="text-lg text-muted-foreground max-w-2xl mx-auto">Un parcours simple pour préparer la demande avant le rendez-vous.</p></div><div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"><Step n="1" title="Recherchez" text="Consultez les profils et les informations disponibles dans votre zone." /><Step n="2" title="Précisez" text="Décrivez les besoins de votre animal, le créneau et les conditions particulières." /><Step n="3" title="Confirmez" text="Convenez du prix, de la durée, du lieu et des modalités avec l’Accompagnateur." /></div><div className="text-center mt-12"><Button size="lg" onClick={() => navigate("/walkers?service=garde")}>Trouver un Accompagnateur <ArrowRight className="ml-2 h-5 w-5" /></Button></div></div></section>

        <section className="py-16 bg-muted/30"><div className="container mx-auto px-4"><div className="grid lg:grid-cols-2 gap-10 items-center max-w-5xl mx-auto"><div className="grid sm:grid-cols-2 gap-4"><NeedCard emoji="🐕" title="Rythme habituel" text="Repas, sorties et temps de repos à renseigner." /><NeedCard emoji="🐶" title="Animal jeune" text="Consignes et besoins à détailler avant la mission." /><NeedCard emoji="🏠" title="Environnement familier" text="Informations d’accès et règles à confirmer directement." /><NeedCard emoji="🩺" title="Besoins spécifiques" text="Signalez les contraintes ; pour une urgence vétérinaire, contactez les services compétents." /></div><img src={dogSittingJeu} alt="Chien jouant dans un jardin" className="rounded-2xl shadow-lg w-full object-cover aspect-video" /></div></div></section>

        <section className="py-16"><div className="container mx-auto px-4 max-w-4xl"><Card className="border"><CardContent className="p-7 md:p-10"><h2 className="text-2xl font-bold mb-5">À confirmer avant la mission</h2><div className="grid md:grid-cols-2 gap-4"><CheckLine text="Besoins et consignes de l’animal" /><CheckLine text="Créneau et durée" /><CheckLine text="Prix et moyen de règlement" /><CheckLine text="Informations nécessaires au rendez-vous" /></div></CardContent></Card></div></section>

        <SEOFAQ title="Questions fréquentes sur la garde à domicile" subtitle="Les informations utiles avant de déposer une demande." faqs={dogSittingFAQs} className="bg-muted/30" />

        <section className="py-16 bg-primary text-primary-foreground"><div className="container mx-auto px-4 text-center"><h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à organiser une garde à domicile ?</h2><p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">Consultez les profils et confirmez les conditions qui conviennent à votre animal.</p><div className="flex flex-wrap justify-center gap-4"><Button size="lg" variant="secondary" onClick={() => navigate("/walkers?service=garde")}>Trouver un Accompagnateur <ArrowRight className="ml-2 h-5 w-5" /></Button><Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" onClick={() => navigate("/walker/register")}>Proposer mes services</Button></div></div></section>
      </main>
      <Footer />
    </div>
  );
};

const Feature = ({ icon: Icon, title, text }: { icon: typeof Heart; title: string; text: string }) => <div className="flex items-start gap-4"><div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0"><Icon className="h-6 w-6 text-primary" /></div><div><h3 className="text-xl font-bold mb-1">{title}</h3><p className="text-muted-foreground">{text}</p></div></div>;
const Step = ({ n, title, text }: { n: string; title: string; text: string }) => <div className="text-center"><div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">{n}</div><h3 className="text-xl font-bold mb-2">{title}</h3><p className="text-muted-foreground">{text}</p></div>;
const NeedCard = ({ emoji, title, text }: { emoji: string; title: string; text: string }) => <Card className="h-full"><CardContent className="p-6 text-center"><div className="text-4xl mb-4">{emoji}</div><h3 className="font-bold mb-2">{title}</h3><p className="text-sm text-muted-foreground">{text}</p></CardContent></Card>;
const CheckLine = ({ text }: { text: string }) => <div className="flex items-center gap-2 text-muted-foreground"><CheckCircle className="h-5 w-5 text-primary shrink-0" /> {text}</div>;

export default ServiceDogSitting;
