export type Rarity = 'Comum' | 'Rara' | 'Épica' | 'Lendária' | 'Mítica';

export interface Profile {
  id: string;
  username: string;
  level: number;
  xp: number;
  sparks: number;
  hearts: number;
  inventory: {
    stickers: Sticker[];
    merits: string[];
    powerups: Record<string, number>;
  };
  portalStats: Record<string, { hits: number; misses: number }>;
}

export interface QuizQuestion {
  id: string;
  portal: PortalKey;
  question: string;
  options: string[];
  answerIndex: number;
  teaching: string;
}

export interface Sticker {
  id: string;
  name: string;
  nameHe: string;
  description: string;
  category: string;
  rarity: Rarity;
  imageUrl: string;
}

export interface ShopItem {
  id: string;
  namePt: string;
  description: string;
  price: number;
  type: 'powerup' | 'heart' | 'chest';
  effect: string;
}

export type PortalKey = 'leis-de-noe' | 'pshat' | 'remez' | 'drash' | 'sod' | 'parasha-semana';

export interface PortalDefinition {
  key: PortalKey;
  title: string;
  subtitle: string;
}
