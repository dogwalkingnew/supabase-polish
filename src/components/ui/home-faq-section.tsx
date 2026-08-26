import { SEOFAQ } from "./seo-faq";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

// FAQ alignée sur les NOUVELLES sections de la home (déclencheurs + protocole 5 points)
// Chaque question répond à une objection concrète, sans répétition.
const homeFAQs = [
  {
    question: "Et si je tombe sur quelqu'un de pas sérieux ?",
    answer: "Vous ne tomberez pas dessus : 65% des candidats Accompagnateurs sont refusés. Chaque profil est vérifié manuellement par notre équipe (pièce d'identité, justificatifs, références). Et même si quelque chose se passait mal, le paiement reste bloqué jusqu'à VOTRE validation finale via votre code unique. L'Accompagnateur n'est jamais payé à l'avance."
  },
  {
    question: "Concrètement, comment je sais que la promenade a vraiment eu lieu ?",
    answer: "L'Accompagnateur envoie des photos pendant la mission directement sur votre fil de réservation. À la fin, il vous demande votre code unique à 4 chiffres. Tant que vous ne lui avez pas donné ce code, il ne touche pas un centime. Pas de photo, pas de code transmis = remboursement automatique."
  },
  {
    question: "C'est combien et qu'est-ce qui est compris dans le prix ?",
    answer: "Les prix sont libres et fixés par chaque Accompagnateur, à partir de 8€ pour une promenade ou une visite, 10€ pour une garderie, 12€ pour une garde à domicile, 16€ pour une visite sanitaire. Le prix affiché inclut tout : la mission, le suivi photos, la garantie Paiement Sécurisé, le support. Aucun frais caché, aucun abonnement."
  },
  {
    question: "Et si j'ai un imprévu et que je dois annuler ?",
    answer: "Vous annulez en 2 clics depuis votre espace. Tant que la mission n'a pas commencé et que les fonds ne sont pas libérés, vous êtes intégralement remboursé automatiquement. À moins de 3h du début, c'est la médiation au cas par cas avec notre support."
  },
  {
    question: "Vous êtes dispos dans ma ville ?",
    answer: "Présents partout en France métropolitaine, avec une forte densité en Île-de-France, Lyon, Marseille, Bordeaux, Toulouse, Nantes, Lille et leurs périphéries. Tapez votre adresse dans la recherche en haut de la page : vous voyez immédiatement les Accompagnateurs disponibles autour de vous, avec distance, tarif et premier créneau libre."
  },
  {
    question: "Je préfère décrire mon besoin et recevoir des propositions, c'est possible ?",
    answer: "Oui. Plutôt que de chercher manuellement, vous pouvez déposer une annonce libre : vous décrivez votre besoin, vous fixez votre budget (dans le respect des prix planchers), et vous recevez plusieurs propositions d'Accompagnateurs. Vous gardez le choix final."
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
            Les 6 questions qu'on nous pose le plus avant la première réservation.
          </p>
        </motion.div>
        <div className="max-w-3xl mx-auto">
          <SEOFAQ faqs={homeFAQs} />
        </div>
      </div>
    </section>
  );
};
