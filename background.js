let scene, camera, renderer, particles, stars, nebula;
let mouseX = 0;
let mouseY = 0;

function init() {
    // Create scene
    scene = new THREE.Scene();
    
    // Setup camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    // Setup renderer
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('bg'),
        alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create main particle system
    createParticles();
    
    // Create stars
    createStars();
    
    // Create nebula
    createNebula();
    
    // Create floating objects
    createFloatingObjects();

    // Add mouse movement effect
    document.addEventListener('mousemove', onMouseMove);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

function createParticles() {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.1,
        color: '#8A2BE2',
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
}

function createStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 2000;
    const starsArray = new Float32Array(starsCount * 3);
    const starsSizes = new Float32Array(starsCount);

    for(let i = 0; i < starsCount * 3; i += 3) {
        starsArray[i] = (Math.random() - 0.5) * 200;
        starsArray[i + 1] = (Math.random() - 0.5) * 200;
        starsArray[i + 2] = (Math.random() - 0.5) * 200;
        starsSizes[i/3] = Math.random() * 2;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsArray, 3));
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(starsSizes, 1));

    const starsMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 }
        },
        vertexShader: `
            attribute float size;
            varying float vSize;
            void main() {
                vSize = size;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying float vSize;
            void main() {
                float strength = distance(gl_PointCoord, vec2(0.5));
                strength = 1.0 - strength;
                strength = pow(strength, 3.0);
                vec3 color = mix(vec3(0.8, 0.8, 1.0), vec3(1.0, 1.0, 1.0), vSize/2.0);
                gl_FragColor = vec4(color, strength);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending
    });

    stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}

function createNebula() {
    const nebulaGeometry = new THREE.BufferGeometry();
    const nebulaCount = 1000;
    const nebulaArray = new Float32Array(nebulaCount * 3);
    const nebulaSizes = new Float32Array(nebulaCount);
    const nebulaColors = new Float32Array(nebulaCount * 3);

    for(let i = 0; i < nebulaCount * 3; i += 3) {
        nebulaArray[i] = (Math.random() - 0.5) * 150;
        nebulaArray[i + 1] = (Math.random() - 0.5) * 150;
        nebulaArray[i + 2] = (Math.random() - 0.5) * 150;
        nebulaSizes[i/3] = Math.random() * 5;
        
        // Random colors between purple and blue
        nebulaColors[i] = 0.5 + Math.random() * 0.5; // R
        nebulaColors[i + 1] = 0.2 + Math.random() * 0.3; // G
        nebulaColors[i + 2] = 0.8 + Math.random() * 0.2; // B
    }

    nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(nebulaArray, 3));
    nebulaGeometry.setAttribute('size', new THREE.BufferAttribute(nebulaSizes, 1));
    nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));

    const nebulaMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 }
        },
        vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            void main() {
                float strength = distance(gl_PointCoord, vec2(0.5));
                strength = 1.0 - strength;
                strength = pow(strength, 2.0);
                gl_FragColor = vec4(vColor, strength * 0.5);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending
    });

    nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
    scene.add(nebula);
}

function createFloatingObjects() {
    // Create geometric shapes
    for(let i = 0; i < 50; i++) {
        const geometry = new THREE.IcosahedronGeometry(Math.random() * 0.5, 0);
        const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(Math.random(), Math.random(), Math.random()),
            transparent: true,
            opacity: 0.6,
            shininess: 100
        });
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.set(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100
        );
        
        mesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        scene.add(mesh);
    }

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
}

function onMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
    mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotate particle system
    particles.rotation.x += 0.0003;
    particles.rotation.y += 0.0005;
    
    // Rotate stars
    if (stars) {
        stars.rotation.x += 0.0001;
        stars.rotation.y += 0.0002;
    }
    
    // Animate nebula
    if (nebula) {
        nebula.rotation.x += 0.0002;
        nebula.rotation.y += 0.0003;
        nebula.material.uniforms.time.value += 0.01;
    }

    // Camera movement based on mouse position
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

// Initialize and start animation
document.addEventListener('DOMContentLoaded', () => {
    init();
    animate();
});
