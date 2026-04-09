/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef9ff',
          100: '#d8f1ff',
          200: '#b8e8ff',
          300: '#8cdbff',
          400: '#59c9ff',
          500: '#2baeff',
          600: '#118fe3',
          700: '#0f74b8',
          800: '#115f95',
          900: '#134f7a',
        },
        accent: {
          50: '#ecfffc',
          100: '#cffff9',
          200: '#a0fff2',
          300: '#66f8e8',
          400: '#31e8d7',
          500: '#0fcbbb',
          600: '#0b9f97',
          700: '#0f807a',
          800: '#136561',
          900: '#155450',
        },
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
    },
  },
  plugins: [],
}

