import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const PLACEHOLDER_DOG = "/placeholder.svg";
const PLACEHOLDER_AVATAR = "/placeholder.svg";

const SERVICE_LABELS: Record<string, string> = {
  promenade: "Promenade",
  garde: "Garde",
  visite: "Visite",
  veterinaire: "Vétérinaire",
};

export interface OwnerDashboardData {
  pets: {
    id: string;
    name: string;
    breed: string;
    photo: string;
    ageYears: number;
    weightKg: number;
    vaccinesHistory: never[];
    treatmentsHistory: never[];
    lastVetVisit?: string;
    allergies: string[];
  }[];
  nextMission: {
    id: string;
    date: string;
    time: string;
    address: string;
    city: string;
    walkerName: string;
    walkerPhoto?: string;
    walkerRole: string;
    status: "Confirmée" | "En attente";
    gpsTracking: boolean;
    estimatedDuration?: number;
    estimatedPrice?: number;
    validationCode?: string | null;
  } | null;
  activeMission: {
    id: string;
    walkerName: string;
    walkerPhone?: string;
    walkerPhoto?: string;
    petName: string;
    estimatedEndTime?: string;
  } | null;
  walkers: {
    id: string;
    name: string;
    photo: string;
    rating: number;
    reviews: number;
    services: string[];
    distanceKm: number;
    pricePerHour: number;
    favorite?: boolean;
  }[];
  history: {
    id: string;
    title: string;
    walkerName: string;
    date: string;
    price: number;
    status: "Terminée" | "Annulée";
  }[];
  invoices: {
    id: string;
    ref: string;
    date: string;
    total: number;
    status: "Utilisé" | "En attente";
  }[];
  walletBalance: number;
  walletCurrency: string;
  unreadNotifications: number;
}

export const useOwnerDashboard = () => {
  const { user, profile } = useAuth();

  return useQuery({
    queryKey: ["owner-dashboard", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<OwnerDashboardData> => {
      const uid = user!.id;

      const [dogsRes, bookingsRes, favsRes, walkerProfilesRes, notifRes] = await Promise.all([
        supabase.from("dogs").select("*").eq("owner_id", uid).order("created_at"),
        supabase
          .from("bookings")
          .select("*, dogs(name, photo_url)")
          .eq("owner_id", uid)
          .order("scheduled_date", { ascending: false }),
        supabase.from("favorites").select("walker_id").eq("user_id", uid),
        supabase
          .from("walker_profiles")
          .select("user_id, hourly_rate, rating, total_reviews, services, verified, service_radius_km")
          .eq("verified", true),
        supabase.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", uid).eq("read", false),
      ]);

      const favIds = new Set((favsRes.data ?? []).map((f) => f.walker_id));
      const walkerProfileIds = new Set([
        ...(bookingsRes.data ?? []).flatMap((booking) => (booking.walker_id ? [booking.walker_id] : [])),
        ...(walkerProfilesRes.data ?? []).map((walker) => walker.user_id),
      ]);
      const walkerProfilesResponse =
        walkerProfileIds.size > 0
          ? await supabase
              .from("profiles")
              .select("id, first_name, last_name, avatar_url, phone")
              .in("id", [...walkerProfileIds])
          : { data: [] };
      const walkerProfiles = walkerProfilesResponse.data ?? [];
      const walkerById = new Map(walkerProfiles.map((walker) => [walker.id, walker]));
      const formatWalkerName = (walkerId: string | null, fallback: string) => {
        const walker = walkerId ? walkerById.get(walkerId) : undefined;
        const name = `${walker?.first_name ?? ""} ${(walker?.last_name ?? "").slice(0, 1)}.`.trim();
        return name || fallback;
      };

      const pets = (dogsRes.data ?? []).map((d) => ({
        id: d.id,
        name: d.name,
        breed: d.breed ?? "—",
        photo: d.photo_url ?? PLACEHOLDER_DOG,
        ageYears: d.age ?? 0,
        weightKg: d.weight ?? 0,
        vaccinesHistory: [] as never[],
        treatmentsHistory: [] as never[],
        allergies: d.special_needs ? [d.special_needs] : [],
      }));

      const bookings = bookingsRes.data ?? [];
      const today = new Date().toISOString().slice(0, 10);

      const upcoming = bookings
        .filter((b) => (b.status === "confirmed" || b.status === "pending") && b.scheduled_date >= today)
        .sort((a, b) => (a.scheduled_date + (a.scheduled_time ?? "")).localeCompare(b.scheduled_date + (b.scheduled_time ?? "")))[0];

      const inProgress = bookings.find((b) => b.status === "in_progress");

      const upcomingWalker = upcoming?.walker_id ? walkerById.get(upcoming.walker_id) : undefined;
      const nextMission = upcoming
        ? {
            id: upcoming.id,
            date: new Date(upcoming.scheduled_date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
            time: (upcoming.scheduled_time ?? "").slice(0, 5),
            address: upcoming.address ?? "Adresse à confirmer",
            city: upcoming.city ?? "",
            walkerName: formatWalkerName(upcoming.walker_id, "En attente d'attribution"),
            walkerPhoto: upcomingWalker?.avatar_url ?? undefined,
            walkerRole: "Accompagnateur",
            status: upcoming.status === "confirmed" ? ("Confirmée" as const) : ("En attente" as const),
            gpsTracking: true,
            estimatedDuration: upcoming.duration_minutes ?? undefined,
            estimatedPrice: upcoming.price ?? undefined,
            validationCode: upcoming.validation_code,
          }
        : null;

      const inProgressWalker = inProgress?.walker_id ? walkerById.get(inProgress.walker_id) : undefined;
      const activeMission = inProgress
        ? {
            id: inProgress.id,
            walkerName: formatWalkerName(inProgress.walker_id, "Accompagnateur"),
            walkerPhone: inProgressWalker?.phone ?? undefined,
            walkerPhoto: inProgressWalker?.avatar_url ?? undefined,
            petName: inProgress.dogs?.name ?? "Votre chien",
          }
        : null;

      const walkers = (walkerProfilesRes.data ?? []).map((w) => {
        const walker = walkerById.get(w.user_id);
        return {
        id: w.user_id,
        name: formatWalkerName(w.user_id, "Accompagnateur"),
        photo: walker?.avatar_url ?? PLACEHOLDER_AVATAR,
        rating: w.rating ?? 0,
        reviews: w.total_reviews ?? 0,
        services: (w.services ?? []).map((s) => SERVICE_LABELS[s] ?? s),
        distanceKm: w.service_radius_km ?? 0,
        pricePerHour: w.hourly_rate ?? 0,
        favorite: favIds.has(w.user_id),
      };
      });

      const past = bookings.filter((b) => b.status === "completed" || b.status === "cancelled");
      const history = past.map((b) => ({
        id: b.id,
        title: SERVICE_LABELS[b.service_type] ?? b.service_type,
        walkerName: formatWalkerName(b.walker_id, "—"),
        date: `${new Date(b.scheduled_date).toLocaleDateString("fr-FR")} à ${(b.scheduled_time ?? "").slice(0, 5)}`,
        price: b.price ?? 0,
        status: b.status === "completed" ? ("Terminée" as const) : ("Annulée" as const),
      }));

      const invoices = bookings
        .filter((b) => b.price != null && b.payment_status)
        .map((b) => ({
          id: b.id,
          ref: `DOG-${b.scheduled_date.replaceAll("-", "")}-${b.id.slice(0, 4).toUpperCase()}`,
          date: new Date(b.scheduled_date).toLocaleDateString("fr-FR"),
          total: Number(b.price ?? 0) * 1.05,
          status: b.payment_status === "released" || b.payment_status === "held" ? ("Utilisé" as const) : ("En attente" as const),
        }));

      return {
        pets,
        nextMission,
        activeMission,
        walkers,
        history,
        invoices,
        walletBalance: profile?.wallet_balance ?? 0,
        walletCurrency: profile?.wallet_currency ?? "EUR",
        unreadNotifications: notifRes.count ?? 0,
      };
    },
  });
};
