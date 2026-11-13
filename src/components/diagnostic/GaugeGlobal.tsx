import { useEffect, useRef, useState, useCallback } from "react";
import { zonaColor } from "@/data/diagnosticData";

interface GaugeGlobalProps {
  value: number;
  onComplete?: () => void;
  size?: "sm" | "lg";
  className?: string;
}

const CX = 100,
  CY = 100,
  R = 70,
  NR = 55;
const CALC_MS = 600,
  ANIM_MS = 1400;

function pt(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

function arcSeg(cx: number, cy: number, r: number, a1: number, a2: number): string {
  const s = pt(cx, cy, r, a1);
  const e = pt(cx, cy, r, a2);
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 0 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function GaugeGlobal({ value, onComplete, size = "lg", className }: GaugeGlobalProps) {
  const [phase, setPhase] = useState<"idle" | "calc" | "anim" | "done">("idle");
  const [needleDeg, setNeedleDeg] = useState(180);
  const [displayVal, setDisplayVal] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const targetDeg = 180 - (Math.min(100, Math.max(0, value)) / 100) * 180;

  const startAnim = useCallback(() => {
    setPhase("anim");
    const t0 = performance.now();
    function frame(now: number) {
      const t = Math.min((now - t0) / ANIM_MS, 1);
      const e = easeOutCubic(t);
      setNeedleDeg(180 - e * (180 - targetDeg));
      setDisplayVal(Math.round(e * value));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        setNeedleDeg(targetDeg);
        setDisplayVal(value);
        setPhase("done");
        onComplete?.();
      }
    }
    rafRef.current = requestAnimationFrame(frame);
  }, [value, targetDeg, onComplete]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let tid: ReturnType<typeof setTimeout>;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase("calc");
          tid = setTimeout(startAnim, CALC_MS);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      clearTimeout(tid);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [startAnim]);

  const needleEnd = pt(CX, CY, NR, needleDeg);
  const w = size === "sm" ? 200 : 230;
  const h = size === "sm" ? 130 : 140;

  return (
    <div ref={containerRef} className={className ?? "flex flex-col items-center my-4"}>
      <svg viewBox="0 0 200 130" width={w} height={h} overflow="visible">
        {/* Zonas semafóricas: Crítico (180° a 120°), En desarrollo (120° a 60°), Sólido (60° a 0°) */}
        <path
          d={arcSeg(CX, CY, R, 180, 120)}
          fill="none"
          stroke={zonaColor(0).color}
          strokeWidth={14}
          strokeLinecap="butt"
        />
        <path
          d={arcSeg(CX, CY, R, 120, 60)}
          fill="none"
          stroke={zonaColor(50).color}
          strokeWidth={14}
          strokeLinecap="butt"
        />
        <path
          d={arcSeg(CX, CY, R, 60, 0)}
          fill="none"
          stroke={zonaColor(100).color}
          strokeWidth={14}
          strokeLinecap="butt"
        />

        {/* Aguja */}
        <line
          x1={CX}
          y1={CY}
          x2={needleEnd.x.toFixed(2)}
          y2={needleEnd.y.toFixed(2)}
          stroke="currentColor"
          className="text-foreground"
          strokeWidth={2.5}
          strokeLinecap="round"
        />

        {/* Eje central */}
        <circle cx={CX} cy={CY} r={5} fill="currentColor" className="text-foreground" />

        {/* Valor central */}
        <text
          x={CX}
          y={112}
          textAnchor="middle"
          fontSize="22"
          fontWeight="800"
          fill="currentColor"
          className="text-foreground font-sans"
        >
          {phase === "calc" ? "..." : `${displayVal}%`}
        </text>
        <text
          x={CX}
          y={125}
          textAnchor="middle"
          fontSize="9"
          fontWeight="600"
          letterSpacing="0.05em"
          fill="currentColor"
          className="text-muted-foreground uppercase"
        >
          Madurez Estructural
        </text>
      </svg>
    </div>
  );
}

export default GaugeGlobal;
