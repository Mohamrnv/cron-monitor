/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          DEFAULT: '#0d0f14',
          100: '#13151c',
          200: '#1a1d27',
          300: '#222633',
          400: '#2d3244',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.06)',
          subtle: 'rgba(255,255,255,0.04)',
        },
        status: {
          healthy: '#10b981',
          late: '#f59e0b',
          down: '#ef4444',
          paused: '#64748b',
        },
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(16,185,129,0.25)',
        'glow-red': '0 0 20px rgba(239,68,68,0.3)',
        'glow-amber': '0 0 20px rgba(245,158,11,0.25)',
        'card': '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)',
      },
      keyframes: {
        pulse_soft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        pulse_soft: 'pulse_soft 2s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        fadeInUp: 'fadeInUp 0.3s ease-out both',
        scaleIn: 'scaleIn 0.2s ease-out both',
      },
    },
  },
  plugins: [],
}
