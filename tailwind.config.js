/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B1F3A',
        brand: '#246BFD',
        cyan: '#24CDE3',
        canvas: '#F6F8FC',
        text: '#172033',
        muted: '#657185',
        line: '#E7ECF3',
      },
      borderRadius: { card: '16px' },
      boxShadow: { card: '0 8px 32px rgba(23, 32, 51, 0.06)' },
    },
  },
  plugins: [],
}
