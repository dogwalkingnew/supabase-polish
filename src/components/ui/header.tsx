import { Button } from "@/components/ui/button";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Menu, Dog, Home, Calendar, Shield, CreditCard, BookOpen, Users, MapPin, PlusCircle, Search, HelpCircle, ChevronDown, LogOut, Megaphone } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate, Link } from "react-router-dom";


export const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!supabase) return;

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (!session) { setUserType(null); return; }
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", session.user.id)
        .single();
      setUserType(profile?.user_type || null);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session);
      if (!session) { setUserType(null); return; }
      setTimeout(() => {
        supabase
          .from("profiles")
          .select("user_type")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => setUserType(data?.user_type || null));
      }, 0);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fermer le dropdown desktop au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    navigate("/");
    setIsOpen(false);
  };

  const serviceLinks = [
    { href: "/services/promenade", label: "Promenade (Extérieur)", icon: Dog },
    { href: "/services/garde", label: "Hébergement (Chez L'Accompagnateur)", icon: Home },
    { href: "/services/visite", label: "Visite (Chez Le Propriétaire)", icon: Calendar },
    { href: "/services/garde-domicile", label: "Garde (Chez Le Propriétaire)", icon: Shield },
    { href: "/services/garde-multi-animaux", label: "Garde Multi-Animaux (Chez Le Propriétaire)", icon: BookOpen },
    { href: "/services/marche-reguliere", label: "Marche Régulière (Extérieur)", icon: Users },
  ];

  const tarifsLinks = [
    { href: "/tarifs", label: "Services & modalités", icon: CreditCard },
    { href: "/nous-sommes-presents", label: "Disponibles Près De Vous", icon: MapPin },
  ];

  const navLinks = [
    { href: "/", label: "Accueil", icon: Home, buttonClass: "font-bold text-slate-800 dark:text-slate-200" },
    { label: "Nos Services", icon: Dog, isDropdown: true, subLinks: serviceLinks, buttonClass: "font-bold text-slate-800 dark:text-slate-200" },
    {
      href: "/walkers",
      label: "Trouvez votre Accompagnateur / Déposer une Annonce Libre",
      icon: Search,
      customLabel: (
        <span className="flex flex-col leading-tight text-center">
          <span>Trouvez votre Accompagnateur</span>
          <span>Déposer une Annonce Libre</span>
        </span>
      ),
      buttonClass: "font-bold text-slate-800 dark:text-slate-200",
    },
    { label: "Services & zones", icon: CreditCard, isDropdown: true, subLinks: tarifsLinks, buttonClass: "font-bold text-slate-800 dark:text-slate-200", customLabel: (
        <span className="flex flex-col leading-tight text-center">
          <span>Services & zones</span>
          <span className="text-xs font-bold">Modalités à confirmer</span>
        </span>
      ) },
    { href: "/blog", label: "Blog", icon: BookOpen, buttonClass: "font-bold text-slate-800 dark:text-slate-200" },
    { href: "/support", label: "Aide", icon: HelpCircle, buttonClass: "font-bold text-slate-800 dark:text-slate-200" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="dogwalking-brand-mark w-10 h-10" aria-hidden="true">
            <Dog className="h-5 w-5" strokeWidth={2.4} />
          </div>
          <span className="dogwalking-wordmark text-xl">Dog<span>Walking</span></span>
        </Link>

        {/* ========== NAVIGATION LARGE ÉCRAN — menu latéral avant le seuil tablette ========== */}
        <nav className="hidden lg:flex items-center gap-1 lg:gap-4">
          {navLinks.map((link) =>
            link.isDropdown ? (
              <div key={link.label} className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                  className={`flex items-center gap-1 text-sm transition-colors py-2 px-2 rounded-lg ${
                    openDropdown === link.label ? "text-primary bg-primary/5" : (link as any).buttonClass || "font-bold text-slate-800 dark:text-slate-200"
                  } hover:text-primary`}
                >
                  {link.label}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${openDropdown === link.label ? "rotate-180" : ""}`} />
                </button>

                <div
                  className={`absolute top-full left-0 mt-1 w-64 bg-card border border-border rounded-xl shadow-xl p-2 z-50 overflow-hidden transition-all duration-300 ease-in-out origin-top ${
                    openDropdown === link.label
                      ? "opacity-100 scale-y-100 translate-y-0"
                      : "opacity-0 scale-y-0 -translate-y-4 pointer-events-none"
                  }`}
                >
                  {link.subLinks?.map((subLink) => (
                    <button
                      key={subLink.href}
                      onClick={() => { navigate(subLink.href); setOpenDropdown(null); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all text-left group"
                    >
                      <div className="w-8 h-8 rounded-full bg-muted group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                        <subLink.icon className="h-4 w-4 group-hover:text-primary" />
                      </div>
                      <span className="font-medium">{subLink.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={link.href}
                to={link.href!}
                className={`text-sm transition-colors px-2 py-2 whitespace-nowrap ${
                  (link as any).buttonClass || "font-bold text-slate-800 dark:text-slate-200"
                } hover:text-primary`}
              >
                {(link as any).customLabel || link.label}
              </Link>
            )
          )}
        </nav>

        {/* ========== RIGHT ACTIONS ========== */}
        <div className="flex items-center gap-2 shrink-0">
          {isAuthenticated && <NotificationCenter />}

          {/* Desktop auth buttons */}
          <div className="hidden lg:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="font-bold text-slate-800 dark:text-slate-200"
              onClick={() => navigate(isAuthenticated ? (userType === "walker" ? "/walker/dashboard" : "/dashboard") : "/auth")}
            >
              {isAuthenticated ? "Mon Espace" : "Connexion"}
            </Button>
            {!isAuthenticated && (
              <Button variant="default" size="sm" className="font-bold" onClick={() => navigate("/auth?type=owner")}>
                S'inscrire
              </Button>
            )}
          </div>

          {/* ========== MENU COMPACT — visible sous lg pour préserver les cibles tactiles ========== */}
          <Sheet open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) setMobileOpenDropdown(null);
          }}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Ouvrir le menu de navigation">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 pb-6 border-b">
                  <div className="dogwalking-brand-mark h-9 w-9" aria-hidden="true">
                    <Dog className="h-4 w-4" strokeWidth={2.4} />
                  </div>
                  <span className="dogwalking-wordmark text-xl">Dog<span>Walking</span></span>
                </div>

                <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Navigation</p>

                  {navLinks.map((link, index) =>
                    link.isDropdown ? (
                      <div key={`dropdown-${index}`} className="space-y-1">
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMobileOpenDropdown(prev => prev === link.label ? null : link.label); }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            mobileOpenDropdown === link.label ? "text-primary bg-primary/5" : "text-muted-foreground hover:bg-accent"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <link.icon className="h-4 w-4" />
                            {link.label}
                          </div>
                          <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${mobileOpenDropdown === link.label ? "rotate-180" : ""}`} />
                        </button>
                        {mobileOpenDropdown === link.label && (
                          <div className="ml-8 space-y-1 border-l border-border pl-4 mt-1 animate-in fade-in slide-in-from-top-2 duration-200">
                            {link.subLinks?.map((subLink) => (
                              <Link
                                key={subLink.href}
                                to={subLink.href}
                                onClick={() => { setIsOpen(false); setMobileOpenDropdown(null); }}
                                className="flex items-center gap-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-primary transition-colors"
                              >
                                {subLink.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        key={`link-${index}`}
                        to={link.href!}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                      >
                        <link.icon className="h-4 w-4 text-muted-foreground" />
                        {(link as any).customLabel || link.label}
                      </Link>
                    )
                  )}

                  <div className="pt-6 mt-6 border-t space-y-3">
                    {isAuthenticated ? (
                      <>
                        <Button
                          variant="default"
                          className="w-full"
                          onClick={() => { navigate(userType === "walker" ? "/walker/dashboard" : "/dashboard"); setIsOpen(false); }}
                        >
                          Mon Espace
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
                          <LogOut className="h-4 w-4" />
                          Déconnexion
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" className="w-full" onClick={() => { navigate("/auth"); setIsOpen(false); }}>
                          Connexion
                        </Button>
                        <Button className="w-full" onClick={() => { navigate("/auth?type=owner"); setIsOpen(false); }}>
                          S'inscrire gratuitement
                        </Button>
                      </>
                    )}
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
