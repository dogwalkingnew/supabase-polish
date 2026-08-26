import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, UserCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const WalkerApplicationsTab = () => {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("walker_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Table walker_applications absente — exécutez la migration");
      setApps([]);
    } else {
      setApps(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchApps(); }, []);

  const handleApprove = async (app: any) => {
    try {
      // 1. Crée le walker_profile vérifié
      const { error: e1 } = await (supabase as any).from("walker_profiles").upsert({
        user_id: app.user_id,
        bio: app.bio || "",
        experience_years: app.experience_years || 0,
        services: app.services || [],
        hourly_rate: app.hourly_rate || 15,
        verified: true,
      });
      if (e1) throw e1;
      // 2. Met à jour le user_type
      await supabase.from("profiles").update({ user_type: "walker" }).eq("id", app.user_id);
      // 3. Marque la candidature
      await (supabase as any).from("walker_applications")
        .update({ status: "approved", reviewed_at: new Date().toISOString() })
        .eq("id", app.id);
      // 4. Notif candidat
      await (supabase as any).from("notifications").insert({
        user_id: app.user_id,
        title: "🎉 Candidature acceptée",
        message: "Votre profil Accompagnateur est validé. Vous pouvez maintenant recevoir des missions.",
        type: "system",
      });
      toast.success("Candidature approuvée");
      fetchApps();
    } catch (e: any) {
      toast.error(e.message || "Erreur");
    }
  };

  const handleReject = async (app: any) => {
    const reason = window.prompt("Motif de refus :");
    if (!reason?.trim()) return;
    await (supabase as any).from("walker_applications")
      .update({ status: "rejected", rejection_reason: reason, reviewed_at: new Date().toISOString() })
      .eq("id", app.id);
    await (supabase as any).from("notifications").insert({
      user_id: app.user_id,
      title: "❌ Candidature refusée",
      message: `Motif : ${reason}`,
      type: "system",
    });
    toast.success("Candidature refusée");
    fetchApps();
  };

  const pending = apps.filter(a => a.status === "pending");

  return (
    <Card className="border-2 rounded-3xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-primary" />
          Candidatures Accompagnateurs ({pending.length} en attente)
        </CardTitle>
        <CardDescription>Validez ou refusez les candidatures pour devenir Accompagnateur.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-32 bg-muted rounded animate-pulse" />
        ) : apps.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
            <p className="font-semibold">Aucune candidature</p>
          </div>
        ) : (
          <div className="space-y-3">
            {apps.map((app) => (
              <div key={app.id} className="p-4 rounded-2xl border-2 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{app.first_name} {app.last_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {app.city || "—"} · {app.experience_years || 0} an(s) d'expérience · {new Date(app.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <Badge variant={
                    app.status === "approved" ? "default" :
                    app.status === "rejected" ? "destructive" : "outline"
                  }>
                    {app.status}
                  </Badge>
                </div>
                {app.bio && <p className="text-sm text-muted-foreground italic">"{app.bio}"</p>}
                {app.status === "pending" && (
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" onClick={() => handleApprove(app)}>
                      <CheckCircle className="h-4 w-4 mr-1" /> Approuver
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleReject(app)}>
                      <XCircle className="h-4 w-4 mr-1" /> Refuser
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WalkerApplicationsTab;
