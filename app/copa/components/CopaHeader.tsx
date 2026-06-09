"use client";

import Link from 'next/link';

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  crumbs?: Crumb[];
  albumName?: string;
}

export default function CopaHeader({ crumbs, albumName }: Props) {
  return (
    <header className="sticky top-0 z-50 px-4 py-3" style={{ background: 'rgba(8,8,24,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,215,0,0.12)' }}>
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <Link href="/copa" className="font-black text-lg shrink-0" style={{ color: '#FFD700', textDecoration: 'none' }}>
            ⚽ Copa 2026
          </Link>
          {crumbs?.map((c, i) => (
            <span key={i} className="flex items-center gap-2 min-w-0">
              <span style={{ color: 'rgba(255,215,0,0.4)' }}>/</span>
              {c.href ? (
                <Link href={c.href} className="text-sm truncate hover:opacity-80 transition" style={{ color: 'rgba(255,255,255,0.6)' }}>{c.label}</Link>
              ) : (
                <span className="text-sm truncate" style={{ color: 'white' }}>{c.label}</span>
              )}
            </span>
          ))}
        </div>
        {albumName && (
          <span className="text-xs px-3 py-1 rounded-full shrink-0 font-semibold" style={{ background: 'rgba(255,215,0,0.12)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.2)' }}>
            {albumName}
          </span>
        )}
      </div>
    </header>
  );
}
