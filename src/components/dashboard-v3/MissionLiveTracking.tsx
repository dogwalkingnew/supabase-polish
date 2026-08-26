import { useState, useEffect } from "react";
import { MapPin, Phone, MessageCircle, AlertCircle, Clock, Route, Zap, X, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MissionLiveTrackingProps {
  missionId: string;
  walkerName: string;
  walkerPhone: string;
  walkerPhoto?: string;
  petName: string;
  estimatedEndTime: string;
  isActive: boolean;
  onClose?: () => void;
}

interface GPSPoint {
  lat: number;
  lng: number;
  timestamp: number;
  accuracy: number;
}

const MissionLiveTracking = ({
  missionId,
  walkerName,
  walkerPhone,
  walkerPhoto,
  petName,
  estimatedEndTime,
  isActive,
  onClose,
}: MissionLiveTrackingProps) => {
  const [gpsTrail, setGpsTrail] = useState<GPSPoint[]>([]);
  const [currentLocation, setCurrentLocation] = useState<GPSPoint | null>(null);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);

  // Simulation GPS tracking
  useEffect(() => {
    if (!isActive || isPaused) return;

    const interval = setInterval(() => {
      // Simulation: générer des points GPS aléatoires
      const newPoint: GPSPoint = {
        lat: 48.8566 + (Math.random() - 0.5) * 0.01,
        lng: 2.3522 + (Math.random() - 0.5) * 0.01,
        timestamp: Date.now(),
        accuracy: Math.random() * 10,
      };

      setCurrentLocation(newPoint);
      setGpsTrail((prev) => [...prev, newPoint]);

      // Calculer distance (approximation)
      if (gpsTrail.length > 0) {
        const lastPoint = gpsTrail[gpsTrail.length - 1];
        const distance = Math.sqrt(
          Math.pow(newPoint.lat - lastPoint.lat, 2) +
          Math.pow(newPoint.lng - lastPoint.lng, 2)
        ) * 111; // Approximation km
        setDistanceTraveled((prev) => prev + distance);
      }

      setElapsedTime((prev) => prev + 1);
    }, 5000); // Mise à jour toutes les 5 secondes

    return () => clearInterval(interval);
  }, [isActive, isPaused, gpsTrail]);

  // Simulation photos
  useEffect(() => {
    if (!isActive) return;

    const photoInterval = setInterval(() => {
      const newPhoto = `https://images.unsplash.com/photo-${Math.random().toString().slice(2, 11)}?w=400&h=300&fit=crop`;
      setPhotos((prev) => [...prev.slice(-4), newPhoto]); // Garder les 5 dernières photos
    }, 30000); // Photo toutes les 30 secondes

    return () => clearInterval(photoInterval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDistance = (km: number) => {
    return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(2)}km`;
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="w-full bg-white rounded-t-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1E7B5F] to-[#10B981] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={walkerPhoto || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop"}
                    alt={walkerName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                </div>
                <div>
                  <p className="font-bold">{walkerName}</p>
                  <p className="text-xs opacity-90">🐕 Promenade de {petName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-3 gap-2 p-4 bg-[#F9F7F4] border-b border-[#EFEAE0]">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-xl p-3 text-center"
              >
                <div className="flex items-center justify-center gap-1 text-[#1E7B5F] mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-bold">DURÉE</span>
                </div>
                <p className="font-bold text-lg text-[#1A1A2E]">{formatTime(elapsedTime)}</p>
              </motion.div>

              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-3 text-center"
              >
                <div className="flex items-center justify-center gap-1 text-[#1E7B5F] mb-1">
                  <Route className="w-4 h-4" />
                  <span className="text-xs font-bold">DISTANCE</span>
                </div>
                <p className="font-bold text-lg text-[#1A1A2E]">{formatDistance(distanceTraveled)}</p>
              </motion.div>

              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-3 text-center"
              >
                <div className="flex items-center justify-center gap-1 text-[#1E7B5F] mb-1">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-bold">PHOTOS</span>
                </div>
                <p className="font-bold text-lg text-[#1A1A2E]">{photos.length}</p>
              </motion.div>
            </div>

            {/* Map Placeholder */}
            <div className="relative w-full h-64 bg-gradient-to-br from-[#E8F5F0] to-[#F0F9F7] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-6 h-full">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="border border-[#1E7B5F]" />
                  ))}
                </div>
              </div>

              {/* Trail visualization */}
              <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
                {gpsTrail.length > 1 && (
                  <polyline
                    points={gpsTrail.map((p, i) => `${(i / gpsTrail.length) * 100}%,${50 + Math.sin(i * 0.1) * 30}%`).join(" ")}
                    stroke="#1E7B5F"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                  />
                )}
              </svg>

              {/* Current location marker */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="relative z-10"
              >
                <div className="w-12 h-12 rounded-full bg-[#1E7B5F] flex items-center justify-center text-white shadow-lg">
                  <MapPin className="w-6 h-6" />
                </div>
              </motion.div>

              <p className="absolute bottom-4 left-4 text-xs text-[#5C5C70] bg-white/80 px-3 py-1 rounded-full backdrop-blur-sm">
                📍 Carte en direct (simulation)
              </p>
            </div>

            {/* Photos Gallery */}
            {photos.length > 0 && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                className="border-t border-[#EFEAE0] p-4"
              >
                <button
                  onClick={() => setShowPhotos(!showPhotos)}
                  className="w-full flex items-center justify-between mb-3 text-[#1A1A2E] font-bold hover:text-[#1E7B5F] transition-colors"
                >
                  <span>📸 Photos en direct ({photos.length})</span>
                  <span className="text-sm">{showPhotos ? "▼" : "▶"}</span>
                </button>

                <AnimatePresence>
                  {showPhotos && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-4 gap-2"
                    >
                      {photos.map((photo, i) => (
                        <motion.img
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          src={photo}
                          alt={`Photo ${i + 1}`}
                          className="w-full aspect-square rounded-lg object-cover"
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Actions */}
            <div className="border-t border-[#EFEAE0] p-4 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#10B981] text-white font-bold hover:bg-[#0F9370] transition-colors">
                  <Phone className="w-5 h-5" />
                  Appeler
                </button>
                <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1E7B5F] text-white font-bold hover:bg-[#165A47] transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  Message
                </button>
              </div>

              <button
                onClick={() => setIsPaused(!isPaused)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-[#1E7B5F] text-[#1E7B5F] font-bold hover:bg-[#1E7B5F]/5 transition-colors"
              >
                {isPaused ? (
                  <>
                    <Play className="w-5 h-5" />
                    Reprendre le suivi
                  </>
                ) : (
                  <>
                    <Pause className="w-5 h-5" />
                    Pause
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-[#F9F7F4] text-[#1A1A2E] font-bold hover:bg-[#EFEAE0] transition-colors"
              >
                Fermer
              </button>
            </div>

            {/* Alert Banner */}
            <div className="bg-[#E74C3C]/10 border-t border-[#E74C3C]/20 px-4 py-3 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#E74C3C] shrink-0 mt-0.5" />
              <div className="text-sm text-[#1A1A2E]">
                <p className="font-bold">Fin estimée: {estimatedEndTime}</p>
                <p className="text-xs text-[#5C5C70] mt-0.5">Vous recevrez une notification à la fin de la promenade</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MissionLiveTracking;
