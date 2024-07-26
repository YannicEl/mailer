import { defineConfig, presetIcons, presetUno, transformerDirectives } from 'unocss';

export default defineConfig({
	presets: [
		presetUno(),
		presetIcons({
			scale: 1.2,
			warn: true,
			cdn: 'https://esm.sh/',
		}),
	],
	transformers: [
		transformerDirectives({
			applyVariable: ['--apply'],
		}),
	],
	theme: {
		fontFamily: {
			sans: ['Inter', 'sans-serif'],
		},
	},
});
