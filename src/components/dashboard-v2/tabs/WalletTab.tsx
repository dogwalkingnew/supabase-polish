import { Wallet, ArrowDownRight, ArrowUpRight, Lock, Receipt, CreditCard, Plus, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useBookings } from "@/hooks/useNewBookings";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { computeTopupCharge, WALLET_TOPUP_FIXED_FEE } from "@/lib/pricing";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const useWalletBalance = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["wallet_balance", user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { data } = await supabase
        .from("profiles")
        .select("wallet_balance")
        .eq("id", user.id)
        .single();
      // wallet_balance column may not exist yet (pre-migration) — fallback to 0
      return Number((data as any)?.wallet_balance ?? 0);
    },
    enabled: !!user,
    retry: false,
  });
};

const WalletTab = () => {
  const { user } = useAuth();
  const { data: bookings = [] } = useBookings("owner");
  const { data: walletBalance = 0 } = useWalletBalance();
  const navigate = useNavigate();
  const isDemo = !user;

  // Stats
  const completed = bookings.filter((b: any) => b.status === "completed");
  const inEscrow = bookings.filter((b: any) => b.status === "confirmed" || b.status === "in_progress");
  const totalSpentMonth = completed
    .filter((b: any) => new Date(b.scheduled_date).getMonth() === new Date().getMonth())
    .reduce((s: number, b: any) => s + Number(b.price || 0), 0);
  const totalEscrow = inEscrow.reduce((s: number, b: any) => s + Number(b.price || 0), 0);
  const totalLifetime = completed.reduce((s: number, b: any) => s + Number(b.price || 0), 0);

  // Mouvements (Paiement Sécurisé + payés)
  const movements = [...inEscrow, ...completed]
    .sort((a: any, b: any) => new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime())
    .slice(0, 15);

  return (
    <div className="px-4 py-6 space-y-4 pb-24">
      <div className="flex items-center gap-2">
        <Wallet className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-black text-foreground">Portefeuille</h2>
      </div>

      {/* Hero — Doggy Wallet */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl gradient-primary p-5 text-white shadow-elevated"
      >
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-wider opacity-80">Solde Doggy Wallet</p>
          <span className="text-[10px] font-bold uppercase opacity-70">1 Doggy = 1 €</span>
        </div>
        <p className="text-3xl font-black mt-1">{walletBalance.toFixed(2)} <span className="text-base">🐾</span></p>
        <p className="text-[11px] opacity-80 mt-1">Dépensé ce mois · {totalSpentMonth.toFixed(2)} €</p>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
          <div>
            <p className="text-[10px] font-bold uppercase opacity-80">Total cumulé</p>
            <p className="text-base font-extrabold">{totalLifetime.toFixed(2)} €</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase opacity-80">Paiement Sécurisé</p>
            <p className="text-base font-extrabold flex items-center gap-1 justify-end">
              <Lock className="w-3 h-3" />
              {totalEscrow.toFixed(2)} €
            </p>
          </div>
        </div>
      </motion.div>

      {/* Recharge Doggies */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          size="sm"
          className="rounded-xl h-11"
          onClick={() => {
            const raw = window.prompt("Montant à créditer (€)", "20");
            const eur = Number(raw);
            if (!eur || eur <= 0) return;
            const charged = computeTopupCharge(eur);
            toast.info(`Recharge ${eur} Doggies · ${charged.toFixed(2)} € prélevés (frais sécurité ${WALLET_TOPUP_FIXED_FEE.toFixed(2)} €). Stripe Checkout bientôt actif.`);
          }}
        >
          <Plus className="w-4 h-4 mr-1" /> Recharger
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="rounded-xl h-11"
          onClick={() => toast.info("Crédit mensuel récurrent — bientôt disponible.")}
        >
          <RefreshCw className="w-4 h-4 mr-1" /> Crédit mensuel
        </Button>
      </div>

      {/* Règles v5.0 — transparence */}
      <div className="bg-card rounded-2xl shadow-card p-3 border border-border/50">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Règles Dogfinance v5.0</p>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg bg-primary/5">
            <p className="text-base font-black text-primary">+5%</p>
            <p className="text-[9px] font-bold text-muted-foreground">Frais propriétaire</p>
          </div>
          <div className="p-2 rounded-lg bg-amber-500/10">
            <p className="text-base font-black text-amber-600">−13%</p>
            <p className="text-[9px] font-bold text-muted-foreground">Commission accomp.</p>
          </div>
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <p className="text-base font-black text-emerald-600">87%</p>
            <p className="text-[9px] font-bold text-muted-foreground">Reversé net</p>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">Marge brute plateforme : <strong>18 %</strong></p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-card rounded-xl shadow-card p-3 text-center">
          <span className="text-lg font-black text-primary">{completed.length}</span>
          <p className="text-[9px] text-muted-foreground font-semibold">Payées</p>
        </div>
        <div className="bg-card rounded-xl shadow-card p-3 text-center">
          <span className="text-lg font-black text-amber-600">{inEscrow.length}</span>
          <p className="text-[9px] text-muted-foreground font-semibold">En cours</p>
        </div>
        <div className="bg-card rounded-xl shadow-card p-3 text-center">
          <span className="text-lg font-black text-foreground">{completed.length}</span>
          <p className="text-[9px] text-muted-foreground font-semibold">Factures</p>
        </div>
      </div>


      {/* CTA moyens de paiement */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate("/dashboard?tab=profil")}
        className="w-full bg-card rounded-2xl shadow-card p-4 flex items-center gap-3 border border-border/50"
      >
        <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center">
          <CreditCard className="w-4 h-4 text-accent" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-bold text-foreground">Moyens de paiement</p>
          <p className="text-[11px] text-muted-foreground font-medium">Cartes & coordonnées de facturation</p>
        </div>
      </motion.button>

      {/* Mouvements */}
      <div>
        <h3 className="text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 px-1">Mouvements récents</h3>
        {isDemo ? (
          <p className="text-sm text-muted-foreground text-center py-6">Connectez-vous pour voir vos mouvements.</p>
        ) : movements.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Aucun mouvement pour le moment.</p>
        ) : (
          <div className="space-y-2">
            {movements.map((m: any, i: number) => {
              const isEscrow = m.status === "confirmed" || m.status === "in_progress";
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-card rounded-xl shadow-card p-3 flex items-center gap-3"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isEscrow ? "bg-amber-500/15 text-amber-600" : "bg-primary/10 text-primary"
                  }`}>
                    {isEscrow ? <Lock className="w-3.5 h-3.5" /> : <Receipt className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">
                      {m.dogs?.name || "Animal"} — {m.service_type || "Prestation"}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium">
                      {m.scheduled_date} • {isEscrow ? "Paiement Sécurisé" : "Payé"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-black flex items-center gap-1 ${
                      isEscrow ? "text-amber-600" : "text-foreground"
                    }`}>
                      {isEscrow ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {Number(m.price || 0).toFixed(2)}€
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletTab;
