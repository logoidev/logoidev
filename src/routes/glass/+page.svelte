<script lang="ts">
	import * as THREE from 'three';
	import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let error: string | null = null;
	let isInitialized = false;
	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let renderer: THREE.WebGLRenderer;
	let torusKnot: THREE.Mesh;

	onMount(async () => {
		if (!browser) return;

		try {
			// Import Looking Glass polyfill only in browser
			const { LookingGlassWebXRPolyfill, LookingGlassConfig } = await import(
				'@lookingglass/webxr-polyfill'
			);

			// Initialize Looking Glass configuration
			const config = LookingGlassConfig;
			config.targetY = 0;
			config.targetZ = 0;
			config.targetDiam = 3;
			config.fovy = (14 * Math.PI) / 180;
			new LookingGlassWebXRPolyfill();
			isInitialized = true;
		} catch (e) {
			error = 'Failed to initialize Looking Glass: ' + (e instanceof Error ? e.message : String(e));
		}

		// Create Three.js scene
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x000000);

		// Create a more interesting 3D object
		const geometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 16);
		const material = new THREE.MeshStandardMaterial({
			color: 0x00ff00,
			metalness: 0.5,
			roughness: 0.1
		});
		torusKnot = new THREE.Mesh(geometry, material);
		scene.add(torusKnot);

		// Add lights
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(3, 3, 3);
		scene.add(directionalLight);

		// Create renderer
		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.xr.enabled = true;
		document.body.appendChild(renderer.domElement);

		// Create camera
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.z = 3;

		// Animation loop
		renderer.setAnimationLoop(() => {
			if (torusKnot) {
				torusKnot.rotation.x += 0.01;
				torusKnot.rotation.y += 0.01;
			}
			renderer.render(scene, camera);
		});

		// Add VR button
		document.body.appendChild(VRButton.createButton(renderer));

		// Handle window resize
		function onWindowResize() {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		}

		window.addEventListener('resize', onWindowResize);
		onWindowResize();

		return () => {
			// Cleanup
			window.removeEventListener('resize', onWindowResize);
			renderer.dispose();
			if (renderer.domElement.parentNode) {
				renderer.domElement.parentNode.removeChild(renderer.domElement);
			}
		};
	});
</script>

<div class="container">
	<h1>Looking Glass 3D Preview</h1>
	{#if !browser}
		<p>Loading...</p>
	{:else if error}
		<div class="error">
			<p>{error}</p>
			<p>
				Please make sure you have a Looking Glass display connected and the Looking Glass Bridge
				software running.
			</p>
		</div>
	{:else if isInitialized}
		<p>Move around the display to see the 3D content from different angles</p>
	{:else}
		<p>Initializing Looking Glass display...</p>
	{/if}
</div>

<style>
	.container {
		position: absolute;
		top: 20px;
		left: 20px;
		color: white;
		z-index: 100;
		pointer-events: none;
	}

	h1 {
		font-size: 24px;
		margin-bottom: 10px;
	}

	p {
		font-size: 16px;
		margin: 0;
	}

	.error {
		color: #ff4444;
		background: rgba(0, 0, 0, 0.7);
		padding: 10px;
		border-radius: 4px;
		margin-top: 10px;
		pointer-events: auto;
	}

	.error p {
		margin-bottom: 5px;
	}
</style>
