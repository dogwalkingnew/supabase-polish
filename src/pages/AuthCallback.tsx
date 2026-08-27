/**
 * DogWalking — Confiance canine de proximité : callback d’accès sobre et sûr.
 * Les retours restent strictement internes ; une récupération ne redirige jamais vers un espace avant le choix d’un nouveau mot de passe.
 */
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

const getSafeInternalPath = (value: string | null): string | null => {
  if (!value) return null;
  try {
    const candidate = decodeURIComponent(value).trim();
    if (!candidate.startsWith('/') || candidate.startsWith('//') || candidate.startsWith('/\\') || candidate.includes('\\') || candidate.includes('\0')) return null;
    return candidate;
  } catch {
    return null;
  }
};

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = getSafeInternalPath(searchParams.get('redirect'));
  const isPasswordRecovery = searchParams.get('reset') === '1';

  useEffect(() => {
    const handleCallback = async () => {
      // Wait for session to be established
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        navigate('/auth');
        return;
      }

      if (isPasswordRecovery) {
        navigate('/auth?mode=reset', { replace: true });
        return;
      }

      if (redirectUrl) {
        navigate(redirectUrl, { replace: true });
        return;
      }

      // Check user type from metadata or profile
      const userType = session.user.user_metadata?.user_type;
      
      if (!userType) {
        // Try from profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();
        
        if (profile?.user_type === 'walker') {
          navigate('/walker/dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
        return;
      }

      if (userType === 'walker') {
        navigate('/walker/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    };

    handleCallback();
  }, [isPasswordRecovery, navigate, redirectUrl]);

  return (
    <div className="min-h-dvh flex items-center justify-center bg-background">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-muted-foreground">Connexion en cours...</p>
      </motion.div>
    </div>
  );
};

export default AuthCallback;
