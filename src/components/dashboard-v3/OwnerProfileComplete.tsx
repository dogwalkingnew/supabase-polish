import { useState } from "react";
import { User, Mail, Phone, MapPin, Bell, Lock, LogOut, FileText, Download, Edit2, Save, X, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface OwnerProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  bio?: string;
  avatar?: string;
  verificationStatus: "pending" | "verified" | "rejected";
  createdAt: string;
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    smsAlerts: boolean;
    newsletter: boolean;
  };
  documents: {
    id: string;
    name: string;
    type: string;
    uploadedAt: string;
    status: "pending" | "approved" | "rejected";
  }[];
}

interface OwnerProfileCompleteProps {
  profile: OwnerProfile;
  onUpdate?: (profile: Partial<OwnerProfile>) => void;
  onLogout?: () => void;
}

const OwnerProfileComplete = ({
  profile,
  onUpdate,
  onLogout,
}: OwnerProfileCompleteProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(profile);
  const [activeTab, setActiveTab] = useState<"infos" | "preferences" | "documents" | "security">("infos");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setPasswordLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordLoading(false);
    if (error) {
      toast.error("Impossible de changer le mot de passe.");
    } else {
      toast.success("Mot de passe mis à jour.");
      setShowPasswordForm(false);
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleSavePreferences = () => {
    onUpdate?.({ preferences: editData.preferences });
    toast.success("Préférences enregistrées.");
  };

  const handleSave = () => {
    onUpdate?.(editData);
    setIsEditing(false);
  };

  const tabs = [
    { key: "infos" as const, label: "Informations", icon: User },
    { key: "preferences" as const, label: "Préférences", icon: Bell },
    { key: "documents" as const, label: "Documents", icon: FileText },
    { key: "security" as const, label: "Sécurité", icon: Lock },
  ];

  const getVerificationColor = (status: string) => {
    switch (status) {
      case "verified":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "rejected":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getVerificationLabel = (status: string) => {
    switch (status) {
      case "verified":
        return "✓ Vérifié";
      case "pending":
        return "⏳ En attente";
      case "rejected":
        return "✗ Rejeté";
      default:
        return "Non vérifié";
    }
  };

  return (
    <div className="bg-[#F9F7F4] min-h-dvh pb-32">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E7B5F] to-[#10B981] text-white px-4 py-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={profile.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"}
                alt={profile.firstName}
                className="w-20 h-20 rounded-full object-cover border-4 border-white"
              />
              <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold ${
                profile.verificationStatus === "verified"
                  ? "bg-green-500"
                  : profile.verificationStatus === "pending"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}>
                {profile.verificationStatus === "verified" ? "✓" : profile.verificationStatus === "pending" ? "?" : "✗"}
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h1>
              <p className="text-white/80 text-sm">{profile.email}</p>
              <div className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${getVerificationColor(profile.verificationStatus)}`}>
                {getVerificationLabel(profile.verificationStatus)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="px-4 max-w-lg mx-auto space-y-6 py-6">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(26,26,46,0.06)] p-1.5 flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? "bg-[#1E7B5F] text-white shadow"
                    : "text-[#5C5C70] hover:text-[#1A1A2E]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Informations Tab */}
        {activeTab === "infos" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#1A1A2E]">Informations Personnelles</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-[#1E7B5F] font-bold text-sm hover:text-[#165A47] transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Modifier
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#5C5C70] uppercase">Prénom</label>
                    <input
                      type="text"
                      value={editData.firstName}
                      onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-[#EFEAE0] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#1E7B5F]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#5C5C70] uppercase">Nom</label>
                    <input
                      type="text"
                      value={editData.lastName}
                      onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-[#EFEAE0] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#1E7B5F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#5C5C70] uppercase">Téléphone</label>
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-[#EFEAE0] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#1E7B5F]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#5C5C70] uppercase">Adresse</label>
                  <input
                    type="text"
                    value={editData.address}
                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-[#EFEAE0] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#1E7B5F]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#5C5C70] uppercase">Code Postal</label>
                    <input
                      type="text"
                      value={editData.postalCode}
                      onChange={(e) => setEditData({ ...editData, postalCode: e.target.value })}
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-[#EFEAE0] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#1E7B5F]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#5C5C70] uppercase">Ville</label>
                    <input
                      type="text"
                      value={editData.city}
                      onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-[#EFEAE0] text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#1E7B5F]"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1E7B5F] text-white font-bold hover:bg-[#165A47] transition-colors"
                  >
                    <Save className="w-5 h-5" />
                    Enregistrer
                  </button>
                  <button
                    onClick={() => {
                      setEditData(profile);
                      setIsEditing(false);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-[#1E7B5F] text-[#1E7B5F] font-bold hover:bg-[#1E7B5F]/5 transition-colors"
                  >
                    <X className="w-5 h-5" />
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { icon: Mail, label: "Email", value: profile.email },
                  { icon: Phone, label: "Téléphone", value: profile.phone },
                  { icon: MapPin, label: "Adresse", value: `${profile.address}, ${profile.postalCode} ${profile.city}` },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="bg-white rounded-xl p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#1E7B5F]/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#1E7B5F]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#5C5C70] uppercase">{item.label}</p>
                        <p className="text-sm text-[#1A1A2E] truncate">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Preferences Tab */}
        {activeTab === "preferences" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-4">Préférences de Notification</h2>

            {[
              { key: "notifications", label: "Notifications push", desc: "Alertes en temps réel" },
              { key: "emailUpdates", label: "Mises à jour par email", desc: "Résumés hebdomadaires" },
              { key: "smsAlerts", label: "Alertes SMS", desc: "Urgences et confirmations" },
              { key: "newsletter", label: "Newsletter", desc: "Conseils et actualités" },
            ].map((pref) => (
              <label key={pref.key} className="bg-white rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow">
                <input
                  type="checkbox"
                  checked={editData.preferences[pref.key as keyof typeof editData.preferences]}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      preferences: {
                        ...editData.preferences,
                        [pref.key]: e.target.checked,
                      },
                    })
                  }
                  className="w-5 h-5 rounded border-[#1E7B5F] text-[#1E7B5F] cursor-pointer"
                />
                <div className="flex-1">
                  <p className="font-bold text-[#1A1A2E]">{pref.label}</p>
                  <p className="text-xs text-[#5C5C70]">{pref.desc}</p>
                </div>
              </label>
            ))}

            <button
              onClick={handleSavePreferences}
              className="w-full py-3 rounded-xl bg-[#1E7B5F] text-white font-bold text-sm hover:bg-[#166048] transition-colors"
            >
              Enregistrer les préférences
            </button>
          </motion.div>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-4">Documents</h2>

            {profile.documents.length > 0 ? (
              profile.documents.map((doc) => (
                <div key={doc.id} className="bg-white rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#1E7B5F]/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#1E7B5F]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#1A1A2E] truncate">{doc.name}</p>
                      <p className="text-xs text-[#5C5C70]">{doc.type}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                      doc.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : doc.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {doc.status === "approved" ? "✓ Approuvé" : doc.status === "pending" ? "⏳ En attente" : "✗ Rejeté"}
                    </div>
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-[#1E7B5F] text-[#1E7B5F] font-bold text-sm hover:bg-[#1E7B5F]/5 transition-colors">
                    <Download className="w-4 h-4" />
                    Télécharger
                  </button>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl p-6 text-center">
                <FileText className="w-12 h-12 text-[#8A8A99] mx-auto mb-3 opacity-50" />
                <p className="text-[#5C5C70] font-bold">Aucun document</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-4">Sécurité</h2>

            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="w-full bg-white rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#1E7B5F]/10 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-[#1E7B5F]" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-[#1A1A2E]">Changer le mot de passe</p>
                  <p className="text-xs text-[#5C5C70]">Mise à jour recommandée tous les 3 mois</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#8A8A99]" />
            </button>

            {showPasswordForm && (
              <div className="bg-white rounded-xl p-4 space-y-3">
                <input
                  type="password"
                  placeholder="Nouveau mot de passe (min. 8 caractères)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-[#E5E5EA] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1E7B5F]/30"
                />
                <input
                  type="password"
                  placeholder="Confirmer le nouveau mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-[#E5E5EA] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1E7B5F]/30"
                />
                <button
                  onClick={handleChangePassword}
                  disabled={passwordLoading}
                  className="w-full py-2.5 rounded-lg bg-[#1E7B5F] text-white font-bold text-sm hover:bg-[#166048] transition-colors disabled:opacity-50"
                >
                  {passwordLoading ? "Mise à jour..." : "Valider le changement"}
                </button>
              </div>
            )}

            <div className="bg-[#E74C3C]/10 border border-[#E74C3C]/20 rounded-xl p-4 mt-6">
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#E74C3C] text-white font-bold hover:bg-[#C73D2D] transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Déconnexion
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default OwnerProfileComplete;
