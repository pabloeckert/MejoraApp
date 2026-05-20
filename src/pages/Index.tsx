import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import ContenidoDeValor from "@/components/tabs/ContenidoDeValor";
import Muro from "@/components/tabs/Muro";
import Novedades from "@/components/tabs/Novedades";
import Comunidad from "@/components/tabs/Comunidad";
import Mentor from "@/components/tabs/Mentor";
import DiagnosticTest from "@/components/DiagnosticTest";
import { MirrorPage } from "@/components/mirror/MirrorPage";
import Emergencia from "@/components/tabs/Emergencia";
import Eventos from "@/components/tabs/Eventos";
import CirculoDorado from "@/components/tabs/CirculoDorado";
import { MiPerfil } from "@/components/tabs/MiPerfil";
import ProfileCompleteModal from "@/components/ProfileCompleteModal";
import { RedTab } from "@/components/tabs/RedTab";
import { HomeDashboard } from "@/components/home/HomeDashboard";
import { trackPageView, trackTabSwitch } from "@/lib/analytics";
import { useLastVisit } from "@/hooks/useLastVisit";
import { useProfileComplete } from "@/hooks/useProfile";
import { SEOHead, SEO_CONFIGS } from "@/components/SEOHead";
import { FeatureBoundary } from "@/components/FeatureBoundary";

const SPLASH_SEEN_KEY = "mc-splash-seen";

const Index = () => {
  const { session, loading, user } = useAuth();
  const { isComplete: profileComplete, isLoading: profileLoading, profile } = useProfileComplete(user?.id);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    // Si viene del onboarding, abrir directo en la tab indicada
    const fromState = (location.state as { initialTab?: string } | null)?.initialTab;
    if (fromState) return fromState;
    // Default a "red" para usuarios que ya visitaron la app
    try {
      const visits = parseInt(sessionStorage.getItem("mc-visits") ?? "0", 10);
      sessionStorage.setItem("mc-visits", String(visits + 1));
      if (visits > 0) return "red";
    } catch { /* ignore */ }
    return "home";
  });
  const { badges, markVisited } = useLastVisit();
  const scrollPositions = useRef<Record<string, number>>({});

  // Listen for cross-tab navigation events (e.g., muro empty → diagnóstico)
  useEffect(() => {
    const handler = (e: Event) => {
      const tab = (e as CustomEvent).detail;
      if (tab) setActiveTab(tab);
    };
    window.addEventListener("navigate-tab", handler);
    return () => window.removeEventListener("navigate-tab", handler);
  }, []);

  // Track page view on mount and mark initial tab visited
  useEffect(() => {
    trackPageView("/");
    markVisited(activeTab);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Track tab switches, save/restore scroll position, and mark visited
  const handleTabChange = (tab: string) => {
    // Save current scroll position
    scrollPositions.current[activeTab] = window.scrollY;
    trackTabSwitch(activeTab, tab);
    markVisited(tab);
    setActiveTab(tab);
    // Restore scroll position for new tab (after render)
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPositions.current[tab] ?? 0);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-background">
        <div className="w-8 h-8 border-3 border-mc-dark-blue border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Cargando tu sesión…</p>
      </div>
    );
  }

  // Splash screen — primera visita
  if (!session && !sessionStorage.getItem(SPLASH_SEEN_KEY)) {
    return <Navigate to="/splash" replace />;
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  if (profileLoading || profileComplete === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-background">
        <div className="w-8 h-8 border-3 border-mc-dark-blue border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Verificando tu perfil…</p>
      </div>
    );
  }

  // Guard: usuarios nuevos (mirror_completed = false) van al onboarding antes de entrar
  if (profile?.mirror_completed === false && profile?.access_level !== "ADMIN") {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <SEOHead {...SEO_CONFIGS.index} />
      <AppHeader />
      <main className="max-w-lg mx-auto px-4 py-4" role="main">
        {activeTab === "home" && <FeatureBoundary feature="Home"><HomeDashboard onNavigate={handleTabChange} /></FeatureBoundary>}
        {activeTab === "contenido" && <FeatureBoundary feature="Contenido"><ContenidoDeValor /></FeatureBoundary>}
        {activeTab === "diagnostico" && <FeatureBoundary feature="Diagnóstico"><DiagnosticTest onComplete={() => setActiveTab("home")} /></FeatureBoundary>}
        {activeTab === "mirror" && <FeatureBoundary feature="Business Mirror"><MirrorPage /></FeatureBoundary>}
        {activeTab === "emergencia" && <FeatureBoundary feature="Emergencia"><Emergencia /></FeatureBoundary>}
        {activeTab === "eventos" && <FeatureBoundary feature="Eventos"><Eventos /></FeatureBoundary>}
        {activeTab === "circulo" && <FeatureBoundary feature="Círculo Dorado"><CirculoDorado /></FeatureBoundary>}
        {activeTab === "red" && <FeatureBoundary feature="Red"><RedTab /></FeatureBoundary>}
        {activeTab === "muro" && <FeatureBoundary feature="Muro"><Muro /></FeatureBoundary>}
        {activeTab === "comunidad" && <FeatureBoundary feature="Comunidad"><Comunidad /></FeatureBoundary>}
        {activeTab === "mentor" && <FeatureBoundary feature="Mentor IA"><Mentor /></FeatureBoundary>}
        {activeTab === "novedades" && <FeatureBoundary feature="Novedades"><Novedades /></FeatureBoundary>}
        {activeTab === "perfil" && <FeatureBoundary feature="Mi Perfil"><MiPerfil /></FeatureBoundary>}
      </main>
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        badges={badges}
        hasDiagnostic={!!sessionStorage.getItem("mc-diagnostic-done")}
      />

      {/* Profile completion modal — al completar, va al Mirror */}
      {!profileComplete && user && (
        <ProfileCompleteModal
          userId={user.id}
          onComplete={() => handleTabChange("diagnostico")}
        />
      )}
    </div>
  );
};

export default Index;
