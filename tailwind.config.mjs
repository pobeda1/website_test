/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#E11D48',
        secondary: '#06B6D4',
        accent: '#F59E0B'
      }
    }
  }
};
