export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/adam": [~5],
		"/adam/chat": [6],
		"/blog": [7],
		"/blog/[post]": [8],
		"/blog/[post]/p": [9],
		"/cal": [~13],
		"/c": [10],
		"/c/[id]": [11],
		"/c/[id]/p": [12],
		"/foundation": [14],
		"/liturgy": [~15],
		"/p": [16],
		"/ref/pa": [~17],
		"/ref/sophia": [~18],
		"/ref/sophia/c": [~19],
		"/ref/sophia/k": [~20],
		"/ref/sophia/ua": [~21],
		"/resolutions": [~22],
		"/resolutions/[id]": [~23],
		"/ukraine": [24],
		"/[user]": [3],
		"/[user]/p": [4]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.svelte';