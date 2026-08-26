/**
 * Design DogWalking : information locale factuelle, avec le vert forêt réservé au parcours d’action et au motif de promenade.
 * Cette page n’avance aucune couverture, densité, délai ou certification qui ne serait pas démontré par les profils disponibles.
 */
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { MapPin, Dog, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import heroImg from "@/assets/hero-dogwalking.jpg";

const faqs = [
  { question: "Où puis-je trouver des Accompagnateurs ?", answer: "Consultez les profils disponibles et les informations de zone renseignées par chaque Accompagnateur. La disponibilité dépend des profils et créneaux réellement publiés." },
  { question: "Une mission est-elle garantie près de chez moi ?", answer: "Non. DogWalking ne garantit ni une couverture géographique, ni un délai de réponse, ni la disponibilité d’un Accompagnateur dans une zone donnée." },
  { question: "Comment choisir un profil ?", answer: "Vérifiez les services, les disponibilités et les informations renseignées. Confirmez ensuite le créneau, les besoins de l’animal, le prix et les conditions avec la personne concernée." },
  { question: "Quels services sont proposés ?", answer: "Les parcours disponibles concernent la promenade, la garde, la visite et l’accompagnement vétérinaire. Les services effectivement proposés dépendent des profils renseignés." },
];

const NousSommesPresents = () => (
  <div className="min-h-dvh bg-warm/45">
    <SEOHead title="Rechercher une zone | DogWalking" description="Consultez les profils et informations de zone renseignés sur DogWalking." canonical="https://dogwalking.fr/nous-sommes-presents" />
    <Header />
    <main>
      <section className="relative overflow-hidden border-b border-primary/10 py-16 md:py-24"><img src={heroImg} alt="Promenade d’un chien en extérieur" className="absolute inset-0 h-full w-full object-cover opacity-20" /><div className="absolute inset-0 bg-gradient-to-r from-warm via-warm/90 to-warm/55" /><div className="container relative mx-auto max-w-5xl px-4"><p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-primary"><MapPin className="h-4 w-4" /> Informations de zone</p><h1 className="mt-4 max-w-3xl text-4xl font-bold md:text-6xl">Consultez les profils et les zones renseignées.</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">Les informations de zone, services et disponibilités dépendent des profils actuellement renseignés. DogWalking ne revendique pas de couverture ou de délai garanti.</p><div className="my-7 dogwalking-route" aria-hidden="true" /><div className="flex flex-wrap gap-3"><Button asChild size="lg"><Link to="/walkers">Voir les Accompagnateurs <ArrowRight className="ml-2 h-4 w-4" /></Link></Button><Button asChild size="lg" variant="outline"><Link to="/annonces-libres"><Search className="mr-2 h-4 w-4" /> Consulter les demandes</Link></Button></div></div></section>
      <section className="container mx-auto grid gap-5 px-4 py-14 md:grid-cols-3"><Card className="border-primary/10 bg-background"><CardContent className="p-6"><MapPin className="mb-4 h-7 w-7 text-primary" /><h2 className="font-bold">Zone renseignée</h2><p className="mt-2 text-sm text-muted-foreground">Chaque profil peut indiquer une ville, une zone ou un rayon de service.</p></CardContent></Card><Card className="border-primary/10 bg-background"><CardContent className="p-6"><Dog className="mb-4 h-7 w-7 text-primary" /><h2 className="font-bold">Besoins de l’animal</h2><p className="mt-2 text-sm text-muted-foreground">La demande reste associée à l’animal et aux informations utiles que son Propriétaire renseigne.</p></CardContent></Card><Card className="border-primary/10 bg-background"><CardContent className="p-6"><ArrowRight className="mb-4 h-7 w-7 text-primary" /><h2 className="font-bold">Conditions à confirmer</h2><p className="mt-2 text-sm text-muted-foreground">Le créneau, la durée, le prix et les modalités doivent être convenus avant la mission.</p></CardContent></Card></section>
      <section className="border-y border-primary/10 bg-background/75 py-16"><div className="container mx-auto max-w-3xl px-4"><h2 className="text-3xl font-bold">Questions fréquentes sur les zones</h2><div className="mt-7"><Accordion type="single" collapsible className="space-y-3">{faqs.map((faq) => <AccordionItem key={faq.question} value={faq.question} className="rounded-xl border border-primary/10 bg-background px-5"><AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger><AccordionContent className="pb-5 text-muted-foreground">{faq.answer}</AccordionContent></AccordionItem>)}</Accordion></div></div></section>
    </main>
    <Footer />
  </div>
);

export default NousSommesPresents;
