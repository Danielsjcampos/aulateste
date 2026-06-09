"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { getAlbum, getStats } from '../../lib/store';
import { Album } from '../../types';
import { stickers, TOTAL_STICKERS } from '../../data/stickers';
import CopaHeader from '../../components/CopaHeader';
import AlbumProgress from '../../components/AlbumProgress';

interface PageProps {
  params: Promise<{ albumId: string }>;
}

export default function TrocasPage({ params }: PageProps) {
  const { albumId } = use(params);
  const [album, setAlbum] = useState<Album | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => { setAlbum(getAlbum(albumId)); }, [albumId]);

  if (!album) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link href="/copa" style={{ color: '#FFD700' }}>← Voltar</Link>
      </div>
    );
  }

  const stats = getStats(album, TOTAL_STICKERS);

  const repStickers = stickers.filter((s) => (album.stickers[s.id]?.duplicates ?? 0) > 0);
  const missingStickers = stickers.filter((s) => !album.stickers[s.id]?.owned);

  const generateText = () => {
    const lines: string[] = [
      `📔 ${album.name} — ${album.owner}`,
      `📊 ${stats.percentage}% completo (${stats.owned}/${stats.total})`,
      '',
      '🔁 FIGURINHAS QUE TENHO REPETIDAS:',
      ...repStickers.map((s) => `  #${s.id} ${s.name} (${album.stickers[s.id]?.duplicates}x)`),
      '',
      '❌ FIGURINHAS QUE FALTAM:',
      ...missingStickers.slice(0, 100).map((s) => `  #${s.id} ${s.name}`),
      missingStickers.length > 100 ? `  ... e mais ${missingStickers.length - 100} figurinhas` : '',
      '',
      '⚽ Copa do Mundo 2026',
    ];
    return lines.filter((l) => l !== undefined).join('\n');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <CopaHeader
        crumbs={[{ label: album.name, href: `/copa/${albumId}` }, { label: 'Lista de Trocas' }]}
        albumName={album.owner}
      />
      <div className="sticky top-[57px] z-40 px-4 py-3" style={{ background: 'rgba(8,8,24,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,215,0,0.08)' }}>
        <div className="max-w-3xl mx-auto"><AlbumProgress stats={stats} compact /></div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-white">Lista de Trocas</h1>
          <button
            onClick={handleCopy}
            className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
            style={{ background: copied ? '#4ade80' : 'linear-gradient(90deg,#FFD700,#FF6B35)', color: '#000' }}
          >
            {copied ? '✓ Copiado!' : '📋 Copiar Lista'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="rounded-2xl p-4" style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)' }}>
            <div className="font-black text-2xl text-white">{repStickers.length}</div>
            <div className="text-xs mt-0.5" style={{ color: '#FFD700' }}>Para oferecer</div>
          </div>
          <div className="rounded-2xl p-4" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>
            <div className="font-black text-2xl text-white">{missingStickers.length}</div>
            <div className="text-xs mt-0.5" style={{ color: '#f87171' }}>Que preciso</div>
          </div>
        </div>

        {repStickers.length > 0 && (
          <div className="mb-6">
            <h2 className="font-bold text-white mb-3 text-sm flex items-center gap-2">
              <span>🔁 Tenho para oferecer</span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,215,0,0.12)', color: '#FFD700' }}>{repStickers.length}</span>
            </h2>
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              {repStickers.map((s, i) => (
                <div key={s.id} className="flex items-center justify-between px-3 py-2.5 text-sm" style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none', background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                  <div>
                    <span className="font-mono text-xs mr-2" style={{ color: '#FFD700' }}>#{s.id}</span>
                    <span className="text-white">{s.name}</span>
                  </div>
                  <span className="font-bold text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(255,215,0,0.15)', color: '#FFD700' }}>
                    {album.stickers[s.id]?.duplicates}x
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {missingStickers.length > 0 && (
          <div>
            <h2 className="font-bold text-white mb-3 text-sm flex items-center gap-2">
              <span>❌ Preciso dessas</span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171' }}>{missingStickers.length}</span>
            </h2>
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              {missingStickers.map((s, i) => (
                <div key={s.id} className="flex items-center justify-between px-3 py-2.5 text-sm" style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none', background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                  <div>
                    <span className="font-mono text-xs mr-2" style={{ color: 'rgba(255,255,255,0.4)' }}>#{s.id}</span>
                    <span className="text-white">{s.name}</span>
                  </div>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.team ?? s.section}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {repStickers.length === 0 && missingStickers.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🏆</div>
            <p className="font-bold text-white">Álbum completo!</p>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Parabéns por completar o álbum!</p>
          </div>
        )}
      </div>
    </>
  );
}
