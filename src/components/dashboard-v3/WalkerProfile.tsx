import { Star, MapPin, Award, ShieldCheck, BadgeCheck, GraduationCap, Edit3 } from "lucide-react";
import WalkerHero from "./WalkerHero";
import heroImg from "@/assets/walker-hero-home.jpg";
import avatar from "@/assets/avatar-walker.jpg";

interface WalkerProfileProps {
  name: string;
  bio: string;
  rating: number;
  reviews: number;
  zone: string;
  specialities: string[];
  badges: { label: string; verified?: boolean }[];
}

const WalkerProfile = ({ name, bio, rating, reviews, zone, specialities, badges }: WalkerProfileProps) => {
  return (
    <div className="bg-[#0E1428] min-h-dvh pb-28 text-white">
      <WalkerHero image={heroImg} alt={`Profil ${name}`} />

      <main className="px-4 -mt-12 max-w-lg mx-auto space-y-5 relative z-10">
        {/* Profile card */}
        <article className="bg-[#1A2240] rounded-3xl p-5 ring-1 ring-white/5">
          <div className="flex items-end gap-4 -mt-12">
            <img src={avatar} alt={name} className="w-24 h-24 rounded-2xl object-cover ring-4 ring-[#0E1428] shadow-xl" />
            <div className="flex-1 pb-1">
              <h1 className="text-2xl font-bold leading-tight">{name}</h1>
              <div className="flex items-center gap-2 mt-1 text-sm">
                <Star className="w-4 h-4 fill-[#D4A574] text-[#D4A574]" />
                <span className="font-semibold">{rating.toFixed(1)}/5</span>
                <span className="text-white/50">({reviews} avis)</span>
              </div>
            </div>
            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center ring-1 ring-white/10" aria-label="Éditer"><Edit3 className="w-4 h-4 text-[#D4A574]" /></button>
          </div>
          <p className="text-sm text-white/80 leading-relaxed mt-4">{bio}</p>
          <div className="inline-flex items-center gap-1.5 mt-3 text-xs text-white/70"><MapPin className="w-3.5 h-3.5 text-[#D4A574]" />{zone}</div>
        </article>

        {/* Specialities */}
        <section>
          <h2 className="text-lg font-bold mb-3 px-1">Spécialités</h2>
          <div className="flex flex-wrap gap-2">
            {specialities.map((s) => (
              <span key={s} className="px-3 py-1.5 rounded-full bg-[#1A2240] text-sm text-white/90 ring-1 ring-[#D4A574]/30">{s}</span>
            ))}
          </div>
        </section>

        {/* Badges */}
        <section>
          <h2 className="text-lg font-bold mb-3 px-1">Badges & Certifications</h2>
          <div className="grid grid-cols-2 gap-3">
            {badges.map((b) => (
              <article key={b.label} className="bg-[#1A2240] rounded-2xl p-4 ring-1 ring-white/5 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#D4A574]/20 flex items-center justify-center">
                  {b.verified ? <ShieldCheck className="w-5 h-5 text-[#27AE60]" /> : <Award className="w-5 h-5 text-[#D4A574]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{b.label}</p>
                  {b.verified && <p className="text-[10px] text-[#27AE60] inline-flex items-center gap-1"><BadgeCheck className="w-3 h-3" />Vérifié</p>}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Formation */}
        <section className="bg-gradient-to-br from-[#10B981]/30 to-transparent rounded-2xl p-4 ring-1 ring-[#D4A574]/30 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#D4A574]/20 flex items-center justify-center"><GraduationCap className="w-6 h-6 text-[#D4A574]" /></div>
          <div className="flex-1">
            <p className="font-bold">Centre de formation</p>
            <p className="text-xs text-white/60">Améliorez vos compétences et gagnez plus</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default WalkerProfile;
