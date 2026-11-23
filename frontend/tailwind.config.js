/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        supro: {
          bg: '#F5F1EB',         // Signature Supro warm linen/sand canvas
          surface: '#EFE9DF',    // Soft sand / muted linen
          card: '#FFFFFF',       // Pure white cards
          ivory: '#FAF8F5',      // Soft warm ivory
          border: '#E3DBD0',     // Hairline sand border
          borderLight: '#EDE6DC',
          black: '#111111',      // Solid editorial black
          charcoal: '#262422',   // Deep warm charcoal
          muted: '#6B665F',      // Editorial stone grey
          tan: '#C27B48',        // Warm cognac tan accent
          sandPill: '#EAE3D7',   // Minimalist sand pill tag
          pillHover: '#DFD7CA',
        },
        mixed: {
          bg: '#F5F1EB',        // Warm Cashmere Alabaster
          surface: '#EFE9DF',   // Soft Oat Sand
          card: '#ffffff',      // Pure White for Cards
          cardWarm: '#FAF8F5',  // Warm Tint Card
          border: '#E3DBD0',    // Warm Sand Border
          borderLight: '#EDE6DC',
          espresso: '#111111',  // Deep Editorial Black
          charcoal: '#262422',
          muted: '#6B665F',
          copper: '#C27B48',    // Warm Terracotta
          copperHover: '#A86232',
          amber: '#d97706',     // Golden Harvest Amber
          gold: '#f59e0b',
          sage: '#1e5144',      // Deep Eucalyptus Sage
          sageLight: '#eef5f2',
          clay: '#9c4424',
          sandPill: '#EAE3D7',
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
