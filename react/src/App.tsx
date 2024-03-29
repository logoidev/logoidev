import { Canvas } from '@react-three/fiber';
import { PresentationControls } from '@react-three/drei';
import Level from './components/Level';
import Cactus from './components/Cactus';
import Pyramid from './components/Pyramid';

export default function App() {
	return (
		<div className="w-screen h-screen">
			<Canvas flat dpr={[1, 2]} camera={{ fov: 25, position: [0, 0, 8] }}>
				<color attach="background" args={['#e0b7ff']} />
				<ambientLight />
				<PresentationControls
					snap
					global
					zoom={0.8}
					rotation={[0, -Math.PI / 4, 0]}
					polar={[0, Math.PI / 4]}
					azimuth={[-Math.PI / 4, Math.PI / 4]}
				>
					<group position-y={-0.75} dispose={null}>
						<Level />

						<Cactus />

						<Pyramid />
					</group>
				</PresentationControls>
			</Canvas>
		</div>
	);
}
