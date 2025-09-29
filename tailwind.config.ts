import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FDC435',
          light: '#FFE08A',
        },
        'background-light': '#F3F3F3',
        'background-dark': '#121212',
        'surface-light': '#FFFFFF',
        'surface-dark': '#1E1E1E',
        'text-light': '#1A1A1A',
        'text-dark': '#FFFFFF',
        'border-light': '#000000',
        'border-dark': '#FFFFFF',
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body: ['Roboto Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
      },
      borderWidth: {
        '3': '3px',
      },
      boxShadow: {
        'brutal-dark': '4px 4px 0px #FFFFFF',
        'brutal-light': '4px 4px 0px #000000',
      },
      animation: {
        'glowing': 'glowing 20s linear infinite',
        'tilt': 'tilt 10s infinite linear',
      },
      keyframes: {
        glowing: {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
        tilt: {
          '0%, 50%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(0.5deg)' },
          '75%': { transform: 'rotate(-0.5deg)' },
        },
      },
    },
  },
  plugins: [],
}
export default config