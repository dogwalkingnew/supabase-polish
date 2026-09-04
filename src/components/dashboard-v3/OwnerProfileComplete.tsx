/** DogWalking — profil Propriétaire : modifications de données réelles et sécurité Auth, sans statut de vérification ou préférences de diffusion simulés. */
/* Direction visuelle : project-gem, fiche Propriétaire émeraude/sable, lecture large sur desktop et confort tactile sur mobile. */
import { useState } from "react";
import { User, Mail, Phone, MapPin, Lock, LogOut, Edit2, Save, X, ChevronRight, Loader2, CheckCircle2 } from "lucide-react";
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
  createdAt: string;
}

interface OwnerProfileCompleteProps {
  profile: OwnerProfile;
  onUpdate?: (profile: Partial<OwnerProfile>) => Promise<boolean> | boolean | void;
  onLogout?: () => void;
}

const OwnerProfileComplete = ({ profile, onUpdate, onLogout }: OwnerProfileCompleteProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(profile);
  const [activeTab, setActiveTab] = useState<"infos" | "security">("infos");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword.length < 8) return toast.error("Le mot de passe doit contenir au moins 8 caractères.");
    if (newPassword !== confirmPassword) return toast.error("Les deux mots de passe ne correspondent pas.");
    setPasswordLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordLoading(false);
    if (error) return toast.error("Impossible de changer le mot de passe.");
    toast.success("Mot de passe mis à jour.");
    setShowPasswordForm(false);
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSave = async () => {
    setProfileSaving(true);
    setProfileSaved(false);
    try {
      const result = await onUpdate?.(editData);
      if (result !== false) {
        setProfileSaved(true);
        toast.success("Profil mis à jour.");
        setIsEditing(false);
      }
    } finally {
      setProfileSaving(false);
    }
  };

  const tabs = [{ key: "infos" as const, label: "Informations", icon: User }, { key: "security" as const, label: "Sécurité", icon: Lock }];
  const initials = `${profile.firstName.slice(0, 1)}${profile.lastName.slice(0, 1)}`.toUpperCase() || "P";

  return <div className="min-h-dvh bg-warm/70 pb-28"><header className="bg-primary px-4 py-8 text-white"><div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-0 sm:px-2 lg:px-4">{profile.avatar ? <img src={profile.avatar} alt={`${profile.firstName} ${profile.lastName}`} className="h-16 w-16 rounded-full border-4 border-white object-cover" /> : <div aria-hidden="true" className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white/15 text-xl font-bold">{initials}</div>}<div className="min-w-0"><h1 className="truncate text-2xl font-bold">{profile.firstName} {profile.lastName}</h1><p className="truncate text-sm text-white/80">{profile.email}</p></div></div></header><main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-10"><nav className="flex gap-1 rounded-2xl bg-white p-1.5 shadow-sm" aria-label="Profil Propriétaire">{tabs.map((tab) => { const Icon = tab.icon; const active = activeTab === tab.key; return <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)} className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition-colors ${active ? "bg-primary text-white" : "text-muted-foreground hover:bg-primary/5"}`}><Icon className="h-4 w-4" />{tab.label}</button>; })}</nav>{activeTab === "infos" && <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4"><div className="flex items-center justify-between gap-3"><div><h2 className="text-xl font-bold text-foreground">Informations personnelles</h2>{profileSaved && <p className="mt-1 flex items-center gap-2 text-sm font-medium text-emerald-700" role="status"><CheckCircle2 className="h-4 w-4" />Modifications enregistrées.</p>}</div>{!isEditing && <button type="button" onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-sm font-bold text-primary"><Edit2 className="h-4 w-4" />Modifier</button>}</div>{isEditing ? <div className="space-y-3 rounded-2xl bg-white p-4 shadow-sm"><div className="grid grid-cols-2 gap-3"><label className="text-xs font-bold text-muted-foreground">Prénom<input value={editData.firstName} onChange={(event) => setEditData({ ...editData, firstName: event.target.value })} className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm text-foreground" /></label><label className="text-xs font-bold text-muted-foreground">Nom<input value={editData.lastName} onChange={(event) => setEditData({ ...editData, lastName: event.target.value })} className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm text-foreground" /></label></div><label className="block text-xs font-bold text-muted-foreground">Téléphone<input type="tel" value={editData.phone} onChange={(event) => setEditData({ ...editData, phone: event.target.value })} className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm text-foreground" /></label><label className="block text-xs font-bold text-muted-foreground">Adresse<input value={editData.address} onChange={(event) => setEditData({ ...editData, address: event.target.value })} className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm text-foreground" /></label><div className="grid grid-cols-2 gap-3"><label className="text-xs font-bold text-muted-foreground">Code postal<input value={editData.postalCode} onChange={(event) => setEditData({ ...editData, postalCode: event.target.value })} className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm text-foreground" /></label><label className="text-xs font-bold text-muted-foreground">Ville<input value={editData.city} onChange={(event) => setEditData({ ...editData, city: event.target.value })} className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm text-foreground" /></label></div><div className="flex gap-2 pt-2"><button type="button" onClick={handleSave} disabled={profileSaving} aria-busy={profileSaving} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">{profileSaving ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />Enregistrement…</> : <><Save className="h-4 w-4" />Enregistrer</>}</button><button type="button" disabled={profileSaving} onClick={() => { setEditData(profile); setIsEditing(false); }} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-primary/30 py-3 text-sm font-bold text-primary disabled:opacity-60"><X className="h-4 w-4" />Annuler</button></div></div> : <div className="space-y-3">{[{ icon: Mail, label: "E-mail", value: profile.email }, { icon: Phone, label: "Téléphone", value: profile.phone || "Non renseigné" }, { icon: MapPin, label: "Adresse", value: [profile.address, profile.postalCode, profile.city].filter(Boolean).join(", ") || "Non renseignée" }].map((item) => { const Icon = item.icon; return <div key={item.label} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Icon className="h-5 w-5 text-primary" /></div><div className="min-w-0"><p className="text-xs font-bold uppercase text-muted-foreground">{item.label}</p><p className="truncate text-sm text-foreground">{item.value}</p></div></div>; })}</div>}</motion.section>}{activeTab === "security" && <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3"><h2 className="text-xl font-bold text-foreground">Sécurité du compte</h2><button type="button" onClick={() => setShowPasswordForm((value) => !value)} className="flex w-full items-center justify-between rounded-xl bg-white p-4 text-left shadow-sm"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Lock className="h-5 w-5 text-primary" /></div><div><p className="font-bold text-foreground">Changer le mot de passe</p><p className="text-xs text-muted-foreground">Utilisez un mot de passe unique et suffisamment long.</p></div></div><ChevronRight className="h-5 w-5 text-muted-foreground" /></button>{showPasswordForm && <div className="space-y-3 rounded-xl bg-white p-4 shadow-sm"><input type="password" autoComplete="new-password" placeholder="Nouveau mot de passe (8 caractères minimum)" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="w-full rounded-lg border border-input px-3 py-2 text-sm" /><input type="password" autoComplete="new-password" placeholder="Confirmer le nouveau mot de passe" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full rounded-lg border border-input px-3 py-2 text-sm" /><button type="button" onClick={handleChangePassword} disabled={passwordLoading} aria-busy={passwordLoading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-bold text-white disabled:opacity-50">{passwordLoading ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />Mise à jour…</> : "Valider le changement"}</button></div>}<button type="button" onClick={onLogout} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/30 py-3 text-sm font-bold text-destructive"><LogOut className="h-4 w-4" />Déconnexion</button></motion.section>}</main></div>;
};

export default OwnerProfileComplete;
