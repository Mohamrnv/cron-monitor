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
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scaleOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.94)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        backdropIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        modalIn: {
          '0%': { opacity: '0', transform: 'scale(0.92) translateY(12px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        spin_slow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        ping_dot: {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
      },
      animation: {
        pulse_soft: 'pulse_soft 2.5s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        fadeInUp: 'fadeInUp 0.35s cubic-bezier(0.16,1,0.3,1) both',
        fadeInDown: 'fadeInDown 0.3s cubic-bezier(0.16,1,0.3,1) both',
        fadeIn: 'fadeIn 0.25s ease-out both',
        scaleIn: 'scaleIn 0.25s cubic-bezier(0.16,1,0.3,1) both',
        scaleOut: 'scaleOut 0.2s ease-in both',
        slideInRight: 'slideInRight 0.3s cubic-bezier(0.16,1,0.3,1) both',
        slideInLeft: 'slideInLeft 0.3s cubic-bezier(0.16,1,0.3,1) both',
        backdropIn: 'backdropIn 0.2s ease-out both',
        modalIn: 'modalIn 0.3s cubic-bezier(0.16,1,0.3,1) both',
        spin_slow: 'spin_slow 3s linear infinite',
        ping_dot: 'ping_dot 1.5s cubic-bezier(0,0,0.2,1) infinite',
        wiggle: 'wiggle 0.4s ease-in-out',
        countUp: 'countUp 0.3s ease-out both',
        ripple: 'ripple 0.6s ease-out both',
      },
    },
  },
  plugins: [],
}
