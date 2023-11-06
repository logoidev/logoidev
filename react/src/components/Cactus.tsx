// eslint-disable-next-line
// @ts-nocheck
import { MeshWobbleMaterial, useGLTF } from '@react-three/drei';
import { assetPath } from '../utils/path';

export default function Cactus() {
	const { nodes, materials } = useGLTF(assetPath('/level.glb'));
	return (
		<mesh
			geometry={nodes.Cactus.geometry}
			position={[-0.42, 0.51, -0.62]}
			rotation={[Math.PI / 2, 0, 0]}
		>
			<MeshWobbleMaterial factor={0.4} map={materials.Cactus.map} />
		</mesh>
	);
}
