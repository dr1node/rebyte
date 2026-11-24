import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 20px 45px rgba(0, 0, 0, 0.18)'
      },
      backgroundImage: {
        'hero-stripes': 'radial-gradient(circle at top left, rgba(56, 189, 248, 0.10), transparent 38%)'
      }
    }
  },
  plugins: []
};

export default config;
