import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import GUI from 'lil-gui';

/**
 * Base
 */
// Debug
const gui = new GUI();
gui.hide();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Responsive 
// hide mobile tooltips on desktop
if (window.innerWidth > 768) {
    document.querySelectorAll('.tooltip').forEach(tooltip => {tooltip.style.display = 'block';});
    document.querySelectorAll('.mobile-tooltip').forEach(tooltip => {tooltip.style.display = 'none';});
}
else {
    document.querySelectorAll('.tooltip').forEach(tooltip => {tooltip.style.display = 'none';});
    document.querySelectorAll('.mobile-tooltip').forEach(tooltip => {tooltip.style.display = 'block';});
}


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
// matcaps: 3, 4, 5, 7, 8
const metalTexture = textureLoader.load('textures/matcaps/3.png');
const flameTexture = textureLoader.load('textures/matcaps/flame.png');
const copperTexture = textureLoader.load('textures/matcaps/copper.png');
const neonTexture = textureLoader.load('textures/matcaps/neon.png');
const purplePearlTexture = textureLoader.load('textures/matcaps/8.png');
const xrayTexture = textureLoader.load('textures/matcaps/xray.png');
metalTexture.colorSpace = THREE.SRGBColorSpace;
flameTexture.colorSpace = THREE.SRGBColorSpace;
copperTexture.colorSpace = THREE.SRGBColorSpace;
neonTexture.colorSpace = THREE.SRGBColorSpace;
purplePearlTexture.colorSpace = THREE.SRGBColorSpace;
xrayTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Fonts
 */
const fontLoader = new FontLoader();

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        // Material
        const material = new THREE.MeshMatcapMaterial({ matcap: xrayTexture });

        // Text
        const textGeometry = new TextGeometry(
            'straight cash, homie',
            {
                font: font,
                size: 0.5,
                depth: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        );
        textGeometry.center();

        const text = new THREE.Mesh(textGeometry, material);
        text.name = 'text';
        scene.add(text);

        // Shapes
        let capsuleGeometry, donutGeometry;
        const geometries = [
            capsuleGeometry = new THREE.CapsuleGeometry(0.3, 0.5, 64, 32),
            donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64),
        ];

        for(let i = 0; i < 100; i++)
        {
            const shape = new THREE.Mesh(geometries[Math.floor(Math.random() * geometries.length)], material);
            let posX, posY, posZ;
            do {
                posX = (Math.random() - 0.5) * 15;
            } while (posX > 0 && posX < 1);
            do {
                posY = (Math.random() - 0.5) * 15;
            } while (posY > 0 && posY < 1);
            do {
                posZ = (Math.random() - 0.5) * 12;
            } while (posZ > 0 && posZ < 1);
            
            shape.position.set(posX, posY, posZ);
            shape.rotation.x = Math.random() * Math.PI;
            shape.rotation.y = Math.random() * Math.PI;
            const scale = Math.random();
            shape.scale.set(scale, scale, scale);

            scene.add(shape);
        }
    }
);

/**
 * Theme Selector
 */
const themes = document.querySelectorAll('.theme');
let currentTexture = xrayTexture;
themes.forEach(theme => {
    theme.addEventListener('click', (event) => {
        const theme = event.target.id;
        let texture;
        switch (theme) {
            case 'xray':
                texture = xrayTexture;
                currentTexture = xrayTexture;
                break;
            case 'flame':
                texture = flameTexture;
                currentTexture = flameTexture;
                break;
            case 'copper':
                texture = copperTexture;
                currentTexture = copperTexture;
                break;
            case 'neon':
                texture = neonTexture;
                currentTexture = neonTexture;
                break;
            case 'purple-pearl':
                texture = purplePearlTexture;   
                currentTexture = purplePearlTexture;
                break;
            default:
                texture = xrayTexture;
                currentTexture = xrayTexture;
        }
        const textGeometries = scene.children.filter(child => child.type === "Mesh");
        for (let i = 0; i < textGeometries.length; i++) {
            textGeometries[i].material = new THREE.MeshMatcapMaterial({ matcap: texture });
        }
    });
});

const textInput = document.querySelector('textarea');
const submitButton = document.querySelector('#submit');
textInput.style.display = 'none';

const updateText = (event) => {
    // remove the old text
    const textGeometry = scene.children.find(child => child.type === "Mesh" && child.name === 'text');
    scene.remove(textGeometry);

    // add the new text
    fontLoader.load(
        '/fonts/helvetiker_regular.typeface.json',
        (font) =>
        {
            // Material
            const material = new THREE.MeshMatcapMaterial({ matcap: currentTexture });

            // Text
            const textGeometry = new TextGeometry(
                event.target.value,
                {
                    font: font,
                    size: 0.5,
                    depth: 0.2,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 0.03,
                    bevelSize: 0.02,
                    bevelOffset: 0,
                    bevelSegments: 5
                }
            );
            textGeometry.center();

            const text = new THREE.Mesh(textGeometry, material);
            text.name = 'text';
            scene.add(text);
        }
    );
};

const toggleTextInput = () => {
    if (textInput.style.display === 'none') {
        textInput.style.display = 'block';
        submitButton.style.display = 'block';
        textInput.value = '';
        textInput.focus();
    } else {
        textInput.style.display = 'none';
        submitButton.style.display = 'none';
    }
};

const keyPressHandler = (event) => {
    if (event.key === 't' && textInput.style.display === 'none') {
        event.preventDefault();
        toggleTextInput();
    }
    else if (event.key === 'Enter' && textInput.style.display !== 'none') {
        toggleTextInput();
        updateText(event);
    }
};

let lastClick = 0;
window.addEventListener('touchstart', function(event) {
    event.preventDefault(); // to disable browser default zoom on double tap
    let date = new Date();
    let time = date.getTime();
    const timeBetweenTaps = 500; // 200ms
    if (lastClick > 0 && time - lastClick < timeBetweenTaps) {
        toggleTextInput();
    }
    lastClick = time;
});
window.addEventListener('keydown', keyPressHandler, false);
window.addEventListener('dblclick', toggleTextInput);
const submit = () => {
    toggleTextInput();
    updateText({target: {value: textInput.value}});
}
submitButton.addEventListener('click', submit);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 5;
if (window.innerWidth < 768) {
    camera.position.z = 7.5;
}
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();