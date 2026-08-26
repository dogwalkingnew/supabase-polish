/**
 * DogWalking — Confiance canine de proximité : marche régulière décrite de façon factuelle,
 * sans promesse de résultat, forfait, même accompagnateur, paiement ou suivi simulé.
 */
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { SEOHead } from "@/components/ui/seo-head";
import { SEOFAQ } from "@/components/ui/seo-faq";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ServiceHero } from "@/components/ui/service-hero";
import { Calendar, Clock, Heart, Repeat, CheckCircle, ArrowRight, Search, MessageCircle, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import marcheHero from "@/assets/services/marche-reguliere-hero.jpg";
import marcheQuotidienne from "@/assets/services/marche-reguliere-quotidienne.jpg";
import marcheEquilibre from "@/assets/services/marche-reguliere-chien-equilibre.jpg";
import marchePlanning from "@/assets/services/marche-reguliere-planning.jpg";

const marcheFAQs = [
  { question: "À quoi correspond une marche régulière ?", answer: "Il s’agit d’une demande dont les créneaux peuvent être répétés. La fréquence, la durée et la personne qui intervient doivent être confirmées avant chaque organisation ou modification." },
  { question: "Puis-je définir des jours et créneaux ?", answer: "Oui. Indiquez vos préférences dans la demande, puis convenez du planning final avec l’Accompagnateur selon les disponibilités réellement renseignées." },
  { question: "Puis-je adapter le planning ?", answer: "Discutez des modifications avec l’Accompagnateur avant le créneau concerné. L’application n’impose pas de forfait ou de conditions d’annulation automatiques." },
  { question: "Puis-je payer dans DogWalking ?", answer: "Le traitement de paiement en ligne n’est pas encore disponible. Le prix et le moyen de règlement doivent être confirmés entre les personnes concernées avant la mission." },
];

const ServiceMarcheReguliere = () => {
  const navigate = useNavigate();
  const serviceJsonLd = { "@context": "https://schema.org", "@type": "Service", "name": "Marche régulière", "description": "Organisation de demandes de marche régulière pour chiens avec des Accompagnateurs dont les informations sont renseignées dans DogWalking.", "provider": { "@type": "Organization", "name": "DogWalking", "url": "https://dogwalking.fr" }, "areaServed": { "@type": "Country", "name": "France" } };

  return (
    <div className="min-h-dvh bg-background">
      <SEOHead title="Marche régulière | DogWalking" description="Organisez des demandes de marche régulière et consultez les profils disponibles dans votre zone." keywords="marche régulière chien, promenade, accompagnateur" canonicalUrl="https://dogwalking.fr/services/marche-reguliere" structuredData={serviceJsonLd} ogImage={marcheHero} />
      <Header />
      <main>
        <ServiceHero backgroundImage={marcheHero} badgeIcon={Repeat} badgeText="Organiser une marche régulière" title={<>Marche régulière pour votre <span className="text-gradient">chien</span></>} description="Indiquez la fréquence souhaitée, les besoins de votre chien et votre zone, puis confirmez le planning avec l’Accompagnateur choisi." ctaText="Voir les Accompagnateurs" ctaLink="/walkers?service=promenade" imageAlt="Personne promenant un chien sur un chemin" trustIndicators={[{ icon: Calendar, text: "Planning à confirmer" }, { icon: Clock, text: "Fréquence à définir" }, { icon: MessageCircle, text: "Modalités à convenir" }]} />

        <section className="py-16 bg-muted/30"><div className="container mx-auto px-4"><div className="text-center mb-12 max-w-3xl mx-auto"><Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Planifier avec souplesse</Badge><h2 className="text-3xl md:text-4xl font-bold mb-4">Une organisation à définir selon votre rythme</h2><p className="text-lg text-muted-foreground">La fréquence et le planning doivent être construits avec l’Accompagnateur en fonction des informations réellement disponibles.</p></div><div className="grid lg:grid-cols-2 gap-8 items-center max-w-5xl mx-auto"><img src={marcheQuotidienne} alt="Chien en promenade dans un quartier" className="rounded-2xl shadow-lg w-full object-cover aspect-video" /><div className="space-y-5"><Feature icon={Calendar} title="Fréquence souhaitée" text="Indiquez les jours ou créneaux préférés pour faciliter l’échange." /><Feature icon={Heart} title="Besoins du chien" text="Renseignez rythme, habitudes et contraintes utiles avant la mission." /><Feature icon={MessageCircle} title="Planning à confirmer" text="Convenez du planning final avec l’Accompagnateur avant chaque série de promenades." /></div></div></div></section>

        <section className="py-16"><div className="container mx-auto px-4"><div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-bold mb-4">Mettre en place une marche régulière en 3 étapes</h2><p className="text-lg text-muted-foreground max-w-2xl mx-auto">Un parcours simple pour préparer les conditions avant de commencer.</p></div><div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"><Step n="1" title="Recherchez" text="Consultez les profils, services et informations disponibles dans votre zone." /><Step n="2" title="Proposez" text="Décrivez la fréquence souhaitée et les besoins de votre chien." /><Step n="3" title="Confirmez" text="Convenez du planning, du prix et des modalités avec l’Accompagnateur." /></div><div className="text-center mt-12"><Button size="lg" onClick={() => navigate("/walkers?service=promenade")}>Trouver un Accompagnateur <ArrowRight className="ml-2 h-5 w-5" /></Button></div></div></section>

        <section className="py-16 bg-muted/30"><div className="container mx-auto px-4"><div className="grid lg:grid-cols-2 gap-10 items-center max-w-5xl mx-auto"><div className="grid sm:grid-cols-2 gap-4"><NeedCard emoji="📅" title="Planning hebdomadaire" text="Jours et créneaux à convenir avec l’Accompagnateur." /><NeedCard emoji="🐕" title="Rythme de l’animal" text="Habitudes et besoins à renseigner dans la demande." /><NeedCard emoji="📍" title="Zone d’intervention" text="Ville ou zone à préciser avant l’échange." /><NeedCard emoji="📝" title="Adaptations" text="Toute modification doit être confirmée avant le créneau concerné." /></div><img src={marchePlanning} alt="Planning de promenade et chien dans un parc" className="rounded-2xl shadow-lg w-full object-cover aspect-video" /></div></div></section>

        <section className="py-16"><div className="container mx-auto px-4 max-w-5xl"><div className="grid lg:grid-cols-2 gap-8 items-center"><img src={marcheEquilibre} alt="Chien marchant calmement en extérieur" className="rounded-2xl shadow-lg w-full object-cover aspect-video" /><Card className="border"><CardContent className="p-7"><h2 className="text-2xl font-bold mb-5">À confirmer avant chaque organisation</h2><div className="space-y-3"><CheckLine text="Fréquence, durée et créneaux" /><CheckLine text="Besoins et consignes de l’animal" /><CheckLine text="Prix et moyen de règlement" /><CheckLine text="Informations nécessaires au rendez-vous" /></div></CardContent></Card></div></div></section>

        <SEOFAQ title="Questions fréquentes sur la marche régulière" subtitle="Les informations utiles avant de déposer une demande." faqs={marcheFAQs} className="bg-muted/30" />

        <section className="py-16 bg-primary text-primary-foreground"><div className="container mx-auto px-4 text-center"><h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à organiser une marche régulière ?</h2><p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">Consultez les profils et échangez sur un planning adapté aux besoins de votre chien.</p><div className="flex flex-wrap justify-center gap-4"><Button size="lg" variant="secondary" onClick={() => navigate("/walkers?service=promenade")}>Trouver un Accompagnateur <ArrowRight className="ml-2 h-5 w-5" /></Button><Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" onClick={() => navigate("/walker/register")}>Proposer mes services</Button></div></div></section>
      </main>
      <Footer />
    </div>
  );
};

const Feature = ({ icon: Icon, title, text }: { icon: typeof Calendar; title: string; text: string }) => <div className="flex items-start gap-4"><div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0"><Icon className="h-6 w-6 text-primary" /></div><div><h3 className="text-xl font-bold mb-1">{title}</h3><p className="text-muted-foreground">{text}</p></div></div>;
const Step = ({ n, title, text }: { n: string; title: string; text: string }) => <div className="text-center"><div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">{n}</div><h3 className="text-xl font-bold mb-2">{title}</h3><p className="text-muted-foreground">{text}</p></div>;
const NeedCard = ({ emoji, title, text }: { emoji: string; title: string; text: string }) => <Card className="h-full"><CardContent className="p-6 text-center"><div className="text-4xl mb-4">{emoji}</div><h3 className="font-bold mb-2">{title}</h3><p className="text-sm text-muted-foreground">{text}</p></CardContent></Card>;
const CheckLine = ({ text }: { text: string }) => <div className="flex items-center gap-2 text-muted-foreground"><CheckCircle className="h-5 w-5 text-primary shrink-0" /> {text}</div>;

export default ServiceMarcheReguliere;
