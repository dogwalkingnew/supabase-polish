import { Button } from "@/components/ui/button";
/**
 * DogWalking — Confiance canine de proximité : cartes de service aérées et explicites,
 * avec des prix indicatifs et des informations de mission sans promesse financière implicite.
 */
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Dog, Home, Moon, Sun, Heart, PawPrint, Shield, Check } from 'lucide-react';
import { useNavigate } from "react-router-dom";

// Import des images locales
import promenadeParc from '@/assets/services/promenade-chien-parc.jpg';
import visiteRepas from '@/assets/services/visite-chien-repas.jpg';
import hebergementNuit from '@/assets/services/pet-sitting-serenite.jpg';
import garderieJour from '@/assets/services/pet-sitting-organisation.jpg';
import gardeDomicile from '@/assets/services/pet-sitting-multi-animaux.jpg';

export const ServicesSection = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: "promenade",
      slug: "promenade",
      title: "Promenade",
      description: "Demande de promenade à organiser selon les besoins renseignés pour votre animal.",
      image: promenadeParc,
      tags: ["Besoin à détailler", "Conditions à confirmer"],
      icon: Dog,
      benefits: ["Profil à consulter", "Créneau à convenir"]
    },
    {
      id: "visite_domicile",
      slug: "visite",
      title: "Visite à domicile",
      description: "Demande de visite à domicile dont la durée, les consignes et les actions sont à confirmer.",
      image: visiteRepas,
      tags: ["Consignes à préciser", "Créneau à confirmer"],
      icon: Home,
      benefits: ["Profil à consulter", "Modalités à convenir"]
    },
    {
      id: "hebergement_nuit",
      slug: "garde",
      title: "Hébergement",
      description: "Demande d’hébergement à préciser avec l’Accompagnateur, selon ses informations et le besoin de votre animal.",
      image: hebergementNuit,
      tags: ["Lieu à confirmer", "Conditions à convenir"],
      icon: Moon,
      benefits: ["Profil à consulter", "Dates à discuter"],
    },
    {
      id: "garderie",
      slug: "garde",
      title: "Garderie de Jour/Nuit",
      description: "Demande de garde de jour à organiser avec l’Accompagnateur et les consignes adaptées à votre animal.",
      image: garderieJour,
      tags: ["Demande à préciser", "Conditions à confirmer"],
      icon: Sun,
      benefits: ["Profil à consulter", "Créneau à convenir"]
    },
    {
      id: "garde_domicile",
      slug: "garde-domicile",
      title: "Garde à domicile",
      description: "Demande de garde au domicile du Propriétaire, dont les conditions sont à convenir avant la mission.",
      image: gardeDomicile,
      tags: ["Lieu à préciser", "Modalités à confirmer"],
      icon: Heart,
      benefits: ["Profil à consulter", "Dates à discuter"]
    }
  ];

  return (
    <section id="services" className="py-16 md:py-24 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <PawPrint className="h-4 w-4" />
            Services à organiser
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Nos Services d'Accompagnement pour vos animaux</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Promenade, garde, hébergement et accompagnement vétérinaire : choisissez une catégorie de besoin et confirmez les modalités avec l’Accompagnateur.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 max-w-7xl mx-auto">
          {services.map((service) => (
            <div 
              key={service.id}
              className="group bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-500 border border-border/50 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-44 md:h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <Badge variant="secondary" className="bg-black/70 text-white text-xs backdrop-blur-sm">
                    Modalités à confirmer
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <service.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold">{service.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>

                {/* Benefits */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.benefits.map((benefit, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center gap-1 text-xs text-primary bg-primary/10 px-2.5 py-1 rounded-full font-medium"
                    >
                      <Check className="h-3 w-3" />
                      {benefit}
                    </span>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs font-normal py-0.5 px-2">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button 
                  variant="ghost" 
                  size="sm"
                  className="p-0 h-auto font-semibold text-primary hover:text-primary/80 group/btn"
                  onClick={() => navigate(`/services/${service.slug}`)}
                >
                  Consulter le service
                  <ArrowRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-16 text-center">
          <div className="inline-flex items-center gap-3 bg-card rounded-2xl px-6 py-4 shadow-soft border border-border mb-8">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-sm md:text-base">
              <strong>DogWalking :</strong> informations de mission et conditions à confirmer avec l’Accompagnateur
            </span>
          </div>
          <div>
            <Button size="lg" className="rounded-full px-8" onClick={() => navigate('/walkers')}>
              Consulter les Accompagnateurs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
