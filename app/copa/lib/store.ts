"use client";

import { Album, AlbumStats, AlbumStickers } from '../types';

const STORAGE_KEY = 'copa2026_albums';

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function loadAlbums(): Album[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAlbums(albums: Album[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(albums));
}

export function createAlbum(name: string, owner: string): Album {
  const album: Album = {
    id: generateId(),
    name,
    owner,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stickers: {},
  };
  const albums = loadAlbums();
  albums.push(album);
  saveAlbums(albums);
  return album;
}

export function getAlbum(id: string): Album | null {
  const albums = loadAlbums();
  return albums.find((a) => a.id === id) ?? null;
}

export function deleteAlbum(id: string): void {
  const albums = loadAlbums().filter((a) => a.id !== id);
  saveAlbums(albums);
}

export function toggleSticker(albumId: string, stickerId: number): Album | null {
  const albums = loadAlbums();
  const idx = albums.findIndex((a) => a.id === albumId);
  if (idx === -1) return null;

  const album = albums[idx];
  const current = album.stickers[stickerId];

  if (!current || !current.owned) {
    album.stickers[stickerId] = { owned: true, duplicates: 0 };
  } else {
    album.stickers[stickerId] = { owned: false, duplicates: 0 };
  }

  album.updatedAt = new Date().toISOString();
  saveAlbums(albums);
  return album;
}

export function setDuplicates(albumId: string, stickerId: number, count: number): Album | null {
  const albums = loadAlbums();
  const idx = albums.findIndex((a) => a.id === albumId);
  if (idx === -1) return null;

  const album = albums[idx];
  const current = album.stickers[stickerId] ?? { owned: true, duplicates: 0 };
  album.stickers[stickerId] = { ...current, owned: true, duplicates: Math.max(0, count) };
  album.updatedAt = new Date().toISOString();
  saveAlbums(albums);
  return album;
}

export function markAllOwned(albumId: string, stickerIds: number[]): Album | null {
  const albums = loadAlbums();
  const idx = albums.findIndex((a) => a.id === albumId);
  if (idx === -1) return null;

  const album = albums[idx];
  for (const id of stickerIds) {
    if (!album.stickers[id]?.owned) {
      album.stickers[id] = { owned: true, duplicates: 0 };
    }
  }
  album.updatedAt = new Date().toISOString();
  saveAlbums(albums);
  return album;
}

export function getStats(album: Album, total: number): AlbumStats {
  const owned = Object.values(album.stickers).filter((s) => s.owned).length;
  const duplicatesCount = Object.values(album.stickers).reduce(
    (acc, s) => acc + (s.owned && s.duplicates > 0 ? s.duplicates : 0),
    0
  );
  return {
    total,
    owned,
    missing: total - owned,
    duplicatesCount,
    percentage: total > 0 ? Math.round((owned / total) * 100) : 0,
  };
}

export function bulkSetOwned(albumId: string, stickersState: AlbumStickers): Album | null {
  const albums = loadAlbums();
  const idx = albums.findIndex((a) => a.id === albumId);
  if (idx === -1) return null;
  albums[idx].stickers = stickersState;
  albums[idx].updatedAt = new Date().toISOString();
  saveAlbums(albums);
  return albums[idx];
}
