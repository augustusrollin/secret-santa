import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        christmas: {
          red: '#C41E3A',
          darkRed: '#8B1A2F',
          green: '#165B33',
          darkGreen: '#0F4422',
          gold: '#D4AF37',
          lightGold: '#FFD700',
          snow: '#FFFAFA',
        },
      },
      fontFamily: {
        festive: ['"Mountains of Christmas"', 'cursive'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config

