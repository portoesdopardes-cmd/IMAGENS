import type { ReactNode } from 'react';
import { Sparkles, Heart, Trophy } from 'lucide-react';
import type { Profile } from '@/types/domain';
import { GlassCard } from './ui/GlassCard';

export function Dashboard({ profile }: { profile: Profile }) {
  return (
    <GlassCard className="space-y-5">
      <header>
        <p className="text-xs tracking-[0.3em] text-yellow-500">EXPLORADOR DA SABEDORIA</p>
        <h1 className="font-heading text-4xl font-semibold">{profile.username}</h1>
      </header>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Stat icon={<Sparkles size={16} />} label="Centelhas" value={profile.sparks} />
        <Stat icon={<Heart size={16} />} label="Corações" value={`${profile.hearts}/613`} />
        <Stat icon={<Trophy size={16} />} label="Nível" value={profile.level} />
      </div>
      <div>
        <div className="mb-2 flex justify-between text-xs uppercase tracking-widest text-slate-400">
          <span>Progresso de nível</span>
          <span>{profile.xp} XP</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-gradient-to-r from-yellow-600 to-amber-300" style={{ width: `${profile.xp % 100}%` }} />
        </div>
      </div>
    </GlassCard>
  );
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: string | number }) {
  return (
    <article className="rounded-xl border border-white/10 bg-slate-900/80 p-3">
      <p className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400">
        <span className="text-yellow-500">{icon}</span>
        {label}
      </p>
      <p className="text-2xl font-semibold text-yellow-400">{value}</p>
    </article>
  );
}
