<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	export let starCount = 0;

	let canvas: HTMLCanvasElement;
	let scene: any;
	let camera: any;
	let renderer: any;
	let stars: any;
	let animationId: number;
	let THREE: any;

	// Star twinkling animation state
	let starOpacities: number[] = [];
	let twinkleDirections: number[] = [];
	let starSizes: number[] = [];

	function createStars(count: number) {
		if (!THREE) return;

		// Remove existing stars if they exist
		if (stars) {
			scene.remove(stars);
		}

		// Create geometry
		const geometry = new THREE.BufferGeometry();
		const vertices = [];
		starOpacities = [];
		twinkleDirections = [];
		starSizes = [];

		console.log('Creating stars', count);

		// Generate random stars
		for (let i = 0; i < count; i++) {
			const x = (Math.random() - 0.5) * 2;
			const y = (Math.random() - 0.5) * 2;
			const z = (Math.random() - 0.5) * 0.5;

			vertices.push(x, y, z);

			// Random starting opacity and twinkle direction with more variation
			starOpacities.push(0.2 + Math.random() * 0.7); // Start with varied opacities
			// Varied twinkle speeds for each star
			twinkleDirections.push((Math.random() > 0.5 ? 1 : -1) * (0.005 + Math.random() * 0.015));
			// Random star sizes
			starSizes.push(0.03 + Math.random() * 0.04);
		}

		geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

		// Add size attribute for individual star sizes
		const sizes = new Float32Array(count);
		for (let i = 0; i < count; i++) {
			sizes[i] = starSizes[i];
		}
		geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

		// Create a sprite for the star shape (circle with outline)
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		const size = 128;
		canvas.width = size;
		canvas.height = size;

		// Draw a golden circle with black outline
		if (context) {
			// Golden fill
			context.beginPath();
			context.arc(size / 2, size / 2, size / 2 - 6, 0, 2 * Math.PI);
			context.fillStyle = 'gold';
			context.fill();
			// Black outline
			context.lineWidth = 4;
			context.strokeStyle = 'black';
			context.stroke();
		}

		const starTexture = new THREE.CanvasTexture(canvas);

		// Create custom shader material to use the size attribute
		const material = new THREE.ShaderMaterial({
			uniforms: {
				starTexture: { value: starTexture },
				globalScaleFactor: { value: 1.0 }
			},
			vertexShader: `
				attribute float size;
				uniform float globalScaleFactor;
				varying vec3 vColor;
				void main() {
					vColor = vec3(1.0, 0.84, 0.0); // Gold color
					vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
					gl_PointSize = size * globalScaleFactor * (300.0 / -mvPosition.z);
					gl_Position = projectionMatrix * mvPosition;
				}
			`,
			fragmentShader: `
				uniform sampler2D starTexture;
				varying vec3 vColor;
				void main() {
					gl_FragColor = vec4(vColor, 1.0) * texture2D(starTexture, gl_PointCoord);
				}
			`,
			transparent: true,
			blending: THREE.AdditiveBlending,
			depthTest: false
		});

		// Create star points
		stars = new THREE.Points(geometry, material);
		scene.add(stars);
	}

	function updateStars() {
		if (!stars || !THREE) return;

		const positions = stars.geometry.attributes.position.array;
		const count = positions.length / 3;

		// Update star opacities for twinkling effect
		for (let i = 0; i < count; i++) {
			// Update opacity based on direction
			starOpacities[i] += twinkleDirections[i];

			// Change direction if limits reached
			if (starOpacities[i] > 0.9 || starOpacities[i] < 0.1) {
				twinkleDirections[i] *= -1;
			}

			// Apply opacity to star
			const idx = i * 3;
			const scale = starOpacities[i];

			// Slightly move stars for subtle animation
			positions[idx + 1] += Math.sin(Date.now() * 0.001 + i) * 0.0003;
		}

		// Pulsate the size of the stars
		const pulseFactor = 0.7 + 0.2 * Math.sin(Date.now() * 0.001);

		// Update the global scale uniform for pulsating effect
		if (stars.material.uniforms && stars.material.uniforms.globalScaleFactor) {
			stars.material.uniforms.globalScaleFactor.value = pulseFactor;
		}

		// Update material opacity
		stars.geometry.attributes.position.needsUpdate = true;
	}

	function animate() {
		if (!THREE) return;

		animationId = requestAnimationFrame(animate);

		// Update star twinkling
		updateStars();

		// Render scene
		if (renderer && scene && camera) {
			renderer.render(scene, camera);
		}
	}

	function handleResize() {
		if (!canvas || !THREE) return;

		// Get the parent element's width instead of window width
		const width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
		const height = window.innerHeight;

		if (camera) {
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
		}

		if (renderer) {
			renderer.setSize(width, height);
		}
	}

	async function initThreeJS() {
		// Dynamically import Three.js
		THREE = await import('three');

		// Initialize Three.js scene
		scene = new THREE.Scene();

		// Create camera
		const width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
		camera = new THREE.PerspectiveCamera(75, width / window.innerHeight, 0.1, 1000);
		camera.position.z = 1;

		// Create renderer
		renderer = new THREE.WebGLRenderer({
			canvas,
			alpha: true,
			antialias: true
		});
		renderer.setClearColor(0x000000, 0); // Transparent background
		renderer.setSize(width, window.innerHeight);

		// Create initial stars
		createStars(starCount);

		// Handle window resize
		window.addEventListener('resize', handleResize);

		// Start animation loop
		animate();
	}

	// React to changes in starCount
	$: if (scene && THREE && stars && stars.geometry.attributes.position.count !== starCount) {
		createStars(starCount);
	}

	onMount(async () => {
		await initThreeJS();
	});

	onDestroy(() => {
		if (animationId) {
			cancelAnimationFrame(animationId);
		}

		window.removeEventListener('resize', handleResize);

		// Clean up Three.js resources
		if (THREE && stars) {
			scene.remove(stars);
			stars.geometry.dispose();
			stars.material.dispose();
		}

		if (renderer) {
			renderer.dispose();
		}
	});
</script>

<canvas
	bind:this={canvas}
	class="absolute w-full h-screen z-40 pointer-events-none"
	style="mix-blend-mode: screen;"
></canvas>
