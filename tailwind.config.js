/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './styles/**/*.css',
  ],
  safelist: [
    { pattern: /^modal-overlay$/ },
    { pattern: /^modal-img$/ },
    'fixed',
    'inset-0',
    'z-50',
    'flex',
    'items-center',
    'justify-center',
    'p-4',
    'bg-black',
    'bg-opacity-50',
    'bg-opacity-60',
    'bg-white',
    'rounded',
    'shadow-lg',
    'max-w-4xl',
    'max-h-[90vh]',
    'overflow-auto',
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
