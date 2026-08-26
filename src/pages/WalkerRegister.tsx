import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import { Briefcase, Euro, Clock, Shield, CheckCircle, Users } from 'lucide-react';
import { SEOHead } from "@/components/seo/SEOHead";
import { motion } from "framer-motion";
import heroImage from "@/assets/services/promenade-chien-parc.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const WalkerRegister = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const fd = new FormData(e.currentTarget);
    const firstName = String(fd.get("firstName") || "").trim();
    const lastName = String(fd.get("lastName") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const city = String(fd.get("city") || "").trim();
    const experience = String(fd.get("experience") || "").trim();
    const motivation = String(fd.get("motivation") || "").trim();

    try {
      const { data: { session } } = await supabase.auth.getSession();

      // Si non connecté → on demande la création de compte (user_type=walker)
      // et on stocke la candidature dans sessionStorage pour reprise post-auth.
      if (!session) {
        sessionStorage.setItem(
          "pendingWalkerApplication",
          JSON.stringify({ firstName, lastName, phone, city, experience, motivation })
        );
        toast({
          title: "Créez votre compte",
          description: "Une dernière étape : créez votre compte Accompagnateur pour finaliser votre candidature.",
        });
        navigate(`/auth?type=walker&redirect=${encodeURIComponent("/walker/register")}&email=${encodeURIComponent(email)}`);
        return;
      }

      const userId = session.user.id;

      // 1) Mise à jour du profil (nom, ville, téléphone, type walker)
      await (supabase as any)
        .from("profiles")
        .update({
          first_name: firstName || null,
          last_name: lastName || null,
          phone: phone || null,
          city: city || null,
          user_type: "walker",
        })
        .eq("id", userId);

      // 2) Création/Upsert du walker_profile (verified=false → en attente d'examen admin)
      const { error: wpError } = await (supabase as any)
        .from("walker_profiles")
        .upsert(
          {
            user_id: userId,
            verified: false,
            experience_years: 0,
            hourly_rate: 15,
          },
          { onConflict: "user_id" }
        );
      if (wpError) throw wpError;

      // 3) Notification aux admins (best-effort)
      try {
        const { data: admins } = await (supabase as any)
          .from("user_roles")
          .select("user_id")
          .eq("role", "admin");
        if (admins?.length) {
          await (supabase as any).from("notifications").insert(
            admins.map((a: any) => ({
              user_id: a.user_id,
              title: "🆕 Nouvelle candidature Accompagnateur",
              message: `${firstName} ${lastName} (${city || "ville non renseignée"}) souhaite devenir Accompagnateur.`,
              type: "admin",
              link: "/admin",
              metadata: { applicant_id: userId, experience, motivation },
            }))
          );
        }
      } catch (notifErr) {
        console.warn("[walker-register] notif admin échouée:", notifErr);
      }

      toast({
        title: "Candidature envoyée ✓",
        description: "Votre dossier est enregistré et reste en attente d’une décision administrative.",
      });
      sessionStorage.removeItem("pendingWalkerApplication");
      navigate('/');
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || "Impossible d'envoyer votre candidature pour le moment.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const advantages = [
    {
      icon: Euro,
      title: "Tarifs renseignés",
      description: "Indiquez un tarif de référence pour vos demandes ; les modalités restent à confirmer avec chaque Propriétaire."
    },
    {
      icon: Clock,
      title: "Profil à compléter",
      description: "Renseignez votre zone et votre expérience afin de préparer l’examen de votre candidature."
    },
    {
      icon: Shield,
      title: "Candidature suivie",
      description: "Votre dossier reste en attente tant qu’une décision administrative n’a pas été enregistrée."
    },
    {
      icon: Users,
      title: "Services proposés",
      description: "Après validation, votre profil peut être utilisé pour répondre aux demandes compatibles avec vos informations."
    }
  ];

  return (
    <div className="min-h-dvh bg-background">
      <SEOHead
        title="Devenir Accompagnateur | DogWalking"
        description="Déposez votre candidature Accompagnateur. Votre profil sera soumis à un examen administratif avant toute mission."
        canonical="https://dogwalking.fr/walker/register"
      />
      
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div aria-hidden="true" className="dogwalking-route absolute inset-x-0 bottom-0 h-28 opacity-70" />
        
        <motion.div 
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6"
          >
            <Briefcase className="h-10 w-10 text-primary" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Devenez Accompagnateur</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Déposez votre candidature pour proposer des services auprès des Propriétaires, sous réserve de la validation administrative prévue par DogWalking.
          </p>
        </motion.div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Advantages Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {advantages.map((advantage, index) => (
                <motion.div 
                  key={advantage.title}
                  className="text-center"
                  whileHover={{ scale: 1.05, y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="h-full shadow-card">
                    <CardContent className="pt-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <advantage.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{advantage.title}</h3>
                      <p className="text-sm text-muted-foreground">{advantage.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Requirements */}
            <motion.div variants={itemVariants} className="mb-12">
              <Card className="bg-muted/50 shadow-card border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Étapes de candidature
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Compte et coordonnées</p>
                        <p className="text-sm text-muted-foreground">Créez votre compte puis renseignez les coordonnées demandées.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Expérience décrite</p>
                         <p className="text-sm text-muted-foreground">Expliquez votre expérience et votre approche de l’accompagnement animalier.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Examen administratif</p>
                        <p className="text-sm text-muted-foreground">Votre dossier est étudié avant l’autorisation de répondre aux demandes.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Décision notifiée</p>
                        <p className="text-sm text-muted-foreground">La décision et son éventuel motif sont communiqués dans votre espace.</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 pt-4 border-t">
                    Le délai d’examen dépend de l’organisation de DogWalking et n’est pas garanti par l’application.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Application Form */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Candidature Accompagnateur</CardTitle>
                  <CardDescription>
                    Remplissez ce formulaire pour soumettre votre dossier. Il restera en attente jusqu’à la décision administrative.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div whileFocus={{ scale: 1.02 }}>
                        <Label htmlFor="firstName">Prénom *</Label>
                        <Input id="firstName" name="firstName" required placeholder="Jean" />
                      </motion.div>
                      <div>
                        <Label htmlFor="lastName">Nom *</Label>
                        <Input id="lastName" name="lastName" required placeholder="Dupont" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" name="email" type="email" required placeholder="jean@email.com" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Téléphone *</Label>
                        <Input id="phone" name="phone" type="tel" required placeholder="06 12 34 56 78" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="city">Ville d'intervention *</Label>
                      <Input id="city" name="city" required placeholder="Paris, Lyon, Marseille..." />
                    </div>

                    <div>
                      <Label htmlFor="experience">Expérience animalière *</Label>
                      <Textarea
                        id="experience"
                        name="experience"
                        placeholder="Décrivez votre expérience : possédez-vous des animaux ? Avez-vous des formations ? Quelle est votre approche de la sécurité ?"
                        rows={4}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="motivation">Pourquoi DogWalking ? *</Label>
                      <Textarea
                        id="motivation"
                        name="motivation"
                        placeholder="Pourquoi souhaitez-vous proposer vos services sur DogWalking ?"
                        rows={4}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                      {submitting ? "Envoi en cours…" : "Envoyer ma candidature"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WalkerRegister;
