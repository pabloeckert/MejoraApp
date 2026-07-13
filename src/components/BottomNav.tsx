import { Home, Users, ScanLine, Bot, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  badges?: Record<string, boolean>;
  hasDiagnostic?: boolean;
}

const tabs: { id: string; label: string; icon: typeof Home; accent?: boolean; mirror?: boolean }[] = [
  { id: "home",       label: "Inicio",   icon: Home },
  { id: "red",        label: "Red",      icon: Users },
  { id: "diagnostico",label: "Mirror",   icon: ScanLine, mirror: true },
  { id: "mentor",     label: "Mentor",   icon: Bot, accent: true },
  { id: "perfil",     label: "Perfil",   icon: UserCircle },
];

const BottomNav = ({ activeTab, onTabChange, badges, hasDiagnostic }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border" role="navigation" aria-label="Navegación principal">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const hasNew = badges?.[tab.id] ?? false;
          const showMirrorCta = tab.mirror && !hasDiagnostic && !isActive;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? "page" : undefined}
              aria-label={`${tab.label}${hasNew ? " (nuevo contenido)" : ""}${showMirrorCta ? " — ¡Hacé tu diagnóstico!" : ""}`}
              className={cn(
                "relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all",
                tab.mirror ? "min-w-[64px]" : "min-w-[60px]",
                isActive
                  ? tab.mirror
                    ? "text-white"
                    : "text-primary bg-primary/8 dark:bg-primary/12"
                  : tab.accent
                    ? "text-primary hover:text-primary/80"
                    : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.mirror ? (
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full transition-all",
                    isActive
                      ? "bg-brand-azul shadow-lg"
                      : "bg-brand-azul/90 hover:bg-brand-azul"
                  )}
                >
                  <Icon className="w-5 h-5 text-white stroke-[2px]" />
                  {showMirrorCta && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-rojo rounded-full border-2 border-card animate-pulse" />
                  )}
                </div>
              ) : (
                <div className="relative">
                  <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
                  {hasNew && !isActive && (
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-card animate-pulse" />
                  )}
                </div>
              )}
              <span className={cn(
                "text-caption",
                isActive
                  ? tab.mirror ? "font-medium text-brand-azul" : "font-medium text-brand-azul"
                  : tab.accent ? "font-semibold" : "font-medium"
              )}>
                {tab.label}
              </span>
              {tab.accent && !isActive && (
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
