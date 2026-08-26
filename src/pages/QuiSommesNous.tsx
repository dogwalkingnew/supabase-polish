/**
 * Design DogWalking : éditorial local, chaleureux et factuel, utilisant le vert forêt seulement pour les actions et repères de confiance.
 * Cette page ne présente que les parcours réellement disponibles et évite toute statistique, certification, couverture ou disponibilité non vérifiée.
 */
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { SEOFAQ } from "@/components/ui/seo-faq";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dog, Heart, MapPin, MessageSquare, Shield, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import teamImage from "@/assets/pages/equipe-dogwalking.jpg";

const quiSommesNousFAQs = [
  {
    question: "Que permet DogWalking aujourd’hui ?",
    answer: "DogWalking propose des espaces pour créer un profil, renseigner les informations d’un animal, présenter des services et organiser des demandes de promenade, garde, visite ou accompagnement vétérinaire.",
  },
  {
    question: "Comment choisir un Accompagnateur ?",
    answer: "Consultez les informations de profil, les services, disponibilités et tarifs renseignés lorsqu’ils sont disponibles. Confirmez directement les conditions, le créneau et les besoins de l’animal avant toute mission.",
  },
  {
    question: "DogWalking est-il disponible dans ma zone ?",
    answer: "La disponibilité dépend des profils et zones renseignés par les Accompagnateurs. L’application ne revendique pas de couverture nationale ou de délai de réponse garanti sans données vérifiables.",
  },
  {
    question: "Comment contacter DogWalking ?",
    answer: "Le canal de contact de production est en cours de confirmation. Les coordonnées de l’éditeur devront être publiées dans les ressources légales avant toute mise en ligne publique.",
  },
  {
    question: "Le paiement est-il géré dans l’application ?",
    answer: "Non. Le paiement en ligne, le séquestre, les commissions et les remboursements automatisés ne sont pas actifs dans la version actuellement disponible.",
  },
];

const repères = [
  { icon: Dog, title: "Informations sur l’animal", description: "Le Propriétaire peut associer chaque demande à un animal et à ses besoins renseignés." },
  { icon: Users, title: "Profils et services", description: "Les Accompagnateurs peuvent présenter les services et informations qu’ils choisissent de renseigner." },
  { icon: MessageSquare, title: "Conditions à confirmer", description: "Durée, prix, lieu et modalités sont à convenir entre les personnes concernées avant la mission." },
  { icon: Shield, title: "Parcours transparents", description: "Les fonctionnalités non disponibles, notamment le paiement intégré, ne sont pas présentées comme actives." },
];

const QuiSommesNous = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-warm/45">
      <SEOHead
        title="À propos de DogWalking"
        description="Découvrez les parcours actuellement proposés par DogWalking pour organiser des demandes liées aux animaux."
        canonical="https://dogwalking.fr/qui-sommes-nous"
        image={teamImage}
      />
      <Header />

      <main>
        <section className="relative overflow-hidden border-b border-primary/10 bg-background/70 py-16 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-warm via-background to-sage-light/35" aria-hidden="true" />
          <div className="container relative z-10 mx-auto grid items-center gap-10 px-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
              <Badge className="mb-5 border-primary/15 bg-primary/10 text-primary"><Heart className="mr-1 h-3.5 w-3.5" /> À propos</Badge>
              <h1 className="max-w-xl text-4xl font-bold leading-tight md:text-5xl">Organiser une demande pour son animal, avec des informations claires.</h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">DogWalking met à disposition des parcours pour renseigner les besoins d’un animal, consulter des profils et structurer les demandes. Les conditions d’une mission restent à confirmer entre le Propriétaire et l’Accompagnateur.</p>
              <div className="my-7 dogwalking-route" aria-hidden="true" />
              <div className="flex flex-wrap gap-3">
                <Button size="lg" onClick={() => navigate("/walkers")}>Consulter les Accompagnateurs</Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/annonces-libres")}>Voir les demandes ouvertes</Button>
              </div>
            </motion.div>
            <motion.figure initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.1 }} className="relative">
              <div className="absolute -inset-3 rounded-[2.25rem] border border-primary/10 bg-primary/5" aria-hidden="true" />
              <img src={teamImage} alt="Promenade d’un chien dans un environnement extérieur" className="relative aspect-[4/3] w-full rounded-[2rem] object-cover shadow-elevated" />
              <figcaption className="mt-3 text-sm text-muted-foreground">Les informations visibles dépendent des profils et demandes effectivement renseignés.</figcaption>
            </motion.figure>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Un parcours de proximité</p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">Des repères concrets, avant de confier une mission.</h2>
              <p className="mt-5 text-muted-foreground">L’objectif est de rendre les informations utiles visibles, sans promettre de disponibilité, de certification ou de service financier qui ne sont pas mis en œuvre.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {repères.map((repère) => (
                <Card key={repère.title} className="border-primary/10 bg-background/90 shadow-card">
                  <CardContent className="p-6">
                    <repère.icon className="mb-4 h-7 w-7 text-primary" />
                    <h3 className="font-bold">{repère.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{repère.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-primary/10 bg-background/75 py-16 md:py-20">
          <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="order-2 lg:order-1">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Avant la mission</p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">Préparer, confirmer, puis suivre les informations utiles.</h2>
              <p className="mt-5 max-w-2xl text-muted-foreground">Renseignez un animal, choisissez un service adapté, vérifiez les informations disponibles et confirmez les conditions pratiques avec l’autre personne. Le prix et le moyen de règlement ne sont pas traités par DogWalking dans cette version.</p>
              <div className="mt-7 dogwalking-route" aria-hidden="true" />
            </div>
            <div className="order-1 rounded-[2rem] border border-primary/10 bg-warm/70 p-7 shadow-soft lg:order-2">
              <MapPin className="h-8 w-8 text-primary" />
              <h3 className="mt-4 text-xl font-bold">Une zone dépend des profils renseignés</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Vérifiez les zones, créneaux et services affichés pour chaque profil. Aucune couverture géographique ou capacité de réponse n’est garantie par cette page.</p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Réponses utiles</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Ce que DogWalking propose aujourd’hui.</h2>
            <div className="mt-8 rounded-[2rem] border border-primary/10 bg-background shadow-card">
              <SEOFAQ faqs={quiSommesNousFAQs} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default QuiSommesNous;
