/**
 * DogWalking — page Visite factuelle : les actions présentées sont à définir entre
 * les participants ; aucun soin, suivi ou résultat n’est garanti par la plateforme.
 */
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { SEOHead } from "@/components/ui/seo-head";
import { SEOFAQ } from "@/components/ui/seo-faq";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ServiceHero } from "@/components/ui/service-hero";
import { ArrowRight, CalendarDays, ClipboardList, Home, MapPin, MessageCircle, Search, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import serviceVisiteImg from "@/assets/service-visite.jpg";

const visiteFAQs = [
  { question: "Comment demander une visite à domicile ?", answer: "Décrivez le besoin, la ville ou zone, le créneau souhaité et les consignes pertinentes. Consultez les profils puis convenez des modalités avec l’Accompagnateur choisi." },
  { question: "Quelles actions peuvent être prévues pendant une visite ?", answer: "Les actions dépendent du profil, de l’animal et de l’accord entre les participants. Elles doivent être décrites et confirmées avant la mission." },
  { question: "Puis-je demander une aide médicale ?", answer: "DogWalking ne fournit pas de soin vétérinaire. Pour toute situation de santé, demandez conseil à un professionnel compétent et ne confirmez une mission que si les compétences et conditions sont clairement établies." },
  { question: "Comment sont définis le prix et le règlement ?", answer: "Le paiement en ligne n’est pas disponible. Le prix et le moyen de règlement sont à convenir directement entre les personnes concernées avant la mission." },
];

const serviceJsonLd = { "@context": "https://schema.org", "@type": "Service", name: "Demande de visite à domicile", description: "Mise en relation pour organiser une demande de visite avec des Accompagnateurs dont les informations de service sont renseignées dans DogWalking.", provider: { "@type": "Organization", name: "DogWalking" } };

const ServiceVisite = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-dvh bg-background">
      <SEOHead title="Visite à domicile | DogWalking" description="Préparez une demande de visite et consultez les profils qui renseignent leurs services dans votre zone." keywords="visite domicile animal, visite chien, demande de visite, accompagnateur" canonicalUrl="https://dogwalking.fr/services/visite" structuredData={serviceJsonLd} ogImage={serviceVisiteImg} />
      <Header />
      <main>
        <ServiceHero backgroundImage={serviceVisiteImg} badgeIcon={Home} badgeText="Organiser une visite" title={<>Visite à domicile, <span className="text-gradient">à définir avec l’Accompagnateur</span></>} description="Présentez votre besoin, consultez les profils et échangez sur le contenu et les conditions de la visite avant toute mission." ctaText="Consulter les profils" ctaLink="/walkers?service=visite" secondaryCtaText="Déposer une annonce de visite" secondaryCtaLink="/annonces-libres" imageAlt="Personne avec un chien à domicile" trustIndicators={[{ icon: Search, text: "Profils à consulter" }, { icon: CalendarDays, text: "Créneau à confirmer" }, { icon: MessageCircle, text: "Actions à convenir" }]} />

        <section className="py-16 md:py-20 bg-muted/30"><div className="container mx-auto px-4"><div className="max-w-2xl mx-auto text-center mb-12"><Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Préparer une visite</Badge><h2 className="text-3xl md:text-4xl font-bold mb-4">Ce qu’il est utile de préciser</h2><p className="text-base md:text-lg text-muted-foreground">Une demande détaillée aide les participants à échanger sur une visite adaptée.</p></div><div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"><InfoCard icon={ClipboardList} title="Consignes" text="Indiquez les informations utiles pour votre animal et votre domicile." /><InfoCard icon={CalendarDays} title="Créneau" text="Proposez une date, une heure et une durée à confirmer." /><InfoCard icon={MapPin} title="Accès" text="Échangez les modalités pratiques uniquement avec le profil choisi." /></div></div></section>

        <section className="relative overflow-hidden py-16"><div aria-hidden="true" className="dogwalking-route absolute -left-12 top-7 rotate-[8deg]" /><div className="container mx-auto px-4"><div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-bold mb-4">Un parcours simple en trois étapes</h2><p className="text-lg text-muted-foreground max-w-2xl mx-auto">DogWalking met en relation ; les détails de la mission sont à convenir entre les participants.</p></div><div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"><Step number="1" title="Recherchez" text="Consultez les profils et services renseignés dans votre zone." /><Step number="2" title="Décrivez" text="Ajoutez votre besoin, vos consignes et votre préférence de créneau." /><Step number="3" title="Confirmez" text="Convenez du contenu, du prix, du règlement et des conditions avant la visite." /></div><div className="text-center mt-12"><Button size="lg" onClick={() => navigate("/walkers?service=visite")}>Voir les Accompagnateurs <ArrowRight className="ml-2 h-5 w-5" /></Button></div></div></section>

        <section className="py-16 bg-muted/30"><div className="container mx-auto px-4"><div className="grid lg:grid-cols-2 gap-10 items-center max-w-5xl mx-auto"><div><h2 className="text-3xl md:text-4xl font-bold mb-6">Des modalités claires avant la visite</h2><p className="text-lg text-muted-foreground mb-7">Vérifiez que le profil choisi accepte la demande et qu’il dispose des informations nécessaires. DogWalking ne valide pas la faisabilité ni les compétences particulières d’une personne.</p></div><Card className="border"><CardContent className="p-7"><h3 className="text-2xl font-bold mb-4">Points à confirmer</h3><ul className="space-y-3 text-muted-foreground"><ListItem text="Contenu de la visite et consignes" /><ListItem text="Créneau, durée et conditions d’accès" /><ListItem text="Prix et règlement hors plateforme" /><ListItem text="Contact à joindre en cas de question" /></ul></CardContent></Card></div></div></section>

        <SEOFAQ title="Questions fréquentes sur les visites" subtitle="Les informations utiles avant de déposer une demande." faqs={visiteFAQs} className="bg-background" />
        <section className="py-16 bg-primary text-primary-foreground"><div className="container mx-auto px-4 text-center"><h2 className="text-3xl md:text-4xl font-bold mb-4">Préparer une visite pour votre animal</h2><p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">Consultez les profils et échangez sur les conditions adaptées à votre situation.</p><div className="flex flex-wrap justify-center gap-4"><Button size="lg" variant="secondary" onClick={() => navigate("/walkers?service=visite")}>Trouver un Accompagnateur <ArrowRight className="ml-2 h-5 w-5" /></Button><Button size="lg" variant="outline" className="border-primary-foreground bg-primary-foreground text-primary hover:bg-primary-foreground/90 hover:text-primary" onClick={() => navigate("/walker/register")}>Proposer mes services</Button></div></div></section>
      </main>
      <Footer />
    </div>
  );
};

const InfoCard = ({ icon: Icon, title, text }: { icon: typeof Home; title: string; text: string }) => <Card className="border-2 hover:border-primary/50 transition-colors text-center"><CardContent className="p-6"><span className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 mx-auto"><Icon className="h-6 w-6 text-primary" /></span><h3 className="text-xl font-bold mb-2">{title}</h3><p className="text-muted-foreground text-sm">{text}</p></CardContent></Card>;
const Step = ({ number, title, text }: { number: string; title: string; text: string }) => <div className="text-center"><span className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">{number}</span><h3 className="text-xl font-bold mb-2">{title}</h3><p className="text-muted-foreground">{text}</p></div>;
const ListItem = ({ text }: { text: string }) => <li className="flex gap-2"><ShieldCheck className="h-5 w-5 text-primary shrink-0" />{text}</li>;

export default ServiceVisite;
