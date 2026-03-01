import { useMemo, useState } from 'react';
import type { PortalKey, Profile } from '@/types/domain';
import { portals, quizQuestions } from '@/data/mockData';
import { GlassCard } from './ui/GlassCard';

export function QuizPortal({ onAward, onHeartLoss }: { onAward: (xp: number, sparks: number) => void; onHeartLoss: () => void }) {
  const [activePortal, setActivePortal] = useState<PortalKey>('leis-de-noe');
  const [selected, setSelected] = useState<number | null>(null);

  const question = useMemo(
    () => quizQuestions.find((q) => q.portal === activePortal) ?? quizQuestions[0],
    [activePortal],
  );

  const answered = selected !== null;
  const correct = selected === question.answerIndex;

  const submit = (optionIndex: number) => {
    if (answered) return;
    setSelected(optionIndex);
    if (optionIndex === question.answerIndex) onAward(35, 20);
    else onHeartLoss();
  };

  return (
    <GlassCard className="space-y-4">
      <h2 className="font-heading text-2xl text-yellow-400">Portais de Estudo</h2>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {portals.map((portal) => (
          <button
            key={portal.key}
            className={`rounded-lg border px-3 py-2 text-left transition ${
              portal.key === activePortal ? 'border-yellow-500 bg-yellow-500/10' : 'border-white/10 bg-slate-900/60'
            }`}
            onClick={() => {
              setActivePortal(portal.key);
              setSelected(null);
            }}
          >
            <p className="font-semibold">{portal.title}</p>
            <p className="text-xs text-slate-400">{portal.subtitle}</p>
          </button>
        ))}
      </div>
      <article className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
        <p className="text-sm text-slate-300">{question.question}</p>
        <div className="mt-3 grid gap-2">
          {question.options.map((option, index) => (
            <button
              key={option}
              onClick={() => submit(index)}
              className="rounded-lg border border-white/10 bg-slate-950/80 p-2 text-left text-sm transition hover:border-yellow-500/60"
            >
              {option}
            </button>
          ))}
        </div>
      </article>
      {answered && (
        <aside className={`rounded-xl p-3 text-sm ${correct ? 'bg-emerald-500/10 text-emerald-200' : 'bg-rose-500/10 text-rose-200'}`}>
          <p className="mb-1 font-semibold">{correct ? 'Resposta correta! +35 XP e +20 centelhas.' : 'Resposta incorreta. -1 coração.'}</p>
          <p>{question.teaching}</p>
        </aside>
      )}
    </GlassCard>
  );
}
