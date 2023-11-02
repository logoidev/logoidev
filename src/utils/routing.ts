import Blog from 'src/routes/blog/blog.svelte';
import Main from 'src/routes/main.svelte';

const routes = {
	blog: Blog
};
export type Route = keyof typeof routes;

export function getRoute(p: { nested: true }): Array<Route>;
export function getRoute(p?: { nested: false | undefined }): Route;
export function getRoute({ nested = false } = {}) {
	const route = window.location.hash.replace('#', '') as Route;
	if (nested) {
		return route.split('/') as Array<Route>;
	}
	return route;
}

export const getRouteComponent = () => {
	const route = getRoute();
	let component = Main;
	if (routes[route]) {
		component = routes[route];
	}
	return component;
};
