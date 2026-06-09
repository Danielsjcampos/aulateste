"use client";

import { useState, useEffect, useMemo, use } from 'react';
import Link from 'next/link';
import { getAlbum, toggleSticker, getStats } from '../../lib/store';
import { Album } from '../../types';
import { stickers, TOTAL_STICKERS } from '../../data/stickers';
import StickerCard from '../../components/StickerCard';
import SearchBar from '../../components/SearchBar';
import AlbumProgress from '../../components/AlbumProgress';
import CopaHeader from '../../components/CopaHeader';

interface PageProps {
  params: Promise<{ albumId: string }>;
}

type FilterMode = 'all' | 'owned' | 'missing' | 'duplicated';

export default function BuscaPage({ params }: PageProps) {
  const { albumId } = use(params);
  const [album, setAlbum] = useState<Album | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterMode>('all');
  const [stickerSize] = useState<'sm' | 'md'>('sm');

  useEffect(() => {
    setAlbum(getAlbum(albumId));
  }, [albumId]);

  const handleToggle = (stickerId: number) => {
    const updated = toggleSticker(albumId, stickerId);
    if (updated) setAlbum(updated);
  };

  const isOwned = (id: number) => album?.stickers[id]?.owned ?? false;
  const getDups = (id: number) => album?.stickers[id]?.duplicates ?? 0;

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return stickers.filter((s) => {
      if (q) {
        const match = s.name.toLowerCase().includes(q)
          || String(s.id).includes(q)
          || (s.team ?? '').toLowerCase().includes(q)
          || (s.teamCode ?? '').toLowerCase().includes(q)
          || (s.position ?? '').toLowerCase().includes(q);
        if (!match) return false;
      }
      if (filter === 'owned') return isOwned(s.id);
      if (filter === 'missing') return !isOwned(s.id);
      if (filter === 'duplicated') return isOwned(s.id) && getDups(s.id) > 0;
      return true;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filter, album]);

  if (!album) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link href="/copa" style={{ color: '#FFD700' }}>← Voltar</Link>
      </div>
    );
  }

  const stats = getStats(album, TOTAL_STICKERS);

  const FILTERS: { key: FilterMode; label: string; color: string }[] = [
    { key: 'all', label: 'Todas', color: '#FFD700' },
    { key: 'owned', label: '✅ Tenho', color: '#4ade80' },
    { key: 'missing', label: '❌ Faltam', color: '#f87171' },
    { key: 'duplicated', label: '🔁 Repetidas', color: '#60a5fa' },
  ];

  return (
    <>
      <CopaHeader
        crumbs={[{ label: album.name, href: `/copa/${albumId}` }, { label: 'Busca' }]}
        albumName={album.owner}
      />
      <div className="sticky top-[57px] z-40 px-4 py-3" style={{ background: 'rgba(8,8,24,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,215,0,0.08)' }}>
        <div className="max-w-5xl mx-auto"><AlbumProgress stats={stats} compact /></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="mb-5">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Buscar por nome, número, time, posição..."
          />
        </div>

        <div className="flex gap-2 mb-5 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
              style={{
                background: filter === f.key ? f.color + '22' : 'rgba(255,255,255,0.05)',
                color: filter === f.key ? f.color : 'rgba(255,255,255,0.5)',
                border: `1px solid ${filter === f.key ? f.color + '66' : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {filtered.length} figurinha{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
          </p>
          {query && (
            <button onClick={() => setQuery('')} className="text-xs" style={{ color: 'rgba(255,215,0,0.6)' }}>Limpar busca</button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <div className="text-4xl mb-3">🔍</div>
            <p>Nenhuma figurinha encontrada</p>
            {query && <p className="text-sm mt-1">Tente outro termo de busca</p>}
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {filtered.map((s) => (
              <StickerCard
                key={s.id}
                sticker={s}
                owned={isOwned(s.id)}
                duplicates={getDups(s.id)}
                size={stickerSize}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
