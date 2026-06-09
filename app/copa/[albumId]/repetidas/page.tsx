"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { getAlbum, setDuplicates, getStats } from '../../lib/store';
import { Album, Sticker } from '../../types';
import { stickers, TOTAL_STICKERS } from '../../data/stickers';
import StickerImage from '../../components/StickerImage';
import AlbumProgress from '../../components/AlbumProgress';
import CopaHeader from '../../components/CopaHeader';
import SearchBar from '../../components/SearchBar';

interface PageProps {
  params: Promise<{ albumId: string }>;
}

function DupRow({ sticker, count, onInc, onDec }: { sticker: Sticker; count: number; onInc: () => void; onDec: () => void }) {
  const [c1] = sticker.colors;
  return (
    <div className="flex items-center gap-3 py-3 px-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${c1}33` }}>
      <div className="shrink-0">
        <StickerImage sticker={sticker} size={52} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white text-sm truncate">{sticker.name}</p>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
          #{sticker.id} · {sticker.team ?? sticker.section}
          {sticker.position && ` · ${sticker.position}`}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onDec}
          disabled={count <= 0}
          className="w-8 h-8 rounded-lg font-bold text-lg flex items-center justify-center transition-all hover:opacity-80 disabled:opacity-30"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'white' }}
        >
          −
        </button>
        <span className="w-6 text-center font-black text-lg" style={{ color: count > 0 ? '#FFD700' : 'rgba(255,255,255,0.3)' }}>
          {count}
        </span>
        <button
          onClick={onInc}
          className="w-8 h-8 rounded-lg font-bold text-lg flex items-center justify-center transition-all hover:opacity-80"
          style={{ background: 'rgba(255,215,0,0.15)', color: '#FFD700' }}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function RepetidosPage({ params }: PageProps) {
  const { albumId } = use(params);
  const [album, setAlbum] = useState<Album | null>(null);
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'has' | 'all'>('has');

  useEffect(() => { setAlbum(getAlbum(albumId)); }, [albumId]);

  const handleChange = (stickerId: number, delta: number) => {
    const current = album?.stickers[stickerId]?.duplicates ?? 0;
    const updated = setDuplicates(albumId, stickerId, current + delta);
    if (updated) setAlbum(updated);
  };

  if (!album) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link href="/copa" style={{ color: '#FFD700' }}>← Voltar</Link>
      </div>
    );
  }

  const stats = getStats(album, TOTAL_STICKERS);
  const q = query.toLowerCase().trim();

  const displayStickers = stickers.filter((s) => {
    if (mode === 'has' && !(album.stickers[s.id]?.owned)) return false;
    if (q) {
      const match = s.name.toLowerCase().includes(q)
        || String(s.id).includes(q)
        || (s.team ?? '').toLowerCase().includes(q)
        || (s.teamCode ?? '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const withDups = displayStickers.filter((s) => (album.stickers[s.id]?.duplicates ?? 0) > 0);
  const totalDupUnits = withDups.reduce((acc, s) => acc + (album.stickers[s.id]?.duplicates ?? 0), 0);

  return (
    <>
      <CopaHeader
        crumbs={[{ label: album.name, href: `/copa/${albumId}` }, { label: 'Repetidas' }]}
        albumName={album.owner}
      />
      <div className="sticky top-[57px] z-40 px-4 py-3" style={{ background: 'rgba(8,8,24,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,215,0,0.08)' }}>
        <div className="max-w-3xl mx-auto"><AlbumProgress stats={stats} compact /></div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="rounded-2xl p-4 text-center" style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)' }}>
            <div className="font-black text-3xl" style={{ color: '#FFD700' }}>{withDups.length}</div>
            <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>tipos com repetidas</div>
          </div>
          <div className="rounded-2xl p-4 text-center" style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)' }}>
            <div className="font-black text-3xl" style={{ color: '#60a5fa' }}>{totalDupUnits}</div>
            <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>unidades para trocar</div>
          </div>
        </div>

        <div className="mb-4">
          <SearchBar value={query} onChange={setQuery} placeholder="Buscar figurinha..." />
        </div>

        <div className="flex gap-2 mb-5">
          <button onClick={() => setMode('has')} className="px-4 py-2 rounded-xl text-sm font-bold transition-all" style={{ background: mode === 'has' ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)', color: mode === 'has' ? '#FFD700' : 'rgba(255,255,255,0.5)', border: `1px solid ${mode === 'has' ? 'rgba(255,215,0,0.4)' : 'rgba(255,255,255,0.08)'}` }}>
            Que Tenho
          </button>
          <button onClick={() => setMode('all')} className="px-4 py-2 rounded-xl text-sm font-bold transition-all" style={{ background: mode === 'all' ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)', color: mode === 'all' ? '#FFD700' : 'rgba(255,255,255,0.5)', border: `1px solid ${mode === 'all' ? 'rgba(255,215,0,0.4)' : 'rgba(255,255,255,0.08)'}` }}>
            Todas
          </button>
          <Link href={`/copa/${albumId}/trocas`} className="ml-auto px-4 py-2 rounded-xl text-sm font-bold transition-opacity hover:opacity-80" style={{ background: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }}>
            Gerar Lista de Trocas →
          </Link>
        </div>

        {displayStickers.length === 0 ? (
          <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <div className="text-4xl mb-3">🔁</div>
            <p>Nenhuma figurinha encontrada</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {displayStickers.map((s) => (
              <DupRow
                key={s.id}
                sticker={s}
                count={album.stickers[s.id]?.duplicates ?? 0}
                onInc={() => handleChange(s.id, 1)}
                onDec={() => handleChange(s.id, -1)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
