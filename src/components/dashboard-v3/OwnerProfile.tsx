import React from "react";
import { User, Shield, Bell, Settings, LogOut, ChevronRight } from "lucide-react";

const OwnerProfile = () => {
  const menuItems = [
    { icon: User, label: "Informations personnelles", sub: "Nom, email, téléphone" },
    { icon: Shield, label: "Sécurité", sub: "Mot de passe, double authentification" },
    { icon: Bell, label: "Notifications", sub: "Alertes, rappels, emails" },
    { icon: Settings, label: "Préférences", sub: "Langue, devise, thème" },
  ];

  return (
    <div className="space-y-6 p-4 bg-[#FDFDFB]">
      <h3 className="text-base font-extrabold text-[#1DB584] mb-4">Mon Profil</h3>
      
      <div className="space-y-3">
        {menuItems.map((item, index) => (
          <button 
            key={index}
            className="w-full bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex items-center justify-between hover:border-[#1DB584]/30 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#E8F8F3] rounded-xl flex items-center justify-center text-[#1DB584]">
                <item.icon size={20} />
              </div>
              <div className="text-left">
                <p className="text-xs font-extrabold text-gray-800">{item.label}</p>
                <p className="text-[10px] text-gray-500">{item.sub}</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
        ))}
      </div>

      <button className="w-full mt-6 bg-red-50 text-red-500 py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-red-100 transition-all active:scale-[0.98]">
        <LogOut size={18} /> DÉCONNEXION
      </button>
    </div>
  );
};

export default OwnerProfile;
