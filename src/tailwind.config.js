// tailwind.config.js
module.exports = {
    content: [
        './index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {},
    },
    plugins: [require('daisyui')],
    // (optional) customize your DaisyUI theme here
    // daisyui: { themes: ['light', 'dark'] },
}
