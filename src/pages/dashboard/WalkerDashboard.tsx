import walkerHero from "@/assets/walker-hero.jpg";
import avatarWalker from "@/assets/avatar-walker.jpg";
import StarRating from "@/components/dashboard-v2/StarRating";
import StatsRow from "@/components/dashboard-v2/StatsRow";
import BadgeGrid from "@/components/dashboard-v2/BadgeGrid";
import BottomNav from "@/components/dashboard-v2/BottomNav";
import DashboardHeader from "@/components/dashboard-v2/DashboardHeader";
import WeatherWidget from "@/components/dashboard-v2/WeatherWidget";
import EarningsCard from "@/components/dashboard-v2/EarningsCard";
import AvailabilityToggle from "@/components/dashboard-v2/AvailabilityToggle";
import ActiveMissionCard from "@/components/dashboard-v2/ActiveMissionCard";
import QuickActions from "@/components/dashboard-v2/QuickActions";
import UpcomingBookings from "@/components/dashboard-v2/UpcomingBookings";
import MissionStats from "@/components/dashboard-v2/MissionStats";
import PlanningCalendar from "@/components/dashboard-v2/PlanningCalendar";
import ProfileTab from "@/components/dashboard-v2/tabs/ProfileTab";
import BookingsTab from "@/components/dashboard-v2/tabs/BookingsTab";
import EarningsTab from "@/components/dashboard-v2/tabs/EarningsTab";
import ReviewsTab from "@/components/dashboard-v2/tabs/ReviewsTab";
import MessagesTab from "@/components/dashboard-v2/tabs/MessagesTab";
import FreeMissionsTab from "@/components/dashboard-v2/tabs/FreeMissionsTab";
import WalkerTrainingTab from "@/components/dashboard/walker/TrainingTab";
import WalkerInvoicesTab from "@/components/dashboard/walker/InvoicesTab";
import WalkerAvailabilityTab from "@/components/dashboard/walker/AvailabilityTab";
import { SEOHead } from "@/components/seo/SEOHead";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useWalkerProfile } from "@/hooks/useProfile";
import { useEarnings } from "@/hooks/useEarnings";
import { useBookings } from "@/hooks/useNewBookings";
import { useSearchParams } from "react-router-dom";
import { mockWalkerProfile, mockProfile, mockBookings, mockEarnings, mockUpcomingBookings } from "@/data/demoData";

const WalkerDashboard = () => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "home";
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { data: walkerProfile } = useWalkerProfile(user?.id);
  const { data: earnings } = useEarnings();
  const { data: realBookings = [] } = useBookings("walker");

  const isDemo = !user;
  const displayProfile = isDemo ? mockProfile : profile;
  const displayWalkerProfile = isDemo ? mockWalkerProfile : walkerProfile;
  const displayEarnings = isDemo ? mockEarnings : (earnings || { today: 0, week: 0, month: 0, trend: 0 });
  const bookings = isDemo ? mockBookings : realBookings;

  const displayName = displayProfile?.first_name || "Accompagnateur";
  const activeMission = isDemo ? null : bookings.find((b: any) => b.status === "in_progress");

  const activeMissionData = activeMission ? {
    id: (activeMission as any).id,
    dogName: (activeMission as any).dogs?.name || "Chien",
    dogPhoto: (activeMission as any).dogs?.photo_url || undefined,
    ownerName: "Propriétaire",
    duration: (activeMission as any).duration_minutes || 30,
    status: "in_progress",
  } : null;

  const upcomingBookings = isDemo
    ? mockUpcomingBookings
    : bookings
        .filter((b: any) => b.status === "confirmed" || b.status === "pending")
        .slice(0, 3)
        .map((b: any) => ({
          id: b.id,
          dogName: b.dogs?.name || "Chien",
          date: b.scheduled_date,
          time: b.scheduled_time,
          duration: `${b.duration_minutes || 30} min`,
          status: (b.status === "confirmed" ? "confirmée" : "en_attente") as "confirmée" | "en_attente",
        }));

  const mockScheduledMissions: any[] = bookings.map((b: any) => ({
    date: b.scheduled_date,
    time: b.scheduled_time,
    dogName: b.dogs?.name || "Chien",
    duration: b.duration_minutes || 30,
    status: b.status === "confirmed" ? "confirmed" : "pending"
  }));

  // Tab content rendering
  if (activeTab === "profil") return (<div className="min-h-dvh bg-background max-w-lg mx-auto"><ProfileTab role="walker" /><BottomNav role="walker" activeMission={activeMissionData} /></div>);
  if (activeTab === "missions" || activeTab === "reservations") return (<div className="min-h-dvh bg-background max-w-lg mx-auto"><BookingsTab role="walker" /><BottomNav role="walker" activeMission={activeMissionData} /></div>);
  if (activeTab === "gains") return (<div className="min-h-dvh bg-background max-w-lg mx-auto"><EarningsTab /><BottomNav role="walker" activeMission={activeMissionData} /></div>);
  if (activeTab === "avis") return (<div className="min-h-dvh bg-background max-w-lg mx-auto"><ReviewsTab /><BottomNav role="walker" activeMission={activeMissionData} /></div>);
  if (activeTab === "messages") return (<div className="min-h-dvh bg-background max-w-lg mx-auto"><MessagesTab /><BottomNav role="walker" activeMission={activeMissionData} /></div>);
  if (activeTab === "formation") return (<div className="min-h-dvh bg-background max-w-lg mx-auto"><WalkerTrainingTab /><BottomNav role="walker" activeMission={activeMissionData} /></div>);
  if (activeTab === "factures") return (<div className="min-h-dvh bg-background max-w-lg mx-auto"><WalkerInvoicesTab /><BottomNav role="walker" activeMission={activeMissionData} /></div>);
  if (activeTab === "disponibilite") return (<div className="min-h-dvh bg-background max-w-lg mx-auto p-4"><WalkerAvailabilityTab walkerProfile={displayWalkerProfile} /><BottomNav role="walker" activeMission={activeMissionData} /></div>);
  if (activeTab === "libres") return (<div className="min-h-dvh bg-background max-w-lg mx-auto"><FreeMissionsTab /><BottomNav role="walker" activeMission={activeMissionData} /></div>);

  return (
    <div className="min-h-dvh bg-background pb-24 w-full">
      <SEOHead title="Mon Espace Accompagnateur | DogWalking" description="Gérez vos missions, vos gains et vos disponibilités depuis votre tableau de bord Accompagnateur Certifié DogWalking." canonical="https://dogwalking.fr/walker/dashboard" noindex={true} />
      {isDemo && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center">
          <span className="text-xs font-bold text-amber-600">🎭 Mode Démo — Connectez-vous pour vos vraies données</span>
        </div>
      )}

      <div className="relative">
        <DashboardHeader title="🐾 Espace Accompagnateur" role="walker" notificationCount={bookings.filter((b: any) => b.status === "pending").length} />
        <div className="w-full h-60 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(160,84%,25%)] to-[hsl(180,60%,30%)]" />
          <img src={walkerHero} alt="Accompagnateur avec chiens" className="w-full h-full object-cover opacity-30" width={800} height={512} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl shadow-elevated p-4 flex items-center gap-4">
            <div className="relative">
              <img src={displayProfile?.avatar_url || avatarWalker} alt={displayName} className="w-16 h-16 rounded-full object-cover ring-4 ring-primary/20" />
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary border-2 border-card flex items-center justify-center shadow-sm">
                <span className="text-[8px] text-white">⭐</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black text-foreground">{displayName}</h1>
              <div className="flex items-center gap-2">
                <StarRating rating={displayWalkerProfile?.rating || 5} />
                <span className="text-xs font-bold text-muted-foreground">({displayWalkerProfile?.total_reviews || 0} avis)</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-4 mt-14 space-y-4">
        <AvailabilityToggle />

        <QuickActions role="walker" notifications={{ bookings: bookings.filter((b: any) => b.status === "pending").length }} />

        {activeMissionData && (
          <ActiveMissionCard
            dogName={activeMissionData.dogName}
            ownerName={activeMissionData.ownerName}
            startTime={(activeMissionData as any).startTime || "—"}
            location={(activeMissionData as any).location || "—"}
            status={activeMissionData.status === "in_progress" ? "en_cours" : activeMissionData.status === "completed" ? "terminée" : "en_route"}
          />
        )}

        <EarningsCard
          today={displayEarnings.today}
          week={displayEarnings.week}
          month={displayEarnings.month}
          trend={displayEarnings.trend}
        />

        <MissionStats
          thisMonth={bookings.filter((b: any) => b.status === "completed" && new Date(b.scheduled_date).getMonth() === new Date().getMonth()).length || 12}
          thisWeek={bookings.filter((b: any) => b.status === "completed" && new Date(b.scheduled_date) >= new Date(Date.now() - 7 * 86400000)).length || 4}
          completed={bookings.filter((b: any) => b.status === "completed").length || 156}
          pending={bookings.filter((b: any) => b.status === "pending").length || 3}
          trend={12}
        />

        <PlanningCalendar missions={mockScheduledMissions} />

        <WeatherWidget />

        <UpcomingBookings bookings={upcomingBookings} />

        <div className="space-y-3">
          <h3 className="font-bold text-foreground px-1">🏆 Mes Badges</h3>
          <BadgeGrid />
        </div>
      </div>
      <BottomNav role="walker" activeMission={activeMissionData} />
    </div>
  );
};

export default WalkerDashboard;
