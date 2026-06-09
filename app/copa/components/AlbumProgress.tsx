"use client";

import { AlbumStats } from '../types';

interface Props {
  stats: AlbumStats;
  compact?: boolean;
}

export default function AlbumProgress({ stats, compact }: Props) {
  const { total, owned, missing, duplicatesCount, percentage } = stats;

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#1a1a3e' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${percentage}%`, background: 'linear-gradient(90deg,#FFD700,#FF6B35)' }}
          />
        </div>
        <span className="text-sm font-bold tabular-nums" style={{ color: '#FFD700', minWidth: 40 }}>
          {percentage}%
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,215,0,0.2)' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-white text-sm">Progresso do Álbum</span>
        <span className="font-black text-2xl" style={{ color: '#FFD700' }}>{percentage}%</span>
      </div>
      <div className="w-full h-3 rounded-full overflow-hidden mb-3" style={{ background: '#0d0d2e' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percentage}%`, background: 'linear-gradient(90deg,#FFD700,#FF6B35)' }}
        />
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="font-black text-lg text-white">{owned}</div>
          <div className="text-xs" style={{ color: '#4ade80' }}>Tenho</div>
        </div>
        <div>
          <div className="font-black text-lg text-white">{missing}</div>
          <div className="text-xs" style={{ color: '#f87171' }}>Faltam</div>
        </div>
        <div>
          <div className="font-black text-lg text-white">{duplicatesCount}</div>
          <div className="text-xs" style={{ color: '#FFD700' }}>Repetidas</div>
        </div>
      </div>
    </div>
  );
}
