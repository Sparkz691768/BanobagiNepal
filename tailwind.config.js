/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './hooks/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6C3FE0',
        accent: '#7B55E8',
        'light-fill': '#EEE8FF',
        background: '#FAF9F7',
        dark: '#4F2BB8',
        body: '#2C3E50',
        muted: '#7F8C8D',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        slideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(200%)' },
        },
      },
      animation: {
        slideDown: 'slideDown 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
