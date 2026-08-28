import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-dog-walking.jpg";
/**
 * DogWalking — Confiance canine de proximité : héros éditorial chaleureux, actions explicites,
 * preuves et statuts présentés sans promesse financière ou sociale non vérifiée.
 */
import { Shield, Clock, Camera } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const trustIndicatorVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.8 + i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <section 
      ref={ref}
      className="relative min-h-[76vh] md:min-h-[88vh] flex items-center justify-center overflow-hidden"
    >
      {/* Parallax Background Image */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroImage})`,
          y,
          scale,
        }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-emerald-950/40"
          style={{ opacity }}
        />
      </motion.div>

      {/* Static decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/20 blur-2xl" />
      <div className="absolute bottom-40 right-20 w-32 h-32 rounded-full bg-accent/20 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white pt-16 md:pt-0">
        <motion.div 
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-slate-950/35 px-4 py-2 mb-6 shadow-lg shadow-slate-950/20 backdrop-blur-md"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Une mise en relation pensée pour le bien-être animal</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-tight drop-shadow-[0_3px_18px_rgba(0,0,0,0.55)]"
          >
              Un accompagnement à organiser{" "}
              <span className="inline-block bg-gradient-to-r from-emerald-200 via-white to-cyan-200 bg-clip-text text-transparent">
              pour votre animal
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-2xl mb-6 md:mb-8 opacity-90 max-w-2xl mx-auto text-center"
          >
            Promenade, garde, visite : consultez les profils et formulez une demande adaptée à votre besoin.<br />
            Confirmez les modalités avec l’Accompagnateur avant la mission.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-auto w-full sm:w-auto bg-gradient-primary text-white shadow-glow-primary hover:-translate-y-0.5 hover:shadow-elevated transition-all duration-200"
                onClick={() => navigate('/walkers')}
              >
                Voir les profils Accompagnateur
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="lg" 
                className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-auto bg-slate-950/30 border-white/60 text-white hover:bg-white/20 hover:-translate-y-0.5 w-full sm:w-auto backdrop-blur-md transition-all duration-200"
                onClick={() => navigate('/walker/register')}
              >
                Devenir Accompagnateur
              </Button>
            </motion.div>
          </motion.div>

                    {/* Microcopy de réassurance sous le CTA */}
          <motion.p
            variants={itemVariants}
            className="text-xs md:text-sm mt-3 opacity-80"
          >
            Modalités et disponibilités confirmées directement avec votre Accompagnateur
          </motion.p>

          {/* Trust indicators */}
          <div className="mt-8 md:mt-12 grid grid-cols-2 md:flex md:justify-center items-center gap-4 md:gap-8 text-xs md:text-sm">
            {[
              { icon: Shield, text: "Candidatures examinées avant activation", color: "text-primary" },
              { icon: Clock, text: "Demandes suivies par statut", color: "text-primary" },
              { icon: Camera, text: "Preuves visuelles selon le service", color: "text-accent" },
            ].map((item, i) => (
              <motion.div 
                key={i}
                custom={i}
                variants={trustIndicatorVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-2 justify-center rounded-full border border-white/15 bg-slate-950/30 px-3 py-1.5 shadow-md shadow-slate-950/20 backdrop-blur-sm"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                <item.icon className={`h-4 w-4 ${item.color}`} />
                <span>{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-1.5 bg-white rounded-full" />
        </div>
      </div>
    </section>
  );
};
