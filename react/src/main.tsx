import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Loader } from '@react-three/drei';
import App from './App.tsx';
import './index.css';

const interval = setInterval(() => {
	const root = document.getElementById('react-root')!;
	if (root) {
		ReactDOM.createRoot(root).render(
			<React.StrictMode>
				<Suspense fallback={null}>
					<App />
				</Suspense>
				<Loader />
			</React.StrictMode>
		);
		clearInterval(interval);
	}
}, 100);
