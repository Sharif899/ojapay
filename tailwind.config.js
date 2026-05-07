/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:      '#080a18',
        bg2:     '#0e1022',
        bg3:     '#141728',
        card:    '#111326',
        card2:   '#181b35',
        blue:    '#4f6ef7',
        blue2:   '#6b85ff',
        purple:  '#7c5cfc',
        cyan:    '#3ecfcf',
        green:   '#22c87a',
        orange:  '#f97316',
      },
      fontFamily: {
        head: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      animation: {
        'fade-up':   'fadeUp .55s cubic-bezier(.22,1,.36,1) both',
        'scale-in':  'scaleIn .45s cubic-bezier(.22,1,.36,1) both',
        'float':     'float 5s ease infinite',
        'glow':      'glow 3s ease infinite',
        'pulse-dot': 'pulse 2s infinite',
        'spin-slow': 'spin 1s linear infinite',
      },
      keyframes: {
        fadeUp:  { from: { opacity:0, transform:'translateY(22px)' }, to: { opacity:1, transform:'translateY(0)' } },
        scaleIn: { from: { opacity:0, transform:'scale(.93)' },       to: { opacity:1, transform:'scale(1)' } },
        float:   { '0%,100%': { transform:'translateY(0)' },          '50%': { transform:'translateY(-8px)' } },
        glow:    { '0%,100%': { boxShadow:'0 0 18px rgba(79,110,247,0.4)' }, '50%': { boxShadow:'0 0 36px rgba(79,110,247,0.4)' } },
      },
      boxShadow: {
        'card': '0 24px 60px rgba(0,0,0,0.55)',
        'blue': '0 10px 28px rgba(79,110,247,0.4)',
      },
    },
  },
  plugins: [],
}
