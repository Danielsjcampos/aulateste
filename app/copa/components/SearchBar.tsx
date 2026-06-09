"use client";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Buscar figurinha...' }: Props) {
  return (
    <div className="relative w-full">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none" aria-hidden>🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-10 py-3 rounded-2xl text-white placeholder-gray-500 font-medium text-sm focus:outline-none transition-all"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1.5px solid rgba(255,215,0,0.2)',
          boxShadow: value ? '0 0 0 2px rgba(255,215,0,0.25)' : 'none',
        }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs hover:opacity-80 transition"
          style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
