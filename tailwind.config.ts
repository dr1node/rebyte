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
        soft: '0 20px 45px rgba(15, 23, 42, 0.08)' 
      },
      backgroundImage: {
        'hero-stripes': 'radial-gradient(circle at top left, rgba(59, 130, 246, 0.12), transparent 40%)'
      }
    }
  },
  plugins: []
};

export default config;
