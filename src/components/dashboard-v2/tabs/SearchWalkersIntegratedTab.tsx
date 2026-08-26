import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Star, Heart } from "lucide-react";
import { mockNearbyWalkers } from "@/data/demoData";

export const SearchWalkersIntegratedTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);

  const services = [
    { id: "all", label: "Tous les services" },
    { id: "promenade", label: "Promenade" },
    { id: "hebergement", label: "Hébergement" },
    { id: "garde", label: "Garde" },
    { id: "visite", label: "Visite" },
  ];

  const filteredWalkers = mockNearbyWalkers.filter((walker: any) => {
    const matchesSearch =
      walker.profiles?.first_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      walker.profiles?.last_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const toggleFavorite = (walkerId: string) => {
    setFavorites((prev) =>
      prev.includes(walkerId)
        ? prev.filter((id) => id !== walkerId)
        : [...prev, walkerId]
    );
  };

  return (
    <div className="min-h-dvh bg-background max-w-lg lg:max-w-full mx-auto p-4 space-y-4">
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher un accompagnateur..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border/50 focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      {/* Filtres de service */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => setSelectedService(service.id)}
            className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
              selectedService === service.id
                ? "bg-accent text-white"
                : "bg-card border border-border/50 text-foreground hover:border-accent/50"
            }`}
          >
            {service.label}
          </button>
        ))}
      </div>

      {/* Liste des accompagnateurs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredWalkers.length > 0 ? (
          filteredWalkers.map((walker: any) => (
            <motion.div
              key={walker.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl shadow-card p-4 border border-border/50 space-y-3 hover:shadow-elevated transition-shadow"
            >
              {/* En-tête : Avatar et Info */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {walker.profiles?.avatar_url && (
                    <img
                      src={walker.profiles.avatar_url}
                      alt={walker.profiles?.first_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-bold text-foreground">
                      {walker.profiles?.first_name} {walker.profiles?.last_name?.[0]}.
                    </p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-foreground">
                        {walker.rating || 5}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({walker.total_reviews || 0} avis)
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(walker.id)}
                  className={`p-2 rounded-full transition-colors ${
                    favorites.includes(walker.id)
                      ? "bg-red-500/10 text-red-500"
                      : "bg-muted text-muted-foreground hover:bg-accent/10 hover:text-accent"
                  }`}
                >
                  <Heart
                    className="w-5 h-5"
                    fill={favorites.includes(walker.id) ? "currentColor" : "none"}
                  />
                </button>
              </div>

              {/* Détails */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{walker.service_radius_km || 5}km de rayon</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {walker.hourly_rate || 15}€/heure
                  </span>
                </div>
              </div>

              {/* Badges */}
              {walker.verified && (
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold">
                    ✓ Certifié
                  </span>
                </div>
              )}

              {/* Bouton de réservation */}
              <button className="w-full py-2.5 rounded-xl bg-accent text-white font-bold hover:bg-accent/90 transition-colors">
                Voir le Profil
              </button>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            <p>Aucun accompagnateur trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchWalkersIntegratedTab;
