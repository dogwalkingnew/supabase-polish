import heroImg from "@/assets/hero-dogwalking.jpg";
/**
 * DogWalking — Confiance canine de proximité : recherche chaleureuse et factuelle,
 * sans statistiques, notes ou labels de certification qui ne proviennent pas de données réelles.
 */
import { PenLine, Shield, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SmartSearchForm from "@/components/findwalkers/SmartSearchForm";

const FindWalkersHero = () => {
  const navigate = useNavigate();


  return (
    <section className="relative">
      <div className="relative h-72 md:h-80 flex items-center justify-center overflow-hidden">
        <img src={heroImg} alt="Accompagnateur d'Animaux" className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/50 to-foreground/70" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 text-center px-4 -mt-8"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 md:mb-3 leading-tight drop-shadow-lg">
            Trouvez un Accompagnateur<br className="hidden sm:block" /> près de chez vous 🐶
          </h1>
          <p className="text-white/85 text-sm md:text-lg mb-4 md:mb-5 max-w-xl mx-auto drop-shadow-sm">
            Consultez les profils, services et disponibilités renseignés autour de vous.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-4 md:gap-6 mb-4"
          >
            <div className="flex items-center gap-1.5 text-white/90 text-xs md:text-sm bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-semibold">Profils renseignés</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/90 text-xs md:text-sm bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-semibold">Services et disponibilités</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-white/90 text-xs md:text-sm bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
              <Clock className="h-4 w-4 text-[hsl(var(--star))]" />
              <span className="font-semibold">Demandes suivies par statut</span>
            </div>
          </motion.div>

          <div className="flex justify-center">
            <Button size="sm" className="gap-2 text-sm font-bold px-5 py-2.5 shadow-lg hover:scale-105 transition-transform"
              onClick={() => navigate('/annonces-libres')}>
              <PenLine className="h-4 w-4" /> Déposez une annonce personnalisée
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Smart form: recherche et annonce libre */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10 max-w-5xl mx-auto px-4 -mt-10 pb-6"
      >
        <SmartSearchForm />
      </motion.div>
    </section>
  );
};

export default FindWalkersHero;
