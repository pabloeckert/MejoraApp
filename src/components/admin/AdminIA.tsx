import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  CheckCircle,
  XCircle,
  ExternalLink,
  Loader2,
  Sparkles,
  Server,
  Cpu,
  Save,
  Brain,
} from "lucide-react";

interface MentorConfig {
  id: string;
  enabled: boolean;
  thinking_level: "HIGH" | "MEDIUM" | "LOW";
  system_prompt: string;
  updated_at?: string;
}

const AdminIA = () => {
  const { toast } = useToast();
  const [testing, setTesting] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [config, setConfig] = useState<MentorConfig>({
    id: "default",
    enabled: true,
    thinking_level: "HIGH",
    system_prompt: "",
  });

  useEffect(() => {
    supabase
      .from("mentor_config")
      .select("key, value, updated_at")
      .then(({ data }) => {
        if (data && data.length > 0) {
          const map = new Map(data.map((r) => [r.key, r.value]));
          setConfig({
            id: "default",
            enabled: map.get("enabled") !== "false",
            thinking_level: (map.get("thinking_level") as "HIGH" | "MEDIUM" | "LOW") || "HIGH",
            system_prompt: map.get("system_prompt") || "",
            updated_at: data[0]?.updated_at,
          });
        }
        setLoadingConfig(false);
      });
  }, []);

  const handleSaveConfig = async () => {
    setSavingConfig(true);
    try {
      const now = new Date().toISOString();
      const updates = [
        { key: "enabled", value: String(config.enabled), updated_at: now },
        { key: "thinking_level", value: config.thinking_level, updated_at: now },
        { key: "system_prompt", value: config.system_prompt, updated_at: now },
      ];

      for (const row of updates) {
        const { error } = await supabase
          .from("mentor_config")
          .upsert(row, { onConflict: "key" });
        if (error) throw error;
      }

      toast({
        title: "Configuración guardada ✅",
        description: "El Mentor IA ya está operando con los nuevos parámetros.",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast({ title: "Error al guardar", description: msg, variant: "destructive" });
    } finally {
      setSavingConfig(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: { category: "tip" },
      });

      if (error) throw error;

      if (data?.titulo) {
        toast({
          title: "IA funcionando ✅",
          description: `Generó: "${data.titulo.slice(0, 50)}..."`,
        });
      } else if (data?.error) {
        toast({ title: "Error de IA", description: data.error, variant: "destructive" });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Control Central del Mentor IA (2026-2027)</h2>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
          Gemini 3.8 Flash · Thinking High
        </span>
      </div>

      {/* Panel de Configuración Dinámica de Mentor IA */}
      <Card className="border-primary/20 bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Brain className="w-4 h-4 text-[#1A3D84]" />
            Parámetros de Ejecución del Mentor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingConfig ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/40 border border-border">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground block">
                    Disponibilidad del Mentor en la App
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    Activa o pausa temporalmente las consultas con el Mentor para todos los usuarios.
                  </p>
                </div>
                <Switch
                  checked={config.enabled}
                  onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, enabled: checked }))}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">
                  Nivel de Razonamiento (Thinking Level)
                </label>
                <div className="flex gap-2">
                  {(["HIGH", "MEDIUM", "LOW"] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, thinking_level: level }))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                        config.thinking_level === level
                          ? "bg-[#1A3D84] text-white border-[#1A3D84]"
                          : "bg-secondary/40 text-muted-foreground border-border hover:border-[#1A3D84]/40"
                      }`}
                    >
                      {level} {level === "HIGH" && "(Recomendado 2026)"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">
                  Directiva Complementaria de Sistema (System Prompt override)
                </label>
                <Textarea
                  value={config.system_prompt}
                  onChange={(e) => setConfig((prev) => ({ ...prev, system_prompt: e.target.value }))}
                  placeholder="Directivas adicionales para afinar el tono de Pablo Eckert, criterios de diagnóstico o alertas de crisis..."
                  className="min-h-[80px] text-xs bg-secondary/30"
                />
              </div>

              <Button
                onClick={handleSaveConfig}
                disabled={savingConfig}
                className="w-full gap-2 text-white font-extrabold text-xs"
                style={{ backgroundColor: "#1A3D84" }}
              >
                {savingConfig ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Guardar Configuración en Producción
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Server-side status */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Server className="w-4 h-4" />
            Cadena de Modelos Server-Side
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Las Edge Functions usan Gemini 3.8 Flash con Thinking Level para análisis profundo y Generative UI, con cascada de fail-safe automática:
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 py-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium">Gemini 3.8 Flash (Google DeepMind)</span>
              <span className="text-caption font-bold text-emerald-600 ml-auto">Principal · Thinking HIGH</span>
            </div>
            <div className="flex items-center gap-2 py-1.5">
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="text-sm font-medium">Gemini 3.5 Flash-Lite</span>
              <span className="text-caption text-muted-foreground ml-auto">Moderación Rápida</span>
            </div>
            <div className="flex items-center gap-2 py-1.5">
              <div className="w-2 h-2 rounded-full bg-orange-400" />
              <span className="text-sm font-medium">Groq (Llama 3.3 70B Versatile)</span>
              <span className="text-caption text-muted-foreground ml-auto">Fallback 1</span>
            </div>
            <div className="flex items-center gap-2 py-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-sm font-medium">OpenRouter (DeepSeek V3)</span>
              <span className="text-caption text-muted-foreground ml-auto">Fallback 2</span>
            </div>
          </div>

          <Button onClick={handleTest} disabled={testing} className="w-full gap-2">
            {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Probar Conectividad de Generación
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminIA;
