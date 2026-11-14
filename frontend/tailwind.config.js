/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mixed: {
          bg: '#faf7f2',        // Warm Cashmere Alabaster
          surface: '#f4efe8',   // Soft Oat Sand
          card: '#ffffff',      // Pure White for Cards
          cardWarm: '#fdfbf7',  // Warm Tint Card
          border: '#e7ded2',    // Warm Sand Border
          borderLight: '#f0e9df',
          espresso: '#1a1f26',  // Deep Espresso Slate Text
          charcoal: '#2e353f',
          muted: '#6b7280',
          copper: '#c85a17',    // Warm Terracotta Copper
          copperHover: '#b04a0b',
          amber: '#d97706',     // Golden Harvest Amber
          gold: '#f59e0b',
          sage: '#1e5144',      // Deep Eucalyptus Sage
          sageLight: '#eef5f2',
          clay: '#9c4424',
          sandPill: '#f3ece2',
          pearlBlue: '#eff4fa'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif']
      }
    },
  },
  plugins: [],
}
