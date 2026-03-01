import type { Sticker } from '@/types/domain';
import { GlassCard } from './ui/GlassCard';

export function Album({ stickers }: { stickers: Sticker[] }) {
  return (
    <GlassCard className="space-y-4">
      <header className="flex items-end justify-between">
        <div>
          <h2 className="font-heading text-2xl text-yellow-400">Álbum de Sabedoria</h2>
          <p className="text-xs tracking-[0.2em] text-slate-400">Coleção PARDeS</p>
        </div>
        <p className="rounded-full border border-yellow-500/40 px-4 py-1 text-sm text-yellow-300">
          {stickers.length} / 500
        </p>
      </header>
      <div className="grid gap-3 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => {
          const sticker = stickers[index];
          return (
            <article key={index} className="h-44 rounded-xl border border-dashed border-white/20 bg-slate-900/50 p-3">
              {sticker ? (
                <>
                  <img src={sticker.imageUrl} alt={sticker.name} className="mb-2 h-24 w-full rounded-md object-cover" />
                  <p className="text-sm font-semibold">{sticker.name}</p>
                  <p className="text-xs text-yellow-300">{sticker.rarity}</p>
                </>
              ) : (
                <div className="grid h-full place-content-center text-center text-xs text-slate-500">
                  <p>🔒</p>
                  <p>#{String(index + 1).padStart(3, '0')}</p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </GlassCard>
  );
}
