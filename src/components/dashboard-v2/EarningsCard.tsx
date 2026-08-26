import { TrendingUp, Euro, Info, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EarningsCardProps {
  today: number;
  week: number;
  month: number;
  trend: number;
}

const EarningsCard = ({ today, week, month, trend }: EarningsCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card rounded-2xl shadow-card p-4 border border-border/50"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Wallet className="w-4 h-4 text-primary" />
        </div>
        <h3 className="font-bold text-foreground">Mes Revenus Nets</h3>
      </div>
      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black border border-green-100">
        <TrendingUp className="w-3 h-3" />
        +{trend}%
      </div>
    </div>
    
    <div className="grid grid-cols-3 gap-2">
      {[
        { label: "Aujourd'hui", value: today, color: "text-foreground" },
        { label: "Cette Semaine", value: week, color: "text-foreground" },
        { label: "Ce Mois", value: month, color: "text-primary" },
      ].map((item, i) => (
        <div key={item.label} className={`flex flex-col items-center p-2 rounded-xl bg-muted/30 relative ${i === 2 ? 'bg-primary/5 border border-primary/10' : ''}`}>
          <span className={`text-base font-black flex items-center gap-0.5 ${item.color}`}>
            {item.value}<Euro className="w-3 h-3 opacity-50" />
          </span>
          <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-wider mt-1">{item.label}</span>
        </div>
      ))}
    </div>

    <div className="mt-4 pt-3 border-t border-dashed border-border flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-bold text-muted-foreground">Commission DogWalking</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-3 h-3 text-muted-foreground/50 hover:text-primary transition-colors" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[200px] text-[10px] p-2">
              <p>Une commission de 13% est prélevée (vous percevez 87%) pour assurer la sécurité, l'assurance et le fonctionnement de la plateforme.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">-13% inclus</span>
    </div>
  </motion.div>
);

export default EarningsCard;
