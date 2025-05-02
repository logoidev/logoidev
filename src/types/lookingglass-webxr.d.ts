declare module '@lookingglass/webxr-polyfill' {
	export class LookingGlassWebXRPolyfill {
		constructor();
	}

	export const LookingGlassConfig: {
		targetY: number;
		targetZ: number;
		targetDiam: number;
		fovy: number;
	};
}
