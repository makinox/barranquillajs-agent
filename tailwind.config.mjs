/** @type {import('tailwindcss').Config} */
const daisyPlugin = require('daisyui');

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {},
	},
	plugins: [daisyPlugin],

}