/**
 * DogWalking — Confiance canine de proximité : page tarifaire éditoriale et factuelle,
 * centrée sur les services et modalités à confirmer, sans paiement ni crédits simulés.
 */
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Shield, Camera, Clock, Sparkles, ArrowRight, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SEOHead } from "@/components/seo/SEOHead";
import { SEOFAQ } from "@/components/ui/seo-faq";
import { FloatingContact } from "@/components/ui/floating-contact";
import { motion } from "framer-motion";
import tarifsHero from "@/assets/pages/tarifs-hero.jpg";

const services = [
  {
    name: "Promenade",
    description: "Sorties adaptées au rythme de votre animal.",
    features: ["Besoin à préciser avant la mission", "Durée convenue avec l’Accompagnateur", "Informations de mission partagées", "Modalités à confirmer"],
    icon: "🚶",
  },
  {
    name: "Visite à domicile",
    description: "Passage chez vous pour les besoins du quotidien.",
    features: ["Besoins de l’animal à renseigner", "Ville et créneau à confirmer", "Consignes partagées avant la mission", "Informations centralisées"],
    icon: "🏠",
  },
  {
    name: "Garde",
    description: "Organisation d’une garde selon vos contraintes.",
    features: ["Durée à définir", "Services renseignés sur le profil", "Conditions convenues entre les parties", "Suivi de la demande par statut"],
    icon: "🌙",
  },
  {
    name: "Accompagnement vétérinaire",
    description: "Aide pour organiser un trajet ou un rendez-vous vétérinaire.",
    features: ["Demande détaillée recommandée", "Créneau à confirmer", "Consignes partagées avant intervention", "Conditions à convenir"],
    icon: "🏥",
  },
];

const informationCards = [
  { icon: Shield, title: "Profils renseignés", description: "Les services, disponibilités et informations de profil sont consultables avant la prise de contact." },
  { icon: Clock, title: "Demandes suivies", description: "Les demandes et réservations disposent de statuts visibles dans les espaces concernés." },
  { icon: Camera, title: "Informations de mission", description: "Des éléments de suivi peuvent être partagés selon le service et la mission organisée." },
  { icon: MessageCircle, title: "Modalités à confirmer", description: "Prix, durée, adresse exacte et conditions sont à convenir directement avec l’Accompagnateur." },
];

const faqItems = [
  {
    question: "Comment sont définis les tarifs ?",
    answer: "Les tarifs sont renseignés par les Accompagnateurs lorsqu’ils les proposent. Vérifiez le profil et confirmez le montant, la durée et les modalités avant toute prestation.",
  },
  {
    question: "Puis-je payer directement dans DogWalking ?",
    answer: "Le traitement de paiement en ligne n’est pas encore disponible dans DogWalking. L’application ne facture pas, ne bloque pas de fonds et ne gère pas de remboursement automatisé.",
  },
  {
    question: "Comment choisir un Accompagnateur ?",
    answer: "Consultez les informations de profil, les services et les disponibilités renseignés, puis échangez pour confirmer l’adéquation avec les besoins de votre animal.",
  },
  {
    question: "Les informations de mission sont-elles partagées ?",
    answer: "Les espaces de l’application permettent de suivre les informations et statuts liés à une demande. Les éléments disponibles dépendent du service et du parcours utilisé.",
  },
];

const Tarifs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-background">
      <SEOHead
        title="Services & modalités | DogWalking"
        description="Découvrez les services DogWalking et organisez les modalités de votre demande avec un Accompagnateur près de chez vous."
      />
      <Header />

      <main className="container mx-auto px-4 pt-20 pb-12">
        <motion.div
          className="relative rounded-3xl overflow-hidden mb-12"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <img src={tarifsHero} alt="Chien accompagné lors d’une promenade" className="w-full h-56 md:h-72 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
            <Badge className="bg-primary/10 backdrop-blur text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4 mr-2" /> Services et modalités
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Services & Tarifs</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Comparez les services et confirmez les conditions avec l’Accompagnateur avant chaque mission.
            </p>
          </div>
        </motion.div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-12">
          {informationCards.map((item, index) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
              <div className="bg-card rounded-2xl p-5 text-center shadow-sm border border-border h-full">
                <item.icon className="h-7 w-7 text-primary mx-auto mb-3" />
                <h2 className="font-semibold text-sm mb-1">{item.title}</h2>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </section>

        <section className="max-w-4xl mx-auto mb-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Une organisation transparente, à confirmer avant la mission</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Les prix affichés sur les profils sont indicatifs lorsqu’ils sont renseignés. DogWalking permet d’organiser une demande et de suivre ses informations ; le prix final et les modalités restent à confirmer avec l’Accompagnateur.
          </p>
          <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
            <p className="text-sm text-muted-foreground"><strong>À savoir :</strong> le paiement en ligne, les commissions, les crédits et le parrainage ne sont pas encore proposés par l’application.</p>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto mb-14">
          {services.map((service, index) => (
            <motion.div key={service.name} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }}>
              <Card className="h-full hover:shadow-xl hover:border-primary/30 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="text-3xl mb-2">{service.icon}</div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2.5 mb-5">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant="outline" onClick={() => navigate("/walkers")}>
                    Voir les Accompagnateurs <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        <section className="max-w-4xl mx-auto bg-muted/50 rounded-3xl p-8 md:p-12 mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">Questions fréquentes</h2>
          <p className="text-center text-muted-foreground mb-8">Ce qu’il faut savoir avant de déposer une demande.</p>
          <SEOFAQ faqs={faqItems} />
        </section>

        <section className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Prêt à organiser une demande pour votre animal ?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="rounded-full px-8" onClick={() => navigate("/walkers")}>
              Trouver un Accompagnateur <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8" onClick={() => navigate("/support?tab=contact")}>
              Poser une question
            </Button>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingContact />
    </div>
  );
};

export default Tarifs;
