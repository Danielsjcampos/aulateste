"use client";

import { useState } from 'react';
import { Sticker } from '../types';
import { getFlagUrl } from '../lib/flags';

interface Props {
  sticker: Sticker;
  size?: number;
}

const POSITION_LABEL: Record<string, string> = {
  GOL: 'GOL', ZAG: 'ZAG', LAT: 'LAT', VOL: 'VOL', MEI: 'MEI', ATA: 'ATA',
};

const POSITION_COLOR: Record<string, string> = {
  GOL: '#f5c518', ZAG: '#4ade80', LAT: '#60a5fa', VOL: '#c084fc', MEI: '#fb923c', ATA: '#f87171',
};

export default function StickerImage({ sticker, size = 120 }: Props) {
  const [flagLoaded, setFlagLoaded] = useState(false);
  const [flagError, setFlagError] = useState(false);

  const [c1, c2] = sticker.colors;
  const s = size;
  const cx = s / 2;

  if (sticker.type === 'flag') {
    const flagUrl = sticker.teamCode ? getFlagUrl(sticker.teamCode, 80) : '';
    return (
      <div
        className="relative overflow-hidden rounded-xl"
        style={{
          width: s, height: s,
          background: `linear-gradient(135deg, ${c1}22, ${c2}22)`,
          border: `2px solid ${c1}55`,
        }}
      >
        {flagUrl && !flagError ? (
          <>
            {!flagLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span style={{ fontSize: s * 0.5 }}>{sticker.flag}</span>
              </div>
            )}
            <img
              src={flagUrl}
              alt={sticker.name}
              onLoad={() => setFlagLoaded(true)}
              onError={() => setFlagError(true)}
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover',
                opacity: flagLoaded ? 1 : 0,
                transition: 'opacity 0.3s',
              }}
            />
            {flagLoaded && (
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7) 100%)' }} />
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span style={{ fontSize: s * 0.5 }}>{sticker.flag}</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 px-1 pb-1">
          <p className="text-center font-black truncate" style={{ fontSize: s * 0.09, color: 'white', textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>
            {sticker.teamCode}
          </p>
        </div>
        <div className="absolute top-1 right-1 rounded-full px-1" style={{ background: `${c1}cc`, fontSize: s * 0.08 }}>
          <span className="font-bold text-white">FLAG</span>
        </div>
      </div>
    );
  }

  if (sticker.type === 'badge') {
    const flagUrl = sticker.teamCode ? getFlagUrl(sticker.teamCode, 40) : '';
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`g-${sticker.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2 === '#FFFFFF' ? c1 + '88' : c2} />
          </linearGradient>
          <clipPath id={`shield-${sticker.id}`}>
            <path d={`M ${cx} ${s * 0.12} L ${s * 0.82} ${s * 0.28} L ${s * 0.82} ${s * 0.62} Q ${cx} ${s * 0.88} ${s * 0.18} ${s * 0.62} L ${s * 0.18} ${s * 0.28} Z`} />
          </clipPath>
        </defs>
        <rect width={s} height={s} rx={s * 0.12} fill="#0d0d22" />
        {/* Shield */}
        <path d={`M ${cx} ${s * 0.12} L ${s * 0.82} ${s * 0.28} L ${s * 0.82} ${s * 0.62} Q ${cx} ${s * 0.88} ${s * 0.18} ${s * 0.62} L ${s * 0.18} ${s * 0.28} Z`} fill={`url(#g-${sticker.id})`} />
        {flagUrl ? (
          <image href={flagUrl} x={s * 0.22} y={s * 0.28} width={s * 0.56} height={s * 0.38} clipPath={`url(#shield-${sticker.id})`} preserveAspectRatio="xMidYMid slice" />
        ) : (
          <text x={cx} y={s * 0.52} textAnchor="middle" dominantBaseline="middle" fontSize={s * 0.24} fill="white" fontWeight="bold" fontFamily="system-ui">{sticker.teamCode}</text>
        )}
        <path d={`M ${cx} ${s * 0.12} L ${s * 0.82} ${s * 0.28} L ${s * 0.82} ${s * 0.62} Q ${cx} ${s * 0.88} ${s * 0.18} ${s * 0.62} L ${s * 0.18} ${s * 0.28} Z`} fill="none" stroke="white" strokeWidth={s * 0.018} opacity="0.7" />
        <text x={cx} y={s * 0.94} textAnchor="middle" dominantBaseline="middle" fontSize={s * 0.085} fill="#FFD700" fontWeight="bold" fontFamily="system-ui">ESCUDO</text>
      </svg>
    );
  }

  if (sticker.type === 'coach') {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`cg-${sticker.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1a3e" />
            <stop offset="100%" stopColor="#0d0d22" />
          </linearGradient>
        </defs>
        <rect width={s} height={s} rx={s * 0.12} fill={`url(#cg-${sticker.id})`} />
        <rect x={0} y={0} width={s} height={s * 0.28} rx={s * 0.12} fill={c1} opacity="0.8" />
        <rect x={0} y={s * 0.22} width={s} height={s * 0.06} fill={c1} opacity="0.8" />
        <text x={cx} y={s * 0.14} textAnchor="middle" dominantBaseline="middle" fontSize={s * 0.1} fill="white" fontWeight="bold" fontFamily="system-ui">TÉCNICO</text>
        {/* Body silhouette */}
        <circle cx={cx} cy={s * 0.42} r={s * 0.13} fill="#f5d6b8" />
        <ellipse cx={cx} cy={s * 0.41} rx={s * 0.1} ry={s * 0.06} fill="#3d2b1f" />
        <path d={`M ${cx - s * 0.2} ${s * 0.8} Q ${cx} ${s * 0.56} ${cx + s * 0.2} ${s * 0.8}`} fill={c1} opacity="0.9" />
        {/* Clipboard */}
        <rect x={cx + s * 0.08} y={s * 0.52} width={s * 0.2} height={s * 0.26} rx={s * 0.03} fill="white" opacity="0.9" />
        <line x1={cx + s * 0.11} y1={s * 0.58} x2={cx + s * 0.25} y2={s * 0.58} stroke={c1} strokeWidth={s * 0.015} />
        <line x1={cx + s * 0.11} y1={s * 0.63} x2={cx + s * 0.25} y2={s * 0.63} stroke={c1} strokeWidth={s * 0.015} />
        <line x1={cx + s * 0.11} y1={s * 0.68} x2={cx + s * 0.22} y2={s * 0.68} stroke={c1} strokeWidth={s * 0.015} />
        <text x={cx - s * 0.1} y={s * 0.93} textAnchor="middle" dominantBaseline="middle" fontSize={s * 0.085} fill="white" fontFamily="system-ui">{sticker.teamCode}</text>
        <text x={cx + s * 0.2} y={s * 0.93} textAnchor="middle" dominantBaseline="middle" fontSize={s * 0.12}>{sticker.flag}</text>
      </svg>
    );
  }

  if (sticker.type === 'player') {
    const pos = sticker.position ? POSITION_LABEL[sticker.position] ?? '' : '';
    const posColor = sticker.position ? POSITION_COLOR[sticker.position] ?? '#FFD700' : '#FFD700';
    const isGoal = sticker.position === 'GOL';
    const shirtC1 = isGoal ? '#f5c518' : c1;
    const shirtC2 = isGoal ? '#e6b800' : (c2 === '#FFFFFF' ? '#ddddee' : c2);

    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`pg-${sticker.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c1} stopOpacity="0.18" />
            <stop offset="100%" stopColor="#080818" />
          </linearGradient>
          <linearGradient id={`sh-${sticker.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={shirtC1} />
            <stop offset="100%" stopColor={shirtC2} stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <rect width={s} height={s} rx={s * 0.12} fill="#0d0d22" />
        <rect width={s} height={s} rx={s * 0.12} fill={`url(#pg-${sticker.id})`} />

        {/* Stars for top players */}
        {sticker.stars && (
          <g>
            <polygon points={`${cx - s*0.02},${s*0.06} ${cx + s*0.025},${s*0.12} ${cx + s*0.08},${s*0.12} ${cx + s*0.04},${s*0.16} ${cx + s*0.06},${s*0.22} ${cx - s*0.02},${s*0.18} ${cx - s*0.1},${s*0.22} ${cx - s*0.08},${s*0.16} ${cx - s*0.12},${s*0.12} ${cx - s*0.07},${s*0.12}`} fill="#FFD700" />
          </g>
        )}

        {/* Head */}
        <circle cx={cx} cy={s * (sticker.stars ? 0.38 : 0.33)} r={s * 0.115} fill="#f5d6b8" />
        <ellipse cx={cx} cy={s * (sticker.stars ? 0.29 : 0.24)} rx={s * 0.1} ry={s * 0.06} fill="#3d2b1f" />
        <circle cx={cx - s * 0.04} cy={s * (sticker.stars ? 0.37 : 0.32)} r={s * 0.015} fill="#c8956d" />
        <circle cx={cx + s * 0.04} cy={s * (sticker.stars ? 0.37 : 0.32)} r={s * 0.015} fill="#c8956d" />

        {/* Shirt */}
        {(() => {
          const baseY = sticker.stars ? 0.49 : 0.44;
          return (
            <>
              <path d={`M ${cx - s*0.07} ${s*baseY} L ${cx - s*0.2} ${s*(baseY-0.04)} L ${cx - s*0.23} ${s*(baseY+0.16)} L ${cx + s*0.23} ${s*(baseY+0.16)} L ${cx + s*0.2} ${s*(baseY-0.04)} L ${cx + s*0.07} ${s*baseY} Z`} fill={`url(#sh-${sticker.id})`} />
              {/* V-neck */}
              <path d={`M ${cx - s*0.05} ${s*baseY} L ${cx} ${s*(baseY+0.05)} L ${cx + s*0.05} ${s*baseY}`} fill={shirtC2} opacity="0.6" />
              {/* Number */}
              <text x={cx} y={s*(baseY+0.1)} textAnchor="middle" dominantBaseline="middle" fontSize={s * 0.14} fill="white" fontWeight="black" fontFamily="system-ui" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                {sticker.playerNumber ?? ''}
              </text>
            </>
          );
        })()}

        {/* Shorts */}
        {(() => {
          const shortY = sticker.stars ? 0.66 : 0.61;
          return (
            <>
              <rect x={cx - s*0.15} y={s*shortY} width={s*0.13} height={s*0.12} rx={s*0.03} fill={shirtC2 === '#ddddee' ? '#8888aa' : shirtC2} opacity="0.9" />
              <rect x={cx + s*0.02} y={s*shortY} width={s*0.13} height={s*0.12} rx={s*0.03} fill={shirtC2 === '#ddddee' ? '#8888aa' : shirtC2} opacity="0.9" />
            </>
          );
        })()}

        {/* Bottom bar */}
        <rect x={0} y={s*0.85} width={s} height={s*0.15} rx={s*0.08} fill={c1} opacity="0.85" />
        <rect x={0} y={s*0.85} width={s} height={s*0.07} fill={c1} opacity="0.85" />

        {/* Position badge */}
        <rect x={s*0.04} y={s*0.865} width={s*0.35} height={s*0.11} rx={s*0.04} fill={posColor} opacity="0.9" />
        <text x={s*0.215} y={s*0.925} textAnchor="middle" dominantBaseline="middle" fontSize={s*0.075} fill="black" fontWeight="black" fontFamily="system-ui">{pos}</text>

        {/* Flag */}
        <text x={s*0.82} y={s*0.925} textAnchor="middle" dominantBaseline="middle" fontSize={s*0.13}>{sticker.flag}</text>
      </svg>
    );
  }

  if (sticker.type === 'squad') {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`sq-${sticker.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2 === '#FFFFFF' ? c1 + '88' : c2} />
          </linearGradient>
        </defs>
        <rect width={s} height={s} rx={s * 0.12} fill={`url(#sq-${sticker.id})`} />
        {/* Football pitch lines */}
        <rect x={s*0.1} y={s*0.1} width={s*0.8} height={s*0.75} rx={s*0.03} fill="none" stroke="white" strokeWidth={s*0.015} opacity="0.5" />
        <line x1={s*0.1} y1={s*0.475} x2={s*0.9} y2={s*0.475} stroke="white" strokeWidth={s*0.015} opacity="0.5" />
        <circle cx={cx} cy={s*0.475} r={s*0.1} fill="none" stroke="white" strokeWidth={s*0.015} opacity="0.5" />
        <rect x={s*0.3} y={s*0.1} width={s*0.4} height={s*0.18} fill="none" stroke="white" strokeWidth={s*0.012} opacity="0.4" />
        <rect x={s*0.3} y={s*0.72} width={s*0.4} height={s*0.13} fill="none" stroke="white" strokeWidth={s*0.012} opacity="0.4" />
        {/* Formation dots - 4-3-3 */}
        {[
          [cx, s*0.22],
          [s*0.22, s*0.36], [s*0.4, s*0.36], [s*0.6, s*0.36], [s*0.78, s*0.36],
          [s*0.28, s*0.52], [cx, s*0.52], [s*0.72, s*0.52],
          [s*0.22, s*0.7], [cx, s*0.66], [s*0.78, s*0.7],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={s * 0.04} fill="white" opacity="0.9" />
        ))}
        <text x={cx} y={s * 0.92} textAnchor="middle" dominantBaseline="middle" fontSize={s * 0.09} fill="white" fontWeight="bold" fontFamily="system-ui">SELEÇÃO</text>
      </svg>
    );
  }

  if (sticker.type === 'stadium') {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} xmlns="http://www.w3.org/2000/svg">
        <rect width={s} height={s} rx={s * 0.12} fill="#060d1a" />
        {/* Sky gradient */}
        <defs>
          <linearGradient id={`sky-${sticker.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a3a6c" />
            <stop offset="100%" stopColor="#0d1f3c" />
          </linearGradient>
          <radialGradient id={`lights-${sticker.id}`} cx="50%" cy="30%" r="40%">
            <stop offset="0%" stopColor="#fffbe0" stopOpacity="0.15" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect x={s*0.04} y={s*0.08} width={s*0.92} height={s*0.65} rx={s*0.04} fill={`url(#sky-${sticker.id})`} />
        <rect x={s*0.04} y={s*0.08} width={s*0.92} height={s*0.65} rx={s*0.04} fill={`url(#lights-${sticker.id})`} />
        {/* Stadium bowl */}
        <ellipse cx={cx} cy={s*0.58} rx={s*0.42} ry={s*0.14} fill="#1a3a1a" stroke="#4a8a4a" strokeWidth={s*0.012} />
        {/* Stands */}
        <path d={`M ${s*0.08} ${s*0.54} L ${s*0.15} ${s*0.32} L ${s*0.85} ${s*0.32} L ${s*0.92} ${s*0.54} Z`} fill="#1e3a6e" stroke="#3a6aae" strokeWidth={s*0.012} />
        {/* Stand rows */}
        {[0.38, 0.43, 0.48].map((y, i) => (
          <line key={i} x1={s*0.15} y1={s*y} x2={s*0.85} y2={s*y} stroke="#2a4a8e" strokeWidth={s*0.01} />
        ))}
        {/* Floodlights */}
        {[0.16, 0.84].map((x, i) => (
          <g key={i}>
            <rect x={s*x - s*0.015} y={s*0.16} width={s*0.03} height={s*0.16} fill="#8888aa" />
            <rect x={s*x - s*0.04} y={s*0.13} width={s*0.08} height={s*0.04} rx={s*0.01} fill="#fffbe0" />
          </g>
        ))}
        {/* Field */}
        <ellipse cx={cx} cy={s*0.56} rx={s*0.28} ry={s*0.09} fill="#2d8a4e" />
        <line x1={cx} y1={s*0.47} x2={cx} y2={s*0.65} stroke="white" strokeWidth={s*0.01} opacity="0.6" />
        <ellipse cx={cx} cy={s*0.56} rx={s*0.06} ry={s*0.03} fill="none" stroke="white" strokeWidth={s*0.01} opacity="0.6" />
        {/* Bottom label */}
        <rect x={0} y={s*0.82} width={s} height={s*0.18} rx={s*0.08} fill="#0d0d22" />
        <rect x={0} y={s*0.82} width={s} height={s*0.09} fill="#0d0d22" />
        <text x={cx} y={s*0.91} textAnchor="middle" dominantBaseline="middle" fontSize={s*0.08} fill="#4a9fe0" fontWeight="bold" fontFamily="system-ui">ESTÁDIO</text>
      </svg>
    );
  }

  if (sticker.type === 'special') {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id={`sp-${sticker.id}`} cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FF6B35" stopOpacity="0.05" />
          </radialGradient>
          <linearGradient id={`sb-${sticker.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a0a00" />
            <stop offset="100%" stopColor="#0d0d22" />
          </linearGradient>
        </defs>
        <rect width={s} height={s} rx={s * 0.12} fill={`url(#sb-${sticker.id})`} />
        <rect width={s} height={s} rx={s * 0.12} fill={`url(#sp-${sticker.id})`} />
        <rect width={s} height={s} rx={s * 0.12} fill="none" stroke="#FFD700" strokeWidth={s*0.025} opacity="0.5" />
        {/* Shine lines */}
        {[0.2, 0.35, 0.5, 0.65, 0.8].map((x, i) => (
          <line key={i} x1={s*x} y1={0} x2={s*(x-0.15)} y2={s} stroke="#FFD700" strokeWidth={s*0.008} opacity={0.04 + i*0.01} />
        ))}
        {/* Star */}
        <polygon
          points={[0,1,2,3,4].flatMap((i) => {
            const a1 = (i * 4 * Math.PI / 5) - Math.PI / 2;
            const a2 = ((i * 4 + 2) * Math.PI / 5) - Math.PI / 2;
            return [
              `${cx + s*0.27*Math.cos(a1)},${s*0.42 + s*0.27*Math.sin(a1)}`,
              `${cx + s*0.11*Math.cos(a2)},${s*0.42 + s*0.11*Math.sin(a2)}`,
            ];
          }).join(' ')}
          fill="#FFD700"
        />
        <text x={cx} y={s*0.75} textAnchor="middle" dominantBaseline="middle" fontSize={s*0.088} fill="#FFD700" fontWeight="black" fontFamily="system-ui">⭐ CRAQUE</text>
        <text x={cx} y={s*0.88} textAnchor="middle" dominantBaseline="middle" fontSize={s*0.075} fill="#FF9E4A" fontWeight="bold" fontFamily="system-ui">ESPECIAL</text>
      </svg>
    );
  }

  // intro / default
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`in-${sticker.id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a1060" />
          <stop offset="100%" stopColor="#0d0d22" />
        </linearGradient>
      </defs>
      <rect width={s} height={s} rx={s * 0.12} fill={`url(#in-${sticker.id})`} />
      <rect width={s} height={s} rx={s * 0.12} fill="none" stroke="#FFD70055" strokeWidth={s*0.02} />
      <text x={cx} y={s*0.42} textAnchor="middle" dominantBaseline="middle" fontSize={s*0.38}>⚽</text>
      <text x={cx} y={s*0.72} textAnchor="middle" dominantBaseline="middle" fontSize={s*0.1} fill="#FFD700" fontWeight="bold" fontFamily="system-ui">COPA</text>
      <text x={cx} y={s*0.84} textAnchor="middle" dominantBaseline="middle" fontSize={s*0.09} fill="#FF9E4A" fontWeight="bold" fontFamily="system-ui">2026</text>
    </svg>
  );
}
