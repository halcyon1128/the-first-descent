/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontSize: {
        xxs: '0.8rem', // 10px
        micro: '0.01rem'
      }
    }
  },
  plugins: []
}
