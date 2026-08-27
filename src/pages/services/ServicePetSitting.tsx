/**
 * DogWalking — page multi-animaux factuelle : la compatibilité, les espèces et les
 * prestations sont renseignées par les personnes et confirmées avant la mission.
 */
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { SEOHead } from "@/components/ui/seo-head";
import { SEOFAQ } from "@/components/ui/seo-faq";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ServiceHero } from "@/components/ui/service-hero";
import { ArrowRight, CalendarDays, ClipboardList, MapPin, MessageCircle, PawPrint, Search, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import petSittingHero from "@/assets/services/pet-sitting-hero.jpg";

const petSittingFAQs = [
  { question: "Comment demander une aide pour plusieurs animaux ?", answer: "Indiquez dans la demande chaque animal concerné, son espèce, les consignes utiles et le créneau souhaité. Vérifiez ensuite avec l’Accompagnateur qu’il accepte bien votre besoin." },
  { question: "Toutes les espèces sont-elles disponibles ?", answer: "Non. Les services et les animaux acceptés dépendent des informations renseignées par chaque Accompagnateur. N’interprétez pas cette page comme la garantie d’une prise en charge." },
  { question: "Puis-je prévoir des soins particuliers ?", answer: "DogWalking ne propose pas de soins vétérinaires. Toute demande particulière doit être discutée et acceptée explicitement avant la mission ; demandez conseil à un professionnel compétent lorsque nécessaire." },
  { question: "Comment sont fixés le prix et le règlement ?", answer: "Le paiement en ligne n’est pas disponible. Le prix et le moyen de règlement sont à convenir directement entre les personnes concernées avant la mission." },
];

const serviceJsonLd = { "@context": "https://schema.org", "@type": "Service", name: "Demande pour plusieurs animaux", description: "Mise en relation pour préparer une demande impliquant plusieurs animaux avec des Accompagnateurs qui renseignent leurs services dans DogWalking.", provider: { "@type": "Organization", name: "DogWalking" } };

const ServicePetSitting = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-dvh bg-background">
      <SEOHead title="Demande multi-animaux | DogWalking" description="Préparez une demande pour plusieurs animaux et consultez les profils qui renseignent leurs services dans votre zone." keywords="garde multi-animaux, demande animaux, accompagnateur, garde chat" canonicalUrl="https://dogwalking.fr/services/garde-multi-animaux" structuredData={serviceJsonLd} ogImage={petSittingHero} />
      <Header />
      <main>
        <ServiceHero backgroundImage={petSittingHero} badgeIcon={PawPrint} badgeText="Préparer une demande multi-animaux" title={<>Plusieurs animaux, <span className="text-gradient">une demande à détailler</span></>} description="Présentez les besoins de chaque animal, consultez les profils et échangez avec l’Accompagnateur avant de confirmer une mission." ctaText="Consulter les profils" ctaLink="/walkers?service=pet_sitting" secondaryCtaText="Déposer une annonce multi-animaux" secondaryCtaLink="/annonces-libres" imageAlt="Personne avec plusieurs animaux de compagnie" trustIndicators={[{ icon: Search, text: "Profils à consulter" }, { icon: CalendarDays, text: "Créneau à confirmer" }, { icon: MessageCircle, text: "Compatibilité à vérifier" }]} />

        <section className="py-16 md:py-20 bg-muted/30"><div className="container mx-auto px-4"><div className="max-w-2xl mx-auto text-center mb-12"><Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Décrire votre besoin</Badge><h2 className="text-3xl md:text-4xl font-bold mb-4">Les informations utiles pour chaque animal</h2><p className="text-base md:text-lg text-muted-foreground">La compatibilité et les modalités dépendent du profil choisi et de l’accord entre les participants.</p></div><div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"><InfoCard icon={PawPrint} title="Animaux concernés" text="Indiquez l’espèce, le nombre et les éléments utiles pour chacun." /><InfoCard icon={ClipboardList} title="Consignes" text="Décrivez les habitudes et contraintes à discuter avec l’Accompagnateur." /><InfoCard icon={MapPin} title="Lieu et créneau" text="Proposez une zone et des dates, qui restent à confirmer." /></div></div></section>

        <section className="relative overflow-hidden py-16"><div aria-hidden="true" className="dogwalking-route absolute -right-14 top-2 rotate-[-10deg]" /><div className="container mx-auto px-4"><div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-bold mb-4">Organiser la demande en trois étapes</h2><p className="text-lg text-muted-foreground max-w-2xl mx-auto">La plateforme facilite la mise en relation, sans garantir la prise en charge d’une espèce ou d’une prestation.</p></div><div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"><Step number="1" title="Consultez" text="Recherchez les profils et informations de service disponibles." /><Step number="2" title="Décrivez" text="Ajoutez les animaux concernés, les consignes et le créneau souhaité." /><Step number="3" title="Confirmez" text="Vérifiez la compatibilité, le contenu, le prix et les conditions avant la mission." /></div><div className="text-center mt-12"><Button size="lg" onClick={() => navigate("/walkers?service=pet_sitting")}>Voir les Accompagnateurs <ArrowRight className="ml-2 h-5 w-5" /></Button></div></div></section>

        <section className="py-16 bg-muted/30"><div className="container mx-auto px-4"><div className="grid lg:grid-cols-2 gap-10 items-center max-w-5xl mx-auto"><div><h2 className="text-3xl md:text-4xl font-bold mb-6">Avant toute mission</h2><p className="text-lg text-muted-foreground mb-7">Il est important de confirmer la capacité de l’Accompagnateur à répondre au besoin décrit. Aucun service, équipement, disponibilité ou compétence ne doit être présumé.</p></div><Card className="border"><CardContent className="p-7"><h3 className="text-2xl font-bold mb-4">Points à convenir</h3><ul className="space-y-3 text-muted-foreground"><ListItem text="Animaux concernés et consignes utiles" /><ListItem text="Compatibilité et limites du service proposé" /><ListItem text="Créneau, lieu et informations pratiques" /><ListItem text="Prix et règlement hors plateforme" /></ul></CardContent></Card></div></div></section>

        <SEOFAQ title="Questions fréquentes sur les demandes multi-animaux" subtitle="Les informations utiles avant de contacter un Accompagnateur." faqs={petSittingFAQs} className="bg-background" />
        <section className="py-16 bg-primary text-primary-foreground"><div className="container mx-auto px-4 text-center"><h2 className="text-3xl md:text-4xl font-bold mb-4">Préparer une demande détaillée</h2><p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">Consultez les profils et convenez des conditions adaptées à vos animaux.</p><div className="flex flex-wrap justify-center gap-4"><Button size="lg" variant="secondary" onClick={() => navigate("/walkers?service=pet_sitting")}>Trouver un Accompagnateur <ArrowRight className="ml-2 h-5 w-5" /></Button><Button size="lg" variant="outline" className="border-primary-foreground bg-primary-foreground text-primary hover:bg-primary-foreground/90 hover:text-primary" onClick={() => navigate("/walker/register")}>Proposer mes services</Button></div></div></section>
      </main>
      <Footer />
    </div>
  );
};

const InfoCard = ({ icon: Icon, title, text }: { icon: typeof PawPrint; title: string; text: string }) => <Card className="border-2 hover:border-primary/50 transition-colors text-center"><CardContent className="p-6"><span className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 mx-auto"><Icon className="h-6 w-6 text-primary" /></span><h3 className="text-xl font-bold mb-2">{title}</h3><p className="text-muted-foreground text-sm">{text}</p></CardContent></Card>;
const Step = ({ number, title, text }: { number: string; title: string; text: string }) => <div className="text-center"><span className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">{number}</span><h3 className="text-xl font-bold mb-2">{title}</h3><p className="text-muted-foreground">{text}</p></div>;
const ListItem = ({ text }: { text: string }) => <li className="flex gap-2"><ShieldCheck className="h-5 w-5 text-primary shrink-0" />{text}</li>;

export default ServicePetSitting;
