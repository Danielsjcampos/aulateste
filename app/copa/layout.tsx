import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Copa 2026 – Gestão de Figurinhas',
  description: 'Gerencie seu álbum de figurinhas da Copa do Mundo 2026. Marque as figurinhas que você tem, controle repetidas e gerencie múltiplos álbuns.',
};

export default function CopaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: '#080818', color: 'white', fontFamily: 'system-ui, sans-serif' }}>
      {children}
    </div>
  );
}
