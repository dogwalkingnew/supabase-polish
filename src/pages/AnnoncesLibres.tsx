import { useEffect, useState } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
/**
 * DogWalking — Confiance canine de proximité : annonces libres rattachées à des données réelles,
 * avec prix indicatif, candidature atomique réservée aux profils validés et absence de paiement intégré.
 */
import { MapPin, Calendar, Euro, FileText, ShieldCheck, Plus, Lock } from "lucide-react";

const SERVICE_LABELS: Record<string, string> = {
  promenade: "Promenade",
  garde: "Garde",
  visite: "Visite à domicile",
  veterinaire: "Accompagnement vétérinaire",
};

interface Annonce {
  id: string;
  service_type: string;
  city?: string | null;
  description?: string | null;
  scheduled_date?: string | null;
  price?: number | null;
  owner_id: string;
  status?: string | null;
  created_at?: string | null;
}

const AnnoncesLibres = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [isVerifiedWalker, setIsVerifiedWalker] = useState(false);
  const [form, setForm] = useState({
    service_type: "promenade",
    city: "",
    description: "",
    scheduled_date: "",
    scheduled_time: "",
    duration_minutes: "",
    price: "",
  });

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    let mounted = true;
    if (!user) {
      setIsVerifiedWalker(false);
      return () => { mounted = false; };
    }

    void (async () => {
      const { data } = await (supabase as any)
        .from("walker_profiles")
        .select("verified")
        .eq("user_id", user.id)
        .maybeSingle();
      if (mounted) setIsVerifiedWalker(data?.verified === true);
    })();

    return () => { mounted = false; };
  }, [user?.id]);

  const load = async () => {
    setLoading(true);
    // Annonces libres = bookings sans walker_id encore assigné
    const { data, error } = await (supabase as any)
      .from("bookings")
      .select("id, service_type, address, notes, scheduled_date, price, owner_id, status, created_at")
      .is("walker_id", null)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(40);
    if (!error && data) {
      setAnnonces(
        data.map((b: any) => ({
          id: b.id,
          service_type: b.service_type,
          city: b.address,
          description: b.notes,
          scheduled_date: b.scheduled_date,
          price: b.price,
          owner_id: b.owner_id,
          status: b.status,
          created_at: b.created_at,
        }))
      );
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Connexion requise", description: "Connectez-vous pour déposer une annonce." });
      navigate("/auth?redirect=/annonces-libres");
      return;
    }
    if (Number(form.price) < 0 || Number(form.duration_minutes) < 15) {
      toast({
        title: "Informations de mission invalides",
        description: "Indiquez un prix indicatif nul ou positif et une durée d’au moins 15 minutes.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    const { data: dogs, error: dogsError } = await supabase
      .from("dogs")
      .select("id")
      .eq("owner_id", user.id)
      .limit(1);
    if (dogsError || !dogs?.[0]) {
      setSubmitting(false);
      toast({
        title: "Ajoutez d’abord un animal",
        description: "Une annonce doit être associée à l’un de vos animaux.",
        variant: "destructive",
      });
      navigate("/dashboard?tab=chiens");
      return;
    }
    const { error } = await (supabase as any).from("bookings").insert({
      owner_id: user.id,
      dog_id: dogs[0].id,
      walker_id: null,
      service_type: form.service_type,
      address: form.city,
      notes: form.description,
      scheduled_date: form.scheduled_date,
      scheduled_time: form.scheduled_time,
      duration_minutes: Number(form.duration_minutes),
      price: Number(form.price),
      status: "pending",
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: "Annonce déposée ✓",
      description: "Les Accompagnateurs autorisés peuvent maintenant la consulter.",
    });
    setShowForm(false);
    setForm({ service_type: "promenade", city: "", description: "", scheduled_date: "", scheduled_time: "", duration_minutes: "", price: "" });
    await load();
  };

  const handleApply = async (announcement: Annonce) => {
    if (!user) {
      toast({ title: "Connexion requise", description: "Connectez-vous avec un profil Accompagnateur validé pour candidater." });
      navigate("/auth?role=walker&mode=login&redirect=/annonces-libres");
      return;
    }
    if (!isVerifiedWalker) return;

    setApplyingId(announcement.id);
    try {
      const { error } = await (supabase as any).rpc("apply_to_open_booking", {
        _booking_id: announcement.id,
        _message: "Candidature envoyée via DogWalking.",
      });
      if (error) throw error;
      toast({
        title: "Candidature enregistrée",
        description: "Votre candidature est en attente de décision. Le Propriétaire a été notifié si elle vient d’être créée.",
      });
    } catch (error: any) {
      toast({ title: "Candidature non envoyée", description: error?.message || "La demande n’a pas pu être enregistrée.", variant: "destructive" });
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="min-h-dvh bg-background">
      <SEOHead
        title="Annonces Libres & Besoins | DogWalking"
        description="Déposez un besoin spécifique ou consultez les demandes ouvertes. Indiquez les informations de mission et un prix à titre indicatif."
        canonical="https://dogwalking.fr/annonces-libres"
      />
      <Header />
      <main className="container mx-auto px-4 py-24 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Annonce libre</h1>
              <p className="text-muted-foreground">
                Déposez un besoin spécifique ou, avec un profil Accompagnateur validé, candidatez aux demandes ouvertes.
              </p>
            </div>
            <Button size="lg" onClick={() => setShowForm((v) => !v)} className="gap-2">
              <Plus className="h-4 w-4" />
              {showForm ? "Annuler" : "Déposer un besoin"}
            </Button>
          </div>

          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardContent className="p-4 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-semibold">Prix proposé et modalités à confirmer.</p>
                <p className="text-muted-foreground">
                  Indiquez un prix à titre d’information et confirmez les modalités avec l’Accompagnateur. Le traitement de paiement n’est pas encore disponible dans DogWalking.
                </p>
              </div>
            </CardContent>
          </Card>

          {showForm && (
            <Card className="mb-8 border-2 shadow-lg">
              <CardHeader>
                <CardTitle>Nouvelle annonce</CardTitle>
                <CardDescription>Indiquez les éléments utiles à la mission. Les modalités restent à confirmer avec l’Accompagnateur.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Service</Label>
                    <Select
                      value={form.service_type}
                      onValueChange={(v) => setForm({ ...form, service_type: v })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(SERVICE_LABELS).map(([k, v]) => (
                          <SelectItem key={k} value={k}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Ville / Zone</Label>
                      <Input id="city" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Ex : Lyon 7e" />
                    </div>
                    <div>
                      <Label htmlFor="date">Date souhaitée</Label>
                      <Input id="date" type="date" required value={form.scheduled_date} onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })} min={new Date().toISOString().split("T")[0]} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="time">Heure souhaitée</Label>
                      <Input id="time" type="time" required value={form.scheduled_time} onChange={(e) => setForm({ ...form, scheduled_time: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="duration">Durée estimée (minutes)</Label>
                      <Input id="duration" type="number" min={15} step={15} required value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} placeholder="Ex : 60" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="price">Prix indicatif (€)</Label>
                    <Input id="price" type="number" min={0} required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                  </div>

                  <div>
                    <Label htmlFor="desc">Description du besoin</Label>
                    <Textarea id="desc" required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Ex : 2 promenades par jour pendant 5 jours, chien sociable, à proximité du parc de la Tête d'Or." />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" /> N’indiquez pas d’adresse détaillée ni de données sensibles dans votre annonce.
                  </div>

                  <Button type="submit" disabled={submitting} size="lg" className="w-full">
                    {submitting ? "Dépôt en cours…" : "Déposer l’annonce"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          <h2 className="text-xl font-bold mb-4">Annonces ouvertes</h2>
          {loading ? (
            <div className="grid gap-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />)}
            </div>
          ) : annonces.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Aucune annonce active pour le moment.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {annonces.map((a) => (
                <Card key={a.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <Badge variant="secondary" className="capitalize">{a.service_type?.replace("_", " ")}</Badge>
                        {a.city && (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" /> {a.city}
                          </span>
                        )}
                        {a.scheduled_date && (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" /> {new Date(a.scheduled_date).toLocaleDateString("fr-FR")}
                          </span>
                        )}
                      </div>
                      {a.description && <p className="text-sm text-muted-foreground line-clamp-2">{a.description}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xl font-bold text-primary inline-flex items-center gap-1" aria-label="Prix indicatif">
                        <Euro className="h-4 w-4" /> {a.price ?? "?"}
                      </div>
                      <p className="text-[11px] text-muted-foreground">Indicatif</p>
                      <Button size="sm" variant="outline" className="mt-2" onClick={() => navigate("/walkers")}>
                        Voir les profils
                      </Button>
                      {!user && (
                        <Button size="sm" className="mt-2 w-full" onClick={() => handleApply(a)}>
                          Connexion pour candidater
                        </Button>
                      )}
                      {user && isVerifiedWalker && user.id !== a.owner_id && (
                        <Button size="sm" className="mt-2 w-full" disabled={applyingId !== null} onClick={() => handleApply(a)}>
                          {applyingId === a.id ? "Envoi…" : "Candidater"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default AnnoncesLibres;
