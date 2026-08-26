/**
 * DogWalking — Confiance canine de proximité : repères éditoriaux chaleureux,
 * actions factuelles et motif d’itinéraire local ; pas de promesse de résultat ou de service garanti.
 */
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, Briefcase, CloudRain, HeartPulse, Accessibility, Baby, Clock3, Home, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const useCases = [
  { icon: Briefcase, title: "Réunion qui s’éternise", description: "Déposez une demande de sortie et précisez le créneau dont vous avez besoin." },
  { icon: Plane, title: "Week-end imprévu", description: "Présentez votre besoin de garde et convenez des conditions avec un Accompagnateur." },
  { icon: HeartPulse, title: "Besoin d’un relais", description: "Expliquez votre situation et les consignes utiles pour votre animal avant la mission." },
  { icon: Accessibility, title: "Un proche à accompagner", description: "Organisez une demande de promenade adaptée au rythme et aux contraintes renseignés." },
  { icon: CloudRain, title: "Prévoir une sortie", description: "Consultez les profils disponibles dans votre zone et confirmez le créneau choisi." },
  { icon: Baby, title: "Un changement de routine", description: "Renseignez les habitudes de votre chien et le rythme souhaité pour la demande." },
  { icon: Clock3, title: "Rendez-vous à organiser", description: "Décrivez le besoin de transport ou d’accompagnement et vérifiez les modalités proposées." },
  { icon: Home, title: "Absence à anticiper", description: "Préparez les informations nécessaires à une visite ou une garde avant de confirmer." },
];

export const UseCasesSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden py-14 md:py-20 px-4 bg-warm/45">
      <div aria-hidden="true" className="dogwalking-route absolute -left-16 top-12 rotate-[12deg]" />
      <div aria-hidden="true" className="absolute bottom-8 right-8 h-36 w-36 rounded-full bg-primary/5 blur-3xl" />
      <div className="container mx-auto relative">
        <div className="mb-10 md:mb-12 max-w-2xl">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15"><Sparkles className="w-3 h-3 mr-1" />Situations du quotidien</Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Un besoin à organiser, <span className="text-primary">près de chez vous</span></h2>
          <p className="text-base md:text-lg text-muted-foreground">DogWalking vous aide à structurer une demande, consulter les profils et confirmer les conditions adaptées à votre situation.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-9">
          {useCases.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="group h-full bg-card/95 border border-primary/10 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-card">
              <CardContent className="p-5 md:p-6"><div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-primary/10 text-primary mb-4"><Icon className="h-5 w-5" /></div><h3 className="text-base md:text-lg font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3><p className="text-sm text-muted-foreground leading-relaxed">{description}</p></CardContent>
            </Card>
          ))}
        </div>
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between rounded-[1.5rem] border border-primary/15 bg-card/90 p-5 md:p-6">
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl">Décrivez votre besoin, puis confirmez avec l’Accompagnateur le créneau, le prix et les conditions avant la mission.</p>
          <Button size="lg" className="group shrink-0" onClick={() => navigate("/walkers")}>Consulter les profils <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" /></Button>
        </div>
      </div>
    </section>
  );
};
