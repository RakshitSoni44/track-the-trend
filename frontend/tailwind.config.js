/** @type {import('tailwindcss').Config} */
export default {
  // This tells Tailwind to look for classes inside your index.html and all React component files
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

