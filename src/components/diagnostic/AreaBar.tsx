import { useEffect, useState } from "react";
import { zonaColor } from "@/data/diagnosticData";

interface AreaBarProps {
  nombre: string;
  porcentaje: number;
  delay?: number;
  start?: boolean;
}

export function AreaBar({ nombre, porcentaje, delay = 0, start = true }: AreaBarProps) {
  const [width, setWidth] = useState(0);
  const { color, zona } = zonaColor(porcentaje);
  const [barColor, setBarColor] = useState(color);

  const porcentajeMostrado = Math.min(100, Math.max(0, Math.round(porcentaje)));

  useEffect(() => {
    if (!start) return;
    const t = setTimeout(() => {
      setWidth(porcentajeMostrado);
      setBarColor(color);
    }, delay);
    return () => clearTimeout(t);
  }, [porcentajeMostrado, delay, color, start]);

  return (
    <div
      className="mb-3 rounded-xl p-3.5 border transition-all duration-300"
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-sm font-bold text-foreground">{nombre}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">{porcentajeMostrado}%</span>
          <span
            className="text-[11px] font-bold px-2.5 py-0.5 rounded-full text-white"
            style={{
              backgroundColor: color,
              color: zona === "En desarrollo" ? "#1A1A1A" : "#FFFFFF",
            }}
          >
            {zona}
          </span>
        </div>
      </div>
      <div
        className="rounded-full overflow-hidden w-full"
        style={{ height: "7px", backgroundColor: "rgba(128, 128, 128, 0.2)" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            backgroundColor: barColor,
            transition:
              "width 1400ms cubic-bezier(0.34, 1.56, 0.64, 1), background-color 1400ms ease-out",
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}

export default AreaBar;
