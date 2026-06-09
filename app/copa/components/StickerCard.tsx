"use client";

import { useState } from 'react';
import { Sticker } from '../types';
import StickerImage from './StickerImage';

interface Props {
  sticker: Sticker;
  owned: boolean;
  duplicates: number;
  size?: 'sm' | 'md' | 'lg';
  onToggle?: (id: number) => void;
  showNumber?: boolean;
  showName?: boolean;
  highlight?: boolean;
}

const SIZE_MAP = { sm: 68, md: 96, lg: 124 };

export default function StickerCard({
  sticker, owned, duplicates, size = 'md', onToggle, showNumber = true, showName = false, highlight = false,
}: Props) {
  const [flash, setFlash] = useState(false);
  const px = SIZE_MAP[size];

  function handleClick() {
    if (!onToggle) return;
    setFlash(true);
    setTimeout(() => setFlash(false), 380);
    onToggle(sticker.id);
  }

  const willBeOwned = flash ? !owned : owned;

  return (
    <button
      onClick={handleClick}
      title={`#${sticker.id} — ${sticker.name}${owned ? ' ✓' : ''}`}
      className="relative flex flex-col items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded-xl"
      style={{ width: px + 4 }}
    >
      {/* Sticker image wrapper */}
      <div
        className="relative rounded-xl overflow-hidden transition-all duration-200 select-none"
        style={{
          width: px,
          height: px,
          opacity: willBeOwned ? 1 : 0.35,
          filter: willBeOwned ? 'none' : 'grayscale(70%) brightness(0.7)',
          boxShadow: willBeOwned
            ? highlight
              ? `0 0 0 3px #FFD700, 0 0 16px #FFD70088`
              : `0 0 0 2px ${sticker.colors[0]}99, 0 4px 12px ${sticker.colors[0]}44`
            : '0 2px 6px rgba(0,0,0,0.5)',
          transform: flash ? 'scale(0.93)' : willBeOwned ? 'scale(1.02)' : 'scale(1)',
          transition: 'all 0.18s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        <StickerImage sticker={sticker} size={px} />

        {/* Owned overlay checkmark */}
        {willBeOwned && (
          <div
            className="absolute top-1 left-1 rounded-full flex items-center justify-center font-bold"
            style={{
              width: px * 0.22,
              height: px * 0.22,
              background: '#4ade80',
              fontSize: px * 0.13,
              boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
              transition: 'opacity 0.2s',
            }}
          >
            ✓
          </div>
        )}

        {/* Duplicate badge */}
        {owned && duplicates > 0 && (
          <div
            className="absolute top-1 right-1 rounded-full font-black flex items-center justify-center"
            style={{
              width: px * 0.24,
              height: px * 0.24,
              background: '#FFD700',
              color: '#000',
              fontSize: px * 0.1,
              boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
            }}
          >
            +{duplicates}
          </div>
        )}

        {/* Flash overlay */}
        {flash && (
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              background: owned ? 'rgba(248,113,113,0.35)' : 'rgba(74,222,128,0.35)',
              transition: 'opacity 0.2s',
            }}
          />
        )}
      </div>

      {/* Number */}
      {showNumber && (
        <span
          className="font-mono text-center leading-none"
          style={{
            fontSize: px * 0.1,
            color: willBeOwned ? '#FFD700' : 'rgba(255,255,255,0.3)',
            minWidth: px,
          }}
        >
          #{sticker.id}
        </span>
      )}

      {/* Name */}
      {showName && (
        <span
          className="text-center leading-tight truncate"
          style={{
            fontSize: px * 0.09,
            color: willBeOwned ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)',
            maxWidth: px + 4,
          }}
        >
          {sticker.name}
        </span>
      )}
    </button>
  );
}
