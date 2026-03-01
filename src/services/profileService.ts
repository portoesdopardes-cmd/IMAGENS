import { seedProfile } from '@/data/mockData';
import type { Profile } from '@/types/domain';
import { hasSupabase, supabaseRest } from './supabaseClient';

export async function fetchProfile(userId: string, accessToken?: string): Promise<Profile> {
  if (!hasSupabase || !accessToken) {
    return { ...seedProfile, id: userId };
  }

  const data = await supabaseRest.selectSingle<{
    id: string;
    username: string;
    level: number;
    xp: number;
    sparks: number;
    hearts: number;
    inventory: Profile['inventory'];
    portal_stats: Profile['portalStats'];
  }>('profiles', `id=eq.${userId}`, accessToken);

  if (!data) {
    return { ...seedProfile, id: userId };
  }

  return {
    id: data.id,
    username: data.username,
    level: data.level,
    xp: data.xp,
    sparks: data.sparks,
    hearts: data.hearts,
    inventory: data.inventory,
    portalStats: data.portal_stats,
  };
}

export async function saveProfile(profile: Profile, accessToken?: string): Promise<void> {
  if (!hasSupabase || !accessToken) return;

  await supabaseRest.upsert(
    'profiles',
    {
      id: profile.id,
      username: profile.username,
      level: profile.level,
      xp: profile.xp,
      sparks: profile.sparks,
      hearts: profile.hearts,
      inventory: profile.inventory,
      portal_stats: profile.portalStats,
    },
    accessToken,
  );
}
