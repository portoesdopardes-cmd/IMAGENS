import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { BookOpen, ShieldQuestion, ShoppingBag, WandSparkles, Crown } from 'lucide-react';
import { Album } from '@/components/Album';
import { AdminPanel } from '@/components/AdminPanel';
import { Dashboard } from '@/components/Dashboard';
import { QuizPortal } from '@/components/QuizPortal';
import { Shop } from '@/components/Shop';
import { seedProfile } from '@/data/mockData';
import { useDebouncedEffect } from '@/hooks/useDebouncedEffect';
import { generateStickerWithGemini } from '@/services/geminiService';
import { fetchProfile, saveProfile } from '@/services/profileService';
import { hasSupabase, supabaseRest } from '@/services/supabaseClient';
import type { Profile, ShopItem } from '@/types/domain';

type View = 'dashboard' | 'quiz' | 'shop' | 'album' | 'admin';

export function App() {
  const [profile, setProfile] = useState<Profile>(seedProfile);
  const [view, setView] = useState<View>('dashboard');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('demo-user');
  const [accessToken, setAccessToken] = useState<string | undefined>(localStorage.getItem('pardes_token') ?? undefined);

  useEffect(() => {
    if (!hasSupabase || !accessToken) return;

    const boot = async () => {
      const user = await supabaseRest.getUser(accessToken);
      if (user) {
        setUserId(user.id);
        setProfile(await fetchProfile(user.id, accessToken));
      }
    };
    void boot();
  }, [accessToken]);

  useDebouncedEffect(
    () => {
      void saveProfile(profile, accessToken);
    },
    [profile, accessToken],
    2000,
  );

  const levelProgress = useMemo(() => (profile.xp % 100) / 100, [profile.xp]);

  const signInOrSignUp = async () => {
    if (!hasSupabase) return;
    try {
      const login = await supabaseRest.signInWithPassword(email, password);
      localStorage.setItem('pardes_token', login.access_token);
      setAccessToken(login.access_token);
      setUserId(login.user.id);
      setProfile(await fetchProfile(login.user.id, login.access_token));
    } catch {
      const signup = await supabaseRest.signUp(email, password);
      if (signup.access_token) {
        localStorage.setItem('pardes_token', signup.access_token);
        setAccessToken(signup.access_token);
      }
      setUserId(signup.user.id);
      setProfile(await fetchProfile(signup.user.id, signup.access_token));
    }
  };

  const handleAward = (xp: number, sparks: number) =>
    setProfile((prev) => {
      const nextXp = prev.xp + xp;
      return { ...prev, xp: nextXp, sparks: prev.sparks + sparks, level: Math.max(prev.level, Math.floor(nextXp / 100) + 1) };
    });

  const handleHeartLoss = () => setProfile((prev) => ({ ...prev, hearts: Math.max(0, prev.hearts - 1) }));

  const handleBuy = async (item: ShopItem) => {
    if (profile.sparks < item.price) return;

    setProfile((prev) => ({ ...prev, sparks: prev.sparks - item.price }));

    if (item.effect.startsWith('heart')) {
      setProfile((prev) => ({ ...prev, hearts: Math.min(613, prev.hearts + 1) }));
    }

    if (item.type === 'chest') {
      const generated = await generateStickerWithGemini({
        rarity: item.id.includes('epic') ? 'Épica' : 'Rara',
        ownedNames: profile.inventory.stickers.map((sticker) => sticker.name),
      });
      setProfile((prev) => ({
        ...prev,
        inventory: { ...prev.inventory, stickers: [generated, ...prev.inventory.stickers] },
      }));
    }
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl space-y-6 px-4 py-8 md:px-8">
      <header className="glass flex flex-col justify-between gap-3 rounded-2xl p-5 md:flex-row md:items-center">
        <div>
          <p className="font-heading text-4xl font-semibold text-yellow-500">Portões do PARDeS</p>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Versão inicial full-stack</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/70 p-2 text-xs">
          <input
            placeholder="email"
            className="rounded-md border border-white/10 bg-slate-950 px-2 py-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="senha"
            type="password"
            className="rounded-md border border-white/10 bg-slate-950 px-2 py-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={signInOrSignUp} className="rounded-md border border-yellow-500/70 px-2 py-1 text-yellow-300">
            Login/Cadastro
          </button>
        </div>
      </header>

      <nav className="grid grid-cols-2 gap-2 md:grid-cols-5">
        <NavButton icon={<BookOpen size={16} />} label="Dashboard" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
        <NavButton icon={<ShieldQuestion size={16} />} label="Quiz" active={view === 'quiz'} onClick={() => setView('quiz')} />
        <NavButton icon={<ShoppingBag size={16} />} label="Loja" active={view === 'shop'} onClick={() => setView('shop')} />
        <NavButton icon={<WandSparkles size={16} />} label="Álbum" active={view === 'album'} onClick={() => setView('album')} />
        <NavButton icon={<Crown size={16} />} label="Admin" active={view === 'admin'} onClick={() => setView('admin')} />
      </nav>

      {view === 'dashboard' && <Dashboard profile={profile} />}
      {view === 'quiz' && <QuizPortal onAward={handleAward} onHeartLoss={handleHeartLoss} />}
      {view === 'shop' && <Shop profile={profile} onBuy={handleBuy} />}
      {view === 'album' && <Album stickers={profile.inventory.stickers} />}
      {view === 'admin' && <AdminPanel />}

      <footer className="text-center text-xs text-slate-500">
        Usuário: {userId} • Progresso salvo automaticamente (debounce 2s) • Nível: {profile.level} ({Math.round(levelProgress * 100)}%)
      </footer>
    </main>
  );
}

function NavButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
        active ? 'border-yellow-500 bg-yellow-500/10 text-yellow-300' : 'border-white/10 bg-slate-900/60'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
