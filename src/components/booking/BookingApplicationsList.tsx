import { useEffect, useState } from "react";
/** DogWalking — candidatures ouvertes : aucune décision client non atomique après révocation des anciens RPC. */
import { User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  bookingId: string;
  ownerId: string;
  onAssigned?: () => void;
}

const BookingApplicationsList = ({ bookingId, ownerId, onAssigned }: Props) => {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    const { data, error } = await (supabase as any)
      .from("booking_applications")
      .select("*, profiles!booking_applications_walker_id_fkey(first_name, last_name, avatar_url)")
      .eq("booking_id", bookingId)
      .eq("status", "pending")
      .order("created_at", { ascending: true });
    if (!error) setApps(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchApps();
    const ch = supabase
      .channel(`booking-apps-${bookingId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "booking_applications", filter: `booking_id=eq.${bookingId}` }, fetchApps)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  if (loading || apps.length === 0) return null;

  return (
    <div className="mt-3 p-3 rounded-2xl bg-primary/5 border border-primary/10 space-y-2">
      <p className="text-xs font-bold text-primary flex items-center gap-1">
        <User className="w-3 h-3" /> {apps.length} candidature{apps.length > 1 ? "s" : ""} reçue{apps.length > 1 ? "s" : ""}
      </p>
      <p className="text-xs text-muted-foreground">La sélection d’une candidature ouverte est temporairement indisponible dans cette version, afin d’éviter une attribution partielle ou non contrôlée.</p>
      {apps.map((app) => (
        <div key={app.id} className="flex items-center gap-2 bg-card rounded-xl p-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
            {app.profiles?.first_name?.[0] || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate">
              {app.profiles?.first_name || "Accompagnateur"} {app.profiles?.last_name || ""}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingApplicationsList;
