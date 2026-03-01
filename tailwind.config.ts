import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        accent: 'hsl(var(--accent))',
        gold: 'hsl(var(--gold))',
      },
      boxShadow: {
        glow: '0 0 40px -16px rgba(250, 204, 21, 0.45)',
      },
      fontFamily: {
        heading: ['Cinzel', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'mystic-radial': 'radial-gradient(circle at top, rgba(250,204,21,0.18), transparent 50%)',
      },
    },
  },
  plugins: [],
} satisfies Config;
