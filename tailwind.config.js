/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'noir-dark': '#1a1a1a',
        'noir-darker': '#0d0d0d',
        'gold': '#d4af37',
        'cream': '#f5f5dc',
      },
      fontFamily: {
        'display': ['"Playfair Display"', 'serif'],
        'body': ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
