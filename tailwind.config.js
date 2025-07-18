/** @type {import('tailwindcss').Config} */
const { heroui } = require("@heroui/react")

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
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
        }
      },
      backgroundImage: {
        'apple-intelligence': 'linear-gradient(90deg, #2997ff, #a259c2, #f46f30, #f4284a)',
        'gradient-subtle': 'linear-gradient(135deg, rgba(0,0,0,0.01) 0%, rgba(0,0,0,0.02) 100%)',
      },
      fontFamily: {
        'apple': ['SF Pro Display', 'Inter', 'Helvetica Neue', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'subtle-float': 'subtleFloat 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        subtleFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      }
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
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
              DEFAULT: '#64748b',
              foreground: '#ffffff',
            },
            background: '#ffffff',
            foreground: '#000000',
          },
        },
      },
    }),
  ],
} 