import { useState } from 'react';
import { generateEventVisual, generateStickerWithGemini } from '@/services/geminiService';
import type { Sticker } from '@/types/domain';
import { GlassCard } from './ui/GlassCard';

export function AdminPanel() {
  const [eventName, setEventName] = useState('Festival da Luz Infinita');
  const [eventPreview, setEventPreview] = useState<string>('');
  const [forgePreview, setForgePreview] = useState<Sticker | null>(null);

  return (
    <GlassCard className="space-y-4">
      <h2 className="font-heading text-2xl text-yellow-400">Painel de Administração</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
          <p className="mb-2 font-semibold">Criar evento com arte IA</p>
          <input
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="mb-3 w-full rounded-lg border border-white/15 bg-slate-950 px-3 py-2"
          />
          <button
            onClick={async () => setEventPreview(await generateEventVisual(eventName))}
            className="rounded-lg border border-yellow-500/70 px-3 py-1 text-sm text-yellow-300"
          >
            Gerar imagem
          </button>
          {eventPreview && <img src={eventPreview} className="mt-3 h-44 w-full rounded-lg object-cover" alt="Evento" />}
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
          <p className="mb-2 font-semibold">Forjar nova carta IA</p>
          <button
            onClick={async () =>
              setForgePreview(await generateStickerWithGemini({ rarity: 'Épica', ownedNames: forgePreview ? [forgePreview.name] : [] }))
            }
            className="rounded-lg border border-yellow-500/70 px-3 py-1 text-sm text-yellow-300"
          >
            Pesquisar + gerar arte
          </button>
          {forgePreview && (
            <article className="mt-3 rounded-lg border border-white/10 p-3">
              <img src={forgePreview.imageUrl} alt={forgePreview.name} className="h-28 w-full rounded object-cover" />
              <p className="mt-2 font-semibold">{forgePreview.name}</p>
              <p className="text-xs text-slate-300">{forgePreview.description}</p>
            </article>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
