// @ts-nocheck
import { useState } from "react";
import OwnerHomeImproved from "@/components/dashboard-v3/OwnerHomeImproved";
import OwnerPets from "@/components/dashboard-v3/OwnerPets";
import OwnerMissions from "@/components/dashboard-v3/OwnerMissions";
import OwnerBilling from "@/components/dashboard-v3/OwnerBilling";
import { Home, PawPrint, Briefcase, Receipt, User } from "lucide-react";
import { motion } from "framer-motion";
import dogGolden from "@/assets/dog-golden.jpg";
import dogBeagle from "@/assets/dog-beagle.jpg";

type Tab = "home" | "pets" | "missions" | "billing" | "profil";

const mockPets = [
  {
    id: "1",
    name: "Max",
    breed: "Golden Retriever",
    ageYears: 4,
    weightKg: 32,
    photo: dogGolden,
    sex: "Mâle",
    birthdate: "15/03/2021",
    vaccines: [
      { label: "Rage", date: "15/03/2025", status: "ok" as const },
      { label: "Leptospirose", date: "15/03/2025", status: "ok" as const },
      { label: "Vermifuge", date: "20/06/2025", status: "soon" as const, note: "Dans 3 jours" },
    ],
    treatments: [],
    visits: [],
  },
  {
    id: "2",
    name: "Bella",
    breed: "Beagle",
    ageYears: 3,
    weightKg: 14,
    photo: dogBeagle,
    sex: "Femelle",
    birthdate: "02/07/2022",
    vaccines: [{ label: "Rage", date: "10/01/2025", status: "ok" as const }],
    treatments: [],
    visits: [],
  },
];

const mockWalkers = [
  {
    id: "w1",
    name: "Julie B.",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    rating: 4.8,
    reviews: 127,
    services: ["Promenade", "Garde"],
    distanceKm: 2.1,
    pricePerHour: 12,
  },
  {
    id: "w2",
    name: "Lucas R.",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    rating: 4.8,
    reviews: 127,
    services: ["Promenade", "Garde"],
    distanceKm: 3.0,
    pricePerHour: 12,
  },
  {
    id: "w3",
    name: "Sophie M.",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    rating: 4.8,
    reviews: 127,
    services: ["Promenade", "Garde"],
    distanceKm: 3.2,
    pricePerHour: 12,
  },
  {
    id: "w4",
    name: "Thomas L.",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    rating: 4.9,
    reviews: 84,
    services: ["Visite"],
    distanceKm: 1.8,
    pricePerHour: 14,
  },
];

const OwnerDashboardV3Improved = () => {
  const [tab, setTab] = useState<Tab>("home");

  const items: { key: Tab; label: string; icon: any }[] = [
    { key: "home", label: "Accueil", icon: Home },
    { key: "pets", label: "Animaux", icon: PawPrint },
    { key: "missions", label: "Missions", icon: Briefcase },
    { key: "billing", label: "Facturation", icon: Receipt },
    { key: "profil", label: "Profil", icon: User },
  ];

  const handleReserve = () => {
    console.log("Réserver un service");
  };

  const handleTracking = () => {
    console.log("Démarrer le suivi GPS");
  };

  const handleEmergency = () => {
    console.log("Contacter urgence vétérinaire");
  };

  return (
    <div className="bg-[#F9F7F4]">
      <motion.div
        key={tab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {tab === "home" && (
          <OwnerHomeImproved
            pets={mockPets}
            nextMission={{
              date: "Demain, 14 mai 2024",
              time: "10:00",
              address: "123 Rue Saint-Denis",
              city: "Montréal, QC H2X 3K5",
              walkerName: "Sarah L.",
              walkerRole: "Promeneuse",
              status: "Confirmée",
              gpsTracking: true,
              estimatedDuration: 45,
              estimatedPrice: 12,
            }}
            onReserve={handleReserve}
            onStartTracking={handleTracking}
            onEmergency={handleEmergency}
          />
        )}
        {tab === "pets" && <OwnerPets pets={mockPets as any} />}
        {tab === "missions" && (
          <OwnerMissions
            favorites={[
              { ...mockWalkers[0], name: "Camille D.", favorite: true },
              { ...mockWalkers[3], favorite: true },
            ]}
            available={mockWalkers}
            history={[
              {
                id: "h1",
                title: "Promenade",
                walkerName: "Julie B.",
                date: "12 mai 2024 à 14:00",
                price: 12,
                status: "Terminée",
              },
            ]}
          />
        )}
        {tab === "billing" && (
          <OwnerBilling
            pets={mockPets.map((p) => ({
              id: p.id,
              name: p.name,
              photo: p.photo,
              promenade: 12,
              garde: 24,
              visite: 10,
            }))}
            invoices={[
              { id: "i1", ref: "FAC-2024-0512", date: "12 mai 2024", total: 15.12, status: "Payée" },
              { id: "i2", ref: "FAC-2024-0508", date: "8 mai 2024", total: 30.24, status: "Payée" },
              { id: "i3", ref: "FAC-2024-0501", date: "1 mai 2024", total: 12.6, status: "En attente" },
            ] as any}
          />
        )}
        {tab === "profil" && (
          <div className="min-h-dvh flex items-center justify-center text-[#8A8A99] px-4 text-center pb-32">
            <p>Onglet « {items.find((i) => i.key === tab)?.label} » — à brancher sur l'existant.</p>
          </div>
        )}
      </motion.div>

      {/* BottomNav v3 améliorée */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-[#EFEAE0] z-50 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-lg mx-auto flex items-center justify-around h-16">
          {items.map((it) => {
            const Icon = it.icon;
            const active = tab === it.key;
            return (
              <motion.button
                key={it.key}
                onClick={() => setTab(it.key)}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 transition-colors ${
                  active ? "text-[#1E7B5F]" : "text-[#8A8A99]"
                }`}
              >
                <motion.div
                  animate={{ scale: active ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
                </motion.div>
                <span className="text-[10px] font-bold">{it.label}</span>
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="h-1 w-6 bg-[#1E7B5F] rounded-full mt-0.5"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default OwnerDashboardV3Improved;