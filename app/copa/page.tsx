"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { loadAlbums, createAlbum, deleteAlbum, getStats } from './lib/store';
import { Album } from './types';
import { TOTAL_STICKERS } from './data/stickers';

export default function CopaHomePage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    setAlbums(loadAlbums());
  }, []);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !owner.trim()) return;
    const album = createAlbum(name.trim(), owner.trim());
    setAlbums(loadAlbums());
    setName('');
    setOwner('');
    setShowForm(false);
    void album;
  }

  function handleDelete(id: string) {
    if (deleting !== id) { setDeleting(id); return; }
    deleteAlbum(id);
    setAlbums(loadAlbums());
    setDeleting(null);
  }

  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#0a0a2e 0%,#1a1060 50%,#0a0a2e 100%)', minHeight: '40vh' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%,#FFD700 0%,transparent 50%),radial-gradient(circle at 80% 50%,#FF6B35 0%,transparent 50%)' }} />
        <div className="relative max-w-5xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">⚽</div>
          <h1 className="text-4xl font-black mb-2" style={{ background: 'linear-gradient(90deg,#FFD700,#FF6B35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Copa do Mundo 2026
          </h1>
          <p className="text-lg mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Álbum de Figurinhas Oficial</p>
          <p className="text-sm" style={{ color: 'rgba(255,215,0,0.6)' }}>{TOTAL_STICKERS} figurinhas · 48 seleções · 12 grupos</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Albums header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            Meus Álbuns
            <span className="ml-2 text-sm font-normal" style={{ color: 'rgba(255,255,255,0.4)' }}>({albums.length})</span>
          </h2>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
            style={{ background: 'linear-gradient(90deg,#FFD700,#FF6B35)', color: '#000' }}
          >
            + Novo Álbum
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <form onSubmit={handleCreate} className="rounded-2xl p-5 mb-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,215,0,0.25)' }}>
            <h3 className="font-bold text-white mb-4">Criar novo álbum</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Nome do álbum</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Meu Álbum Principal"
                  required
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,215,0,0.2)' }}
                />
              </div>
              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Seu nome</label>
                <input
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  placeholder="Ex: João"
                  required
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,215,0,0.2)' }}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-5 py-2 rounded-xl font-bold text-sm" style={{ background: 'linear-gradient(90deg,#FFD700,#FF6B35)', color: '#000' }}>
                Criar
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl font-bold text-sm" style={{ background: 'rgba(255,255,255,0.08)', color: 'white' }}>
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Album list */}
        {albums.length === 0 && !showForm && (
          <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <div className="text-5xl mb-4">📒</div>
            <p className="font-semibold">Nenhum álbum ainda</p>
            <p className="text-sm mt-1">Crie seu primeiro álbum para começar a colecionar!</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.map((album) => {
            const stats = getStats(album, TOTAL_STICKERS);
            const pct = stats.percentage;
            return (
              <div key={album.id} className="rounded-2xl overflow-hidden transition-transform hover:-translate-y-0.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,215,0,0.15)' }}>
                <div className="h-2" style={{ background: `linear-gradient(90deg,#FFD700 ${pct}%,rgba(255,255,255,0.06) ${pct}%)` }} />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <div className="min-w-0">
                      <h3 className="font-bold text-white truncate">{album.name}</h3>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>por {album.owner}</p>
                    </div>
                    <span className="font-black text-xl shrink-0 ml-2" style={{ color: '#FFD700' }}>{pct}%</span>
                  </div>
                  <div className="flex gap-4 text-xs mt-3 mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <span><b className="text-white">{stats.owned}</b> tenho</span>
                    <span><b className="text-white">{stats.missing}</b> faltam</span>
                    <span><b style={{ color: '#FFD700' }}>{stats.duplicatesCount}</b> repetidas</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <Link
                      href={`/copa/${album.id}`}
                      className="py-2 rounded-xl text-center font-bold text-sm transition-opacity hover:opacity-90"
                      style={{ background: 'linear-gradient(90deg,#FFD700,#FF6B35)', color: '#000' }}
                    >
                      Abrir Álbum
                    </Link>
                    <Link
                      href={`/copa/${album.id}/faltantes`}
                      className="py-2 rounded-xl text-center font-bold text-sm transition-opacity hover:opacity-90"
                      style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}
                    >
                      ❌ Faltantes
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <Link
                      href={`/copa/${album.id}/busca`}
                      className="py-2 rounded-xl text-center font-bold text-sm transition-opacity hover:opacity-90"
                      style={{ background: 'rgba(255,215,0,0.1)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.2)' }}
                    >
                      🔍 Busca
                    </Link>
                    <Link
                      href={`/copa/${album.id}/repetidas`}
                      className="py-2 rounded-xl text-center font-bold text-sm transition-opacity hover:opacity-90"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      🔁 Repetidas
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/copa/${album.id}/repetidas`}
                      className="py-2 rounded-xl text-center font-bold text-sm transition-opacity hover:opacity-90"
                      style={{ background: 'rgba(255,215,0,0.08)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.2)' }}
                    >
                      Repetidas
                    </Link>
                    <button
                      onClick={() => handleDelete(album.id)}
                      className="py-2 rounded-xl text-center font-bold text-sm transition-opacity hover:opacity-90"
                      style={{ background: deleting === album.id ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.04)', color: deleting === album.id ? '#ef4444' : 'rgba(255,255,255,0.3)', border: deleting === album.id ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.08)' }}
                    >
                      {deleting === album.id ? 'Confirmar?' : 'Excluir'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-16 text-center text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
          <p>🌎 Copa do Mundo FIFA 2026 · EUA, México e Canadá · 48 seleções</p>
          <p className="mt-1">Dados salvos localmente no seu navegador</p>
        </div>
      </div>
    </>
  );
}
