// @ts-nocheck — Edge function, Deno runtime
// Paiement Sécurisé Stripe Connect — capture manuelle + commission 18%
// Cahier des Charges Financier v5.0 :
//   • Propriétaire paie prix × 1.05 (5% frais de service)
//   • Accompagnateur reçoit prix × 0.87 (13% commission)
//   • Marge brute plateforme : 18% (5% client + 13% prestataire)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OWNER_FEE_RATE = 0.05;         // +5% côté propriétaire
const WALKER_COMMISSION_RATE = 0.13; // -13% côté accompagnateur

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      return new Response(JSON.stringify({ error: 'Stripe non configuré' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // --- Auth : valider le JWT de l'appelant (anti-abus release/refund) ---
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsErr } = await supabaseAuth.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims?.sub) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const callerId = claimsData.claims.sub as string;

    const body = await req.json();
    const { action } = body;

    switch (action) {
      // ---------- CREATE : PaymentIntent avec split + capture manuelle ----------
      case 'create': {
        const { bookingId, amount, currency, missionDescription, walkerEmail, ownerEmail } = body;

        // Récupère booking + walker pour avoir le compte Connect
        const { data: booking, error: bErr } = await supabaseAdmin
          .from('bookings')
          .select('id, walker_id, owner_id, total_price')
          .eq('id', bookingId)
          .single();
        if (bErr || !booking) {
          return new Response(JSON.stringify({ error: 'booking_not_found' }), {
            status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { data: walker } = await supabaseAdmin
          .from('profiles')
          .select('stripe_account_id, stripe_charges_enabled')
          .eq('id', booking.walker_id)
          .single();

        if (!walker?.stripe_account_id || !walker?.stripe_charges_enabled) {
          return new Response(
            JSON.stringify({ error: 'walker_not_onboarded', message: 'Le promeneur doit finaliser son onboarding Stripe.' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const baseCents = Math.round(Number(amount) * 100);
        // Total facturé au propriétaire = base + 5%
        const ownerFeeCents = Math.round(baseCents * OWNER_FEE_RATE);
        const totalChargedCents = baseCents + ownerFeeCents;
        // Commission plateforme (5% client + 13% prestataire) = 18% du prix de base
        const platformFeeCents =
          ownerFeeCents + Math.round(baseCents * WALKER_COMMISSION_RATE);
        const walkerAmountCents = totalChargedCents - platformFeeCents; // = 87% du prix de base

        const paymentIntent = await stripe.paymentIntents.create({
          amount: totalChargedCents,
          currency: (currency || 'eur').toLowerCase(),
          description: `Réservation ${missionDescription || bookingId}`,
          capture_method: 'manual', // Paiement Sécurisé
          application_fee_amount: platformFeeCents,
          transfer_data: { destination: walker.stripe_account_id },
          metadata: {
            booking_id: bookingId,
            walker_id: booking.walker_id,
            owner_id: booking.owner_id,
            walker_email: walkerEmail || '',
            owner_email: ownerEmail || '',
            type: 'secured_payment',
            base_amount: (baseCents / 100).toFixed(2),
            owner_fee: (ownerFeeCents / 100).toFixed(2),
            walker_commission: (Math.round(baseCents * WALKER_COMMISSION_RATE) / 100).toFixed(2),
          },
        });

        await supabaseAdmin
          .from('bookings')
          .update({
            stripe_payment_intent_id: paymentIntent.id,
            platform_fee_amount: platformFeeCents / 100,
            walker_amount: walkerAmountCents / 100,
          })
          .eq('id', bookingId);

        return new Response(
          JSON.stringify({
            paymentIntentId: paymentIntent.id,
            clientSecret: paymentIntent.client_secret,
            ownerTotal: totalChargedCents / 100,
            platformFee: platformFeeCents / 100,
            walkerAmount: walkerAmountCents / 100,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // ---------- CONFIRM : confirme l'autorisation côté serveur (rare, normalement client) ----------
      case 'confirm': {
        const pi = await stripe.paymentIntents.confirm(body.paymentIntentId);
        return new Response(
          JSON.stringify({ success: pi.status === 'requires_capture' || pi.status === 'succeeded', status: pi.status }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // ---------- RELEASE : capture les fonds (déclenche le transfer auto vers le promeneur) ----------
      case 'release': {
        const pi = await stripe.paymentIntents.capture(body.paymentIntentId);
        if (pi.status === 'succeeded' && body.bookingId) {
          await supabaseAdmin
            .from('bookings')
            .update({ funds_released_at: new Date().toISOString() })
            .eq('id', body.bookingId);
        }
        return new Response(
          JSON.stringify({ success: pi.status === 'succeeded', status: pi.status }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // ---------- REFUND : annule l'autorisation OU rembourse la charge ----------
      case 'refund': {
        const pi = await stripe.paymentIntents.retrieve(body.paymentIntentId);
        if (pi.status === 'requires_capture') {
          // Pas encore capturé → annulation simple, aucun frais
          await stripe.paymentIntents.cancel(body.paymentIntentId);
          return new Response(JSON.stringify({ success: true, action: 'cancelled' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        if (pi.latest_charge) {
          const refund = await stripe.refunds.create({
            charge: pi.latest_charge as string,
            reverse_transfer: true,
            refund_application_fee: true,
            reason: body.reason === 'requested_by_customer' ? 'requested_by_customer' : 'other',
          });
          return new Response(
            JSON.stringify({ success: refund.status === 'succeeded' || refund.status === 'pending', refundId: refund.id }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        return new Response(JSON.stringify({ success: false, error: 'no_charge_to_refund' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // ---------- STATUS ----------
      case 'status': {
        const pi = await stripe.paymentIntents.retrieve(body.paymentIntentId);
        let status = 'pending';
        if (pi.status === 'succeeded') status = 'released';
        else if (pi.status === 'requires_capture') status = 'completed';
        else if (pi.status === 'canceled') status = 'refunded';

        return new Response(
          JSON.stringify({
            status,
            stripeStatus: pi.status,
            paymentIntentId: pi.id,
            amount: pi.amount / 100,
            applicationFee: (pi.application_fee_amount || 0) / 100,
            createdAt: new Date(pi.created * 1000).toISOString(),
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(JSON.stringify({ error: 'Action non reconnue' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error: any) {
    console.error('stripe-escrow error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
