import { writable } from 'svelte/store';

export interface Alert {
	id: string;
	type: 'success' | 'error' | 'warning' | 'info';
	title?: string;
	message: string;
	duration?: number;
	dismissible?: boolean;
}

function createAlertStore() {
	const { subscribe, update } = writable<Alert[]>([]);

	function add(alert: Omit<Alert, 'id'>) {
		const id = Math.random().toString(36).substr(2, 9);
		const newAlert: Alert = {
			id,
			duration: 5000,
			dismissible: true,
			...alert
		};

		update((alerts) => [...alerts, newAlert]);

		// Auto-remove after duration
		if (newAlert.duration && newAlert.duration > 0) {
			setTimeout(() => {
				remove(id);
			}, newAlert.duration);
		}

		return id;
	}

	function remove(id: string) {
		update((alerts) => alerts.filter((alert) => alert.id !== id));
	}

	function clear() {
		update(() => []);
	}

	// Convenience methods
	function success(message: string, title?: string, duration?: number) {
		return add({ type: 'success', message, title, duration });
	}

	function error(message: string, title?: string, duration?: number) {
		return add({ type: 'error', message, title, duration });
	}

	function warning(message: string, title?: string, duration?: number) {
		return add({ type: 'warning', message, title, duration });
	}

	function info(message: string, title?: string, duration?: number) {
		return add({ type: 'info', message, title, duration });
	}

	return {
		subscribe,
		add,
		remove,
		clear,
		success,
		error,
		warning,
		info
	};
}

export const alerts = createAlertStore();
