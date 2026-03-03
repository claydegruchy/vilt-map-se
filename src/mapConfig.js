import { writable } from 'svelte/store';

function defaultColorScale(value, min, max) {
	const t = max === min ? 0.5 : (value - min) / (max - min);
	const r = Math.round(220 - t * 170);
	const g = Math.round(235 - t * 100);
	const b = Math.round(255 - t * 30);
	return `rgba(${r},${g},${b},0.7)`;
}

export const mapConfig = writable({
	colorScale: defaultColorScale,
	defaultFill: 'rgba(212, 221, 228, 0.4)',
	highlightStroke: '#1a1a2e',
	defaultStroke: '#6b7f8e',
	highlightStrokeWidth: 2.5,
	defaultStrokeWidth: 1,
	showTrendArrows: false,
	showLegend: true,

});



export function makeEmptyPattern() {
	const canvas = document.createElement('canvas');
	canvas.width = 8;
	canvas.height = 8;
	const ctx = canvas.getContext('2d');
	ctx.strokeStyle = '#94a3b8';
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(0, 8);
	ctx.lineTo(8, 0);
	ctx.stroke();
	return ctx.createPattern(canvas, 'repeat');
}