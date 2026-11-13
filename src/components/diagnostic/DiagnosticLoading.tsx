/** DiagnosticLoading — Pantalla de cálculo dimensional del Mirror Estratégico */

export const DiagnosticLoading = () => (
  <div className="max-w-xl mx-auto animate-fade-in">
    <div className="bg-card border border-border rounded-2xl shadow-sm p-8 sm:p-10 text-center space-y-4">
      <div
        className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto"
        style={{ borderColor: "#1A3D84", borderTopColor: "transparent" }}
      />
      <div className="space-y-1.5">
        <span className="text-[11px] font-extrabold tracking-widest uppercase text-muted-foreground block">
          Procesando Diagnóstico
        </span>
        <h2 className="text-lg sm:text-xl font-black text-foreground">
          Auditando la estructura de tu negocio…
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Calculando tu nivel de madurez en las 4 Dimensiones: Personal, Organizacional, Comercial y Empresarial.
        </p>
      </div>
    </div>
  </div>
);
