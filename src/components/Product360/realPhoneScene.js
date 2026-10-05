import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const FINISHES = {
  natural: { back: '#b6aba2', frame: '#81766e' },
  blue: { back: '#596b80', frame: '#44546a' },
  black: { back: '#444344', frame: '#292929' },
  white: { back: '#dbdbd8', frame: '#a9aaa8' },
};
const WALLPAPERS = {
  natural: '/assets/iphone-15-pro-wallpaper.webp',
  blue: '/assets/iphone-15-pro-wallpaper-blue.webp',
  black: '/assets/iphone-15-pro-wallpaper-black.webp',
  white: '/assets/iphone-15-pro-wallpaper-white.webp',
};

function roundedShape(width, height, radius) {
  const x = -width / 2, y = -height / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

export async function createPhoneScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.55;

  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(31, 1, .1, 100);
    camera.position.set(0, 0, 12.6);
    scene.add(new THREE.AmbientLight(0xffffff, 2.6));
    const key = new THREE.DirectionalLight(0xffffff, 4.2);
    key.position.set(-4, 5, 7);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xb4d8ff, 2.7);
    fill.position.set(5, -1, -6);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0x408de2, 1.6);
    rim.position.set(-5, 1, -5);
    scene.add(rim);

    const textureLoader = new THREE.TextureLoader();
    const [gltf, wallpaperList] = await Promise.all([
      new GLTFLoader().loadAsync('/assets/iphone-15-pro-max.glb'),
      Promise.all(Object.values(WALLPAPERS).map(path => textureLoader.loadAsync(path))),
    ]);
    const wallpapers = Object.fromEntries(Object.keys(WALLPAPERS).map((name, index) => [name, wallpaperList[index]]));
    Object.values(wallpapers).forEach(texture => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.flipY = false;
    });
    const screenMaterial = new THREE.MeshBasicMaterial({ map: wallpapers.natural, transparent: true, opacity: 1, toneMapped: false });
    const model = gltf.scene;
    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = 5.8 / Math.max(size.x, size.y, size.z);
    model.scale.setScalar(scale);
    model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    const pivot = new THREE.Group();
    pivot.add(model);
    scene.add(pivot);

    // The licensed model has an untextured front glass. Add its original
    // iPhone 15 Pro wallpaper as a fitted display surface.
    const displayWidth = 2.55, displayHeight = 5.48;
    const displayGeometry = new THREE.ShapeGeometry(roundedShape(displayWidth, displayHeight, .28), 16);
    const displayUV = displayGeometry.attributes.uv;
    const displayPosition = displayGeometry.attributes.position;
    for (let i = 0; i < displayUV.count; i += 1) {
      displayUV.setXY(i, displayPosition.getX(i) / displayWidth + .5, displayPosition.getY(i) / displayHeight + .5);
    }
    const display = new THREE.Mesh(displayGeometry, screenMaterial);
    display.position.z = .22;
    pivot.add(display);
    const island = new THREE.Mesh(new THREE.ShapeGeometry(roundedShape(.72, .16, .08), 12), new THREE.MeshBasicMaterial({ color: '#090d12' }));
    island.position.set(0, 2.48, .225);
    pivot.add(island);

    const finishMaterials = { back: new Set(), frame: new Set() };
    model.traverse(object => {
      if (!object.isMesh) return;
      object.castShadow = false;
      const material = object.material;
      if (material?.name === 'backpanel') finishMaterials.back.add(material);
      if (material?.name === 'metalframe') finishMaterials.frame.add(material);
    });

    let angle = -.34;
    let velocity = 0;
    let dragging = false;
    let visible = false;
    let reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lastInteraction = -Infinity;
    let lastFrame = 0;
    let frame = 0;
    let autoSpeed = 0;
    let targetFinish = FINISHES.natural;
    let screenOpacity = 1;
    const colorTarget = new THREE.Color();

    function resize() {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / rect.height;
      camera.position.z = rect.width < 460 ? 13.5 : 12.6;
      camera.updateProjectionMatrix();
      if (!visible) renderer.render(scene, camera);
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    function tick(now) {
      if (!visible) return;
      const dt = Math.min((now - (lastFrame || now)) / 1000, .05);
      lastFrame = now;
      if (!dragging) {
        angle += velocity * dt;
        velocity *= Math.pow(.10, dt);
        if (Math.abs(velocity) < .004) velocity = 0;
        const shouldAuto = !reduced && now - lastInteraction > 5000;
        autoSpeed += ((shouldAuto ? .29 : 0) - autoSpeed) * Math.min(1, dt * 1.7);
        angle += autoSpeed * dt;
        pivot.position.y = reduced ? 0 : Math.sin(now / 1100) * .035;
      }
      pivot.rotation.y = angle;
      for (const material of finishMaterials.back) {
        colorTarget.set(targetFinish.back);
        material.color.lerp(colorTarget, Math.min(1, dt * 9));
      }
      for (const material of finishMaterials.frame) {
        colorTarget.set(targetFinish.frame);
        material.color.lerp(colorTarget, Math.min(1, dt * 9));
      }
      screenOpacity += (1 - screenOpacity) * Math.min(1, dt * 14);
      screenMaterial.opacity = screenOpacity;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    }
    function setVisible(next) {
      if (visible === next) return;
      visible = next;
      if (next) { lastFrame = 0; frame = requestAnimationFrame(tick); }
      else cancelAnimationFrame(frame);
    }
    return {
      setVisible,
      setReduced(value) { reduced = value; if (value) autoSpeed = 0; },
      setColor(name) {
        const selected = FINISHES[name] ? name : 'natural';
        targetFinish = FINISHES[selected];
        screenMaterial.map = wallpapers[selected];
        screenMaterial.needsUpdate = true;
        screenOpacity = .72;
      },
      startDrag(now) { dragging = true; velocity = 0; autoSpeed = 0; lastInteraction = now; pivot.position.y = 0; },
      drag(dx, dt, now) { angle += dx * .011; velocity = dx / Math.max(dt, 12) * 11; lastInteraction = now; },
      endDrag(now) { dragging = false; lastInteraction = now; velocity = THREE.MathUtils.clamp(velocity, -4, 4); },
      step(direction, now) { angle += direction * Math.PI / 12; velocity = 0; autoSpeed = 0; lastInteraction = now; },
      dispose() {
        visible = false;
        cancelAnimationFrame(frame);
        resizeObserver.disconnect();
        scene.traverse(object => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach(material => { material.map?.dispose(); material.dispose(); });
          }
        });
        Object.values(wallpapers).forEach(texture => texture.dispose());
        renderer.dispose();
      },
    };
  } catch (error) {
    renderer.dispose();
    throw error;
  }
}
