import { motion } from "framer-motion";
import { TrendingDown, DollarSign, Info } from "lucide-react";
import { useState, useMemo } from "react";

interface DogSelection {
  id: string;
  name: string;
  selected: boolean;
}

interface DynamicPricingProps {
  serviceType?: string;
  minimumPrice?: number;
  dogs: DogSelection[];
  onPriceChange?: (newPrice: number, dogsCount: number) => void;
}

// Minima tarifaires par service (source : Page d'accueil - Section Services)
const SERVICE_MINIMUMS: Record<string, number> = {
  promenade: 8,                    // Promenade - Durée libre
  visite: 8,                       // Visite à domicile - 30 min
  hebergement: 10,                 // Hébergement - Par nuit
  garderie: 10,                    // Garderie de Jour/Nuit - Journée
  garde_domicile: 12,              // Garde à domicile - Par nuit
  visite_sanitaire: 16,            // Visite Sanitaire - 45 min
  veterinaire: 13,                 // Accompagnement Vétérinaire - Variable
};

const DynamicPricing = ({ 
  serviceType = "promenade", 
  minimumPrice, 
  dogs, 
  onPriceChange 
}: DynamicPricingProps) => {
  const [selectedDogs, setSelectedDogs] = useState<string[]>([dogs[0]?.id || ""]);
  const [customPrice, setCustomPrice] = useState<number | "">(minimumPrice || SERVICE_MINIMUMS[serviceType] || 8);

  const minPrice = minimumPrice || SERVICE_MINIMUMS[serviceType] || 8;

  const pricing = useMemo(() => {
    const count = selectedDogs.length;
    const basePrice = typeof customPrice === "number" ? customPrice : minPrice;

    return {
      count,
      basePrice,
      totalPrice: basePrice * count,
      pricePerDog: basePrice,
      isValid: basePrice >= minPrice,
    };
  }, [selectedDogs, customPrice, minPrice]);

  const handleDogToggle = (dogId: string) => {
    setSelectedDogs((prev) => {
      const updated = prev.includes(dogId)
        ? prev.filter((id) => id !== dogId)
        : [...prev, dogId];
      
      // Au moins un chien doit être sélectionné
      return updated.length > 0 ? updated : prev;
    });

    if (onPriceChange) {
      onPriceChange(pricing.totalPrice, pricing.count);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomPrice(value === "" ? "" : Math.max(minPrice, parseFloat(value) || minPrice));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl shadow-card p-4 border border-border/50"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-blue-100 flex items-center justify-center">
            <DollarSign className="w-3 h-3 text-blue-600" />
          </div>
          Tarification Libre
        </h3>
        <span className="text-[8px] font-black px-2 py-1 rounded-full bg-blue-50 text-blue-600">
          Vous fixez le prix
        </span>
      </div>

      {/* Minimum Price Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <p className="text-[8px] text-blue-800 font-semibold leading-relaxed">
          <Info className="w-3 h-3 inline mr-1" />
          <strong>Minimum requis :</strong> {minPrice}€ par animal (selon les règles de qualité DogWalking)
        </p>
      </div>

      {/* Dog Selection */}
      <div className="space-y-2 mb-4">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Sélectionnez vos animaux
        </p>
        <div className="grid grid-cols-2 gap-2">
          {dogs.map((dog) => (
            <motion.button
              key={dog.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDogToggle(dog.id)}
              className={`p-2.5 rounded-lg border-2 transition-all font-semibold text-sm ${
                selectedDogs.includes(dog.id)
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-muted/30 text-muted-foreground hover:border-accent/50"
              }`}
            >
              🐕 {dog.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Price Input */}
      <div className="space-y-2 mb-4">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Prix par animal (€)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={minPrice}
            step="0.50"
            value={customPrice}
            onChange={handlePriceChange}
            className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border/50 text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <span className="text-sm font-bold text-muted-foreground">€</span>
        </div>
        {typeof customPrice === "number" && customPrice < minPrice && (
          <p className="text-[8px] text-red-600 font-semibold">
            Le prix doit être ≥ {minPrice}€
          </p>
        )}
      </div>

      {/* Pricing Breakdown */}
      <div className="bg-muted/30 rounded-lg p-3 space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Prix par animal :</span>
          <span className="font-bold text-foreground">
            {typeof customPrice === "number" ? customPrice.toFixed(2) : minPrice.toFixed(2)}€
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Nombre d'animaux :</span>
          <span className="font-bold text-foreground">{pricing.count}</span>
        </div>
        <div className="border-t border-border/30 pt-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Commission DogWalking :</span>
          <span className="font-bold text-amber-600">-18% (5% + 13%)</span>
        </div>
      </div>

      {/* Total Price */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg p-4 border border-accent/20 text-center"
      >
        <p className="text-xs text-muted-foreground font-semibold mb-1">PRIX TOTAL FACTURÉ</p>
        <p className="text-2xl font-black text-accent">
          {(pricing.totalPrice * 1.05).toFixed(2)}€
        </p>
        <p className="text-[8px] text-muted-foreground mt-1">
          (dont +5% frais de service)
        </p>
      </motion.div>

      {/* Commission Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3"
      >
        <p className="text-[8px] text-green-800 font-semibold leading-relaxed mb-2">
          <strong>Transparence Financière :</strong>
        </p>
        <div className="text-[7px] text-green-700 space-y-1">
          <p>• Vous payez : {(pricing.totalPrice * 1.05).toFixed(2)}€ (prix + 5% frais)</p>
          <p>• L'Accompagnateur reçoit : {(pricing.totalPrice * 0.87).toFixed(2)}€ (87% net)</p>
          <p>• DogWalking : {(pricing.totalPrice * 0.18).toFixed(2)}€ (18% commission)</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DynamicPricing;
