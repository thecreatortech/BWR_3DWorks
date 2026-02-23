import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export const AnimatedCarViewer = ({ modelPath, style, className }) => {
	const mountRef = useRef(null);
	const sceneRef = useRef(null);
	const rendererRef = useRef(null);
	const controlsRef = useRef(null);
	const modelRef = useRef(null);
	const cameraRef = useRef(null);
	const animationRef = useRef(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [animationComplete, setAnimationComplete] = useState(false);

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
		camera.position.set(0, 3, 12); // Start zoomed out
		cameraRef.current = camera;

		// Renderer setup
		const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setClearColor(0x000000, 0);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		mountRef.current.appendChild(renderer.domElement);
		rendererRef.current = renderer;

		// Lighting
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		scene.add(ambientLight);

		const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
		directionalLight1.position.set(5, 10, 5);
		directionalLight1.castShadow = true;
		scene.add(directionalLight1);

		const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
		directionalLight2.position.set(-5, 5, -5);
		scene.add(directionalLight2);

		// Add rim light for dramatic effect
		const rimLight = new THREE.DirectionalLight(0x4488ff, 0.6);
		rimLight.position.set(0, 3, -10);
		scene.add(rimLight);

		// OrbitControls (disabled during animation)
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.05;
		controls.screenSpacePanning = false;
		controls.minDistance = 2;
		controls.maxDistance = 15;
		controls.enableZoom = true;
		controls.enableRotate = false; // Start disabled
		controls.autoRotate = false;
		controls.maxPolarAngle = Math.PI / 2;
		controlsRef.current = controls;

		// Animation state
		let animationProgress = 0;
		const animationDuration = 3.5; // seconds
		let startTime = Date.now();

		// GLTF/GLB Loader
		const loader = new GLTFLoader();
		loader.load(
			modelPath,
			(gltf) => {
				const model = gltf.scene;
				modelRef.current = model;

				// Enable shadows
				model.traverse((child) => {
					if (child.isMesh) {
						child.castShadow = true;
						child.receiveShadow = true;
					}
				});

				// Calculate bounding box for scaling
				const box = new THREE.Box3().setFromObject(model);
				const size = new THREE.Vector3();
				box.getSize(size);
				const maxDim = Math.max(size.x, size.y, size.z);
				const scale = 2.5 / maxDim; // Scale to reasonable size
				model.scale.set(scale, scale, scale);

				// Set initial position (off-screen right, coming from behind)
				model.position.set(15, 0, -12);
				model.rotation.y = -Math.PI / 6; // Angled towards us

				scene.add(model);
				setLoading(false);
			},
			undefined,
			(err) => {
				console.error('Error loading GLB:', err);
				setError('Failed to load 3D model');
				setLoading(false);
			},
		);

		// Animation loop
		function animate() {
			animationRef.current = requestAnimationFrame(animate);

			const currentTime = Date.now();
			const elapsed = (currentTime - startTime) / 1000; // seconds

			if (modelRef.current && !animationComplete) {
				animationProgress = Math.min(elapsed / animationDuration, 1);

				// Easing function (ease-out-cubic)
				const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
				const easeInOutCubic = (t) =>
					t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

				const easedProgress = easeInOutCubic(animationProgress);

				// Phase 1: Drive in (0-40%)
				if (animationProgress < 0.4) {
					const driveProgress = animationProgress / 0.4;
					const easedDrive = easeOutCubic(driveProgress);

					modelRef.current.position.x = 15 - easedDrive * 18; // Move from right to left
					modelRef.current.position.z = -12 + easedDrive * 10; // Move forward
					modelRef.current.rotation.y = -Math.PI / 6 + (easedDrive * Math.PI) / 12;
				}
				// Phase 2: Drift (40-70%)
				else if (animationProgress < 0.7) {
					const driftProgress = (animationProgress - 0.4) / 0.3;
					const easedDrift = easeInOutCubic(driftProgress);

					// Drift motion - car slides sideways while rotating
					modelRef.current.position.x = -3 + Math.sin(easedDrift * Math.PI) * 2;
					modelRef.current.position.z = -2 + easedDrift * 2;
					modelRef.current.rotation.y = -Math.PI / 12 + easedDrift * Math.PI * 0.8; // Rotate during drift

					// Slight tilt during drift
					modelRef.current.rotation.z = Math.sin(easedDrift * Math.PI) * 0.15;
				}
				// Phase 3: Settle (70-100%)
				else {
					const settleProgress = (animationProgress - 0.7) / 0.3;
					const easedSettle = easeOutCubic(settleProgress);

					// Settle into final position
					const startX = -3 + Math.sin(Math.PI) * 2;
					const startZ = -2 + 2;
					const startRotY = -Math.PI / 12 + Math.PI * 0.8;
					const startRotZ = Math.sin(Math.PI) * 0.15;

					modelRef.current.position.x = startX + easedSettle * (0 - startX);
					modelRef.current.position.z = startZ + easedSettle * (0 - startZ);
					modelRef.current.rotation.y =
						startRotY + easedSettle * (Math.PI / 2.5 - startRotY);
					modelRef.current.rotation.z = startRotZ - easedSettle * startRotZ;
				}

				// Camera follows car and zooms in during animation
				if (animationProgress < 0.95) {
					const targetCameraX = modelRef.current.position.x * 0.3;
					const targetCameraY = 2 + (1 - easedProgress) * 1; // Lower camera as it progresses
					const targetCameraZ = modelRef.current.position.z + 12 - easedProgress * 9.5; // Zoom in from 12 to 2.5
					(targetCameraY - cameraRef.current.position.y) * 0.03;
					cameraRef.current.position.z +=
						(targetCameraZ - cameraRef.current.position.z) * 0.05;
					cameraRef.current.lookAt(
						modelRef.current.position.x,
						modelRef.current.position.y + 0.3,
						modelRef.current.position.z,
					);
				}

				// Animation complete
				if (animationProgress >= 1 && !animationComplete) {
					setAnimationComplete(true);
					controls.enableRotate = true; // Enable user interaction
					controls.autoRotate = true;
					controls.autoRotateSpeed = 0.5;
				}
			}

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
			window.removeEventListener('resize', handleResize);
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
			if (mountRef.current && renderer.domElement) {
				mountRef.current.removeChild(renderer.domElement);
			}
			renderer.dispose();
			controls.dispose();
		};
	}, [modelPath]);

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
			{loading && (
				<div
					style={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						fontSize: 14,
						color: '#999',
					}}
				>
					Loading 3D model...
				</div>
			)}
			{error && (
				<div
					style={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						fontSize: 14,
						color: '#999',
					}}
				>
					{error}
				</div>
			)}
			{!loading && !error && !animationComplete && (
				<div
					style={{
						position: 'absolute',
						bottom: 30,
						left: '50%',
						transform: 'translateX(-50%)',
						fontSize: 12,
						color: 'rgba(255,255,255,0.6)',
						letterSpacing: '0.1em',
						textTransform: 'uppercase',
						fontWeight: 600,
						background: 'rgba(0,0,0,0.3)',
						padding: '8px 20px',
						borderRadius: 20,
						backdropFilter: 'blur(10px)',
					}}
				>
					🏎️ Watch the McLaren drift...
				</div>
			)}
		</div>
	);
};
