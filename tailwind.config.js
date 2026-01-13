/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                serif: ['var(--font-noto-serif)', 'Noto Serif', 'serif'],
                sans: ['var(--font-noto-sans)', 'Noto Sans', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
