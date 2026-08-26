import { CalendarDays, MapPin, User2, CheckCircle2, AlertTriangle, Syringe, Lightbulb, ChevronRight, MapPinOff, Clock, Zap, Shield, AlertCircle } from "lucide-react";
import { useState } from "react";
import OwnerHeroImproved from "./OwnerHeroImproved";
import GoButton from "./GoButton";
import SectionTitle from "./SectionTitle";
import { motion } from "framer-motion";

interface Pet {
  id: string;
  name: string;
  breed: string;
  photo: string;
  ageYears?: number;
  weightKg?: number;
}

interface NextMission {
  date: string;
  time: string;
  address: string;
  city: string;
  walkerName: string;
  walkerPhoto?: string;
  walkerRole: string;
  status: "Confirmée" | "En attente";
  gpsTracking?: boolean;
  estimatedDuration?: number;
  estimatedPrice?: number;
}

interface OwnerHomeImprovedProps {
  pets: Pet[];
  nextMission?: NextMission | null;
  onReserve?: () => void;
  onViewAllPets?: () => void;
  onViewAllMissions?: () => void;
  onViewMissionDetails?: () => void;
  onViewHealth?: () => void;
  onViewAlerts?: () => void;
  onStartTracking?: () => void;
  onEmergency?: () => void;
}

const OwnerHomeImproved = ({
  pets,
  nextMission,
  onReserve,
  onViewAllPets,
  onViewAllMissions,
  onViewMissionDetails,
  onViewHealth,
  onViewAlerts,
  onStartTracking,
  onEmergency,
}: OwnerHomeImprovedProps) => {
  const [showEmergency, setShowEmergency] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="bg-[#F9F7F4] min-h-dvh pb-32">
      <OwnerHeroImproved alt="Propriétaire avec son chien" />

      <main className="px-4 -mt-3 max-w-lg mx-auto space-y-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* GO Button */}
          <motion.div variants={itemVariants} className="pt-2">
            <GoButton label="Réserver un service" onClick={onReserve} />
          </motion.div>

          {/* Mes Animaux - Section NÉCESSAIRE */}
          <motion.section variants={itemVariants}>
            <SectionTitle title="Mes Animaux" actionLabel="Voir tout" onAction={onViewAllPets} />
            <div className="grid grid-cols-2 gap-3">
              {pets.slice(0, 2).map((p, idx) => (
                <motion.article
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(26,26,46,0.06)] overflow-hidden flex items-center gap-3 p-2.5 hover:shadow-[0_4px_20px_rgba(26,26,46,0.12)] transition-shadow"
                >
                  <img src={p.photo} alt={p.name} className="w-20 h-20 rounded-xl object-cover shrink-0" loading="lazy" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-[#1A1A2E] truncate text-lg">{p.name}</h3>
                    <p className="text-xs text-[#8A8A99] truncate">{p.breed}</p>
                    {p.ageYears && <p className="text-xs text-[#5C5C70] mt-0.5">{p.ageYears} ans • {p.weightKg}kg</p>}
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.section>

          {/* Prochaine Mission - Section NÉCESSAIRE */}
          {nextMission && (
            <motion.section variants={itemVariants}>
              <SectionTitle title="Prochaine Mission" actionLabel="Voir toutes" onAction={onViewAllMissions} />
              <motion.article
                className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(26,26,46,0.06)] p-4 hover:shadow-[0_4px_24px_rgba(26,26,46,0.12)] transition-shadow"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={nextMission.walkerPhoto || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop"}
                    alt={nextMission.walkerName}
                    className="w-20 h-20 rounded-full object-cover ring-2 ring-[#F0EBE3] shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Date et heure */}
                    <div className="flex items-start gap-2">
                      <CalendarDays className="w-4 h-4 text-[#1E7B5F] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-[#8A8A99]">{nextMission.date}</p>
                        <p className="font-bold text-[#1A1A2E] text-lg leading-tight">{nextMission.time}</p>
                      </div>
                    </div>

                    {/* Adresse */}
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#1E7B5F] mt-0.5 shrink-0" />
                      <p className="text-sm text-[#1A1A2E] leading-tight">
                        {nextMission.address}<br /><span className="text-[#8A8A99]">{nextMission.city}</span>
                      </p>
                    </div>

                    {/* Accompagnateur */}
                    <div className="flex items-center gap-2">
                      <User2 className="w-4 h-4 text-[#1E7B5F]" />
                      <p className="text-sm text-[#1A1A2E] font-semibold">{nextMission.walkerName}</p>
                      <span className="ml-1 text-[10px] font-bold uppercase tracking-wide bg-[#D4A574]/20 text-[#8B6B3A] px-2 py-0.5 rounded-full">{nextMission.walkerRole}</span>
                    </div>

                    {/* Détails supplémentaires */}
                    {(nextMission.estimatedDuration || nextMission.estimatedPrice) && (
                      <div className="flex items-center gap-3 text-xs text-[#5C5C70] pt-1 border-t border-[#EFEAE0]">
                        {nextMission.estimatedDuration && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            ~{nextMission.estimatedDuration}min
                          </span>
                        )}
                        {nextMission.estimatedPrice && (
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            {nextMission.estimatedPrice}€
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions droite */}
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#27AE60]/10 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-[#27AE60]" />
                    </div>
                    <p className="text-xs font-bold text-[#1E7B5F]">{nextMission.status}</p>
                    <button
                      onClick={onViewMissionDetails}
                      className="text-xs font-bold border border-[#1E7B5F] text-[#1E7B5F] px-3 py-1.5 rounded-lg hover:bg-[#1E7B5F]/5 transition-colors"
                    >
                      Détails
                    </button>
                  </div>
                </div>

                {/* Bouton GPS - Section NÉCESSAIRE */}
                {nextMission.gpsTracking && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={onStartTracking}
                    className="w-full mt-4 py-2.5 rounded-xl bg-[#1E7B5F]/10 text-[#1E7B5F] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#1E7B5F]/20 transition-colors"
                  >
                    <MapPinOff className="w-4 h-4" />
                    Suivre la promenade en direct
                  </motion.button>
                )}
              </motion.article>
            </motion.section>
          )}

          {/* Carnet de Santé + Alertes - Section UTILE */}
          <motion.section variants={itemVariants} className="grid grid-cols-2 gap-3">
            <motion.article
              className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(26,26,46,0.06)] p-3.5 hover:shadow-[0_4px_20px_rgba(26,26,46,0.12)] transition-shadow"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-[#1A1A2E] text-sm">Carnet de Santé</h3>
                <button onClick={onViewHealth} className="text-[11px] font-semibold text-[#1E7B5F]">Voir tout</button>
              </div>
              <button onClick={onViewHealth} className="w-full flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-full bg-[#E74C3C] flex items-center justify-center shrink-0">
                  <Syringe className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#E74C3C] truncate">Vaccin Rage · Aujourd'hui</p>
                  <p className="text-xs text-[#8A8A99]">Pour {pets[0]?.name || "votre animal"}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8A8A99]" />
              </button>
            </motion.article>

            <motion.article
              className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(26,26,46,0.06)] p-3.5 hover:shadow-[0_4px_20px_rgba(26,26,46,0.12)] transition-shadow"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-[#1A1A2E] text-sm">Alertes</h3>
                <button onClick={onViewAlerts} className="text-[11px] font-semibold text-[#1E7B5F]">Voir tout</button>
              </div>
              <button onClick={onViewAlerts} className="w-full flex items-start gap-3 text-left">
                <div className="w-10 h-10 rounded-full bg-[#D4A574]/25 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-[#B8860B]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#1A1A2E] leading-snug">Météo pluvieuse cette semaine</p>
                  <p className="text-[11px] text-[#8A8A99] leading-snug mt-0.5">Pensez aux vêtements imperméables.</p>
                </div>
              </button>
            </motion.article>
          </motion.section>

          {/* Conseil du jour - Section UTILE */}
          <motion.section
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(26,26,46,0.06)] p-4 flex items-center gap-4 hover:shadow-[0_4px_20px_rgba(26,26,46,0.12)] transition-shadow"
          >
            <div className="w-12 h-12 rounded-full bg-[#1E7B5F]/10 flex items-center justify-center shrink-0">
              <Lightbulb className="w-6 h-6 text-[#1E7B5F]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[#1A1A2E]">Conseil du jour</h3>
              <p className="text-xs text-[#5C5C70] leading-relaxed mt-1">Après une promenade sous la pluie, n'oubliez pas de sécher les pattes de votre chien pour éviter les irritations.</p>
            </div>
          </motion.section>

          {/* Bouton d'urgence vétérinaire - Section NÉCESSAIRE */}
          {showEmergency && (
            <motion.section
              variants={itemVariants}
              className="bg-[#E74C3C]/10 border border-[#E74C3C] rounded-2xl p-4"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-[#E74C3C] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-bold text-[#E74C3C] mb-2">Urgence Vétérinaire</h3>
                  <p className="text-sm text-[#1A1A2E] mb-3">Besoin d'aide immédiate pour votre animal ?</p>
                  <button
                    onClick={onEmergency}
                    className="w-full py-2.5 rounded-xl bg-[#E74C3C] text-white font-bold text-sm hover:bg-[#C73D2D] transition-colors"
                  >
                    Contacter un vétérinaire 24/7
                  </button>
                </div>
              </div>
            </motion.section>
          )}

          {/* Bouton pour afficher urgence */}
          <motion.button
            variants={itemVariants}
            onClick={() => setShowEmergency(!showEmergency)}
            className="w-full py-2.5 rounded-xl border border-[#E74C3C]/30 text-[#E74C3C] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#E74C3C]/5 transition-colors"
          >
            <Shield className="w-4 h-4" />
            {showEmergency ? "Masquer" : "Afficher"} Urgence Vétérinaire
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
};

export default OwnerHomeImproved;
