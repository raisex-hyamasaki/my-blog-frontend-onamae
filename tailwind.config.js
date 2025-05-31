/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './styles/**/*.{css}',
  ],
  safelist: [
    { pattern: /^modal-overlay$/ },
    { pattern: /^modal-img$/ },
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            code: {
              backgroundColor: '#fef3c7', // Tailwind: bg-yellow-100
              color: '#000000',
              fontSize: '0.75rem', // Tailwind: text-xs
              padding: '0 0.25rem',
              borderRadius: '0.25rem',
              whiteSpace: 'normal',
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
