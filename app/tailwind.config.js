/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        dark: {
          50: '#18181b',
          100: '#27272a',
          200: '#3f3f46',
          300: '#52525b',
          800: '#1f2937',
          900: '#111827',
        }
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}