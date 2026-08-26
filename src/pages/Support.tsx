/**
 * DogWalking — Confiance canine de proximité : aide concise et factuelle,
 * sans paiement simulé, données de support inventées ni formulaire qui prétend envoyer un message.
 */
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { SEOFAQ } from "@/components/ui/seo-faq";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, Dog, Briefcase, CreditCard, Shield, MessageSquare, Mail, Clock, Heart, Users, Camera } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import teamImage from "@/assets/pages/equipe-dogwalking.jpg";
import missionImage from "@/assets/trust/promeneur-verifie-badge.jpg";
import { FloatingContact } from "@/components/ui/floating-contact";

const faqCategories = {
  proprietaires: {
    title: "Propriétaires",
    icon: Dog,
    faqs: [
      { question: "Comment déposer une demande ?", answer: "Vous pouvez consulter les Accompagnateurs ou utiliser les annonces libres. Une demande doit être associée à votre animal et ses informations peuvent ensuite être suivies dans votre espace." },
      { question: "Comment choisir un Accompagnateur ?", answer: "Consultez les services, informations de profil et disponibilités renseignés. Confirmez ensuite les conditions, la durée et les besoins de votre animal avant la mission." },
      { question: "Puis-je annuler une réservation ?", answer: "Les modalités d’annulation doivent être confirmées avec l’Accompagnateur. L’application ne gère pas encore de remboursement automatique." },
      { question: "Des informations de mission peuvent-elles être partagées ?", answer: "Les espaces DogWalking permettent de suivre des informations et statuts liés à une demande. Les éléments disponibles dépendent du parcours et du service utilisés." },
    ],
  },
  accompagnateurs: {
    title: "Accompagnateurs",
    icon: Briefcase,
    faqs: [
      { question: "Comment proposer mes services ?", answer: "Créez votre profil, renseignez vos services, disponibilités et tarifs lorsqu’ils sont pertinents, puis consultez les demandes accessibles depuis votre espace." },
      { question: "Puis-je fixer mes tarifs ?", answer: "Vous pouvez renseigner un tarif sur votre profil. Les montants et les modalités d’une mission doivent être confirmés avec le Propriétaire avant toute prestation." },
      { question: "Comment suivre une mission ?", answer: "Les tableaux de bord permettent de consulter les demandes et leurs statuts. Les informations à partager doivent être adaptées au service organisé." },
    ],
  },
  paiement: {
    title: "Paiement & modalités",
    icon: CreditCard,
    faqs: [
      { question: "Puis-je payer directement dans DogWalking ?", answer: "Non. Le traitement de paiement en ligne n’est pas encore disponible. DogWalking ne bloque pas de fonds, ne facture pas de commission et ne gère pas de remboursement automatisé." },
      { question: "Comment confirmer un prix ?", answer: "Le prix indiqué est une information de départ. Confirmez directement avec l’Accompagnateur le montant, la durée, les conditions et le moyen de règlement avant la mission." },
      { question: "Le programme de parrainage est-il disponible ?", answer: "Le parrainage et les crédits ne sont pas encore proposés dans l’application." },
    ],
  },
};

const values = [
  { icon: Shield, title: "Informations structurées", description: "Les profils, services et demandes sont organisés dans des parcours dédiés." },
  { icon: Camera, title: "Suivi de mission", description: "Les informations de mission peuvent être partagées selon le service et le parcours utilisé." },
  { icon: Heart, title: "Bien-être animal", description: "Les besoins de l’animal sont au cœur de la préparation de chaque demande." },
  { icon: MessageSquare, title: "Échanges à confirmer", description: "Les conditions d’une prestation sont à convenir entre les personnes concernées." },
];

const Support = () => {
  const [searchParams] = useSearchParams();
  const [mainTab, setMainTab] = useState("faq");
  const [faqTab, setFaqTab] = useState<keyof typeof faqCategories>("proprietaires");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "contact") setMainTab("contact");
    else if (tab === "a-propos") setMainTab("about");
    else if (tab && tab in faqCategories) {
      setMainTab("faq");
      setFaqTab(tab as keyof typeof faqCategories);
    }
  }, [searchParams]);

  return (
    <div className="min-h-dvh bg-background">
      <SEOHead title="Centre d’aide | DogWalking" description="Retrouvez les informations utiles sur les demandes, les profils, les modalités et les fonctionnalités actuellement proposées par DogWalking." />
      <Header />
      <main className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-2 text-sm font-semibold mb-4"><HelpCircle className="w-4 h-4" /> Centre d’aide</span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Des réponses claires, fondées sur les fonctions disponibles</h1>
            <p className="text-muted-foreground text-base md:text-lg">Consultez les informations utiles avant de créer un profil, déposer une demande ou organiser une mission.</p>
          </div>

          <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto mb-10">
              <TabsTrigger value="faq" className="gap-2"><HelpCircle className="w-4 h-4" /> FAQ</TabsTrigger>
              <TabsTrigger value="about" className="gap-2"><Users className="w-4 h-4" /> À propos</TabsTrigger>
              <TabsTrigger value="contact" className="gap-2"><MessageSquare className="w-4 h-4" /> Contact</TabsTrigger>
            </TabsList>

            <TabsContent value="faq" className="space-y-8">
              <div className="grid md:grid-cols-4 gap-8">
                <div className="md:col-span-1"><div className="sticky top-24 space-y-2">
                  {Object.entries(faqCategories).map(([key, category]) => (
                    <Button key={key} variant={faqTab === key ? "default" : "ghost"} className="w-full justify-start gap-3 rounded-xl" onClick={() => setFaqTab(key as keyof typeof faqCategories)}>
                      <category.icon className="w-4 h-4" /> {category.title}
                    </Button>
                  ))}
                </div></div>
                <div className="md:col-span-3"><div className="bg-card rounded-3xl border shadow-sm overflow-hidden">
                  <div className="p-6 md:p-8 border-b bg-muted/30"><h2 className="text-2xl font-bold mb-2">{faqCategories[faqTab].title}</h2><p className="text-muted-foreground">Réponses aux questions les plus fréquentes.</p></div>
                  <SEOFAQ faqs={faqCategories[faqTab].faqs} />
                </div></div>
              </div>
            </TabsContent>

            <TabsContent value="about" className="space-y-12">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                  <h2 className="text-3xl md:text-4xl font-bold mb-5">Organiser les demandes liées à votre animal</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-5">DogWalking met à disposition des espaces pour renseigner un profil, présenter des services et structurer les demandes de promenade, garde, visite ou accompagnement vétérinaire.</p>
                  <p className="text-lg text-muted-foreground leading-relaxed">L’application privilégie des informations visibles et des conditions explicites entre Propriétaires et Accompagnateurs. Les éléments non disponibles, notamment les paiements intégrés, ne sont pas présentés comme actifs.</p>
                </motion.div>
                <img src={teamImage} alt="Personnes accompagnant un chien" className="rounded-[2rem] shadow-xl border w-full h-auto object-cover" />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{values.map((value) => <Card key={value.title} className="border-none shadow-soft bg-card/50"><CardContent className="pt-7"><value.icon className="w-7 h-7 text-primary mb-4" /><h3 className="font-bold mb-2">{value.title}</h3><p className="text-sm text-muted-foreground">{value.description}</p></CardContent></Card>)}</div>
              <div className="grid md:grid-cols-2 gap-10 items-center bg-muted/50 rounded-[2rem] p-7 md:p-10"><img src={missionImage} alt="Chien accompagné lors d’une mission" className="rounded-3xl shadow-lg w-full" /><div><h2 className="text-3xl font-bold mb-5">Préparer une mission avec soin</h2><p className="text-muted-foreground leading-relaxed mb-5">Renseignez les besoins de l’animal, le lieu ou la zone, le créneau et les consignes utiles. Les modalités doivent être confirmées avant la prestation.</p><ul className="space-y-3 text-sm"><li className="flex gap-2"><CheckIcon /> Profil et services à compléter</li><li className="flex gap-2"><CheckIcon /> Demande associée à un animal</li><li className="flex gap-2"><CheckIcon /> Informations à confirmer entre les parties</li></ul></div></div>
            </TabsContent>

            <TabsContent value="contact"><div className="max-w-2xl mx-auto"><Card className="border shadow-lg rounded-3xl"><CardContent className="p-7 md:p-10 text-center"><Mail className="w-9 h-9 text-primary mx-auto mb-4" /><h2 className="text-2xl font-bold mb-3">Contacter DogWalking</h2><p className="text-muted-foreground mb-6">Le formulaire de support n’est pas encore relié à un service d’envoi. Utilisez l’adresse email ci-dessous pour nous écrire.</p><Button asChild size="lg" className="rounded-full px-7"><a href="mailto:contact@dogwalking.fr">Écrire à contact@dogwalking.fr</a></Button><p className="text-xs text-muted-foreground mt-5">N’envoyez pas de données sensibles ou d’adresse complète dans votre premier message.</p></CardContent></Card></div></TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
};

const CheckIcon = () => <span className="mt-0.5 text-primary">✓</span>;

export default Support;
