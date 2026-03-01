import type { PortalDefinition, Profile, QuizQuestion, ShopItem } from '@/types/domain';

export const portals: PortalDefinition[] = [
  { key: 'leis-de-noe', title: 'Leis de Noé', subtitle: 'Fundamentos universais' },
  { key: 'pshat', title: 'Pshat', subtitle: 'Sentido literal da Torá' },
  { key: 'remez', title: 'Remez', subtitle: 'Pistas e alusões' },
  { key: 'drash', title: 'Drash', subtitle: 'Interpretação homilética' },
  { key: 'sod', title: 'Sod', subtitle: 'Dimensão mística' },
  { key: 'parasha-semana', title: 'Parashá da Semana', subtitle: 'Estudo contínuo' },
];

export const seedProfile: Profile = {
  id: 'demo-user',
  username: 'projectpardes',
  level: 12,
  xp: 2560,
  sparks: 980,
  hearts: 613,
  inventory: { stickers: [], merits: ['primeiro-passo'], powerups: { pular: 1, rabino: 2 } },
  portalStats: {},
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q-noe-1',
    portal: 'leis-de-noe',
    question: 'Quantas Leis de Noé são tradicionalmente reconhecidas?',
    options: ['5', '7', '10', '13'],
    answerIndex: 1,
    teaching:
      'A tradição rabínica reconhece 7 leis universais para as nações: justiça, proibição da idolatria, blasfêmia, assassinato, relações ilícitas, roubo e consumo de membro de animal vivo.',
  },
  {
    id: 'q-sod-1',
    portal: 'sod',
    question: 'No método PaRDeS, o nível Sod representa:',
    options: ['A gramática', 'O sentido legal', 'O mistério esotérico', 'A poesia litúrgica'],
    answerIndex: 2,
    teaching:
      'Sod é o plano secreto/místico. Tradicionalmente conectado à Cabalá e ao estudo dos níveis internos da criação.',
  },
];

export const shopItems: ShopItem[] = [
  {
    id: 'power-eliminar',
    namePt: 'Eliminar Alternativas',
    description: 'Remove duas opções incorretas da questão atual.',
    price: 120,
    type: 'powerup',
    effect: 'eliminar',
  },
  {
    id: 'heart-one',
    namePt: '+1 Coração',
    description: 'Restaura um coração instantaneamente.',
    price: 80,
    type: 'heart',
    effect: 'heart+1',
  },
  {
    id: 'chest-epic',
    namePt: 'Baú Místico Épico',
    description: 'Garante carta de raridade Épica ou superior.',
    price: 450,
    type: 'chest',
    effect: 'chest:epic',
  },
];
