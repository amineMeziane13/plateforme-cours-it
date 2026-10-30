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
        cyber: {
          black: '#080C14',
          darker: '#0B111E',
          card: '#111A2E',
          hover: '#18243E',
          border: '#1E2D4A',
          borderGlow: '#2D4470',
          blue: '#2563EB',
          blueLight: '#3B82F6',
          blueGlow: '#60A5FA',
          cyan: '#06B6D4',
          cyanLight: '#22D3EE',
          red: '#DC2626',
          redLight: '#EF4444',
          redGlow: '#F43F5E',
          muted: '#94A3B8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'glow-blue': '0 0 25px rgba(59, 130, 246, 0.25)',
        'glow-red': '0 0 25px rgba(239, 68, 68, 0.3)',
        'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.25)',
        'glow-card': '0 10px 30px -10px rgba(0, 0, 0, 0.5)'
      },
      backgroundImage: {
        'cyber-gradient': 'radial-gradient(ellipse at top, #152238 0%, #080C14 70%)',
        'grid-pattern': 'linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px)'
      }
    },
  },
  plugins: [],
}
