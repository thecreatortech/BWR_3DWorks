import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const ModelLoader = ({ progress }) => (
	<div
		className='model-loader'
		style={{
			position: 'absolute',
			inset: 0,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			flexDirection: 'column',
			gap: 16,
			background: 'rgba(240,240,240,0.95)',
			zIndex: 5,
		}}
	>
		<div
			style={{
				width: 44,
				height: 44,
				border: '3px solid #ebebeb',
				borderTop: '3px solid #000',
				borderRadius: '50%',
				animation: 'spin 0.8s linear infinite',
			}}
		/>
		<div
			style={{
				fontSize: 11,
				fontWeight: 600,
				letterSpacing: '.14em',
				textTransform: 'uppercase',
				color: 'rgba(0,0,0,0.35)',
			}}
		>
			Loading 3D Model
		</div>
		{progress > 0 && progress < 100 && (
			<div style={{ width: 120, height: 3, background: '#ebebeb', borderRadius: 2, overflow: 'hidden' }}>
				<div
					style={{
						width: `${progress}%`,
						height: '100%',
						background: '#000',
						borderRadius: 2,
						transition: 'width .3s ease',
					}}
				/>
			</div>
		)}
	</div>
);

export const GLBViewer = ({ modelPath, color = '#ffffff', style, className }) => {
	const mountRef = useRef(null);
	const sceneRef = useRef(null);
	const rendererRef = useRef(null);
	const controlsRef = useRef(null);
	const modelRef = useRef(null);
	const [loading, setLoading] = useState(true);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!mountRef.current) return;

		// Scene setup
		const scene = new THREE.Scene();
		sceneRef.current = scene;

		// Camera setup
		const camera = new THREE.PerspectiveCamera(
			45,
			mountRef.current.clientWidth / mountRef.current.clientHeight,
			0.1,
			1000,
		);
		camera.position.set(0, 0, 150);

		// Renderer setup
		const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setClearColor(0x000000, 0);
		mountRef.current.appendChild(renderer.domElement);
		rendererRef.current = renderer;

		// Lighting
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
		scene.add(ambientLight);

		const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
		directionalLight1.position.set(5, 5, 5);
		scene.add(directionalLight1);

		const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
		directionalLight2.position.set(-5, -5, -5);
		scene.add(directionalLight2);

		// OrbitControls
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.05;
		controls.screenSpacePanning = false;
		controls.minDistance = 50;
		controls.maxDistance = 500;
		controls.enableZoom = true;
		controls.enableRotate = true;
		controls.autoRotate = true;
		controls.autoRotateSpeed = 1.0;
		controlsRef.current = controls;

		// GLTF/GLB Loader
		const loader = new GLTFLoader();
		loader.load(
			modelPath,
			(gltf) => {
				const model = gltf.scene;
				modelRef.current = model;

				// Center the model
				const box = new THREE.Box3().setFromObject(model);
				const center = box.getCenter(new THREE.Vector3());
				model.position.sub(center);

				// Calculate bounding box for auto-scaling
				const size = new THREE.Vector3();
				box.getSize(size);
				const maxDim = Math.max(size.x, size.y, size.z);
				const scale = 100 / maxDim;
				model.scale.set(scale, scale, scale);

				// Apply color to all meshes in the model
				model.traverse((child) => {
					if (child.isMesh) {
						if (!child.material.map) {
							child.material.color.set(color);
						}
						child.material.needsUpdate = true;
					}
				});

				scene.add(model);
				setLoading(false);
			},
			(xhr) => {
				if (xhr.total > 0) {
					setProgress(Math.round((xhr.loaded / xhr.total) * 100));
				}
			},
			(err) => {
				console.error('Error loading GLB:', err);
				setError('Failed to load 3D model');
				setLoading(false);
			},
		);

		// Animation loop
		let animId;
		function animate() {
			animId = requestAnimationFrame(animate);
			controls.update();
			renderer.render(scene, camera);
		}
		animate();

		// Handle resize
		const handleResize = () => {
			if (!mountRef.current) return;
			const width = mountRef.current.clientWidth;
			const height = mountRef.current.clientHeight;
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
			renderer.setSize(width, height);
		};
		window.addEventListener('resize', handleResize);

		// Cleanup
		return () => {
			cancelAnimationFrame(animId);
			window.removeEventListener('resize', handleResize);
			if (mountRef.current && renderer.domElement) {
				mountRef.current.removeChild(renderer.domElement);
			}
			renderer.dispose();
			controls.dispose();
		};
	}, [modelPath]);

	// Update color when it changes
	useEffect(() => {
		if (modelRef.current) {
			modelRef.current.traverse((child) => {
				if (child.isMesh && !child.material.map) {
					child.material.color.set(color);
				}
			});
		}
	}, [color]);

	return (
		<div
			ref={mountRef}
			style={{
				width: '100%',
				height: '100%',
				position: 'relative',
				...style,
			}}
			className={className}
		>
			{loading && <ModelLoader progress={progress} />}
			{error && (
				<div
					style={{
						position: 'absolute',
						inset: 0,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						flexDirection: 'column',
						gap: 12,
						background: 'rgba(240,240,240,0.95)',
					}}
				>
					<div style={{ fontSize: 32, opacity: 0.3 }}>⚠</div>
					<div style={{ fontSize: 13, color: 'rgba(0,0,0,0.4)', fontWeight: 500 }}>
						{error}
					</div>
				</div>
			)}
		</div>
	);
};
