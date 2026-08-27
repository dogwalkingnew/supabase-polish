/**
 * DogWalking — page Garde factuelle : informer et préparer la demande sans avis,
 * disponibilité, garantie, paiement, statistique ou prestation non confirmés.
 */
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { SEOHead } from "@/components/ui/seo-head";
import { SEOFAQ } from "@/components/ui/seo-faq";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ServiceHero } from "@/components/ui/service-hero";
import { ArrowRight, CalendarDays, Home, MapPin, MessageCircle, PawPrint, Search, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import serviceGardeImg from "@/assets/service-garde.jpg";

const gardeFAQs = [
  { question: "Comment préparer une demande de garde ?", answer: "Indiquez les dates souhaitées, les besoins de l’animal et votre ville ou zone. Consultez ensuite les profils qui renseignent ce type de service et échangez avant de confirmer." },
  { question: "La garde se déroule-t-elle au domicile ou chez l’Accompagnateur ?", answer: "Le lieu dépend du service renseigné par l’Accompagnateur et de ce que vous convenez ensemble. Vérifiez le lieu, les conditions d’accueil et les accès avant toute mission." },
  { question: "Les prix et le règlement sont-ils intégrés à DogWalking ?", answer: "Le paiement en ligne n’est pas disponible. Le prix et le moyen de règlement doivent être convenus directement entre les personnes concernées avant la mission." },
  { question: "Quelles informations faut-il confirmer avant la garde ?", answer: "Confirmez notamment les dates, les horaires, le lieu, les habitudes de l’animal, les consignes utiles et les coordonnées nécessaires." },
];

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Demande de garde d’animal",
  description: "Mise en relation pour organiser une demande de garde avec des Accompagnateurs dont les informations de service sont renseignées dans DogWalking.",
  provider: { "@type": "Organization", name: "DogWalking" },
};

const ServiceGarde = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-dvh bg-background">
      <SEOHead title="Garde d’animal | DogWalking" description="Préparez une demande de garde et consultez les profils qui renseignent leurs services dans votre zone." keywords="garde animal, garde chien, demande de garde, accompagnateur" canonicalUrl="https://dogwalking.fr/services/garde" structuredData={serviceJsonLd} ogImage={serviceGardeImg} />
      <Header />
      <main>
        <ServiceHero backgroundImage={serviceGardeImg} badgeIcon={Home} badgeText="Organiser une garde" title={<>Garde d’animal, <span className="text-gradient">à organiser ensemble</span></>} description="Décrivez les besoins de votre animal, consultez les profils et convenez des modalités avec l’Accompagnateur avant la mission." ctaText="Consulter les profils" ctaLink="/walkers?service=garde" secondaryCtaText="Déposer une annonce de garde" secondaryCtaLink="/annonces-libres" imageAlt="Personne avec un chien dans un intérieur" trustIndicators={[{ icon: Search, text: "Profils à consulter" }, { icon: CalendarDays, text: "Dates à confirmer" }, { icon: MessageCircle, text: "Modalités à convenir" }]} />

        <section className="py-16 md:py-20 bg-muted/30"><div className="container mx-auto px-4"><div className="max-w-2xl mx-auto text-center mb-12"><Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Préparer une demande</Badge><h2 className="text-3xl md:text-4xl font-bold mb-4">Les informations à préciser pour une garde</h2><p className="text-base md:text-lg text-muted-foreground">Les conditions dépendent du profil choisi et de l’accord entre les participants.</p></div><div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"><InfoCard icon={CalendarDays} title="Dates et horaires" text="Précisez la période souhaitée ainsi que les horaires à discuter." /><InfoCard icon={PawPrint} title="Besoins de l’animal" text="Partagez les habitudes, consignes et contraintes utiles." /><InfoCard icon={MapPin} title="Lieu et accès" text="Déterminez le lieu de garde et les informations pratiques nécessaires." /></div></div></section>

        <section className="relative overflow-hidden py-16"><div aria-hidden="true" className="dogwalking-route absolute -right-10 top-3 rotate-[-7deg]" /><div className="container mx-auto px-4"><div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-bold mb-4">Organiser une garde en trois étapes</h2><p className="text-lg text-muted-foreground max-w-2xl mx-auto">Un parcours de mise en relation, sans disponibilité ni paiement garantis par la plateforme.</p></div><div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"><Step number="1" title="Consultez" text="Recherchez les profils et informations de service disponibles." /><Step number="2" title="Décrivez" text="Présentez votre besoin, vos dates et les consignes de l’animal." /><Step number="3" title="Confirmez" text="Convenez du lieu, du prix, du règlement et des conditions avant la mission." /></div><div className="text-center mt-12"><Button size="lg" onClick={() => navigate("/walkers?service=garde")}>Voir les Accompagnateurs <ArrowRight className="ml-2 h-5 w-5" /></Button></div></div></section>

        <section className="py-16 bg-muted/30"><div className="container mx-auto px-4"><div className="grid lg:grid-cols-2 gap-10 items-center max-w-5xl mx-auto"><div><h2 className="text-3xl md:text-4xl font-bold mb-6">Avant de confirmer la mission</h2><p className="text-lg text-muted-foreground mb-7">Prenez le temps d’échanger avec l’Accompagnateur choisi. La plateforme ne garantit ni l’acceptation, ni la disponibilité, ni les conditions particulières d’une garde.</p></div><Card className="border"><CardContent className="p-7"><h3 className="text-2xl font-bold mb-4">Points à convenir</h3><ul className="space-y-3 text-muted-foreground"><ListItem text="Période, horaires et lieu de garde" /><ListItem text="Besoins, habitudes et consignes de l’animal" /><ListItem text="Prix et moyen de règlement hors plateforme" /><ListItem text="Coordonnées et modalités pratiques" /></ul></CardContent></Card></div></div></section>

        <SEOFAQ title="Questions fréquentes sur la garde" subtitle="Les éléments à vérifier avant de déposer une demande." faqs={gardeFAQs} className="bg-background" />
        <section className="py-16 bg-primary text-primary-foreground"><div className="container mx-auto px-4 text-center"><h2 className="text-3xl md:text-4xl font-bold mb-4">Préparer une demande de garde</h2><p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">Consultez les profils et échangez sur les conditions adaptées à votre situation.</p><div className="flex flex-wrap justify-center gap-4"><Button size="lg" variant="secondary" onClick={() => navigate("/walkers?service=garde")}>Trouver un Accompagnateur <ArrowRight className="ml-2 h-5 w-5" /></Button><Button size="lg" variant="outline" className="border-primary-foreground bg-primary-foreground text-primary hover:bg-primary-foreground/90 hover:text-primary" onClick={() => navigate("/walker/register")}>Proposer mes services</Button></div></div></section>
      </main>
      <Footer />
    </div>
  );
};

const InfoCard = ({ icon: Icon, title, text }: { icon: typeof Home; title: string; text: string }) => <Card className="border-2 hover:border-primary/50 transition-colors text-center"><CardContent className="p-6"><span className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 mx-auto"><Icon className="h-6 w-6 text-primary" /></span><h3 className="text-xl font-bold mb-2">{title}</h3><p className="text-muted-foreground text-sm">{text}</p></CardContent></Card>;
const Step = ({ number, title, text }: { number: string; title: string; text: string }) => <div className="text-center"><span className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">{number}</span><h3 className="text-xl font-bold mb-2">{title}</h3><p className="text-muted-foreground">{text}</p></div>;
const ListItem = ({ text }: { text: string }) => <li className="flex gap-2"><ShieldCheck className="h-5 w-5 text-primary shrink-0" />{text}</li>;

export default ServiceGarde;
