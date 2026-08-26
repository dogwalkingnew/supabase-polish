/**
 * Design DogWalking : choix de rôle calme et pragmatique, sans statistiques ni promesses de certification, assurance ou revenu.
 * Les redirections reprennent les tableaux de bord réellement déclarés par l’application.
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Dog, ArrowRight, MessageCircle, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { SEOHead } from '@/components/seo/SEOHead';

const DashboardPreview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;
        const { data: profile } = await supabase.from('profiles').select('user_type').eq('id', session.user.id).maybeSingle();
        navigate(profile?.user_type === 'walker' ? '/walker/dashboard' : '/dashboard', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    void checkUserAndRedirect();
  }, [navigate]);

  if (loading) return <div className="flex min-h-dvh items-center justify-center bg-background"><div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;

  return (
    <div className="min-h-dvh bg-warm/45">
      <SEOHead title="Choisir mon espace | DogWalking" description="Accédez à votre espace Propriétaire ou Accompagnateur sur DogWalking." />
      <Header />
      <main className="container mx-auto px-4 py-14 md:py-20">
        <motion.header initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Choisir son parcours</p>
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">Votre espace DogWalking</h1>
          <p className="mt-4 text-lg text-muted-foreground">Sélectionnez le parcours correspondant à votre besoin. Les informations de mission et les conditions sont à confirmer entre les personnes concernées.</p>
        </motion.header>
        <div className="mx-auto grid max-w-4xl gap-7 md:grid-cols-2">
          <Card className="border-heart/30 bg-background shadow-card"><CardHeader><Dog className="mb-3 h-9 w-9 text-heart" /><CardTitle>Espace Propriétaire</CardTitle><CardDescription>Renseignez votre animal et organisez une demande auprès des Accompagnateurs inscrits.</CardDescription></CardHeader><CardContent><ul className="space-y-3 text-sm text-muted-foreground"><li className="flex gap-2"><Calendar className="h-4 w-4 text-primary" /> Associer une demande à un animal</li><li className="flex gap-2"><Users className="h-4 w-4 text-primary" /> Consulter les informations de profil disponibles</li><li className="flex gap-2"><MessageCircle className="h-4 w-4 text-primary" /> Confirmer les modalités avant la mission</li></ul><Button className="mt-7 w-full" onClick={() => navigate('/auth?role=owner')}>Je suis Propriétaire <ArrowRight className="ml-2 h-4 w-4" /></Button></CardContent></Card>
          <Card className="border-primary/25 bg-background shadow-card"><CardHeader><Users className="mb-3 h-9 w-9 text-primary" /><CardTitle>Espace Accompagnateur</CardTitle><CardDescription>Présentez les services et disponibilités que vous choisissez de renseigner.</CardDescription></CardHeader><CardContent><ul className="space-y-3 text-sm text-muted-foreground"><li className="flex gap-2"><Calendar className="h-4 w-4 text-primary" /> Renseigner vos disponibilités</li><li className="flex gap-2"><Dog className="h-4 w-4 text-primary" /> Consulter les demandes accessibles</li><li className="flex gap-2"><MessageCircle className="h-4 w-4 text-primary" /> Échanger les conditions avec le Propriétaire</li></ul><Button variant="outline" className="mt-7 w-full border-primary text-primary" onClick={() => navigate('/auth?role=walker')}>Je suis Accompagnateur <ArrowRight className="ml-2 h-4 w-4" /></Button></CardContent></Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPreview;
