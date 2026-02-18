import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

export const STLViewer = ({ modelPath, color = '#ffffff', style, className }) => {
	const mountRef = useRef(null);
	const sceneRef = useRef(null);
	const rendererRef = useRef(null);
	const controlsRef = useRef(null);
	const meshRef = useRef(null);
	const [loading, setLoading] = useState(true);
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

		// STL Loader
		const loader = new STLLoader();
		loader.load(
			modelPath,
			(geometry) => {
				// Center geometry
				geometry.center();

				// Create material
				const material = new THREE.MeshPhongMaterial({
					color: new THREE.Color(color),
					specular: 0x111111,
					shininess: 100,
					flatShading: false,
				});

				// Create mesh
				const mesh = new THREE.Mesh(geometry, material);
				meshRef.current = mesh;

				// Calculate bounding box for auto-scaling
				geometry.computeBoundingBox();
				const boundingBox = geometry.boundingBox;
				const size = new THREE.Vector3();
				boundingBox.getSize(size);
				const maxDim = Math.max(size.x, size.y, size.z);
				const scale = 100 / maxDim;
				mesh.scale.set(scale, scale, scale);

				scene.add(mesh);
				setLoading(false);
			},
			undefined,
			(err) => {
				console.error('Error loading STL:', err);
				setError('Failed to load 3D model');
				setLoading(false);
			},
		);

		// Animation loop
		function animate() {
			requestAnimationFrame(animate);
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
			if (mountRef.current && renderer.domElement) {
				mountRef.current.removeChild(renderer.domElement);
			}
			renderer.dispose();
			controls.dispose();
		};
	}, [modelPath]);

	// Update color when it changes
	useEffect(() => {
		if (meshRef.current) {
			meshRef.current.material.color.set(color);
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
		</div>
	);
};
