import { useState, useEffect } from "react";
import { Header } from "@/components/ui/header";
import { SEOHead } from "@/components/seo/SEOHead";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, Dog, Calendar, Euro, Shield, Scale, AlertTriangle,
  BarChart3, Activity, CheckCircle, XCircle, Clock, FileCheck, FileX, Eye, Lock, Camera, Search,
  ShieldCheck, ShieldAlert
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import AdminMetrics from "@/components/dashboard-v2/AdminMetrics";
import SelectionFlowChart from "@/components/dashboard-v2/SelectionFlowChart";
import DisputeTracker from "@/components/dashboard-v2/DisputeTracker";
import WalkerApplicationsTab from "@/components/admin/WalkerApplicationsTab";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOwners: 0,
    totalWalkers: 0,
    activeWalkers: 0,
    pendingWalkers: 0,
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    activeBookings: 0,
    cancelledBookings: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [pendingDocuments, setPendingDocuments] = useState<any[]>([]);
  const [openDisputes, setOpenDisputes] = useState<any[]>([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'admin')
      .single();

    if (!roles) {
      toast.error("Accès réservé aux administrateurs");
      navigate('/dashboard');
      return;
    }

    fetchAdminStats();
  };

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      // Fetch Profiles
      const { data: profilesData, error: profilesError } = await supabase.from('profiles').select('user_type');
      const owners = profilesData?.filter(p => p.user_type === 'owner').length || 0;
      const walkers = profilesData?.filter(p => p.user_type === 'walker').length || 0;

      // Fetch Walker Profiles
      const { data: walkerProfiles, error: walkerProfilesError } = await supabase.from('walker_profiles').select('verified');
      const activeWalkers = walkerProfiles?.filter(w => w.verified).length || 0;
      const pendingWalkers = walkerProfiles?.filter(w => !w.verified).length || 0;

      // Bookings stats
      const { data: bookingsData, error: bookingsError } = await supabase.from('bookings').select('status, price, created_at');
      const completed = bookingsData?.filter(b => b.status === 'completed') || [];
      const active = bookingsData?.filter(b => b.status === 'confirmed' || b.status === 'in_progress') || [];

      // Recent bookings
      const { data: recentBookingsData, error: recentBookingsError } = await supabase
        .from('bookings')
        .select('*, dogs(name)')
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentBookings(recentBookingsData || []);

      // Recent users
      const { data: recentUsersData, error: recentUsersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentUsers(recentUsersData || []);

      // Pending documents
      const { data: docsData, error: docsError } = await supabase
        .from('walker_documents')
        .select('*')
        .eq('verification_status', 'pending');
      setPendingDocuments(docsData || []);

      // Open disputes
      const { data: disputesData, error: disputesError } = await supabase
        .from('disputes')
        .select('*')
        .eq('status', 'open');
      setOpenDisputes(disputesData || []);

      const firstError = [
        profilesError,
        walkerProfilesError,
        bookingsError,
        recentBookingsError,
        recentUsersError,
        docsError,
        disputesError,
      ].find(Boolean);
      if (firstError) throw firstError;

      setStats({
        totalUsers: profilesData?.length || 0,
        totalOwners: owners,
        totalWalkers: walkers,
        activeWalkers,
        pendingWalkers,
        totalBookings: bookingsData?.length || 0,
        completedBookings: completed.length,
        pendingBookings: bookingsData?.filter(b => b.status === 'pending').length || 0,
        activeBookings: active.length,
        cancelledBookings: bookingsData?.filter(b => b.status === 'cancelled').length || 0
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setErrorMessage("Les données d’administration ne sont pas disponibles pour le moment. Aucune statistique n’est affichée afin d’éviter toute information erronée.");
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const { data: bookings } = await supabase
        .from('bookings')
        .select('id, status, price, created_at, walker_id, owner_id')
        .order('created_at', { ascending: false });
      const rows = [
        ['id', 'status', 'price', 'created_at', 'walker_id', 'owner_id'],
        ...(bookings || []).map((b: any) => [b.id, b.status, b.price, b.created_at, b.walker_id, b.owner_id]),
      ];
      const csv = rows.map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dogwalking-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Export CSV téléchargé");
    } catch (e: any) {
      toast.error(e.message || "Échec export");
    }
  };

  const handleGenerateReport = () => {
    const report = `RAPPORT DOGWALKING - ${new Date().toLocaleDateString('fr-FR')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UTILISATEURS
  Total          : ${stats.totalUsers}
  Propriétaires  : ${stats.totalOwners}
  Accompagnateurs: ${stats.totalWalkers} (${stats.activeWalkers} vérifiés, ${stats.pendingWalkers} en attente)

RÉSERVATIONS
  Total      : ${stats.totalBookings}
  Complétées : ${stats.completedBookings}
  En attente : ${stats.pendingBookings}
  Annulées   : ${stats.cancelledBookings}
LITIGES OUVERTS    : ${openDisputes.length}
DOCUMENTS EN ATTENTE: ${pendingDocuments.length}
`;
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-dogwalking-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Rapport généré");
  };

  if (loading) {
    return (
      <div className="min-h-dvh bg-background">
        <Header />
        <main className="container mx-auto px-4 py-24">
          <div className="h-64 bg-muted rounded animate-pulse" />
        </main>
        <Footer />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-dvh bg-background">
        <Header />
        <main className="container mx-auto max-w-3xl px-4 py-28">
          <Card className="border-destructive/30 bg-destructive/5">
            <CardHeader>
              <CardTitle>Impossible de charger le tableau de bord</CardTitle>
              <CardDescription>{errorMessage}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={fetchAdminStats}>Réessayer</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background">
      <SEOHead
        title="Dashboard Administrateur | DogWalking"
        description="Gestion administrative de la plateforme DogWalking"
      />
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
<div className="dashboard-gradient relative flex flex-col gap-5 overflow-hidden rounded-3xl p-6 text-white shadow-elevated md:flex-row md:items-center md:justify-between md:p-8">
            <div className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <h1 className="text-3xl font-black md:text-4xl">Dashboard Administrateur</h1>
              <p className="mt-2 text-white/80">Gestion globale de la plateforme DogWalking</p>
            </div>
            <div className="relative flex flex-wrap items-center gap-3">
              <Button variant="outline" className="rounded-xl border-white/50 bg-white/10 font-bold text-white hover:bg-white hover:text-primary" onClick={handleGenerateReport}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Rapport
              </Button>
              <Button className="rounded-xl bg-white font-bold text-primary shadow-lg shadow-black/15 hover:bg-white/90" onClick={handleExportCSV}>
                Exporter CSV
              </Button>
            </div>
          </div>

          <AdminMetrics 
            totalUsers={stats.totalUsers}
            activeWalkers={stats.activeWalkers}
            openDisputes={openDisputes.length}
            completionRate={Math.round((stats.completedBookings / (stats.totalBookings || 1)) * 100)}
            verificationRate={Math.round((stats.activeWalkers / (stats.totalWalkers || 1)) * 100)}
          />

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-background border-2 p-1 h-auto rounded-2xl grid grid-cols-2 md:grid-cols-6 gap-1 mb-8">
              <TabsTrigger value="overview" className="rounded-xl font-bold py-2.5">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="verification" className="rounded-xl font-bold py-2.5 relative">
                Vérifications
                {pendingDocuments.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-[10px] rounded-full flex items-center justify-center">
                    {pendingDocuments.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="applications" className="rounded-xl font-bold py-2.5">Candidatures</TabsTrigger>
              <TabsTrigger value="disputes" className="rounded-xl font-bold py-2.5 relative">
                Litiges
                {openDisputes.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-[10px] rounded-full flex items-center justify-center">
                    {openDisputes.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="users" className="rounded-xl font-bold py-2.5">Utilisateurs</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                  <SelectionFlowChart
                    totalBookings={stats.totalBookings}
                    pendingBookings={stats.pendingBookings}
                    activeBookings={stats.activeBookings}
                    completedBookings={stats.completedBookings}
                    cancelledBookings={stats.cancelledBookings}
                  />
                </div>
                <div className="lg:col-span-4">
                  <DisputeTracker disputes={openDisputes.map(d => ({
                    id: d.id,
                    bookingId: d.booking_id,
                    ownerName: "Propriétaire",
                    walkerName: "Accompagnateur",
                    reason: d.reason,
                    status: d.status as any,
                    createdAt: d.created_at,
                    priority: "medium"
                  }))} />
                </div>
              </div>
            </TabsContent>

            {/* ===== Onglet Vérifications CNI / Documents ===== */}
            <TabsContent value="verification" className="space-y-4">
              <Card className="border-2 rounded-3xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-primary" />
                    Documents en attente de vérification
                  </CardTitle>
                  <CardDescription>
                    Validez ou refusez les pièces d'identité (CNI) des Accompagnateurs.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingDocuments.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                      <p className="font-semibold">Aucun document en attente</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pendingDocuments.map((doc) => (
                        <div key={doc.id} className="p-4 rounded-2xl border-2 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                              <FileCheck className="h-5 w-5 text-amber-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold truncate">{doc.document_type || 'Document'}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                Soumis le {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {doc.file_url && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                                  <Eye className="h-4 w-4 mr-1" /> Voir
                                </a>
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="default"
                              onClick={async () => {
                                const { error } = await supabase
                                  .from('walker_documents')
                                  .update({ verification_status: 'verified', verified_at: new Date().toISOString() })
                                  .eq('id', doc.id);
                                if (error) toast.error(error.message);
                                else { toast.success("Document validé"); fetchAdminStats(); }
                              }}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" /> Valider
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={async () => {
                                const reason = window.prompt("Motif de refus (obligatoire) :");
                                if (!reason || !reason.trim()) {
                                  toast.error("Motif obligatoire");
                                  return;
                                }
                                const { error } = await supabase
                                  .from('walker_documents')
                                  .update({ verification_status: 'rejected', rejection_reason: reason })
                                  .eq('id', doc.id);
                                if (error) toast.error(error.message);
                                else { toast.success("Document refusé"); fetchAdminStats(); }
                              }}
                            >
                              <XCircle className="h-4 w-4 mr-1" /> Refuser
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ===== Onglet Candidatures Accompagnateurs ===== */}
            <TabsContent value="applications" className="space-y-4">
              <WalkerApplicationsTab />
            </TabsContent>

            {/* ===== Onglet Litiges ===== */}
            <TabsContent value="disputes" className="space-y-4">
              <Card className="border-2 rounded-3xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-primary" />
                    Médiation des litiges ({openDisputes.length} ouvert{openDisputes.length > 1 ? 's' : ''})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DisputeTracker disputes={openDisputes.map(d => ({
                    id: d.id,
                    bookingId: d.booking_id,
                    ownerName: "Propriétaire",
                    walkerName: "Accompagnateur",
                    reason: d.reason,
                    status: d.status as any,
                    createdAt: d.created_at,
                    priority: "medium"
                  }))} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* ===== Onglet Utilisateurs ===== */}
            <TabsContent value="users" className="space-y-4">
              <Card className="border-2 rounded-3xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Utilisateurs récents
                  </CardTitle>
                  <CardDescription>
                    {stats.totalOwners} Propriétaires · {stats.totalWalkers} Accompagnateurs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recentUsers.map((u) => (
                      <div key={u.id} className="p-3 rounded-xl border flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={u.avatar_url || ''} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {u.first_name?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{u.first_name} {u.last_name}</p>
                          <p className="text-xs text-muted-foreground truncate">{u.city || '—'} · {u.user_type || 'owner'}</p>
                        </div>
                        <Badge variant="outline">{new Date(u.created_at).toLocaleDateString('fr-FR')}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
