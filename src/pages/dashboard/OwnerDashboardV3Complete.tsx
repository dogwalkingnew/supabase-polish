// @ts-nocheck
import { useState } from "react";
import { Home, PawPrint, Briefcase, Receipt, User, AlertCircle, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import OwnerHomeImproved from "@/components/dashboard-v3/OwnerHomeImproved";
import OwnerPets from "@/components/dashboard-v3/OwnerPets";
import OwnerMissions from "@/components/dashboard-v3/OwnerMissions";
import OwnerBilling from "@/components/dashboard-v3/OwnerBilling";
import OwnerProfileComplete from "@/components/dashboard-v3/OwnerProfileComplete";
import MissionLiveTracking from "@/components/dashboard-v3/MissionLiveTracking";
import OwnerAlertsAndRecommendations from "@/components/dashboard-v3/OwnerAlertsAndRecommendations";
import dogGolden from "@/assets/dog-golden.jpg";
import dogBeagle from "@/assets/dog-beagle.jpg";

type Tab = "home" | "pets" | "missions" | "billing" | "profil";

// Mock data
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

const mockProfile = {
  id: "owner-1",
  firstName: "Jean",
  lastName: "Dupont",
  email: "jean.dupont@email.com",
  phone: "+33 6 12 34 56 78",
  address: "123 Rue de la Paix",
  city: "Paris",
  postalCode: "75001",
  bio: "Propriétaire de deux chiens adorables",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  verificationStatus: "verified" as const,
  createdAt: "2024-01-15",
  preferences: {
    notifications: true,
    emailUpdates: true,
    smsAlerts: false,
    newsletter: true,
  },
  documents: [
    {
      id: "doc1",
      name: "Pièce d'identité",
      type: "ID",
      uploadedAt: "2024-01-15",
      status: "approved" as const,
    },
    {
      id: "doc2",
      name: "Preuve d'adresse",
      type: "Facture",
      uploadedAt: "2024-01-15",
      status: "approved" as const,
    },
  ],
};

const mockAlerts = [
  {
    id: "alert1",
    type: "warning" as const,
    title: "Vaccin Rage à renouveler",
    description: "Le vaccin rage de Bella expire dans 3 mois. Pensez à prendre rendez-vous chez le vétérinaire.",
    action: "Prendre RDV",
    timestamp: "Aujourd'hui à 10:30",
  },
  {
    id: "alert2",
    type: "info" as const,
    title: "Météo pluvieuse cette semaine",
    description: "Pensez à préparer des vêtements imperméables pour les promenades.",
    action: "Voir la météo",
    timestamp: "Aujourd'hui à 08:00",
  },
];

const mockRecommendations = [
  {
    id: "rec1",
    icon: Lightbulb,
    title: "Augmentez les promenades",
    description: "Max a besoin de plus d'exercice selon ses données. Augmentez à 2x par jour.",
    benefit: "+30% d'énergie dépensée",
    action: "Voir les détails",
  },
  {
    id: "rec2",
    icon: AlertCircle,
    title: "Visite vétérinaire recommandée",
    description: "Bella n'a pas eu de visite depuis 6 mois. Un check-up est recommandé.",
    benefit: "Santé optimale",
    action: "Prendre RDV",
  },
];

const OwnerDashboardV3Complete = () => {
  const [tab, setTab] = useState<Tab>("home");
  const [showLiveTracking, setShowLiveTracking] = useState(false);

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
    setShowLiveTracking(true);
  };

  const handleEmergency = () => {
    console.log("Contacter urgence vétérinaire");
  };

  return (
    <div className="bg-[#F9F7F4]">
      {/* Live Tracking Modal */}
      <MissionLiveTracking
        missionId="mission-1"
        walkerName="Sarah L."
        walkerPhone="+33 6 98 76 54 32"
        walkerPhoto="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
        petName="Max"
        estimatedEndTime="11:30"
        isActive={showLiveTracking}
        onClose={() => setShowLiveTracking(false)}
      />

      <motion.div
        key={tab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {tab === "home" && (
          <div className="space-y-6 pb-32">
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

            <div className="px-4 max-w-lg mx-auto">
              <OwnerAlertsAndRecommendations
                alerts={mockAlerts}
                recommendations={mockRecommendations}
              />
            </div>
          </div>
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
          <OwnerProfileComplete
            profile={mockProfile}
            onUpdate={(updatedProfile) => console.log("Profil mis à jour:", updatedProfile)}
            onLogout={() => console.log("Déconnexion")}
          />
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

export default OwnerDashboardV3Complete;