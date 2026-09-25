/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Courier New"', 'Courier', 'monospace', 'Consolas'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        receipt: ['"VT323"', '"Courier New"', 'monospace'],
        ocr: ['"OCR-A"', '"Courier New"', 'monospace']
      },
      screens: {
        'print': {'raw': 'print'},
      }
    },
  },
  plugins: [],
}
