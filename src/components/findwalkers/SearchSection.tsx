import { useState } from "react";
/**
 * DogWalking — Confiance canine de proximité : résultats réels en liste,
 * filtres accessibles et absence de carte ou de labels de vérification simulés.
 */
import { SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import FiltersSidebar from "@/components/findwalkers/FiltersSidebar";
import AccompagnateurCertifiesListe from "@/components/findwalkers/PromeneursListe";

const SearchSection = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <section className="py-10 bg-background border-t border-border" id="recherche">
      <div className="max-w-7xl mx-auto px-4 relative">
        <div aria-hidden="true" className="dogwalking-route absolute -right-12 -top-5 rotate-[-10deg]" />
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full mb-3">
            Profils disponibles
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-2">
            Les Accompagnateurs
          </h2>
          <p className="text-sm text-foreground/60 max-w-2xl mx-auto font-medium leading-relaxed">
            Consultez les profils, services et disponibilités renseignés près de chez vous.
          </p>
        </motion.div>

        {/* Filtres horizontaux (desktop) */}
        <div className="hidden lg:block mb-6">
          <FiltersSidebar />
        </div>

        {/* Mobile : toggle filtres */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setFiltersOpen(true)}
            className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2.5 text-sm font-bold text-foreground hover:bg-secondary transition-colors active:scale-95"
          >
            <SlidersHorizontal className="h-4 w-4 text-primary" /> Filtrer
          </button>
        </div>

        {/* Mobile : drawer */}
        <AnimatePresence>
          {filtersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-foreground/50"
                onClick={() => setFiltersOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-background overflow-y-auto p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-extrabold text-foreground text-lg">Filtres</h2>
                  <button
                    onClick={() => setFiltersOpen(false)}
                    className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <FiltersSidebar />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Mobile : liste seule */}
        <div className="lg:hidden">
          <AccompagnateurCertifiesListe />
        </div>

        {/* Desktop : liste complète, sans carte simulée */}
        <div className="hidden lg:block">
          <AccompagnateurCertifiesListe />
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
