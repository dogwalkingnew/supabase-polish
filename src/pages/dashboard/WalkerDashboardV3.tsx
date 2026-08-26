import { useState } from "react";
import WalkerHome from "@/components/dashboard-v3/WalkerHome";
import WalkerPlanning from "@/components/dashboard-v3/WalkerPlanning";
import WalkerRevenus from "@/components/dashboard-v3/WalkerRevenus";
import WalkerProfile from "@/components/dashboard-v3/WalkerProfile";
import { Home, CalendarDays, Wallet, User, Settings } from "lucide-react";

type Tab = "home" | "planning" | "revenus" | "profil" | "params";

const WalkerDashboardV3 = () => {
  const [tab, setTab] = useState<Tab>("home");
  const [online, setOnline] = useState(true);

  const items: { key: Tab; label: string; icon: any }[] = [
    { key: "home", label: "Accueil", icon: Home },
    { key: "planning", label: "Planning", icon: CalendarDays },
    { key: "revenus", label: "Revenus", icon: Wallet },
    { key: "profil", label: "Profil", icon: User },
    { key: "params", label: "Paramètres", icon: Settings },
  ];

  return (
    <div className="bg-[#0E1428]">
      {tab === "home" && (
        <WalkerHome
          online={online}
          onToggleOnline={() => setOnline((v) => !v)}
          todayEarnings={48}
          weekEarnings={312}
          missionsCount={4}
          nextMission={{ id: "m1", client: "Sarah L.", pet: "Max - Golden Retriever", address: "Rue St-Denis", time: "10:00", durationMin: 60, price: 12 }}
          reviews={[
            { id: "r1", from: "Camille D.", rating: 5, comment: "Super attentif avec mon chien, je recommande vivement !", date: "12 mai 2024" },
            { id: "r2", from: "Thomas L.", rating: 5, comment: "Toujours à l'heure et très professionnel.", date: "10 mai 2024" },
          ]}
        />
      )}
      {tab === "planning" && (
        <WalkerPlanning
          assigned={[
            { id: "1", client: "Sarah L.", pet: "Max - Golden", address: "Rue St-Denis", time: "10:00", durationMin: 60, price: 12, type: "Promenade", status: "Confirmée" },
            { id: "2", client: "Lucas M.", pet: "Bella - Beagle", address: "Av. Mont-Royal", time: "14:30", durationMin: 45, price: 10, type: "Visite", status: "Confirmée" },
          ]}
          open={[
            { id: "o1", client: "Anonymisé", pet: "Rocky - Border Collie", address: "Plateau", time: "Demain 09:00", durationMin: 60, price: 14, type: "Promenade" },
            { id: "o2", client: "Anonymisé", pet: "Luna - Bouledogue", address: "Outremont", time: "Demain 16:00", durationMin: 90, price: 22, type: "Garde" },
          ]}
        />
      )}
      {tab === "revenus" && (
        <WalkerRevenus
          monthEarnings={1248}
          weekChart={[40, 28, 64, 0, 52, 88, 40]}
          details={[
            { id: "d1", date: "13 mai 2024 · 10:00", client: "Sarah L.", type: "Promenade", amount: 12 },
            { id: "d2", date: "12 mai 2024 · 14:00", client: "Camille D.", type: "Garde", amount: 24 },
            { id: "d3", date: "11 mai 2024 · 09:30", client: "Thomas L.", type: "Visite", amount: 10 },
          ]}
          payouts={[
            { id: "p1", date: "5 mai 2024", amount: 312.50, status: "Versé" },
            { id: "p2", date: "Cette semaine", amount: 168.00, status: "En cours" },
          ]}
        />
      )}
      {tab === "profil" && (
        <WalkerProfile
          name="Julie B."
          bio="Passionnée par les chiens depuis 10 ans, je propose des promenades douces et stimulantes adaptées à chaque animal."
          rating={4.8} reviews={127}
          zone="Montréal · 5 km"
          specialities={["Promenade", "Garde", "Chiens craintifs", "Grands chiens"]}
          badges={[
            { label: "Identité vérifiée", verified: true },
            { label: "Premiers secours", verified: true },
            { label: "Éducateur certifié" },
            { label: "100 missions" },
          ]}
        />
      )}
      {tab === "params" && (
        <div className="min-h-dvh flex items-center justify-center text-white/60 px-4 text-center">
          <p>Onglet « Paramètres » — à brancher sur l'existant.</p>
        </div>
      )}

      {/* BottomNav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0E1428]/95 backdrop-blur-lg border-t border-white/5 z-50 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-lg mx-auto flex items-center justify-around h-16">
          {items.map((it) => {
            const Icon = it.icon;
            const active = tab === it.key;
            return (
              <button key={it.key} onClick={() => setTab(it.key)}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 transition-colors ${active ? "text-[#D4A574]" : "text-white/50"}`}>
                <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
                <span className="text-[10px] font-bold">{it.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default WalkerDashboardV3;
