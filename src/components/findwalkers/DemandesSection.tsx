/**
 * DogWalking — Confiance canine de proximité : section d’annonces sans données fictives,
 * orientant les utilisateurs vers le parcours dédié lorsque les données réelles sont accessibles.
 */
import { ArrowRight, PlusCircle, CheckCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const DemandesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 bg-secondary/50 border-t border-border" id="annonces">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent text-xs font-bold px-3 py-1.5 rounded-full mb-3">
            <Search className="h-3.5 w-3.5" />
            Annonces libres
          </div>
          <h2 className="text-2xl font-extrabold text-foreground mb-2">Les demandes actives, au bon endroit</h2>
          <p className="text-sm text-foreground/60 max-w-xl mx-auto font-medium leading-relaxed">
            Consultez les annonces réelles ou publiez la vôtre depuis l’espace dédié. Aucune demande d’exemple n’est affichée ici.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto rounded-2xl border border-border bg-card p-6 md:p-8 text-center shadow-sm"
        >
          <Search className="h-10 w-10 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-2">Accéder aux annonces libres</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-5">
            Les annonces sont chargées depuis votre espace afin de respecter les permissions et les données partagées par leurs propriétaires.
          </p>
          <Button onClick={() => navigate("/annonces-libres")} className="font-bold gap-2">
            Voir les annonces libres
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export const DevenirAccompagnateurCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 bg-background border-t border-border" id="devenir">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-primary rounded-2xl p-8 md:p-10 text-primary-foreground shadow-xl"
        >
          <div className="grid md:grid-cols-[auto,1fr,auto] items-center gap-6">
            <div className="h-14 w-14 bg-primary-foreground/20 rounded-2xl flex items-center justify-center shrink-0">
              <PlusCircle className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-extrabold mb-2">Déposez votre dossier Accompagnateur</h3>
              <p className="text-primary-foreground/80 text-sm font-medium mb-3">
                Renseignez votre expérience et votre zone ; après validation administrative, vous pouvez répondre aux demandes qui vous sont attribuées.
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {["Déposer son dossier", "Décrire son expérience", "Suivre la décision", "Répondre aux demandes attribuées"].map((item) => (
                  <div key={item} className="flex items-center gap-1.5 text-xs font-semibold text-primary-foreground/90">
                    <CheckCircle className="h-3.5 w-3.5 text-primary-foreground shrink-0" /> {item}
                  </div>
                ))}
              </div>
            </div>
            <Button
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold gap-2 hover:scale-[1.02] active:scale-95 transition-transform shrink-0"
              onClick={() => navigate("/walker/register")}
            >
              Devenir Accompagnateur <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DemandesSection;
