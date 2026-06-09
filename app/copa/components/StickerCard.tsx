"use client";

import { Sticker } from '../types';
import StickerImage from './StickerImage';

interface Props {
  sticker: Sticker;
  owned: boolean;
  duplicates: number;
  size?: 'sm' | 'md' | 'lg';
  onToggle?: (id: number) => void;
  showNumber?: boolean;
  showDuplicates?: boolean;
}

const SIZE_MAP = { sm: 72, md: 100, lg: 130 };

export default function StickerCard({
  sticker, owned, duplicates, size = 'md', onToggle, showNumber = true, showDuplicates = false,
}: Props) {
  const px = SIZE_MAP[size];

  return (
    <button
      onClick={() => onToggle?.(sticker.id)}
      title={sticker.name}
      className="relative flex flex-col items-center gap-1 group focus:outline-none"
      style={{ width: px + 8 }}
    >
      <div
        className="relative rounded-xl overflow-hidden transition-all duration-200"
        style={{
          width: px,
          height: px,
          opacity: owned ? 1 : 0.32,
          boxShadow: owned
            ? `0 0 0 2px ${sticker.colors[0]}, 0 4px 16px ${sticker.colors[0]}66`
            : '0 2px 8px rgba(0,0,0,0.4)',
          transform: owned ? 'scale(1.03)' : 'scale(1)',
          filter: owned ? 'none' : 'grayscale(60%)',
        }}
      >
        <StickerImage sticker={sticker} size={px} />
        {owned && duplicates > 0 && (
          <div className="absolute top-1 right-1 rounded-full text-xs font-bold px-1.5 py-0.5 leading-none" style={{ background: '#FFD700', color: '#000' }}>
            +{duplicates}
          </div>
        )}
        {sticker.stars && owned && (
          <div className="absolute top-1 left-1 text-xs">⭐</div>
        )}
      </div>
      {showNumber && (
        <span className="text-xs font-mono text-center leading-tight" style={{ color: owned ? '#FFD700' : '#666', fontSize: 10, maxWidth: px }}>
          #{sticker.id}
        </span>
      )}
      {showDuplicates && owned && duplicates > 0 && (
        <span className="text-xs font-bold" style={{ color: '#FFD700' }}>{duplicates}x repetida</span>
      )}
    </button>
  );
}
