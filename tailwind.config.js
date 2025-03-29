import kampsyUI from 'kampsy-ui/preset';

/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  presets: [kampsyUI],
  theme: kampsyUI.theme,
  content: [
    './src/app.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{html,js,svelte,ts}', // Your app files
    './node_modules/kampsy-ui/**/*.{html,js,svelte,ts}' // Include kampsy-ui components
  ]
};
