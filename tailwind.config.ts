import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#d32b36',     // Vermelho
        secondary: '#eea04a',   // Laranja
        accent: '#f7bf38',      // Amarelo
      },
      fontFamily: {
        sans: ['var(--font-convergence)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;