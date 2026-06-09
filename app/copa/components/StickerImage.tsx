"use client";

import { Sticker } from '../types';

interface Props {
  sticker: Sticker;
  size?: number;
}

const POSITION_LABEL: Record<string, string> = {
  GOL: 'GL', ZAG: 'ZG', LAT: 'LT', VOL: 'VM', MEI: 'ME', ATA: 'AT',
};

export default function StickerImage({ sticker, size = 120 }: Props) {
  const [c1, c2] = sticker.colors;
  const s = size;
  const cx = s / 2;
  const cy = s / 2;

  if (sticker.type === 'flag') {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`bg-${sticker.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={c1} stopOpacity="0.15" />
            <stop offset="100%" stopColor={c2} stopOpacity="0.15" />
          </linearGradient>
          <clipPath id={`round-${sticker.id}`}>
            <rect width={s} height={s} rx={s * 0.12} />
          </clipPath>
        </defs>
        <rect width={s} height={s} rx={s * 0.12} fill={`url(#bg-${sticker.id})`} />
        <rect width={s} height={s} rx={s * 0.12} fill="none" stroke={c1} strokeWidth={s * 0.025} />
        <text x={cx} y={cy + 2} textAnchor="middle" dominantBaseline="middle" fontSize={s * 0.55}>{sticker.flag}</text>
        <text x={cx} y={s * 0.88} textAnchor="middle" dominantBaseline="middle" fontSize={s * 0.1} fill={c1} fontWeight="bold" fontFamily="system-ui">BANDEIRA</text>
      </svg>
    );
  }

  if (sticker.type === 'badge') {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`g-${sticker.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>
        </defs>
        <rect width={s} height={s} rx={s * 0.12} fill={`url(#g-${sticker.id})`} />
        <path d={`M ${cx} ${s * 0.15} L ${s * 0.8} ${s * 0.3} L ${s * 0.8} ${s * 0.6} Q ${cx} ${s * 0.85} ${s * 0.2} ${s * 0.6} L ${s * 0.2} ${s * 0.3} Z`} fill="white" opacity="0.9" />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize={s * 0.28} fill={c1} fontWeight="bold" fontFamily="system-ui">
          {sticker.teamCode}
        </text>
        <text x={cx} y={s * 0.88} textAnchor="middle" dominantBaseline="middle" fontSize={s * 0.09} fill="white" fontWeight="bold" fontFamily="system-ui" opacity="0.9">ESCUDO</text>
      </svg>
    );
  }

  if (sticker.type === 'coach') {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} xmlns="http://www.w3.org/2000/svg">
        <rect width={s} height={s} rx={s * 0.12} fill="#1a1a2e" />
        <rect width={s} height={s} rx={s * 0.12} fill="none" stroke={c1} strokeWidth={s * 0.03} />
        <circle cx={cx} cy={s * 0.38} r={s * 0.16} fill={c1} />
        <circle cx={cx} cy={s * 0.38} r={s * 0.12} fill="#f4c4a0" />
        <path d={`M ${cx - s * 0.22} ${s * 0.72} Q ${cx} ${s * 0.55} ${cx + s * 0.22} ${s * 0.72}`} fill={c1} />
        <text x={cx} y={s * 0.87} textAnchor="middle" dominantBaseline="middle" fontSize={s * 0.09} fill="white" fontWeight="bold" fontFamily="system-ui">TÉCNICO</text>
      </svg>
    );
  }

  if (sticker.type === 'player') {
    const pos = sticker.position ? POSITION_LABEL[sticker.position] ?? '' : '';
    const isGoal = sticker.position === 'GOL';
    const shirtColor = isGoal ? '#f5c518' : c1;
    const shirtAccent = isGoal ? '#d4a017' : c2;

    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`pg-${sticker.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f0f23" />
            <stop offset="100%" stopColor="#1a1a3e" />
          </linearGradient>
        </defs>
        <rect width={s} height={s} rx={s * 0.12} fill={`url(#pg-${sticker.id})`} />
        {sticker.stars && (
          <>
            <polygon points={`${cx},${s*0.07} ${cx+s*0.04},${s*0.14} ${cx+s*0.09},${s*0.14} ${cx+s*0.05},${s*0.18} ${cx+s*0.07},${s*0.24} ${cx},${s*0.2} ${cx-s*0.07},${s*0.24} ${cx-s*0.05},${s*0.18} ${cx-s*0.09},${s*0.14} ${cx-s*0.04},${s*0.14}`} fill="#FFD700" />
          </>
        )}
        {/* Head */}
        <circle cx={cx} cy={s * 0.36} r={s * 0.13} fill="#f4c4a0" />
        {/* Hair */}
        <ellipse cx={cx} cy={s * 0.26} rx={s * 0.11} ry={s * 0.06} fill="#3d2b1f" />
        {/* Body / Shirt */}
        <path d={`M ${cx - s*0.06} ${s*0.48} L ${cx - s*0.18} ${s*0.44} L ${cx - s*0.22} ${s*0.65} L ${cx + s*0.22} ${s*0.65} L ${cx + s*0.18} ${s*0.44} L ${cx + s*0.06} ${s*0.48} Z`} fill={shirtColor} />
        <path d={`M ${cx - s*0.06} ${s*0.48} L ${cx} ${s*0.5} L ${cx + s*0.06} ${s*0.48}`} fill={shirtAccent} />
        {/* Number on shirt */}
        <text x={cx} y={s * 0.59} textAnchor="middle" dominantBaseline="middle" fontSize={s * 0.14} fill="white" fontWeight="bold" fontFamily="system-ui">
          {sticker.playerNumber ?? ''}
        </text>
        {/* Legs */}
        <rect x={cx - s*0.13} y={s*0.65} width={s*0.1} height={s*0.15} rx={s*0.04} fill={c2 === '#FFFFFF' ? '#d0d0e0' : c2} />
        <rect x={cx + s*0.03} y={s*0.65} width={s*0.1} height={s*0.15} rx={s*0.04} fill={c2 === '#FFFFFF' ? '#d0d0e0' : c2} />
        {/* Position badge */}
        <rect x={s*0.05} y={s*0.85} width={s*0.28} height={s*0.1} rx={s*0.04} fill={c1} />
        <text x={s*0.19} y={s*0.905} textAnchor="middle" dominantBaseline="middle" fontSize={s*0.075} fill="white" fontWeight="bold" fontFamily="system-ui">{pos}</text>
        {/* Flag */}
        <text x={s*0.82} y={s*0.9} textAnchor="middle" dominantBaseline="middle" fontSize={s*0.14}>{sticker.flag}</text>
      </svg>
    );
  }

  if (sticker.type === 'squad') {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`sq-${sticker.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>
        </defs>
        <rect width={s} height={s} rx={s * 0.12} fill={`url(#sq-${sticker.id})`} />
        {/* Field lines */}
        <ellipse cx={cx} cy={cy - s*0.05} rx={s*0.35} ry={s*0.22} fill="none" stroke="white" strokeWidth={s*0.015} opacity="0.4" />
        <line x1={s*0.15} y1={cy - s*0.05} x2={s*0.85} y2={cy - s*0.05} stroke="white" strokeWidth={s*0.015} opacity="0.4" />
        {/* Players dots */}
        {[
          [cx, s*0.25], [cx-s*0.25, s*0.38], [cx, s*0.38], [cx+s*0.25, s*0.38],
          [cx-s*0.18, s*0.52], [cx+s*0.18, s*0.52], [cx-s*0.3, s*0.65], [cx, s*0.65], [cx+s*0.3, s*0.65],
          [cx-s*0.15, s*0.78], [cx+s*0.15, s*0.78],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={s * 0.04} fill="white" opacity="0.85" />
        ))}
        <text x={cx} y={s * 0.9} textAnchor="middle" dominantBaseline="middle" fontSize={s * 0.09} fill="white" fontWeight="bold" fontFamily="system-ui">SELEÇÃO</text>
      </svg>
    );
  }

  if (sticker.type === 'stadium') {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} xmlns="http://www.w3.org/2000/svg">
        <rect width={s} height={s} rx={s * 0.12} fill="#0d1b2a" />
        {/* Stadium shape */}
        <rect x={s*0.1} y={s*0.35} width={s*0.8} height={s*0.45} rx={s*0.04} fill="#1a3a5c" stroke="#4a9fe0" strokeWidth={s*0.02} />
        <ellipse cx={cx} cy={s*0.35} rx={s*0.4} ry={s*0.12} fill="#1a3a5c" stroke="#4a9fe0" strokeWidth={s*0.02} />
        {/* Field */}
        <ellipse cx={cx} cy={s*0.56} rx={s*0.28} ry={s*0.13} fill="#2d8a4e" />
        <line x1={cx} y1={s*0.43} x2={cx} y2={s*0.69} stroke="white" strokeWidth={s*0.01} opacity="0.5" />
        <ellipse cx={cx} cy={s*0.56} rx={s*0.07} ry={s*0.04} fill="none" stroke="white" strokeWidth={s*0.01} opacity="0.5" />
        <text x={cx} y={s*0.88} textAnchor="middle" dominantBaseline="middle" fontSize={s*0.08} fill="#4a9fe0" fontWeight="bold" fontFamily="system-ui">ESTÁDIO</text>
      </svg>
    );
  }

  if (sticker.type === 'special') {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id={`sp-${sticker.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#FF6B35" />
          </radialGradient>
        </defs>
        <rect width={s} height={s} rx={s * 0.12} fill="#0d0d1a" />
        {/* Glow */}
        <circle cx={cx} cy={cy} r={s*0.38} fill={`url(#sp-${sticker.id})`} opacity="0.15" />
        {/* Star */}
        <polygon
          points={Array.from({length:5}, (_,i) => {
            const outer = [cx + s*0.28*Math.cos((i*4*Math.PI/5)-Math.PI/2), cy + s*0.28*Math.sin((i*4*Math.PI/5)-Math.PI/2)];
            const inner = [cx + s*0.12*Math.cos(((i*4+2)*Math.PI/5)-Math.PI/2), cy + s*0.12*Math.sin(((i*4+2)*Math.PI/5)-Math.PI/2)];
            return `${outer[0]},${outer[1]} ${inner[0]},${inner[1]}`;
          }).join(' ')}
          fill="#FFD700"
        />
        <text x={cx} y={s*0.73} textAnchor="middle" dominantBaseline="middle" fontSize={s*0.085} fill="#FFD700" fontWeight="bold" fontFamily="system-ui">CRAQUE</text>
        <text x={cx} y={s*0.85} textAnchor="middle" dominantBaseline="middle" fontSize={s*0.075} fill="#FF6B35" fontWeight="bold" fontFamily="system-ui">ESPECIAL</text>
      </svg>
    );
  }

  // intro / default
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`in-${sticker.id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a237e" />
          <stop offset="100%" stopColor="#283593" />
        </linearGradient>
      </defs>
      <rect width={s} height={s} rx={s * 0.12} fill={`url(#in-${sticker.id})`} />
      <text x={cx} y={cy - s*0.06} textAnchor="middle" dominantBaseline="middle" fontSize={s*0.35}>⚽</text>
      <text x={cx} y={s*0.75} textAnchor="middle" dominantBaseline="middle" fontSize={s*0.085} fill="#FFD700" fontWeight="bold" fontFamily="system-ui">COPA 2026</text>
    </svg>
  );
}
