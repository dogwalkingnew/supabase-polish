import { SEOFAQ } from "./seo-faq";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

/** DogWalking — FAQ publique factuelle : ne pas annoncer de contrôle, paiement ou disponibilité non prouvés. */
const homeFAQs = [
  {
    question: "Et si je tombe sur quelqu'un de pas sérieux ?",
    answer: "Consultez les informations renseignées sur le profil et échangez avec l’Accompagnateur avant de confirmer une mission. Les règles de vérification et de modération doivent être publiées par l’éditeur avant toute promesse de contrôle renforcé."
  },
  {
    question: "Concrètement, comment je sais que la promenade a vraiment eu lieu ?",
    answer: "Le statut de la mission est visible par les participants. L’Accompagnateur peut ajouter des photos de preuve pendant la mission ; elles restent accessibles aux seuls participants autorisés."
  },
  {
    question: "C'est combien et qu'est-ce qui est compris dans le prix ?",
    answer: "Un prix peut être renseigné à titre indicatif. Le montant, la durée, les prestations comprises et le moyen de règlement doivent être confirmés directement entre le Propriétaire et l’Accompagnateur avant la mission."
  },
  {
    question: "Et si j'ai un imprévu et que je dois annuler ?",
    answer: "Une demande peut être annulée depuis l’espace concerné selon son état. Les conséquences, conditions d’annulation et modalités de règlement doivent être convenues entre les participants tant qu’une politique officielle n’est pas publiée."
  },
  {
    question: "Vous êtes dispos dans ma ville ?",
    answer: "La recherche affiche les profils et informations disponibles dans l’application. Les disponibilités ne sont pas encore gérées comme un calendrier partagé : confirmez toujours le créneau avec l’Accompagnateur."
  },
  {
    question: "Je préfère décrire mon besoin et recevoir des propositions, c'est possible ?",
    answer: "Vous pouvez déposer une annonce libre en décrivant votre besoin, votre créneau et un prix indicatif. L’envoi de candidatures par les Accompagnateurs n’est pas encore disponible dans ce parcours ; consultez aussi les profils pour une demande directe."
  }
];

export const HomeFAQSection = () => {
  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4 border border-primary/20">
            <HelpCircle className="w-4 h-4" />
            Les questions que vous vous posez vraiment
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Réponses directes, sans langue de bois
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Des repères utiles avant de créer une demande ou de déposer une candidature.
          </p>
        </motion.div>
        <div className="max-w-3xl mx-auto">
          <SEOFAQ faqs={homeFAQs} />
        </div>
      </div>
    </section>
  );
};
