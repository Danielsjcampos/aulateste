"use client";

import { useState, useEffect, useMemo, use } from 'react';
import Link from 'next/link';
import { getAlbum, toggleSticker, markAllOwned, getStats } from '../../lib/store';
import { Album } from '../../types';
import { stickers, TOTAL_STICKERS } from '../../data/stickers';
import { teams } from '../../data/teams';
import StickerCard from '../../components/StickerCard';
import SearchBar from '../../components/SearchBar';
import AlbumProgress from '../../components/AlbumProgress';
import CopaHeader from '../../components/CopaHeader';

interface PageProps {
  params: Promise<{ albumId: string }>;
}

type SortMode = 'numero' | 'time' | 'grupo';

export default function FaltantesPage({ params }: PageProps) {
  const { albumId } = use(params);
  const [album, setAlbum] = useState<Album | null>(null);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortMode>('numero');
  const [selectedTeam, setSelectedTeam] = useState<string>('todas');
  const [bulkMarked, setBulkMarked] = useState<number[]>([]);
  const [recentlyMarked, setRecentlyMarked] = useState<number[]>([]);

  useEffect(() => { setAlbum(getAlbum(albumId)); }, [albumId]);

  function isOwned(id: number) { return album?.stickers[id]?.owned ?? false; }

  const missingStickers = useMemo(() => {
    if (!album) return [];
    return stickers.filter((s) => !album.stickers[s.id]?.owned);
  }, [album]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return missingStickers.filter((s) => {
      if (selectedTeam !== 'todas' && s.teamCode !== selectedTeam) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q)
        || String(s.id).includes(q)
        || (s.team ?? '').toLowerCase().includes(q)
        || (s.teamCode ?? '').toLowerCase().includes(q)
        || (s.position ?? '').toLowerCase().includes(q)
      );
    }).sort((a, b) => {
      if (sort === 'numero') return a.id - b.id;
      if (sort === 'time') return (a.team ?? '').localeCompare(b.team ?? '');
      return (a.section ?? '').localeCompare(b.section ?? '');
    });
  }, [missingStickers, query, selectedTeam, sort]);

  const groupedByTeam = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const s of filtered) {
      const key = s.teamCode ?? s.section ?? 'Outros';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    return map;
  }, [filtered]);

  function handleToggle(stickerId: number) {
    const updated = toggleSticker(albumId, stickerId);
    if (updated) {
      setAlbum(updated);
      setRecentlyMarked((prev) => [stickerId, ...prev.slice(0, 9)]);
    }
  }

  function handleMarkTeam(teamCode: string) {
    const ids = stickers
      .filter((s) => s.teamCode === teamCode && !isOwned(s.id))
      .map((s) => s.id);
    const updated = markAllOwned(albumId, ids);
    if (updated) {
      setAlbum(updated);
      setRecentlyMarked((prev) => [...ids, ...prev].slice(0, 20));
    }
  }

  function handleBulkToggle(id: number) {
    setBulkMarked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleConfirmBulk() {
    if (bulkMarked.length === 0) return;
    const updated = markAllOwned(albumId, bulkMarked);
    if (updated) {
      setAlbum(updated);
      setRecentlyMarked((prev) => [...bulkMarked, ...prev].slice(0, 20));
    }
    setBulkMarked([]);
  }

  if (!album) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link href="/copa" style={{ color: '#FFD700' }}>← Voltar</Link>
      </div>
    );
  }

  const stats = getStats(album, TOTAL_STICKERS);
  const teamOptions = [
    { code: 'todas', name: `Todas as seleções (${missingStickers.length})` },
    ...teams
      .filter((t) => missingStickers.some((s) => s.teamCode === t.code))
      .map((t) => ({
        code: t.code,
        name: `${t.flag} ${t.name} (${missingStickers.filter((s) => s.teamCode === t.code).length})`,
      })),
  ];

  return (
    <>
      <CopaHeader
        crumbs={[{ label: album.name, href: `/copa/${albumId}` }, { label: 'Faltantes' }]}
        albumName={album.owner}
      />
      <div className="sticky top-[57px] z-40 px-4 py-3" style={{ background: 'rgba(8,8,24,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,215,0,0.08)' }}>
        <div className="max-w-5xl mx-auto"><AlbumProgress stats={stats} compact /></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-2xl p-4 text-center" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)' }}>
            <div className="font-black text-2xl" style={{ color: '#f87171' }}>{stats.missing}</div>
            <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Faltam</div>
          </div>
          <div className="rounded-2xl p-4 text-center" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)' }}>
            <div className="font-black text-2xl" style={{ color: '#4ade80' }}>{stats.owned}</div>
            <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Tenho</div>
          </div>
          <div className="rounded-2xl p-4 text-center" style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.25)' }}>
            <div className="font-black text-2xl" style={{ color: '#FFD700' }}>{stats.percentage}%</div>
            <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Completo</div>
          </div>
        </div>

        {/* Recently marked */}
        {recentlyMarked.length > 0 && (
          <div className="rounded-2xl p-4 mb-5" style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.2)' }}>
            <p className="text-xs font-bold mb-2" style={{ color: '#4ade80' }}>✓ Coladas agora ({recentlyMarked.length})</p>
            <div className="flex flex-wrap gap-1.5">
              {recentlyMarked.map((id) => {
                const s = stickers.find((x) => x.id === id);
                if (!s) return null;
                return (
                  <span key={id} className="text-xs px-2 py-0.5 rounded-lg font-semibold" style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80' }}>
                    #{id} {s.name}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Bulk action bar */}
        {bulkMarked.length > 0 && (
          <div className="sticky bottom-4 z-50 mb-4">
            <div className="rounded-2xl p-4 flex items-center justify-between gap-4" style={{ background: '#FFD700', boxShadow: '0 4px 24px rgba(255,215,0,0.4)' }}>
              <span className="font-black text-black">{bulkMarked.length} figurinha{bulkMarked.length > 1 ? 's' : ''} selecionada{bulkMarked.length > 1 ? 's' : ''}</span>
              <div className="flex gap-2">
                <button onClick={() => setBulkMarked([])} className="px-3 py-1.5 rounded-lg text-sm font-bold" style={{ background: 'rgba(0,0,0,0.15)', color: '#000' }}>
                  Limpar
                </button>
                <button onClick={handleConfirmBulk} className="px-4 py-1.5 rounded-lg text-sm font-black" style={{ background: '#000', color: '#FFD700' }}>
                  ✓ Marcar como coladas
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search + filters */}
        <div className="mb-4">
          <SearchBar value={query} onChange={setQuery} placeholder="Buscar por nome, número, posição, time..." />
        </div>

        <div className="flex gap-2 flex-wrap mb-4">
          {/* Team filter */}
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm font-semibold focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,215,0,0.2)', color: 'white' }}
          >
            {teamOptions.map((t) => (
              <option key={t.code} value={t.code} style={{ background: '#1a1a3e' }}>{t.name}</option>
            ))}
          </select>

          {/* Sort */}
          <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            {(['numero', 'time', 'grupo'] as SortMode[]).map((s) => (
              <button key={s} onClick={() => setSort(s)} className="px-3 py-2 text-xs font-bold capitalize transition-colors" style={{ background: sort === s ? 'rgba(255,215,0,0.18)' : 'transparent', color: sort === s ? '#FFD700' : 'rgba(255,255,255,0.4)' }}>
                {s === 'numero' ? '#' : s === 'time' ? 'Time' : 'Grupo'}
              </button>
            ))}
          </div>

          <div className="ml-auto text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {filtered.length} faltantes
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            {stats.missing === 0 ? (
              <>
                <div className="text-5xl mb-4">🏆</div>
                <p className="font-black text-xl text-white">Álbum Completo!</p>
                <p className="mt-2 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Parabéns! Você colou todas as {stats.total} figurinhas!</p>
              </>
            ) : (
              <>
                <div className="text-4xl mb-3">🔍</div>
                <p style={{ color: 'rgba(255,255,255,0.4)' }}>Nenhuma figurinha encontrada</p>
              </>
            )}
          </div>
        ) : sort === 'numero' || selectedTeam !== 'todas' ? (
          /* Flat grid view */
          <div>
            {selectedTeam !== 'todas' && (
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-white text-sm">
                  {teams.find((t) => t.code === selectedTeam)?.flag} {teams.find((t) => t.code === selectedTeam)?.name}
                </p>
                <button
                  onClick={() => handleMarkTeam(selectedTeam)}
                  className="px-4 py-1.5 rounded-xl text-xs font-black transition-opacity hover:opacity-80"
                  style={{ background: 'linear-gradient(90deg,#4ade80,#22c55e)', color: '#000' }}
                >
                  ✓ Colar todas do time
                </button>
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              {filtered.map((s) => (
                <div key={s.id} className="relative">
                  <StickerCard
                    sticker={s}
                    owned={isOwned(s.id)}
                    duplicates={0}
                    size="md"
                    onToggle={handleToggle}
                    highlight={bulkMarked.includes(s.id)}
                    showNumber
                  />
                  {/* Long-press / secondary select */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleBulkToggle(s.id); }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                    style={{
                      background: bulkMarked.includes(s.id) ? '#FFD700' : 'rgba(255,255,255,0.15)',
                      color: bulkMarked.includes(s.id) ? '#000' : 'white',
                      border: bulkMarked.includes(s.id) ? 'none' : '1px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    {bulkMarked.includes(s.id) ? '✓' : '+'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Grouped by team */
          <div className="space-y-6">
            {Array.from(groupedByTeam.entries()).map(([teamCode, teamStickers]) => {
              const team = teams.find((t) => t.code === teamCode);
              return (
                <div key={teamCode}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xl">{team?.flag ?? '🌍'}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-sm truncate">{team?.name ?? teamCode}</h3>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{teamStickers.length} faltante{teamStickers.length > 1 ? 's' : ''}</p>
                    </div>
                    {team && (
                      <button
                        onClick={() => handleMarkTeam(teamCode)}
                        className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-black transition-opacity hover:opacity-80"
                        style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)' }}
                      >
                        ✓ Colar todas
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 pl-2">
                    {teamStickers.map((s) => (
                      <div key={s.id} className="relative">
                        <StickerCard
                          sticker={s}
                          owned={isOwned(s.id)}
                          duplicates={0}
                          size="sm"
                          onToggle={handleToggle}
                          highlight={bulkMarked.includes(s.id)}
                          showNumber
                        />
                        <button
                          onClick={(e) => { e.stopPropagation(); handleBulkToggle(s.id); }}
                          className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{
                            background: bulkMarked.includes(s.id) ? '#FFD700' : 'rgba(255,255,255,0.12)',
                            color: bulkMarked.includes(s.id) ? '#000' : 'white',
                            fontSize: 8,
                          }}
                        >
                          {bulkMarked.includes(s.id) ? '✓' : '+'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
