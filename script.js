import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Loading progress management
let loadingProgress = 0;
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const loader = document.getElementById('loader');

function updateProgress(progress) {
    loadingProgress = progress;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `Loading... ${Math.round(progress)}%`;
}

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.appendChild(renderer.domElement);

// Luxury jewelry lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// Key light for diamond sparkle
const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
keyLight.position.set(5, 10, 5);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;
keyLight.shadow.camera.near = 0.1;
keyLight.shadow.camera.far = 50;
keyLight.shadow.camera.left = -10;
keyLight.shadow.camera.right = 10;
keyLight.shadow.camera.top = 10;
keyLight.shadow.camera.bottom = -10;
scene.add(keyLight);

// Fill light
const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
fillLight.position.set(-5, 5, -5);
scene.add(fillLight);

// Rim light for dramatic effect
const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
rimLight.position.set(0, -5, -10);
scene.add(rimLight);

// Point lights for sparkle
const sparkleLight1 = new THREE.PointLight(0xffffff, 0.5, 20);
sparkleLight1.position.set(3, 3, 3);
scene.add(sparkleLight1);

const sparkleLight2 = new THREE.PointLight(0xffffff, 0.5, 20);
sparkleLight2.position.set(-3, 3, -3);
scene.add(sparkleLight2);

// Create ring and diamond
let ring, diamond, jewelryGroup;
const gltfLoader = new GLTFLoader();
const objLoader = new OBJLoader();

// Create realistic jewelry
function createRealisticJewelry() {
    jewelryGroup = new THREE.Group();
    
    // Create flattened ring band (more realistic shape)
    const ringBandGeometry = createFlattenedRingGeometry();
    const goldMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffdb58, // More realistic gold color
        metalness: 1.0,
        roughness: 0.12,
        reflectivity: 0.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        envMapIntensity: 1.5,
    });
    const ringBand = new THREE.Mesh(ringBandGeometry, goldMaterial);
    ringBand.castShadow = true;
    ringBand.receiveShadow = true;
    
    // Remove decorative details that were causing duplicate ring appearance
    
    // Create diamond setting positioned on one side of the ring
    const settingGroup = new THREE.Group();
    
    // Position the setting on the "top" of the ring (Y+ side)
    settingGroup.position.set(0, 1.0, 0);
    
    // Create ring head (wider part that holds the diamond) with more realistic shape
    const ringHeadGeometry = new THREE.CylinderGeometry(0.22, 0.16, 0.1, 16);
    const ringHead = new THREE.Mesh(ringHeadGeometry, goldMaterial);
    ringHead.position.y = 0.05;
    ringHead.castShadow = true;
    ringHead.receiveShadow = true;
    settingGroup.add(ringHead);
    
    // Add gallery (decorative openwork under the diamond)
    const galleryGeometry = new THREE.TorusGeometry(0.18, 0.015, 6, 16);
    const gallery = new THREE.Mesh(galleryGeometry, goldMaterial);
    gallery.position.y = 0.15;
    gallery.castShadow = true;
    settingGroup.add(gallery);
    
    // Create prongs to hold the diamond (adjusted for larger diamond)
    const prongGeometry = new THREE.CylinderGeometry(0.02, 0.015, 0.35, 8);
    const prongs = [];
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6;
        const prong = new THREE.Mesh(prongGeometry, goldMaterial);
        prong.position.x = Math.cos(angle) * 0.18; // Increased from 0.15 to accommodate larger diamond
        prong.position.z = Math.sin(angle) * 0.18;
        prong.position.y = 0.28; // Raised slightly
        prong.castShadow = true;
        prongs.push(prong);
        settingGroup.add(prong);
    }
    
    // Create realistic diamond with brilliant cut
    const diamondGeometry = createDiamondGeometry();
    const diamondMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.0,
        roughness: 0.0,
        transmission: 0.7, // Less transparent so it's visible
        thickness: 0.1,
        ior: 2.417, // Real diamond IOR
        reflectivity: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
        opacity: 0.8, // More opaque
        transparent: true,
    });
    diamond = new THREE.Mesh(diamondGeometry, diamondMaterial);
    diamond.position.y = 0.4; // Raised to accommodate larger size
    diamond.castShadow = true;
    settingGroup.add(diamond);
    
    // Add all parts to the group
    jewelryGroup.add(ringBand);
    jewelryGroup.add(settingGroup);
    
    // Store references
    ring = jewelryGroup;
    
    // Start with large scale for zoom-out effect
    jewelryGroup.scale.set(8, 8, 8);
    jewelryGroup.position.set(0, 0, 0);
    
    // Set initial oblique angle for better perspective
    jewelryGroup.rotation.x = Math.PI * 0.15; // 27 degrees tilt
    jewelryGroup.rotation.z = Math.PI * 0.1;  // 18 degrees roll
    
    scene.add(jewelryGroup);
    return jewelryGroup;
}

// Create flattened ring geometry (more realistic than torus)
function createFlattenedRingGeometry() {
    const outerRadius = 1.0;
    const innerRadius = 0.84;
    const height = 0.12; // Flatter than before
    const segments = 48;
    
    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 0, Math.PI * 2, segments);
    
    // Convert to 3D by extruding
    const shape = new THREE.Shape();
    shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    
    const extrudeSettings = {
        depth: height,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 8
    };
    
    const extrudedGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    
    // Center the geometry
    extrudedGeometry.rotateX(Math.PI / 2);
    extrudedGeometry.translate(0, -height/2, 0);
    
    return extrudedGeometry;
}

// Create a realistic diamond geometry (brilliant cut)
function createDiamondGeometry() {
    const group = new THREE.Group();
    
    // Create crown (top part) - inverted cone with flat table
    const crownGeometry = new THREE.ConeGeometry(0.15, 0.08, 8, 1);
    const crownMesh = new THREE.Mesh(crownGeometry);
    crownMesh.position.y = 0.04;
    crownMesh.rotation.x = Math.PI; // Flip upside down
    
    // Create table (flat top surface)
    const tableGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.005, 8);
    const tableMesh = new THREE.Mesh(tableGeometry);
    tableMesh.position.y = 0.08;
    
    // Create pavilion (bottom part) - pointed cone
    const pavilionGeometry = new THREE.ConeGeometry(0.15, 0.15, 8, 1);
    const pavilionMesh = new THREE.Mesh(pavilionGeometry);
    pavilionMesh.position.y = -0.075;
    
    // Create girdle (middle band)
    const girdleGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.01, 8);
    const girdleMesh = new THREE.Mesh(girdleGeometry);
    girdleMesh.position.y = 0;
    
    // Merge all parts into single geometry
    const crownBufferGeometry = new THREE.BufferGeometry().fromGeometry ? 
        new THREE.BufferGeometry().fromGeometry(crownGeometry) : crownGeometry;
    const tableBufferGeometry = new THREE.BufferGeometry().fromGeometry ? 
        new THREE.BufferGeometry().fromGeometry(tableGeometry) : tableGeometry;
    const pavilionBufferGeometry = new THREE.BufferGeometry().fromGeometry ? 
        new THREE.BufferGeometry().fromGeometry(pavilionGeometry) : pavilionGeometry;
    const girdleBufferGeometry = new THREE.BufferGeometry().fromGeometry ? 
        new THREE.BufferGeometry().fromGeometry(girdleGeometry) : girdleGeometry;
    
    // Apply transformations to geometries
    crownBufferGeometry.rotateX(Math.PI);
    crownBufferGeometry.translate(0, 0.04, 0);
    tableBufferGeometry.translate(0, 0.08, 0);
    pavilionBufferGeometry.translate(0, -0.075, 0);
    
    // Use a more complex diamond shape - dodecahedron for better faceting
    const diamondGeometry = new THREE.DodecahedronGeometry(0.2, 0); // Increased from 0.12 to 0.2
    diamondGeometry.scale(1, 0.8, 1); // Flatten slightly
    
    return diamondGeometry;
}

// Load GLB model or create fallback
loadJewelryModel();

function loadJewelryModel() {
    // Try to load OBJ model first
    objLoader.load(
        'ring.obj', // OBJ file path
        function (object) {
            // Success - use OBJ model
            console.log('OBJ ring loaded successfully');
            setupOBJJewelry(object);
            finishLoading();
        },
        function (progress) {
            // Loading progress
            const percent = (progress.loaded / progress.total) * 100;
            updateProgress(percent);
            console.log('Loading progress:', percent + '%');
        },
        function (error) {
            // Error - fallback to procedural model
            console.log('OBJ loading failed, using fallback model:', error);
            createRealisticJewelry();
            simulateLoadingProgress();
        }
    );
}

function setupOBJJewelry(object) {
    jewelryGroup = new THREE.Group();
    
    // Create materials for the OBJ model
    const goldMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffdb58,
        metalness: 1.0,
        roughness: 0.12,
        reflectivity: 0.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        envMapIntensity: 1.5,
    });
    
    const diamondMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.0,
        roughness: 0.0,
        transmission: 0.7,
        thickness: 0.1,
        ior: 2.417,
        reflectivity: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
        opacity: 0.8,
        transparent: true,
    });
    
    // Apply materials and shadows to all meshes
    object.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Assign materials based on mesh name or create a smart detection
            const meshName = child.name.toLowerCase();
            
            if (meshName.includes('diamond') || meshName.includes('gem') || meshName.includes('stone')) {
                child.material = diamondMaterial;
                diamond = child; // Store diamond reference
            } else {
                // Default to gold material for ring parts
                child.material = goldMaterial;
            }
        }
    });
    
    // Position and scale the model
    object.scale.set(0.5, 0.5, 0.5); // Reduced from 1 to 0.5 (50% smaller)
    object.position.set(0, 0, 0);
    
    jewelryGroup.add(object);
    
    // Set initial properties for animation
    jewelryGroup.scale.set(8, 8, 8); // Start large for zoom-out effect
    jewelryGroup.rotation.x = Math.PI * 0.15; // Oblique angle
    jewelryGroup.rotation.z = Math.PI * 0.1;  // Roll angle
    
    // Store reference for animations
    ring = jewelryGroup;
    
    scene.add(jewelryGroup);
}

// Fallback loading simulation
function simulateLoadingProgress() {
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            finishLoading();
        }
        updateProgress(progress);
    }, 200);
}

function finishLoading() {
    updateProgress(100);
    setTimeout(() => {
        // Hide loader and show scene
        loader.classList.add('hidden');
        renderer.domElement.classList.add('visible');
        document.getElementById('controls').classList.add('visible');
        startJewelryAnimation();
        setupControls();
    }, 500);
}

function setupControls() {
    const cinematicBtn = document.getElementById('cinematicBtn');
    const interactiveBtn = document.getElementById('interactiveBtn');
    
    cinematicBtn.addEventListener('click', () => {
        cinematicMode = true;
        cinematicTime = 0;
        controls.enabled = false;
        cinematicBtn.classList.add('active');
        interactiveBtn.classList.remove('active');
    });
    
    interactiveBtn.addEventListener('click', () => {
        cinematicMode = false;
        controls.enabled = true;
        // Reset to elegant angle
        jewelryGroup.rotation.x = Math.PI * 0.15;
        jewelryGroup.rotation.z = Math.PI * 0.1;
        cinematicBtn.classList.remove('active');
        interactiveBtn.classList.add('active');
    });
}

// Camera position
camera.position.set(0, 2, 6);
camera.lookAt(0, 0, 0);

// Add OrbitControls for mouse interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.minDistance = 2;
controls.maxDistance = 15;
controls.enablePan = false; // Disable panning to keep focus on ring

// Animation variables
let animationStarted = false;
let time = 0;
let cinematicMode = false;
let cinematicTime = 0;

// Cinematic animation sequences
const cinematicSequences = [
    { name: "intro", duration: 4, start: 0 },
    { name: "closeup", duration: 3, start: 4 },
    { name: "rotation", duration: 4, start: 7 },
    { name: "sparkle", duration: 3, start: 11 },
    { name: "finale", duration: 2, start: 14 }
];

function startJewelryAnimation() {
    animationStarted = true;
    // Start cinematic mode after initial zoom
    setTimeout(() => {
        cinematicMode = true;
        cinematicTime = 0;
        controls.enabled = false; // Disable user controls during cinematic
    }, 3500);
}

function getCurrentSequence(time) {
    for (let i = cinematicSequences.length - 1; i >= 0; i--) {
        if (time >= cinematicSequences[i].start) {
            return {
                ...cinematicSequences[i],
                progress: (time - cinematicSequences[i].start) / cinematicSequences[i].duration
            };
        }
    }
    return cinematicSequences[0];
}

// Easing functions
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeInOutQuart(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    time += 0.016; // 60fps

    if (animationStarted && jewelryGroup) {
        // Initial zoom out effect (scale down from 8 to 1)
        const zoomProgress = Math.min(time / 3, 1); // 3 seconds duration
        const scale = 8 - (7 * easeOutCubic(zoomProgress));
        jewelryGroup.scale.set(scale, scale, scale);

        // Cinematic mode
        if (cinematicMode) {
            cinematicTime += 0.016;
            const sequence = getCurrentSequence(cinematicTime);
            
            animateCinematicSequence(sequence);
        } else {
            // Keep the oblique angle fixed after zoom-out is complete
            if (zoomProgress >= 1) {
                jewelryGroup.rotation.x = Math.PI * 0.15; // Fixed oblique angle
                jewelryGroup.rotation.z = Math.PI * 0.1;  // Fixed roll angle
            }
        }

        // Sparkle lights animation (always active)
        sparkleLight1.intensity = 0.5 + Math.sin(time * 3) * 0.3;
        sparkleLight2.intensity = 0.5 + Math.cos(time * 2.5) * 0.3;
        
        // Move sparkle lights around the ring
        sparkleLight1.position.x = 3 + Math.sin(time) * 0.5;
        sparkleLight1.position.y = 3 + Math.cos(time * 1.2) * 0.5;
        
        sparkleLight2.position.x = -3 + Math.cos(time * 0.8) * 0.5;
        sparkleLight2.position.z = -3 + Math.sin(time * 0.9) * 0.5;
    }

    // Update controls (disabled during cinematic mode)
    controls.update();

    renderer.render(scene, camera);
}

function animateCinematicSequence(sequence) {
    const progress = Math.min(sequence.progress, 1);
    
    switch(sequence.name) {
        case "intro":
            animateIntroSequence(progress);
            break;
        case "closeup":
            animateCloseupSequence(progress);
            break;
        case "rotation":
            animateRotationSequence(progress);
            break;
        case "sparkle":
            animateSparkleSequence(progress);
            break;
        case "finale":
            animateFinaleSequence(progress);
            break;
    }
    
    // Loop the animation
    if (cinematicTime > 16) {
        cinematicTime = 0;
    }
}

function animateIntroSequence(progress) {
    const t = easeInOutCubic(progress);
    
    // Camera moves from high angle to elegant view
    camera.position.x = 0;
    camera.position.y = 8 - (6 * t); // From 8 to 2
    camera.position.z = 10 - (4 * t); // From 10 to 6
    
    // Ring tilts elegantly
    jewelryGroup.rotation.x = Math.PI * 0.15;
    jewelryGroup.rotation.y = Math.sin(progress * Math.PI * 2) * 0.1;
    jewelryGroup.rotation.z = Math.PI * 0.1;
    
    camera.lookAt(0, 0, 0);
}

function animateCloseupSequence(progress) {
    const t = easeInOutQuart(progress);
    
    // Close-up on diamond
    camera.position.x = Math.sin(progress * Math.PI) * 2;
    camera.position.y = 2 + Math.sin(progress * Math.PI) * 1;
    camera.position.z = 3 - (t * 1); // Zoom closer
    
    // Focus on diamond setting
    camera.lookAt(0, 1, 0);
    
    // Ring gentle rotation
    jewelryGroup.rotation.y = progress * Math.PI * 0.5;
}

function animateRotationSequence(progress) {
    // Full rotation showcase
    camera.position.x = Math.cos(progress * Math.PI * 2) * 4;
    camera.position.y = 2 + Math.sin(progress * Math.PI * 4) * 0.5;
    camera.position.z = Math.sin(progress * Math.PI * 2) * 4 + 2;
    
    // Ring rotates to show all angles
    jewelryGroup.rotation.y = progress * Math.PI * 2;
    jewelryGroup.rotation.x = Math.PI * 0.15 + Math.sin(progress * Math.PI * 2) * 0.1;
    
    camera.lookAt(0, 0, 0);
}

function animateSparkleSequence(progress) {
    const t = easeInOutCubic(progress);
    
    // Static elegant angle
    camera.position.x = 3;
    camera.position.y = 3;
    camera.position.z = 3;
    camera.lookAt(0, 0, 0);
    
    // Ring slow elegant rotation
    jewelryGroup.rotation.y = progress * Math.PI;
    
    // Intense sparkle lights
    keyLight.intensity = 1.5 + Math.sin(progress * Math.PI * 8) * 0.8;
    sparkleLight1.intensity = 1 + Math.sin(progress * Math.PI * 12) * 0.5;
    sparkleLight2.intensity = 1 + Math.cos(progress * Math.PI * 10) * 0.5;
}

function animateFinaleSequence(progress) {
    const t = easeInOutQuart(progress);
    
    // Dramatic zoom out
    camera.position.x = 0;
    camera.position.y = 2 + (t * 3);
    camera.position.z = 6 + (t * 4);
    
    // Final elegant pose
    jewelryGroup.rotation.x = Math.PI * 0.15;
    jewelryGroup.rotation.y = Math.PI * 0.25;
    jewelryGroup.rotation.z = Math.PI * 0.1;
    
    camera.lookAt(0, 0, 0);
    
    // Lights dim elegantly
    keyLight.intensity = 1.5 - (t * 0.3);
}

// Easing function for smooth zoom out
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();