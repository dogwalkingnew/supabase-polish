import { motion } from "framer-motion";
import { AlertTriangle, Phone, MapPin, Clock, Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EmergencyService {
  id: string;
  name: string;
  phone: string;
  address: string;
  distance: string;
  openNow: boolean;
  rating: number;
}

interface SOSEmergencyProps {
  dogName?: string;
  emergencyServices?: EmergencyService[];
  onSOSActivated?: () => void;
}

const SOSEmergency = ({ dogName = "Votre animal", emergencyServices = [], onSOSActivated }: SOSEmergencyProps) => {
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [sosMessage, setSOSMessage] = useState("");

  const defaultServices: EmergencyService[] = [
    {
      id: "1",
      name: "Clinique Vétérinaire 24/7 - Lyon",
      phone: "04 72 XX XX XX",
      address: "123 Rue de la Paix, Lyon",
      distance: "2.5 km",
      openNow: true,
      rating: 4.8,
    },
    {
      id: "2",
      name: "Urgences Animales - Rhône",
      phone: "04 78 XX XX XX",
      address: "456 Avenue des Champs, Lyon",
      distance: "5 km",
      openNow: true,
      rating: 4.6,
    },
  ];

  const services = emergencyServices.length > 0 ? emergencyServices : defaultServices;

  const handleSOSActivation = async () => {
    setIsSOSActive(true);
    
    // Simuler l'envoi d'une alerte
    try {
      // Ici, on enverrait une requête API pour notifier les services d'urgence
      toast.success(`🚨 Alerte SOS activée pour ${dogName}. Les services d'urgence ont été notifiés.`);
      
      if (onSOSActivated) {
        onSOSActivated();
      }

      // Auto-désactiver après 5 secondes
      setTimeout(() => {
        setIsSOSActive(false);
      }, 5000);
    } catch (error) {
      toast.error("Erreur lors de l'activation du SOS");
      setIsSOSActive(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl shadow-card p-4 border border-red-200/50"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-3 h-3 text-red-600" />
          </div>
          Assistance d'Urgence
        </h3>
      </div>

      {/* SOS Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSOSActivation}
        disabled={isSOSActive}
        className={`w-full py-3 rounded-lg font-bold text-white text-sm mb-4 transition-all flex items-center justify-center gap-2 ${
          isSOSActive
            ? "bg-red-600 animate-pulse"
            : "bg-red-500 hover:bg-red-600 active:scale-95"
        }`}
      >
        <Heart className="w-4 h-4" />
        {isSOSActive ? "🚨 SOS ACTIVÉ - Aide en route" : "🆘 Activer le SOS"}
      </motion.button>

      {sosMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-800 font-semibold"
        >
          {sosMessage}
        </motion.div>
      )}

      {/* Emergency Services */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
          Cliniques d'urgence à proximité
        </p>
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-muted/30 rounded-lg p-3 border border-border/50 hover:border-red-200/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{service.name}</p>
                <div className="flex items-center gap-1 text-[8px] text-muted-foreground mt-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{service.address}</span>
                </div>
              </div>
              {service.openNow && (
                <span className="text-[7px] font-black px-1.5 py-0.5 rounded-full bg-green-100 text-green-600 shrink-0">
                  OUVERT
                </span>
              )}
            </div>
            <div className="flex items-center justify-between gap-2">
              <a
                href={`tel:${service.phone}`}
                className="flex-1 flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-[8px] font-bold py-1.5 px-2 rounded transition-colors"
              >
                <Phone className="w-3 h-3" />
                Appeler
              </a>
              <div className="text-[8px] text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {service.distance}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-[8px] text-blue-800 font-semibold leading-relaxed">
          💡 <strong>Conseil :</strong> En cas d'urgence, appelez directement la clinique. Le SOS notifiera également votre Accompagnateur et DogWalking.
        </p>
      </div>
    </motion.div>
  );
};

export default SOSEmergency;
