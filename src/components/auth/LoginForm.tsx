import { useState } from "react";
import { Eye, EyeOff, Loader2, Sparkles, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { trackLogin } from "@/lib/analytics";

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

const LoginForm = ({ onSwitchToSignup }: LoginFormProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendingMagicLink, setSendingMagicLink] = useState(false);

  const humanizeAuthError = (msg: string): string => {
    const lower = msg.toLowerCase();
    if (lower.includes("invalid login credentials") || lower.includes("invalid credentials"))
      return "Email o contraseña incorrectos. Verificá e intentá de nuevo.";
    if (lower.includes("email not confirmed") || lower.includes("email not verified"))
      return "Tu email todavía no fue confirmado. Revisá tu bandeja de entrada.";
    if (lower.includes("too many requests") || lower.includes("rate limit"))
      return "Demasiados intentos. Esperá unos minutos e intentá de nuevo.";
    if (lower.includes("user not found"))
      return "No existe una cuenta con ese email. ¿Querés registrarte?";
    if (lower.includes("network") || lower.includes("fetch"))
      return "Problema de conexión. Verificá tu internet e intentá de nuevo.";
    return "No pudimos iniciar sesión. Intentá de nuevo en unos segundos.";
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Error al iniciar sesión", description: humanizeAuthError(error.message), variant: "destructive" });
    } else {
      trackLogin("email");
    }
    setLoading(false);
  };

  const handleMagicLink = async () => {
    if (!email) {
      toast({
        title: "Ingresá tu email",
        description: "Escribí tu email para enviarte el enlace de acceso directo.",
        variant: "destructive",
      });
      return;
    }
    setSendingMagicLink(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      toast({
        title: "Enlace enviado al correo ✉️",
        description: "Revisá tu bandeja de entrada para ingresar con 1 solo click sin contraseña.",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast({
        title: "No se pudo enviar el enlace",
        description: humanizeAuthError(msg),
        variant: "destructive",
      });
    } finally {
      setSendingMagicLink(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Ingresá tu email",
        description: "Escribí tu email para recibir el link de recuperación.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast({ title: "Error", description: "No se pudo enviar el email de recuperación. Intentá de nuevo.", variant: "destructive" });
    } else {
      toast({ title: "Email enviado", description: "Revisá tu correo para restablecer tu contraseña." });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-password">Contraseña</Label>
        <div className="relative">
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pr-10"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-sm text-mc-blue hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <Button
        type="submit"
        className="w-full h-11 bg-mc-dark-blue hover:bg-mc-dark-blue/90 gap-2"
        disabled={loading || sendingMagicLink}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? "Ingresando…" : "Iniciar sesión"}
      </Button>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground font-bold">O también</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleMagicLink}
        disabled={loading || sendingMagicLink}
        className="w-full h-11 gap-2 border-[#1A3D84]/30 text-[#1A3D84] dark:text-blue-400 font-bold"
      >
        {sendingMagicLink ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Mail className="w-4 h-4" />
        )}
        Ingresar sin contraseña (Magic Link)
      </Button>

      <p className="text-center text-sm text-muted-foreground pt-2">
        ¿No tenés cuenta?{" "}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-mc-red font-semibold hover:underline"
        >
          Registrate
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
