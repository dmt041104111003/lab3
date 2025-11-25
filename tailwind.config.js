/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#FBF8F4',
          100: '#F4EADF',
          200: '#E8D4C2',
          300: '#D6B290',
          400: '#C38C63',
          500: '#B06C3B',
          600: '#8C522B',
          700: '#6B3C20',
          800: '#4A2815',
          900: '#2F190D',
        },
        'brand-sand': '#F5F4F0',
        'brand-light': '#F4EADF',
        'brand-muted': '#E8D4C2',
        'brand-accent': '#B06C3B',
        'brand-dark': '#7D4A29',
        'brand-deep': '#4A2815',
        'tech-blue': '#B06C3B',
        'tech-dark-blue': '#7D4A29',
      },
      fontFamily: {
        'paytone': ['Paytone One', 'sans-serif'],
        'asap': ['Asap', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
        'roboto-condensed': ['Roboto Condensed', 'sans-serif'],
        'merriweather': ['var(--font-merriweather)', 'Merriweather', 'serif'],
      },
    },
  },
  plugins: [],
}
