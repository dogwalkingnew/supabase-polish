-- ====================================================================
-- MIGRATION FINALE COMPLÈTE — DogWalking / Dogfinance v5.0
-- À exécuter dans : Supabase Dashboard → SQL Editor
-- Idempotente : peut être ré-exécutée sans risque
-- ====================================================================

-- ─────────────────────────────────────────────────────────────────────
-- 1. EXTENSIONS REQUISES
--    (activer manuellement dans Supabase : Database → Extensions)
--    - pg_cron  → auto-release des fonds + purge + refresh scores
--    - pg_net   → appels HTTP sortants depuis les crons
-- ─────────────────────────────────────────────────────────────────────
-- CREATE EXTENSION IF NOT EXISTS pg_cron;   -- activer dans l'UI Supabase
-- CREATE EXTENSION IF NOT EXISTS pg_net;    -- activer dans l'UI Supabase


-- ─────────────────────────────────────────────────────────────────────
-- 2. DOGGY WALLET — colonne wallet_balance dans profiles
-- ─────────────────────────────────────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS wallet_balance NUMERIC(12,2) NOT NULL DEFAULT 0;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS wallet_currency TEXT NOT NULL DEFAULT 'EUR';

-- Transactions wallet (historique des mouvements)
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount        NUMERIC(12,2) NOT NULL,           -- positif = crédit, négatif = débit
  type          TEXT NOT NULL,                    -- topup | booking_payment | refund | withdrawal
  booking_id    UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  description   TEXT,
  stripe_pi_id  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_read_own_wallet" ON public.wallet_transactions;
CREATE POLICY "users_read_own_wallet"
ON public.wallet_transactions FOR SELECT
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "admins_manage_wallet" ON public.wallet_transactions;
CREATE POLICY "admins_manage_wallet"
ON public.wallet_transactions FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_wallet_tx_user ON public.wallet_transactions (user_id, created_at DESC);


-- ─────────────────────────────────────────────────────────────────────
-- 3. CANDIDATURES ACCOMPAGNATEURS (walker_applications)
--    — incluse dans migration_lot_final.sql, répétée ici pour sécurité
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.walker_applications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT,
  city          TEXT,
  experience    TEXT,
  motivation    TEXT,
  status        TEXT NOT NULL DEFAULT 'pending',   -- pending | accepted | rejected
  reviewed_by   UUID REFERENCES auth.users(id),
  reviewed_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.walker_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone_can_apply" ON public.walker_applications;
CREATE POLICY "anyone_can_apply"
ON public.walker_applications FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "owner_can_read_own_application" ON public.walker_applications;
CREATE POLICY "owner_can_read_own_application"
ON public.walker_applications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "admins_manage_applications" ON public.walker_applications;
CREATE POLICY "admins_manage_applications"
ON public.walker_applications FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));


-- ─────────────────────────────────────────────────────────────────────
-- 4. CANDIDATURES MISSIONS LIBRES (booking_applications)
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.booking_applications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  walker_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message     TEXT,
  status      TEXT NOT NULL DEFAULT 'pending',   -- pending | accepted | rejected
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (booking_id, walker_id)
);

ALTER TABLE public.booking_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "walker_can_apply" ON public.booking_applications;
CREATE POLICY "walker_can_apply"
ON public.booking_applications FOR INSERT
TO authenticated
WITH CHECK (walker_id = auth.uid());

DROP POLICY IF EXISTS "walker_reads_own_apps" ON public.booking_applications;
CREATE POLICY "walker_reads_own_apps"
ON public.booking_applications FOR SELECT
TO authenticated
USING (walker_id = auth.uid());

DROP POLICY IF EXISTS "owner_reads_apps_to_his_bookings" ON public.booking_applications;
CREATE POLICY "owner_reads_apps_to_his_bookings"
ON public.booking_applications FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.bookings b
  WHERE b.id = booking_id AND b.owner_id = auth.uid()
));

DROP POLICY IF EXISTS "owner_updates_apps" ON public.booking_applications;
CREATE POLICY "owner_updates_apps"
ON public.booking_applications FOR UPDATE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.bookings b
  WHERE b.id = booking_id AND b.owner_id = auth.uid()
));


-- ─────────────────────────────────────────────────────────────────────
-- 5. PROGRESSION FORMATION WALKER (walker_training_progress)
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.walker_training_progress (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id    TEXT NOT NULL,
  completed    BOOLEAN NOT NULL DEFAULT FALSE,
  score        INTEGER,                           -- score quiz en %
  completed_at TIMESTAMPTZ,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, module_id)
);

ALTER TABLE public.walker_training_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "walker_reads_own_progress" ON public.walker_training_progress;
CREATE POLICY "walker_reads_own_progress"
ON public.walker_training_progress FOR SELECT
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "walker_upserts_own_progress" ON public.walker_training_progress;
CREATE POLICY "walker_upserts_own_progress"
ON public.walker_training_progress FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "walker_updates_own_progress" ON public.walker_training_progress;
CREATE POLICY "walker_updates_own_progress"
ON public.walker_training_progress FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "admins_read_training" ON public.walker_training_progress;
CREATE POLICY "admins_read_training"
ON public.walker_training_progress FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_training_user ON public.walker_training_progress (user_id);


-- ─────────────────────────────────────────────────────────────────────
-- 6. INDEX PERFORMANCE
-- ─────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_bookings_walker_null
ON public.bookings (status) WHERE walker_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_walker_applications_status
ON public.walker_applications (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_booking_applications_booking
ON public.booking_applications (booking_id);

CREATE INDEX IF NOT EXISTS idx_bookings_funds_release
ON public.bookings (payment_status, funds_released_at)
WHERE payment_status = 'held';


-- ─────────────────────────────────────────────────────────────────────
-- 7. FONCTION AUTO-RELEASE FONDS (72h après fin de mission)
--    Appelée par le cron pg_cron toutes les 15 minutes
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.auto_release_escrow()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER := 0;
  v_booking RECORD;
BEGIN
  FOR v_booking IN
    SELECT id, walker_id, walker_amount, stripe_payment_intent_id
    FROM public.bookings
    WHERE status = 'completed'
      AND payment_status = 'held'
      AND funds_released_at IS NULL
      AND updated_at < NOW() - INTERVAL '72 hours'
  LOOP
    -- Marquer les fonds comme libérés
    UPDATE public.bookings
    SET
      payment_status   = 'released',
      funds_released_at = NOW(),
      updated_at        = NOW()
    WHERE id = v_booking.id;

    -- Créer une notification pour le walker
    INSERT INTO public.notifications (user_id, title, message, type, link)
    VALUES (
      v_booking.walker_id,
      '💰 Fonds libérés !',
      'Le paiement de ' || COALESCE(v_booking.walker_amount::TEXT, '?') || ' € vient d''être libéré sur votre compte.',
      'payment',
      '/walker/dashboard?tab=gains'
    )
    ON CONFLICT DO NOTHING;

    v_count := v_count + 1;
  END LOOP;

  RETURN v_count;
END;
$$;


-- ─────────────────────────────────────────────────────────────────────
-- 8. FONCTION REFRESH TRUST SCORES (1×/jour)
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.refresh_trust_scores()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER := 0;
BEGIN
  UPDATE public.walker_profiles wp
  SET
    rating = sub.avg_rating,
    total_reviews = sub.review_count,
    total_walks = sub.walk_count,
    updated_at = NOW()
  FROM (
    SELECT
      b.walker_id,
      ROUND(AVG(r.rating)::NUMERIC, 2)  AS avg_rating,
      COUNT(DISTINCT r.id)               AS review_count,
      COUNT(DISTINCT b.id)               AS walk_count
    FROM public.bookings b
    LEFT JOIN public.reviews r ON r.booking_id = b.id
    WHERE b.status = 'completed'
      AND b.walker_id IS NOT NULL
    GROUP BY b.walker_id
  ) sub
  WHERE wp.user_id = sub.walker_id;

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;


-- ─────────────────────────────────────────────────────────────────────
-- 9. CRON JOBS pg_cron
--    ⚠️ Nécessite que l'extension pg_cron soit activée au préalable
--    dans Supabase Dashboard → Database → Extensions → pg_cron
-- ─────────────────────────────────────────────────────────────────────

-- Auto-release fonds (toutes les 15 min)
SELECT cron.schedule(
  'auto-release-escrow',
  '*/15 * * * *',
  $$ SELECT public.auto_release_escrow(); $$
);

-- Refresh trust scores (tous les jours à 3h du matin)
SELECT cron.schedule(
  'refresh-trust-scores',
  '0 3 * * *',
  $$ SELECT public.refresh_trust_scores(); $$
);


-- ─────────────────────────────────────────────────────────────────────
-- 10. COLONNES STRIPE SUR BOOKINGS (si pas déjà en place)
-- ─────────────────────────────────────────────────────────────────────
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id    TEXT,
  ADD COLUMN IF NOT EXISTS stripe_checkout_session_id  TEXT,
  ADD COLUMN IF NOT EXISTS platform_fee_amount         NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS walker_amount               NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS funds_released_at           TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payment_status              TEXT DEFAULT 'pending';

-- Colonnes Stripe Connect sur profiles (si pas déjà en place)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_account_id           TEXT,
  ADD COLUMN IF NOT EXISTS stripe_onboarding_complete  BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS stripe_charges_enabled      BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS stripe_payouts_enabled      BOOLEAN DEFAULT FALSE;


-- ─────────────────────────────────────────────────────────────────────
-- ✅ FIN DE LA MIGRATION
-- Vérification rapide :
--   SELECT table_name FROM information_schema.tables
--   WHERE table_schema = 'public'
--   ORDER BY table_name;
-- ─────────────────────────────────────────────────────────────────────
