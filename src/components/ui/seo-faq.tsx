/**
 * DogWalking — Confiance canine de proximité : FAQ réutilisables et factuelles,
 * sans promesse de paiement, de vérification, de remboursement ou de performance non implémentée.
 */
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FAQItem {
  question: string;
  answer: string;
}

interface SEOFAQProps {
  title?: string;
  subtitle?: string;
  faqs: FAQItem[];
  className?: string;
}

export const SEOFAQ = ({ faqs, className = "" }: SEOFAQProps) => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
    })),
  };

  return (
    <section className={`py-12 ${className}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem key={`${faq.question}-${index}`} value={`faq-${index}`} className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-md transition-shadow">
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-4">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export const tarifsFAQs: FAQItem[] = [
  {
    question: "Comment sont définis les tarifs ?",
    answer: "Les tarifs peuvent être renseignés sur les profils. Ils sont indicatifs et doivent être confirmés avec l’Accompagnateur avant la mission, avec la durée et les conditions concernées.",
  },
  {
    question: "Puis-je payer directement dans DogWalking ?",
    answer: "Non. Le traitement de paiement en ligne n’est pas encore disponible dans DogWalking. L’application ne bloque pas de fonds, ne facture pas de commission et ne gère pas de remboursement automatisé.",
  },
  {
    question: "Des crédits, pourboires ou parrainages sont-ils disponibles ?",
    answer: "Les crédits, pourboires et parrainages ne sont pas encore proposés dans l’application.",
  },
];

export const securiteFAQs: FAQItem[] = [
  {
    question: "Quelles informations sont visibles sur un profil ?",
    answer: "Les profils peuvent présenter les services, disponibilités, une ville ou zone et d’autres informations renseignées par la personne. Vérifiez les informations pertinentes avant d’organiser une mission.",
  },
  {
    question: "Comment préparer une mission en sécurité ?",
    answer: "Partagez uniquement les informations nécessaires, confirmez les modalités avec l’Accompagnateur et évitez de transmettre des données sensibles ou une adresse complète dans un premier échange.",
  },
  {
    question: "Que faire en cas de problème ?",
    answer: "Contactez directement l’autre personne pour clarifier la situation et utilisez le contact DogWalking si nécessaire. En cas d’urgence ou de danger pour l’animal, contactez les services compétents.",
  },
];

export const promenadeFAQs: FAQItem[] = [
  {
    question: "Combien de temps dure une promenade ?",
    answer: "La durée est à préciser dans la demande et à confirmer avec l’Accompagnateur en fonction des besoins de l’animal.",
  },
  {
    question: "Comment communiquer les besoins de mon animal ?",
    answer: "Renseignez les informations utiles dans votre demande : habitudes, consignes, contraintes et besoins spécifiques. Confirmez-les avant la mission.",
  },
  {
    question: "Puis-je organiser une promenade avec plusieurs chiens ?",
    answer: "Les conditions sont à confirmer avec l’Accompagnateur. Décrivez le nombre d’animaux et leurs besoins dès la demande afin de convenir d’une organisation adaptée.",
  },
];

export const deveniAccompagnateur_CertifiéFAQs: FAQItem[] = [
  {
    question: "Comment proposer mes services ?",
    answer: "Créez votre profil, renseignez vos services, disponibilités et informations utiles, puis consultez les demandes auxquelles vous pouvez répondre.",
  },
  {
    question: "Puis-je choisir mes horaires et ma zone ?",
    answer: "Vous pouvez renseigner vos disponibilités et votre zone dans votre profil. Confirmez toujours les conditions avec le Propriétaire avant une mission.",
  },
  {
    question: "Comment suis-je payé pour une mission ?",
    answer: "DogWalking ne propose pas encore de paiement intégré. Le prix et le moyen de règlement doivent être définis entre les personnes concernées avant la mission.",
  },
  {
    question: "Dois-je déclarer mes revenus ?",
    answer: "Les obligations peuvent dépendre de votre situation et de votre pays. Renseignez-vous auprès des sources administratives ou d’un professionnel qualifié avant d’exercer une activité rémunérée.",
  },
];
