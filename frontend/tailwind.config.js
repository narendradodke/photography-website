/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0A0A0A',
          card: '#141414',
          border: '#262626',
          text: '#FFFFFF',
          muted: '#A1A1A1',
        },
        light: {
          bg: '#F8F8F8',
          card: '#FFFFFF',
          border: '#E0E0E0',
          text: '#111111',
          muted: '#555555',
        },
        gold: {
          DEFAULT: '#D4AF37',
          hover: '#E6C558',
          light: '#F3E5AB',
          dark: '#C59B27',
          muted: '#997D25',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        cursive: ['"Great Vibes"', 'cursive'],
      },
      letterSpacing: {
        widest: '.2em',
        ultra: '.3em',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
