// @ts-expect-error - TODO: Extend window object typing
export const assetPath = (name: string) => (window.IS_SVELTE ? `/react${name}` : name);
