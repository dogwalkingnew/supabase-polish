import { Wallet, Download, ChevronRight, Plus, PieChart, Zap, Gift } from "lucide-react";

interface Invoice { id: string; ref: string; date: string; total: number; status: "Utilisé" | "En attente"; }
interface OwnerBillingProps { pets: any[]; invoices: Invoice[]; walletBalance?: number; }

const FR_MONTHS: Record<string, number> = { janvier: 0, février: 1, mars: 2, avril: 3, mai: 4, juin: 5, juillet: 6, août: 7, septembre: 8, octobre: 9, novembre: 10, décembre: 11 };

const OwnerBilling = ({ pets, invoices, walletBalance = 0 }: OwnerBillingProps) => {
  const now = new Date();
  const monthSpend = invoices
    .filter((inv) => {
      const parts = inv.date.split(" ");
      const m = FR_MONTHS[parts[1]?.toLowerCase() ?? ""];
      return m === now.getMonth() && Number(parts[2]) === now.getFullYear();
    })
    .reduce((sum, inv) => sum + inv.total, 0);
  return (
    <div className="space-y-6 p-4 bg-[#FDFDFB]">
      <h3 className="text-base font-extrabold text-[#1DB584] mb-4">Mes Doggies</h3>
      
      {/* Portefeuille Doggy Credits (Système de Paiement à l'Avance) */}
      <div className="bg-gradient-to-br from-[#1DB584] to-[#15925A] p-6 rounded-[32px] text-white shadow-xl shadow-[#1DB584]/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mb-1">Solde Doggies</p>
              <h3 className="text-4xl font-black">{walletBalance.toFixed(2)} 🐾</h3>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
              🐕
            </div>
          </div>
          <p className="text-[11px] opacity-75 mb-4">1 Doggy = 1 € • Conversion instantanée</p>
          <button className="w-full bg-white text-[#1DB584] py-3.5 rounded-2xl font-extrabold text-xs shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            <Plus size={16} /> AJOUTER DES DOGGIES
          </button>
        </div>
      </div>

      {/* Historique de Consommation */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-extrabold text-gray-800">Consommation ce mois</h3>
          <span className="text-[10px] font-bold text-[#D4A574] bg-orange-50 px-2 py-1 rounded-full">-{monthSpend.toFixed(2)} 🐾</span>
        </div>
        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-[#D4A574]">
              <Zap size={24} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-extrabold text-gray-800">Promenades & Services</p>
              <p className="text-[10px] text-gray-500 leading-relaxed mt-1">Vous avez utilisé {monthSpend.toFixed(2)} Doggies cette période.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mes Services & Tarifs */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-extrabold text-gray-800">Tarifs par animal</h3>
          <button className="text-[10px] font-bold text-[#D4A574] hover:underline">+ AJOUTER</button>
        </div>
        <div className="space-y-3">
          {pets.map((pet) => (
            <div key={pet.id} className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex justify-between items-center group cursor-pointer hover:border-[#1DB584]/30 transition-all">
              <div className="flex items-center gap-3">
                <img src={pet.photo} className="w-10 h-10 rounded-xl object-cover border border-gray-50" alt="" />
                <div>
                  <p className="text-xs font-extrabold text-gray-800">{pet.name}</p>
                  <p className="text-[9px] text-gray-500">Promenade: {pet.promenade}€ • Garde: {pet.garde}€</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-[#1DB584]" />
            </div>
          ))}
        </div>
      </section>

      {/* Historique des Réservations (Doggies Utilisés) */}
      <section className="pb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-extrabold text-gray-800">Dernières réservations</h3>
          <button className="text-[10px] font-bold text-[#D4A574] hover:underline">Voir tout</button>
        </div>
        <div className="space-y-3">
          {invoices.map((inv) => (
            <div key={inv.id} className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex justify-between items-center group cursor-pointer hover:border-[#1DB584]/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-[#1DB584] transition-colors">
                  <Wallet size={20} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-gray-800">{inv.ref}</p>
                  <p className="text-[10px] text-gray-500">{inv.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-gray-800 mb-1">-{inv.total.toFixed(2)} 🐾</p>
                <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase ${inv.status === 'Utilisé' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                  {inv.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bonus & Récompenses */}
      <section className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
            <Gift size={20} />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-gray-800">Bonus Fidélité</h4>
            <p className="text-[10px] text-gray-500">+2.50 🐾 à chaque 5ème réservation</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OwnerBilling;
