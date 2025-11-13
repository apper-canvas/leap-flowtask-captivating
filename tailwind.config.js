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
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#DC2626',
          600: '#b91c1c',
          700: '#991b1b',
        },
        secondary: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#EA580C',
          600: '#c2410c',
          700: '#9a3412',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#F59E0B',
          600: '#d97706',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      animation: {
        'task-complete': 'task-complete 300ms ease-out',
        'bounce-check': 'bounce-check 150ms ease-out',
      },
      keyframes: {
        'task-complete': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(0.95)', opacity: '0.5' },
          '100%': { transform: 'scale(0.95) translateX(20px)', opacity: '0' },
        },
        'bounce-check': {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}