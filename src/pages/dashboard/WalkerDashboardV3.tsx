/**
 * Design DogWalking — tableau Accompagnateur factuel : fond clair, vert forêt pour les états,
 * aucune donnée de démonstration, aucun revenu, avis, paiement ou disponibilité non calculés.
 */
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, CheckCircle2, ClipboardList, Dog, Loader2, MapPin, ShieldAlert, UserRound } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type BookingRow = {
  id: string;
  service_type: string | null;
  scheduled_date: string | null;
  scheduled_time: string | null;
  duration_minutes: number | null;
  address: string | null;
  status: string | null;
  dogs?: { name?: string | null } | null;
};

const statusLabel: Record<string, string> = { pending: "En attente", confirmed: "Confirmée", in_progress: "En cours", completed: "Terminée", cancelled: "Annulée" };
const serviceLabel: Record<string, string> = { promenade: "Promenade", garde: "Garde", visite: "Visite à domicile", veterinaire: "Accompagnement vétérinaire" };

const WalkerDashboardV3 = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [bookings, setBookings] = useState<BookingRow[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      const [{ data: walkerProfile }, { data: bookingRows }] = await Promise.all([
        (supabase as any).from("walker_profiles").select("verified").eq("user_id", user.id).maybeSingle(),
        (supabase as any).from("bookings").select("id, service_type, scheduled_date, scheduled_time, duration_minutes, address, status, dogs(name)").eq("walker_id", user.id).order("scheduled_date", { ascending: true }).limit(20),
      ]);
      setVerified(Boolean(walkerProfile?.verified));
      setBookings((bookingRows || []) as BookingRow[]);
      setLoading(false);
    };
    void load();
  }, [user]);

  const activeBookings = useMemo(() => bookings.filter((booking) => booking.status === "confirmed" || booking.status === "in_progress"), [bookings]);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Header />
      <main className="container max-w-5xl py-24">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div><p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-primary">Espace Accompagnateur</p><h1 className="text-3xl font-bold md:text-4xl">Vos missions et informations</h1><p className="mt-2 max-w-2xl text-muted-foreground">Cet espace affiche uniquement les réservations qui vous sont réellement attribuées dans DogWalking.</p></div>
          <Button asChild variant="outline"><Link to="/messages">Ouvrir la messagerie</Link></Button>
        </div>
        {loading ? <div className="flex min-h-48 items-center justify-center rounded-2xl border bg-card"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div> : (
          <div className="space-y-6">
            <Card className={verified ? "border-primary/30 bg-primary/5" : "border-amber-400/40 bg-amber-50"}><CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3">{verified ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" /> : <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-700" />}<div><p className="font-semibold">{verified ? "Profil opérationnel" : "Profil en attente de validation"}</p><p className="text-sm text-muted-foreground">{verified ? "Vous pouvez consulter vos missions qui vous sont attribuées." : "Vous ne pouvez pas répondre à une demande ouverte tant qu’une validation administrative n’est pas enregistrée."}</p></div></div><Button asChild size="sm" variant="outline"><Link to="/walker/register">Compléter mon dossier</Link></Button></CardContent></Card>
            <div className="grid gap-4 md:grid-cols-2"><Card><CardHeader className="pb-3"><CardDescription className="flex items-center gap-2"><ClipboardList className="h-4 w-4" /> Missions actives</CardDescription><CardTitle>{activeBookings.length}</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Confirmées ou en cours, sans calcul de revenu ni paiement intégré.</CardContent></Card><Card><CardHeader className="pb-3"><CardDescription className="flex items-center gap-2"><UserRound className="h-4 w-4" /> Disponibilités</CardDescription><CardTitle>À renseigner</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">La gestion de disponibilités n’est pas encore active ; n’acceptez que les missions dont vous pouvez confirmer le créneau.</CardContent></Card></div>
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary" /> Réservations attribuées</CardTitle><CardDescription>Les coordonnées détaillées restent limitées aux participants de la mission.</CardDescription></CardHeader><CardContent>{bookings.length === 0 ? <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground"><Dog className="mx-auto mb-3 h-8 w-8 text-primary/60" />Aucune réservation ne vous est attribuée actuellement.</div> : <div className="space-y-3">{bookings.map((booking) => <div key={booking.id} className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="mb-1 flex flex-wrap items-center gap-2"><span className="font-semibold">{serviceLabel[booking.service_type || ""] || "Prestation"}</span><Badge variant="secondary">{statusLabel[booking.status || ""] || booking.status || "—"}</Badge></div><p className="text-sm text-muted-foreground">{booking.dogs?.name ? `Animal : ${booking.dogs.name} · ` : ""}{booking.scheduled_date ? new Date(booking.scheduled_date).toLocaleDateString("fr-FR") : "Date à confirmer"}{booking.scheduled_time ? ` à ${booking.scheduled_time.slice(0, 5)}` : ""}{booking.duration_minutes ? ` · ${booking.duration_minutes} min` : ""}</p>{booking.address && <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> Zone renseignée pour la mission</p>}</div><Button asChild size="sm" variant="outline"><Link to={`/booking/${booking.id}`}>Voir la mission</Link></Button></div>)}</div>}</CardContent></Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default WalkerDashboardV3;
