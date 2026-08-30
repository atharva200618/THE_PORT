/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        port: {
          bg: "#EAEAEB",
          surface: "#F2F2F4",
          card: "#FFFFFF",
          dark: "#161618",
          pill: "#1E1E22",
          border: "#E0E0E4",
          muted: "#71717A"
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      },
      boxShadow: {
        'clay-card': '0 20px 40px -15px rgba(0, 0, 0, 0.05), 0 0 1px 1px rgba(255, 255, 255, 0.8) inset',
        'clay-card-hover': '0 25px 50px -12px rgba(0, 0, 0, 0.09), 0 0 1px 1px rgba(255, 255, 255, 1) inset',
        'clay-pill': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 0 1px 1px rgba(255, 255, 255, 0.9) inset',
        'glossy-btn': '0 8px 20px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
        'inset-pill': 'inset 0 2px 4px rgba(0, 0, 0, 0.05), inset 0 -1px 2px rgba(255, 255, 255, 0.9)'
      }
    },
  },
  plugins: [],
}
