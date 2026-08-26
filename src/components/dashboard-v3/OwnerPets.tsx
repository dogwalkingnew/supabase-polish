import { Plus, Pill, Syringe, Calendar, AlertTriangle, CheckCircle2, Clock, Edit2, Trash2, ChevronDown, Heart, Activity, Download, Upload } from "lucide-react";
import { useState } from "react";

interface Vaccine {
  name: string;
  date: string;
  nextDue: string;
  status: "up-to-date" | "warning" | "overdue";
  veterinarian?: string;
}

interface Treatment {
  name: string;
  startDate: string;
  endDate: string;
  dosage: string;
  reason: string;
}

interface Pet {
  id: string;
  name: string;
  breed: string;
  photo: string;
  ageYears: number;
  weightKg: number;
  microchip?: string;
  vaccinesHistory: Vaccine[];
  treatmentsHistory: Treatment[];
  lastVetVisit?: string;
  allergies?: string[];
}

interface OwnerPetsProps {
  pets: Pet[];
}

const OwnerPets = ({ pets }: OwnerPetsProps) => {
  const [expandedPet, setExpandedPet] = useState<string | null>(pets[0]?.id || null);

  return (
    <div className="space-y-6 p-4 bg-[#FDFDFB] pb-24">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-extrabold text-[#1DB584]">Carnet de Santé Numérique</h3>
        <button className="text-[10px] font-bold text-[#D4A574] hover:underline">+ AJOUTER ANIMAL</button>
      </div>

      {pets.map((pet) => (
        <div key={pet.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all">
          
          {/* HEADER PET */}
          <button
            onClick={() => setExpandedPet(expandedPet === pet.id ? null : pet.id)}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 text-left">
              <img src={pet.photo} className="w-14 h-14 rounded-xl object-cover border border-gray-100" alt={pet.name} />
              <div className="flex-1">
                <p className="text-xs font-extrabold text-gray-800">{pet.name}</p>
                <p className="text-[10px] text-gray-500">{pet.breed} • {pet.ageYears} ans • {pet.weightKg}kg</p>
              </div>
            </div>
            <ChevronDown size={16} className={`text-gray-300 transition-transform ${expandedPet === pet.id ? 'rotate-180' : ''}`} />
          </button>

          {/* CONTENU DÉTAILLÉ */}
          {expandedPet === pet.id && (
            <div className="border-t border-gray-100 p-4 space-y-4">
              
              {/* INFOS GÉNÉRALES */}
              <div className="bg-gray-50 p-3 rounded-xl space-y-2">
                <h4 className="text-[11px] font-extrabold text-gray-800 uppercase tracking-wider">Informations</h4>
                <div className="grid grid-cols-2 gap-3 text-[10px]">
                  <div>
                    <p className="text-gray-500">Microchip</p>
                    <p className="font-bold text-gray-800">{pet.microchip || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Dernière visite</p>
                    <p className="font-bold text-gray-800">{pet.lastVetVisit || "N/A"}</p>
                  </div>
                </div>
                {pet.allergies && pet.allergies.length > 0 && (
                  <div className="bg-orange-50 border border-orange-200 p-2 rounded-lg mt-2">
                    <p className="text-[9px] font-bold text-orange-700">⚠️ Allergies: {pet.allergies.join(", ")}</p>
                  </div>
                )}
              </div>

              {/* VACCINS */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-[11px] font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-1">
                    <Syringe size={12} /> Vaccinations
                  </h4>
                  <button className="text-[#1DB584] text-[9px] font-bold hover:underline">+ AJOUTER</button>
                </div>
                
                <div className="space-y-2">
                  {pet.vaccinesHistory.map((vaccine, idx) => (
                    <div key={idx} className={`p-3 rounded-xl border-l-4 ${
                      vaccine.status === 'up-to-date' ? 'bg-emerald-50 border-emerald-500' :
                      vaccine.status === 'warning' ? 'bg-orange-50 border-orange-500' :
                      'bg-red-50 border-red-500'
                    }`}>
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <p className="text-[10px] font-extrabold text-gray-800">{vaccine.name}</p>
                          <p className="text-[9px] text-gray-600 mt-0.5">Fait: {vaccine.date}</p>
                        </div>
                        <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                          vaccine.status === 'up-to-date' ? 'bg-emerald-100 text-emerald-700' :
                          vaccine.status === 'warning' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {vaccine.status === 'up-to-date' ? '✓ À JOUR' : vaccine.status === 'warning' ? '⚠ BIENTÔT' : '✗ RETARD'}
                        </span>
                      </div>
                      <p className="text-[9px] text-gray-600">Prochain: {vaccine.nextDue}</p>
                      {vaccine.veterinarian && <p className="text-[9px] text-gray-500 mt-1">Dr. {vaccine.veterinarian}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* TRAITEMENTS */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-[11px] font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-1">
                    <Pill size={12} /> Traitements
                  </h4>
                  <button className="text-[#1DB584] text-[9px] font-bold hover:underline">+ AJOUTER</button>
                </div>
                
                <div className="space-y-2">
                  {pet.treatmentsHistory.map((treatment, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <p className="text-[10px] font-extrabold text-gray-800">{treatment.name}</p>
                          <p className="text-[9px] text-gray-600 mt-0.5">Dosage: {treatment.dosage}</p>
                        </div>
                        <div className="flex gap-1">
                          <button className="text-blue-600 hover:text-blue-800 p-1">
                            <Edit2 size={12} />
                          </button>
                          <button className="text-red-600 hover:text-red-800 p-1">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                      <p className="text-[9px] text-gray-600">Du {treatment.startDate} au {treatment.endDate}</p>
                      <p className="text-[9px] text-gray-500 mt-1">Raison: {treatment.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* DOCUMENTS & PHOTOS */}
              <div>
                <h4 className="text-[11px] font-extrabold text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Download size={12} /> Documents
                </h4>
                <button className="w-full border-2 border-dashed border-gray-200 p-3 rounded-xl text-[10px] font-bold text-gray-400 hover:border-[#1DB584]/30 hover:text-[#1DB584] transition-all flex items-center justify-center gap-2">
                  <Upload size={14} /> AJOUTER UN DOCUMENT (PDF, PHOTO)
                </button>
              </div>

              {/* ACTIONS */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                <button className="bg-[#1DB584] text-white text-[10px] font-bold py-2 rounded-lg hover:bg-[#15925A] transition-colors">
                  ✏️ ÉDITER FICHE
                </button>
                <button className="bg-gray-100 text-gray-800 text-[10px] font-bold py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  📋 HISTORIQUE
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* BOUTON AJOUTER ANIMAL */}
      <button className="w-full bg-gradient-to-r from-[#1DB584] to-[#15925A] text-white py-4 rounded-2xl font-extrabold text-sm shadow-lg shadow-[#1DB584]/20 hover:shadow-xl transition-all flex items-center justify-center gap-2">
        <Plus size={18} /> AJOUTER UN ANIMAL
      </button>
    </div>
  );
};

export default OwnerPets;
