import { useMembership } from '@/hooks/useMembership';
import { MEMBERSHIP_CONFIG } from '@/lib/brand';

const BADGE_STYLES = {
  n0:    { bg: 'rgba(107,114,128,0.08)', border: '#374151', text: '#6B7280' },
  n1:    { bg: 'rgba(26,61,132,0.10)',   border: '#1A3D84', text: '#1A3D84' },
  n2:    { bg: 'rgba(247,204,19,0.12)',  border: '#F7CC13', text: '#B8930A' },
  admin: { bg: 'rgba(225,6,30,0.10)',    border: '#E1061E', text: '#E1061E' },
} as const;

interface MembershipBadgeProps {
  onClick?: () => void;
}

export function MembershipBadge({ onClick }: MembershipBadgeProps) {
  const { level } = useMembership();
  const style = BADGE_STYLES[level];
  const label = level === 'admin' ? 'Admin' : MEMBERSHIP_CONFIG[level as keyof typeof MEMBERSHIP_CONFIG]?.label ?? 'Free';

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.dispatchEvent(new CustomEvent('navigate-tab', { detail: 'perfil' }));
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center justify-center px-3 rounded-full text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-80 active:scale-95"
      style={{
        minHeight: 44,
        background: style.bg,
        border: `1px solid ${style.border}`,
        color: style.text,
        fontFamily: "'League Spartan', 'Bw Modelica', system-ui, sans-serif",
      }}
      aria-label={`Nivel de membresía: ${label}`}
    >
      {label}
    </button>
  );
}
