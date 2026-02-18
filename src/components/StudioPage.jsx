import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { calculatePrice } from '../utils/pricing';

export const StudioPage = ({ setPage, addToCart }) => {
	const [file, setFile] = useState(null);
	const [fileName, setFileName] = useState('');
	const [volumeCm3, setVolumeCm3] = useState(50);
	const [price, setPrice] = useState(5000);
	const [modelColor, setModelColor] = useState('#ff6b35');
	const [uploadMode, setUploadMode] = useState('stl'); // 'stl' or 'image'
	const [imageFile, setImageFile] = useState(null);
	const canvasRef = useRef(null);
	const rendererRef = useRef(null);
	const sceneRef = useRef(null);
	const controlsRef = useRef(null);
	const meshRef = useRef(null);

	// Calculate price whenever volume changes
	useEffect(() => {
		const pricing = calculatePrice({ volumeCm3, material: 'PETG Matte' });
		// Convert to Rupees (1 USD ≈ 83 INR)
		setPrice(Math.round(pricing.total * 83));
	}, [volumeCm3]);

	// Initialize Three.js scene
	useEffect(() => {
		if (!canvasRef.current || !fileName) return;

		const width = canvasRef.current.clientWidth;
		const height = canvasRef.current.clientHeight;

		// Scene, Camera, Renderer
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0xf0f0f0);
		sceneRef.current = scene;

		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
		camera.position.z = 150;

		const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setSize(width, height);
		renderer.setPixelRatio(window.devicePixelRatio);
		canvasRef.current.appendChild(renderer.domElement);
		rendererRef.current = renderer;

		// OrbitControls for mouse interaction
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.05;
		controls.screenSpacePanning = false;
		controls.minDistance = 50;
		controls.maxDistance = 500;
		controls.maxPolarAngle = Math.PI;
		controlsRef.current = controls;

		// Lighting
		const ambLight = new THREE.AmbientLight(0xffffff, 0.6);
		scene.add(ambLight);

		const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
		dirLight.position.set(100, 100, 100);
		scene.add(dirLight);

		// Load STL file
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const geometry = new STLLoader().parse(e.target.result);
				geometry.computeBoundingBox();
				geometry.computeVertexNormals();

				// Calculate volume and center geometry
				const box = geometry.boundingBox;
				const width = box.max.x - box.min.x;
				const height = box.max.y - box.min.y;
				const depth = box.max.z - box.min.z;
				const calculatedVolume = width * height * depth;

				// Update volume if can be calculated
				if (calculatedVolume > 0) {
					setVolumeCm3(Math.round(calculatedVolume * 100) / 100);
				}

				// Center geometry
				geometry.center();

				const material = new THREE.MeshPhongMaterial({
					color: new THREE.Color(modelColor),
					shininess: 100,
					specular: 0x444444,
				});

				const mesh = new THREE.Mesh(geometry, material);
				meshRef.current = mesh;
				scene.clear();
				scene.add(ambLight);
				scene.add(dirLight);
				scene.add(mesh);

				// Auto-scale to fit view
				const size = new THREE.Vector3();
				geometry.computeBoundingBox();
				box.getSize(size);
				const maxDim = Math.max(size.x, size.y, size.z);
				const scale = 100 / maxDim;
				mesh.scale.multiplyScalar(scale);

				// Animation loop with OrbitControls
				const animate = () => {
					controls.update();
					renderer.render(scene, camera);
					requestAnimationFrame(animate);
				};
				animate();

				// Handle resize
				const handleResize = () => {
					const w = canvasRef.current?.clientWidth || width;
					const h = canvasRef.current?.clientHeight || height;
					camera.aspect = w / h;
					camera.updateProjectionMatrix();
					renderer.setSize(w, h);
				};
				window.addEventListener('resize', handleResize);
				return () => window.removeEventListener('resize', handleResize);
			} catch (err) {
				console.error('Failed to load STL:', err);
				alert("Failed to load STL file. Make sure it's a valid STL file.");
			}
		};
		reader.readAsArrayBuffer(file);

		return () => {
			if (rendererRef.current && canvasRef.current) {
				try {
					canvasRef.current.removeChild(renderer.domElement);
				} catch (e) {
					// Element might already be removed
				}
			}
		};
	}, [file, modelColor]);

	// Update mesh color when color picker changes
	useEffect(() => {
		if (meshRef.current) {
			meshRef.current.material.color.set(modelColor);
		}
	}, [modelColor]);

	const handleFileUpload = (e) => {
		const uploadedFile = e.target.files?.[0];
		if (uploadedFile) {
			if (!uploadedFile.name.toLowerCase().endsWith('.stl')) {
				alert('Please upload an STL file');
				return;
			}
			setFile(uploadedFile);
			setFileName(uploadedFile.name);
		}
	};

	const handleImageUpload = (e) => {
		const uploadedImage = e.target.files?.[0];
		if (uploadedImage) {
			const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
			if (!validTypes.includes(uploadedImage.type)) {
				alert('Please upload a valid image file (JPG, PNG, WEBP)');
				return;
			}
			setImageFile(uploadedImage);
			setFileName(uploadedImage.name);
			setUploadMode('image');
		}
	};

	const handleAddToCart = () => {
		const customProduct = {
			id: `custom-${Date.now()}`,
			name: `Custom Design: ${fileName || 'Unnamed'}`,
			price: price,
			cat: 'custom',
			desc: `${volumeCm3}cm³ • Custom 3D Print`,
			details: {
				file: fileName,
				volume: volumeCm3,
				priceINR: price,
			},
		};
		addToCart(customProduct);
	};

	return (
		<div style={{ minHeight: '100vh', background: '#f7f7f7', paddingTop: 68 }}>
			{/* Header */}
			<section
				style={{
					background: '#fff',
					padding: '80px 52px',
					borderBottom: '1px solid #ebebeb',
				}}
			>
				<div style={{ maxWidth: 1280, margin: '0 auto' }}>
					<h1
						style={{
							fontFamily: 'var(--font-display)',
							fontSize: 'clamp(36px, 4.5vw, 68px)',
							fontWeight: 400,
							marginBottom: 20,
							color: '#000',
							letterSpacing: '-0.025em',
						}}
					>
						Custom Design Studio
					</h1>
					<p
						style={{
							fontSize: 17,
							fontWeight: 300,
							color: 'rgba(0,0,0,0.5)',
							maxWidth: 600,
							lineHeight: 1.8,
						}}
					>
						Upload your 3D model, preview it in real-time, and get instant pricing for
						custom printing.
					</p>
				</div>
			</section>

			{/* Main Content */}
			<section style={{ padding: '60px 52px' }}>
				<div style={{ maxWidth: 1200, margin: '0 auto' }}>
					{/* Upload Area */}
					{!fileName && (
						<div style={{ background: '#fff', padding: 40, borderRadius: 4 }}>
							{/* Tab Navigation */}
							<div
								style={{
									display: 'flex',
									gap: 12,
									marginBottom: 32,
									borderBottom: '1px solid #ebebeb',
								}}
							>
								<button
									onClick={() => setUploadMode('stl')}
									style={{
										padding: '12px 24px',
										background: 'transparent',
										border: 'none',
										borderBottom:
											uploadMode === 'stl'
												? '2px solid #000'
												: '2px solid transparent',
										fontSize: 14,
										fontWeight: uploadMode === 'stl' ? 600 : 400,
										color: uploadMode === 'stl' ? '#000' : 'rgba(0,0,0,0.4)',
										cursor: 'pointer',
										transition: 'all .2s',
									}}
								>
									📁 Upload STL File
								</button>
								<button
									onClick={() => setUploadMode('image')}
									style={{
										padding: '12px 24px',
										background: 'transparent',
										border: 'none',
										borderBottom:
											uploadMode === 'image'
												? '2px solid #000'
												: '2px solid transparent',
										fontSize: 14,
										fontWeight: uploadMode === 'image' ? 600 : 400,
										color: uploadMode === 'image' ? '#000' : 'rgba(0,0,0,0.4)',
										cursor: 'pointer',
										transition: 'all .2s',
									}}
								>
									🖼️ Image to 3D (AI Preview)
								</button>
							</div>

							{/* STL Upload */}
							{uploadMode === 'stl' && (
								<div
									style={{
										border: '2px dashed #d6d6d6',
										borderRadius: 4,
										padding: 80,
										textAlign: 'center',
										cursor: 'pointer',
										transition: 'border-color .3s, background .3s',
									}}
									onDragOver={(e) => {
										e.preventDefault();
										e.currentTarget.style.borderColor = '#000';
										e.currentTarget.style.background = '#f7f7f7';
									}}
									onDragLeave={(e) => {
										e.currentTarget.style.borderColor = '#d6d6d6';
										e.currentTarget.style.background = '#fff';
									}}
									onDrop={(e) => {
										e.preventDefault();
										e.currentTarget.style.borderColor = '#d6d6d6';
										e.currentTarget.style.background = '#fff';
										if (e.dataTransfer.files[0])
											handleFileUpload({
												target: { files: e.dataTransfer.files },
											});
									}}
								>
									<input
										type='file'
										accept='.stl'
										onChange={handleFileUpload}
										style={{ display: 'none' }}
										id='file-upload'
									/>
									<label
										htmlFor='file-upload'
										style={{ cursor: 'pointer', display: 'block' }}
									>
										<div
											style={{
												fontSize: 64,
												marginBottom: 24,
												color: '#000',
											}}
										>
											📁
										</div>
										<div
											style={{
												fontSize: 20,
												fontWeight: 600,
												color: '#000',
												marginBottom: 12,
											}}
										>
											Upload Your 3D Model
										</div>
										<div style={{ fontSize: 14, color: 'rgba(0,0,0,0.4)' }}>
											Drop STL file here or click to browse
										</div>
									</label>
								</div>
							)}

							{/* Image Upload for AI Conversion */}
							{uploadMode === 'image' && (
								<div>
									<div
										style={{
											border: '2px dashed #d6d6d6',
											borderRadius: 4,
											padding: 60,
											textAlign: 'center',
											cursor: 'pointer',
											transition: 'border-color .3s, background .3s',
										}}
										onDragOver={(e) => {
											e.preventDefault();
											e.currentTarget.style.borderColor = '#000';
											e.currentTarget.style.background = '#f7f7f7';
										}}
										onDragLeave={(e) => {
											e.currentTarget.style.borderColor = '#d6d6d6';
											e.currentTarget.style.background = '#fff';
										}}
										onDrop={(e) => {
											e.preventDefault();
											e.currentTarget.style.borderColor = '#d6d6d6';
											e.currentTarget.style.background = '#fff';
											if (e.dataTransfer.files[0])
												handleImageUpload({
													target: { files: e.dataTransfer.files },
												});
										}}
									>
										<input
											type='file'
											accept='image/*'
											onChange={handleImageUpload}
											style={{ display: 'none' }}
											id='image-upload'
										/>
										<label
											htmlFor='image-upload'
											style={{ cursor: 'pointer', display: 'block' }}
										>
											<div
												style={{
													fontSize: 64,
													marginBottom: 24,
													color: '#000',
												}}
											>
												🖼️
											</div>
											<div
												style={{
													fontSize: 20,
													fontWeight: 600,
													color: '#000',
													marginBottom: 12,
												}}
											>
												Upload Image for 3D Conversion
											</div>
											<div
												style={{
													fontSize: 14,
													color: 'rgba(0,0,0,0.4)',
													marginBottom: 20,
												}}
											>
												Drop image here or click to browse (JPG, PNG)
											</div>
										</label>
									</div>
									<div
										style={{
											background: '#fff3e0',
											border: '1px solid #ffb74d',
											padding: 24,
											borderRadius: 4,
											marginTop: 24,
											fontSize: 13,
											lineHeight: 1.7,
											color: 'rgba(0,0,0,0.7)',
										}}
									>
										<div
											style={{
												fontWeight: 600,
												color: '#e65100',
												marginBottom: 8,
												fontSize: 14,
											}}
										>
											📸 How Image to 3D Works:
										</div>
										<ul style={{ margin: 0, paddingLeft: 20 }}>
											<li>
												Upload an image to get a{' '}
												<strong>preview quote</strong> for your 3D model
											</li>
											<li>We'll review it and send you an estimated price</li>
											<li>
												For best results, send us{' '}
												<strong>photos from all angles</strong> (front,
												back, sides, top)
											</li>
											<li>
												Our team will manually create a high-quality 3D
												model with accurate colors
											</li>
											<li>
												You'll receive a preview before we start printing
											</li>
										</ul>
									</div>
								</div>
							)}
						</div>
					)}

					{/* Preview & Pricing */}
					{fileName && (
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: '1.2fr 1fr',
								gap: 60,
								alignItems: 'start',
							}}
						>
							{/* Left: Preview */}
							<div>
								<div
									style={{
										background: '#e8f5e9',
										border: '1px solid #4caf50',
										padding: 16,
										borderRadius: 2,
										marginBottom: 24,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
									}}
								>
									<div>
										<div
											style={{
												fontSize: 13,
												fontWeight: 600,
												color: '#2e7d32',
												marginBottom: 4,
											}}
										>
											✓ File Loaded
										</div>
										<div style={{ fontSize: 12, color: '#1b5e20' }}>
											{fileName}
										</div>
									</div>
									<button
										onClick={() => {
											setFile(null);
											setFileName('');
											setImageFile(null);
										}}
										style={{
											background: 'rgba(0,0,0,0.05)',
											border: 'none',
											padding: '8px 12px',
											borderRadius: 2,
											fontSize: 12,
											cursor: 'pointer',
										}}
									>
										Change File
									</button>
								</div>

								{/* Color Picker for STL */}
								{uploadMode === 'stl' && file && (
									<div
										style={{
											background: '#fff',
											padding: 20,
											borderRadius: 2,
											marginBottom: 24,
											border: '1px solid #ebebeb',
										}}
									>
										<label
											style={{
												display: 'flex',
												alignItems: 'center',
												gap: 12,
												fontSize: 13,
												fontWeight: 600,
												color: '#000',
											}}
										>
											<span>🎨 Model Color:</span>
											<input
												type='color'
												value={modelColor}
												onChange={(e) => setModelColor(e.target.value)}
												style={{
													width: 50,
													height: 32,
													border: '1px solid #d6d6d6',
													borderRadius: 4,
													cursor: 'pointer',
												}}
											/>
											<span
												style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)' }}
											>
												{modelColor}
											</span>
										</label>
									</div>
								)}

								{/* 3D Preview Canvas for STL */}
								{uploadMode === 'stl' && file && (
									<div
										style={{
											background: '#f0f0f0',
											height: 520,
											borderRadius: 4,
											position: 'relative',
											overflow: 'hidden',
											border: '1px solid #d6d6d6',
										}}
										ref={canvasRef}
									>
										{/* Canvas will be inserted here by Three.js */}
									</div>
								)}

								{/* Image Preview for Image Upload */}
								{uploadMode === 'image' && imageFile && (
									<div
										style={{
											background: '#f0f0f0',
											borderRadius: 4,
											overflow: 'hidden',
											border: '1px solid #d6d6d6',
										}}
									>
										<img
											src={URL.createObjectURL(imageFile)}
											alt='Upload preview'
											style={{
												width: '100%',
												height: 'auto',
												maxHeight: 520,
												objectFit: 'contain',
											}}
										/>
									</div>
								)}

								<div
									style={{
										marginTop: 16,
										padding: 16,
										background: '#fff',
										borderRadius: 2,
										fontSize: 12,
										color: 'rgba(0,0,0,0.5)',
									}}
								>
									{uploadMode === 'stl' ? (
										<>
											<strong style={{ color: '#000' }}>💡 Tip:</strong> Drag
											to rotate, scroll to zoom the 3D preview. Change the
											color to see different options!
										</>
									) : (
										<>
											<strong style={{ color: '#000' }}>
												📸 Next Steps:
											</strong>{' '}
											We'll review your image and send you a quote for
											creating a custom 3D model. For best results, you can
											also send us photos from multiple angles.
										</>
									)}
								</div>
							</div>

							{/* Right: Price & Details */}
							<div>
								{/* STL: Volume & Price */}
								{uploadMode === 'stl' && file && (
									<>
										{/* Volume */}
										<div
											style={{
												background: '#fff',
												padding: 32,
												borderRadius: 4,
												marginBottom: 24,
												border: '1px solid #ebebeb',
											}}
										>
											<label
												style={{
													display: 'block',
													fontSize: 12,
													fontWeight: 600,
													color: 'rgba(0,0,0,0.4)',
													letterSpacing: '.08em',
													textTransform: 'uppercase',
													marginBottom: 12,
												}}
											>
												Model Volume
											</label>
											<div
												style={{
													fontSize: 32,
													fontWeight: 300,
													color: '#000',
													marginBottom: 8,
												}}
											>
												{volumeCm3}{' '}
												<span
													style={{
														fontSize: 18,
														color: 'rgba(0,0,0,0.4)',
													}}
												>
													cm³
												</span>
											</div>
											<div style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)' }}>
												Auto-calculated from your model
											</div>
										</div>

										{/* Price */}
										<div
											style={{
												background: '#000',
												padding: 40,
												borderRadius: 4,
												marginBottom: 24,
												color: '#fff',
											}}
										>
											<div
												style={{
													fontSize: 12,
													fontWeight: 600,
													letterSpacing: '.12em',
													textTransform: 'uppercase',
													opacity: 0.5,
													marginBottom: 16,
												}}
											>
												Estimated Price
											</div>
											<div
												style={{
													fontSize: 52,
													fontWeight: 200,
													letterSpacing: '-0.04em',
													marginBottom: 8,
													lineHeight: 1,
												}}
											>
												<span
													style={{ fontSize: 28, verticalAlign: 'super' }}
												>
													₹
												</span>
												{price.toLocaleString('en-IN')}
											</div>
											<div
												style={{
													fontSize: 13,
													opacity: 0.5,
													marginBottom: 32,
												}}
											>
												Includes materials, printing, and finishing
											</div>
											<button
												onClick={handleAddToCart}
												style={{
													width: '100%',
													padding: '16px 20px',
													background: '#fff',
													color: '#000',
													border: 'none',
													borderRadius: 2,
													fontSize: 15,
													fontWeight: 600,
													cursor: 'pointer',
													transition: 'background .2s',
												}}
												onMouseEnter={(e) =>
													(e.currentTarget.style.background = '#f0f0f0')
												}
												onMouseLeave={(e) =>
													(e.currentTarget.style.background = '#fff')
												}
											>
												Add to Cart — ₹{price.toLocaleString('en-IN')}
											</button>
										</div>
									</>
								)}

								{/* Image Upload: Request Quote */}
								{uploadMode === 'image' && imageFile && (
									<div
										style={{
											background: '#000',
											padding: 40,
											borderRadius: 4,
											marginBottom: 24,
											color: '#fff',
										}}
									>
										<div
											style={{
												fontSize: 12,
												fontWeight: 600,
												letterSpacing: '.12em',
												textTransform: 'uppercase',
												opacity: 0.5,
												marginBottom: 16,
											}}
										>
											Custom 3D Model Request
										</div>
										<div
											style={{
												fontSize: 32,
												fontWeight: 300,
												letterSpacing: '-0.02em',
												marginBottom: 16,
												lineHeight: 1.2,
											}}
										>
											Get a Custom Quote
										</div>
										<div
											style={{ fontSize: 13, opacity: 0.7, marginBottom: 32 }}
										>
											Our team will review your image and provide a detailed
											quote for creating a high-quality 3D model with accurate
											colors and details.
										</div>
										<button
											onClick={() => {
												alert(
													'✅ Request Submitted!\n\nOur team will review your image and contact you within 24 hours with a quote.\n\nFor faster processing, consider sending photos from multiple angles to our email.',
												);
												// Here you would typically send the image to your backend
											}}
											style={{
												width: '100%',
												padding: '16px 20px',
												background: '#fff',
												color: '#000',
												border: 'none',
												borderRadius: 2,
												fontSize: 15,
												fontWeight: 600,
												cursor: 'pointer',
												transition: 'background .2s',
											}}
											onMouseEnter={(e) =>
												(e.currentTarget.style.background = '#f0f0f0')
											}
											onMouseLeave={(e) =>
												(e.currentTarget.style.background = '#fff')
											}
										>
											Request Quote
										</button>
										<div
											style={{
												marginTop: 20,
												padding: 16,
												background: 'rgba(255,255,255,0.1)',
												borderRadius: 4,
												fontSize: 12,
												opacity: 0.8,
											}}
										>
											💡 <strong>Pro Tip:</strong> Send us photos from all
											sides for the most accurate 3D model!
										</div>
									</div>
								)}

								{/* Info */}
								<div
									style={{
										background: '#fff',
										padding: 24,
										borderRadius: 4,
										fontSize: 13,
										lineHeight: 1.7,
										color: 'rgba(0,0,0,0.6)',
										border: '1px solid #ebebeb',
									}}
								>
									<div
										style={{ fontWeight: 600, color: '#000', marginBottom: 12 }}
									>
										What's Included:
									</div>
									<ul style={{ margin: 0, paddingLeft: 20 }}>
										<li>High-precision 3D printing</li>
										<li>Premium PETG material</li>
										<li>Hand-finished surface</li>
										<li>Quality inspection</li>
										<li>Secure packaging</li>
										<li>5-7 days delivery</li>
									</ul>
								</div>
							</div>
						</div>
					)}
				</div>
			</section>
		</div>
	);
};
