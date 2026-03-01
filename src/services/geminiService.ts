import type { Rarity, Sticker } from '@/types/domain';
import { compressBase64ToWebP } from './imageCompression';

const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

function fallbackSticker(rarity: Rarity): Sticker {
  return {
    id: crypto.randomUUID(),
    name: `Conceito ${rarity}`,
    nameHe: 'אוֹר',
    description: 'Carta fallback gerada localmente quando a IA está indisponível.',
    category: 'Fallback',
    rarity,
    imageUrl:
      'https://images.unsplash.com/photo-1548266652-99cf27701ced?auto=format&fit=crop&w=768&q=80',
  };
}

async function geminiGenerateText(prompt: string): Promise<string> {
  if (!geminiKey) throw new Error('Gemini key missing');
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Gemini text failed: ${response.status}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
}

export async function generateStickerWithGemini(params: {
  rarity: Rarity;
  ownedNames: string[];
}): Promise<Sticker> {
  try {
    const rawJson = await geminiGenerateText(`Crie uma carta judaica/cabalística em português e hebraico.
Raridade: ${params.rarity}.
Cartas já possuídas: ${params.ownedNames.join(', ') || 'nenhuma'}.
Retorne APENAS JSON no formato: {"name":"","nameHe":"","description":"","category":""}`);

    const clean = rawJson.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean) as Pick<Sticker, 'name' | 'nameHe' | 'description' | 'category'>;

    const artPrompt =
      'PIXAR/DISNEY 3D, majestic, divine aura, cinematic lighting, 2k resolution, religious, respectful';

    const imageHint = await geminiGenerateText(`Gere um prompt refinado em inglês para arte da carta: ${parsed.name}. Base: ${artPrompt}`);

    const fallbackImage = fallbackSticker(params.rarity).imageUrl;
    const maybeDataUrl = imageHint.startsWith('data:image/') ? imageHint : fallbackImage;
    const compressed = maybeDataUrl.startsWith('data:') ? await compressBase64ToWebP(maybeDataUrl) : maybeDataUrl;

    return {
      id: crypto.randomUUID(),
      name: parsed.name || `Carta ${params.rarity}`,
      nameHe: parsed.nameHe || 'אוֹר',
      description: parsed.description || 'Descrição não disponível.',
      category: parsed.category || 'Misticismo',
      rarity: params.rarity,
      imageUrl: compressed,
    };
  } catch (error) {
    console.error('Gemini error. Using fallback sticker.', error);
    return fallbackSticker(params.rarity);
  }
}

export async function generateEventVisual(eventName: string): Promise<string> {
  try {
    const text = await geminiGenerateText(`Crie um conceito visual para evento judaico: ${eventName}.`);
    if (text.startsWith('data:image/')) {
      return await compressBase64ToWebP(text);
    }
    return fallbackSticker('Comum').imageUrl;
  } catch {
    return fallbackSticker('Comum').imageUrl;
  }
}
