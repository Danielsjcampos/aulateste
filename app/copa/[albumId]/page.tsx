"use client";

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { getAlbum, toggleSticker, getStats } from '../lib/store';
import { Album } from '../types';
import { stickers, TOTAL_STICKERS } from '../data/stickers';
import { teams } from '../data/teams';
import StickerCard from '../components/StickerCard';
import AlbumProgress from '../components/AlbumProgress';
import CopaHeader from '../components/CopaHeader';

interface PageProps {
  params: Promise<{ albumId: string }>;
}

const CONF_LABELS: Record<string, string> = {
  UEFA: '🇪🇺 UEFA', CONMEBOL: '🌎 CONMEBOL', CONCACAF: '🌍 CONCACAF',
  CAF: '🌍 CAF', AFC: '🌏 AFC', OFC: '🌊 OFC',
};

export default function AlbumPage({ params }: PageProps) {
  const { albumId } = use(params);
  const [album, setAlbum] = useState<Album | null>(null);
  const [activeGroup, setActiveGroup] = useState<string>('intro');
  const [stickerSize, setStickerSize] = useState<'sm' | 'md' | 'lg'>('md');

  useEffect(() => {
    const a = getAlbum(albumId);
    setAlbum(a);
  }, [albumId]);

  const handleToggle = useCallback((stickerId: number) => {
    const updated = toggleSticker(albumId, stickerId);
    if (updated) setAlbum(updated);
  }, [albumId]);

  if (!album) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-white font-bold">Álbum não encontrado</p>
          <Link href="/copa" className="text-sm mt-2 block" style={{ color: '#FFD700' }}>← Voltar</Link>
        </div>
      </div>
    );
  }

  const stats = getStats(album, TOTAL_STICKERS);
  const introStickers = stickers.filter((s) => s.section === 'Introdução');
  const groups = [...new Set(teams.map((t) => t.group))].sort();

  function isOwned(id: number) { return album!.stickers[id]?.owned ?? false; }
  function getDups(id: number) { return album!.stickers[id]?.duplicates ?? 0; }

  const navItems = [
    { key: 'intro', label: '⭐ Intro', count: introStickers.length },
    ...groups.map((g) => ({ key: g, label: `Grupo ${g}`, count: teams.filter((t) => t.group === g).length * (3 + teams.find((t) => t.group === g)!.players.length + 1) })),
  ];

  const teamsInGroup = activeGroup === 'intro' ? [] : teams.filter((t) => t.group === activeGroup);

  return (
    <>
      <CopaHeader
        crumbs={[{ label: album.name }]}
        albumName={album.owner}
      />

      {/* Stats bar */}
      <div className="sticky top-[57px] z-40 px-4 py-3" style={{ background: 'rgba(8,8,24,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,215,0,0.08)' }}>
        <div className="max-w-5xl mx-auto">
          <AlbumProgress stats={stats} compact />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Quick actions */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Link href={`/copa/${albumId}/faltantes`} className="px-4 py-2 rounded-xl text-sm font-bold transition-opacity hover:opacity-80" style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171', border: '1px solid rgba(248,113,113,0.35)' }}>
            ❌ Faltantes ({stats.missing})
          </Link>
          <Link href={`/copa/${albumId}/busca`} className="px-4 py-2 rounded-xl text-sm font-bold transition-opacity hover:opacity-80" style={{ background: 'rgba(255,215,0,0.12)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.25)' }}>
            🔍 Busca Rápida
          </Link>
          <Link href={`/copa/${albumId}/repetidas`} className="px-4 py-2 rounded-xl text-sm font-bold transition-opacity hover:opacity-80" style={{ background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.12)' }}>
            🔁 Repetidas ({stats.duplicatesCount})
          </Link>
          <Link href={`/copa/${albumId}/trocas`} className="px-4 py-2 rounded-xl text-sm font-bold transition-opacity hover:opacity-80" style={{ background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.12)' }}>
            🤝 Trocas
          </Link>
          <div className="ml-auto flex items-center gap-1 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
            {(['sm', 'md', 'lg'] as const).map((s) => (
              <button key={s} onClick={() => setStickerSize(s)} className="px-3 py-2 text-xs font-bold transition-colors" style={{ background: stickerSize === s ? 'rgba(255,215,0,0.2)' : 'transparent', color: stickerSize === s ? '#FFD700' : 'rgba(255,255,255,0.4)' }}>
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Group navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveGroup(item.key)}
              className="shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap"
              style={{
                background: activeGroup === item.key ? 'linear-gradient(90deg,#FFD700,#FF6B35)' : 'rgba(255,255,255,0.06)',
                color: activeGroup === item.key ? '#000' : 'rgba(255,255,255,0.6)',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Intro section */}
        {activeGroup === 'intro' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-bold text-white text-lg">Introdução & Especiais</h2>
              <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(255,215,0,0.12)', color: '#FFD700' }}>
                {introStickers.filter((s) => isOwned(s.id)).length}/{introStickers.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {introStickers.map((s) => (
                <StickerCard key={s.id} sticker={s} owned={isOwned(s.id)} duplicates={getDups(s.id)} size={stickerSize} onToggle={handleToggle} />
              ))}
            </div>
          </div>
        )}

        {/* Group teams */}
        {activeGroup !== 'intro' && teamsInGroup.map((team) => {
          const teamStickers = stickers.filter((s) => s.teamCode === team.code);
          const ownedCount = teamStickers.filter((s) => isOwned(s.id)).length;
          return (
            <div key={team.id} className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{team.flag}</span>
                <div>
                  <h3 className="font-bold text-white">{team.name}</h3>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{CONF_LABELS[team.confederation]} · Grupo {team.group}</p>
                </div>
                <div className="ml-auto text-right">
                  <span className="font-bold text-sm" style={{ color: ownedCount === teamStickers.length ? '#4ade80' : '#FFD700' }}>
                    {ownedCount}/{teamStickers.length}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 pl-2">
                {teamStickers.map((s) => (
                  <StickerCard key={s.id} sticker={s} owned={isOwned(s.id)} duplicates={getDups(s.id)} size={stickerSize} onToggle={handleToggle} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
