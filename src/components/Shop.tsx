import type { Profile, ShopItem } from '@/types/domain';
import { shopItems } from '@/data/mockData';
import { GlassCard } from './ui/GlassCard';

export function Shop({ profile, onBuy }: { profile: Profile; onBuy: (item: ShopItem) => void }) {
  return (
    <GlassCard className="space-y-4">
      <h2 className="font-heading text-2xl text-yellow-400">Mercado Místico</h2>
      <p className="text-sm text-slate-300">Use Centelhas para adquirir power-ups, recargas e baús.</p>
      <div className="grid gap-3 md:grid-cols-3">
        {shopItems.map((item) => (
          <article key={item.id} className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
            <p className="font-semibold">{item.namePt}</p>
            <p className="my-2 text-xs text-slate-400">{item.description}</p>
            <button
              onClick={() => onBuy(item)}
              disabled={profile.sparks < item.price}
              className="rounded-lg border border-yellow-500/70 px-3 py-1 text-sm text-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Comprar • {item.price}
            </button>
          </article>
        ))}
      </div>
    </GlassCard>
  );
}
