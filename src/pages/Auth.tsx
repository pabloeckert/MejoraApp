import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { trackLogin } from "@/lib/analytics";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import GoogleButton from "@/components/auth/GoogleButton";
import AdminLoginForm from "@/components/auth/AdminLoginForm";
import { SEOHead, SEO_CONFIGS } from "@/components/SEOHead";
import logoComunidad from "@/assets/logo-comunidad.png";
import logoBlanco from "@/assets/logo-blanco.png";

type AuthMode = "login" | "signup" | "admin";

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [googleLoading, setGoogleLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (session) navigate("/", { replace: true });
  }, [session, navigate]);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setGoogleLoading(false);
    } else {
      trackLogin("google");
    }
  };

  const handleAdminSuccess = () => {
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <SEOHead {...SEO_CONFIGS.auth} />
      <div className="w-full max-w-sm space-y-5">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <img
            src={logoComunidad}
            alt="Mejora Continua - Comunidad de Negocios"
            className="h-14 object-contain dark:hidden"
          />
          <img
            src={logoBlanco}
            alt="Mejora Continua - Comunidad de Negocios"
            className="h-14 object-contain hidden dark:block"
          />
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            {mode === "admin" ? (
              /* Admin login — replaces the normal form */
              <AdminLoginForm
                onBack={() => setMode("login")}
                onSuccess={handleAdminSuccess}
              />
            ) : (
              /* Normal user flow */
              <>
                {/* Segmented Switcher for Login / Signup */}
                <div className="flex rounded-xl bg-muted p-1 mb-5">
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      mode === "login"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      mode === "signup"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Crear Cuenta
                  </button>
                </div>

                <GoogleButton onClick={handleGoogleLogin} disabled={googleLoading} />

                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground font-semibold">o con email</span>
                  </div>
                </div>

                {mode === "login" ? (
                  <LoginForm onSwitchToSignup={() => setMode("signup")} />
                ) : (
                  <SignupForm onSwitchToLogin={() => setMode("login")} />
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Discreet admin link in footer */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setMode(mode === "admin" ? "login" : "admin")}
            aria-label="Acceso directivo"
            title="Acceso directivo"
            className="flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors py-1 px-2 rounded-md"
          >
            <Shield className="w-3 h-3" />
            <span>{mode === "admin" ? "Volver al acceso de miembros" : "Acceso directivo"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
