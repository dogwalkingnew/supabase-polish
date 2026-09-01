import { useState } from "react";
/* Direction visuelle : project-gem, tableau émeraude/sable, surfaces larges sur desktop et navigation compacte sur mobile. */
import { Home, PawPrint, Briefcase, User } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import OwnerHomeImproved from "@/components/dashboard-v3/OwnerHomeImproved";
import DogsTab from "@/components/dashboard/owner/DogsTab";
import OwnerMissions from "@/components/dashboard-v3/OwnerMissions";
import OwnerProfileComplete from "@/components/dashboard-v3/OwnerProfileComplete";
import { useAuth } from "@/contexts/AuthContext";
import { useOwnerDashboard } from "@/hooks/useOwnerDashboard";
import { supabase } from "@/integrations/supabase/client";

type Tab = "home" | "pets" | "missions" | "profil";

const tabFromSearch = (search: string): Tab => {
  const value = new URLSearchParams(search).get("tab");
  if (value === "chiens" || value === "pets") return "pets";
  if (value === "reservations" || value === "missions") return "missions";
  if (value === "profil") return "profil";
  return "home";
};

const OwnerDashboardV3 = () => {
  const location = useLocation();
  const [tab, setTab] = useState<Tab>(() => tabFromSearch(location.search));
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { data, isLoading } = useOwnerDashboard();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const items: { key: Tab; label: string; icon: any }[] = [
    { key: "home", label: "Accueil", icon: Home },
    { key: "pets", label: "Animaux", icon: PawPrint },
    { key: "missions", label: "Missions", icon: Briefcase },
    { key: "profil", label: "Profil", icon: User },
  ];

  const handleReserve = () => navigate("/walkers");

  const handleTabChange = (nextTab: Tab) => {
    const tabParam = nextTab === "pets" ? "chiens" : nextTab === "missions" ? "reservations" : nextTab === "profil" ? "profil" : "";
    navigate(tabParam ? `${location.pathname}?tab=${tabParam}` : location.pathname);
    setTab(nextTab);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const handleUpdateProfile = async (updated: Record<string, any>) => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: updated.firstName,
        last_name: updated.lastName,
        phone: updated.phone,
        address: updated.address,
        city: updated.city,
        postal_code: updated.postalCode,
        bio: updated.bio,
        ...(updated.preferences ? { notification_preferences: updated.preferences } : {}),
      })
      .eq("id", user.id);
    if (error) toast.error("Impossible d'enregistrer le profil.");
    else {
      toast.success("Profil mis à jour.");
      refreshProfile();
    }
  };

  if (isLoading || !data || !profile) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-warm/70">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  const ownerProfile = {
    id: user?.id ?? "",
    firstName: profile.first_name ?? "",
    lastName: profile.last_name ?? "",
    email: profile.email ?? user?.email ?? "",
    phone: profile.phone ?? "",
    address: profile.address ?? "",
    city: profile.city ?? "",
    postalCode: profile.postal_code ?? "",
    bio: profile.bio ?? "",
    avatar: profile.avatar_url ?? undefined,
    createdAt: profile.created_at ?? "",
  };

  return (
    <div className="min-h-dvh w-full bg-warm/70">
      <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10">
        {tab === "home" && (
          <div className="space-y-6 pb-32">
            <OwnerHomeImproved
              pets={data.pets}
              nextMission={data.nextMission}
              onReserve={handleReserve}
              onViewAllPets={() => handleTabChange("pets")}
              onViewAllMissions={() => handleTabChange("missions")}
              onViewMissionDetails={() => data.nextMission && navigate(`/bookings/${data.nextMission.id}`)}
            />

          </div>
        )}

        {tab === "pets" && (
          <div className="pb-32">
            <DogsTab />
          </div>
        )}

        {tab === "missions" && (
          <div className="pb-32">
            <OwnerMissions
              profiles={data.walkers}
              history={data.history}
            />
          </div>
        )}

        {tab === "profil" && (
          <div className="pb-32">
            <OwnerProfileComplete
              profile={ownerProfile}
              onUpdate={(p) => handleUpdateProfile(p)}
              onLogout={handleLogout}
            />
          </div>
        )}
      </motion.div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-background/95 pb-[env(safe-area-inset-bottom)] shadow-elevated backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-4xl items-center justify-around gap-2 px-1 sm:gap-8">
          {items.map((it) => {
            const Icon = it.icon;
            const active = tab === it.key;
            return (
              <motion.button
                key={it.key}
                onClick={() => handleTabChange(it.key)}
                whileTap={{ scale: 0.9 }}
                whileHover={{ y: -2 }}
                className={`relative flex min-w-[60px] flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-2 transition-all duration-200 ${
                  active ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:bg-muted/60"
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                <span className="text-[10px] font-bold">{it.label}</span>
              </motion.button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default OwnerDashboardV3;
