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
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#4F46E5',
          600: '#4338ca',
          700: '#3730a3',
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          500: '#7C3AED',
          600: '#7c2d12',
          700: '#6b21a8',
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