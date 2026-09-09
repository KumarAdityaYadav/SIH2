import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Info, RotateCw, ZoomIn, ZoomOut, Layers, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ThreeDModelProps {
  initialMode?: 'normal' | 'pcos';
  interactive?: boolean;
}

export const ThreeDModel: React.FC<ThreeDModelProps> = ({ initialMode = 'pcos', interactive = true }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'normal' | 'pcos'>(initialMode);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>('ovary');
  const [autoRotate, setAutoRotate] = useState(true);
  const [cameraZoomLevel, setCameraZoomLevel] = useState(5.5);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const follicleGroupRef = useRef<THREE.Group | null>(null);
  const uterusMeshRef = useRef<THREE.Mesh | null>(null);
  const ovaryMeshRef = useRef<THREE.Mesh | null>(null);
  const endometriumMeshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 350;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0f172a); // Slate-900 warm deep background

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0.5, cameraZoomLevel);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff0eb, 1.4);
    dirLight.position.set(5, 8, 5);
    scene.add(dirLight);

    const backLight = new THREE.PointLight(0xec4899, 1.2, 20); // Gentle rose backlight
    backLight.position.set(-4, -2, -3);
    scene.add(backLight);

    const bottomLight = new THREE.PointLight(0x06b6d4, 0.8, 20); // Subtle teal highlight
    bottomLight.position.set(0, -4, 2);
    scene.add(bottomLight);

    // Main 3D Anatomical Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // 1. Central Uterus Model (Stylized anatomical representation)
    const uterusGeo = new THREE.CylinderGeometry(0.7, 0.35, 1.5, 32, 16);
    const uterusMat = new THREE.MeshStandardMaterial({
      color: 0xe11d48, // Crimson-Rose
      roughness: 0.35,
      metalness: 0.15,
      wireframe: false,
    });
    const uterusMesh = new THREE.Mesh(uterusGeo, uterusMat);
    uterusMesh.position.set(0, 0, 0);
    uterusMesh.rotation.z = Math.PI; // Inverted pear shape
    modelGroup.add(uterusMesh);
    uterusMeshRef.current = uterusMesh;

    // Endometrium inner lining glow
    const endoGeo = new THREE.CylinderGeometry(0.5, 0.2, 1.2, 24);
    const endoMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      roughness: 0.2,
      emissive: 0x9f1239,
      emissiveIntensity: 0.3,
    });
    const endoMesh = new THREE.Mesh(endoGeo, endoMat);
    endoMesh.position.set(0, 0, 0.05);
    endoMesh.rotation.z = Math.PI;
    modelGroup.add(endoMesh);
    endometriumMeshRef.current = endoMesh;

    // 2. Fallopian Tubes (Left & Right curves)
    const curvePointsLeft = [
      new THREE.Vector3(-0.65, 0.6, 0),
      new THREE.Vector3(-1.3, 0.9, 0.2),
      new THREE.Vector3(-1.8, 0.5, 0),
      new THREE.Vector3(-2.1, 0.1, -0.1),
    ];
    const tubeCurveLeft = new THREE.CatmullRomCurve3(curvePointsLeft);
    const tubeGeoLeft = new THREE.TubeGeometry(tubeCurveLeft, 32, 0.08, 12, false);
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0xfb7185, roughness: 0.4 });
    const tubeMeshLeft = new THREE.Mesh(tubeGeoLeft, tubeMat);
    modelGroup.add(tubeMeshLeft);

    const curvePointsRight = [
      new THREE.Vector3(0.65, 0.6, 0),
      new THREE.Vector3(1.3, 0.9, 0.2),
      new THREE.Vector3(1.8, 0.5, 0),
      new THREE.Vector3(2.1, 0.1, -0.1),
    ];
    const tubeCurveRight = new THREE.CatmullRomCurve3(curvePointsRight);
    const tubeGeoRight = new THREE.TubeGeometry(tubeCurveRight, 32, 0.08, 12, false);
    const tubeMeshRight = new THREE.Mesh(tubeGeoRight, tubeMat);
    modelGroup.add(tubeMeshRight);

    // 3. Right Ovary (Subject of inspection)
    const ovaryGeo = new THREE.SphereGeometry(0.6, 32, 32);
    ovaryGeo.scale(1.25, 0.9, 0.85); // Ovoid morphology
    const ovaryMat = new THREE.MeshStandardMaterial({
      color: 0xfda4af,
      roughness: 0.3,
      metalness: 0.1,
      transparent: true,
      opacity: 0.92,
    });
    const ovaryMesh = new THREE.Mesh(ovaryGeo, ovaryMat);
    ovaryMesh.position.set(2.2, 0, 0);
    modelGroup.add(ovaryMesh);
    ovaryMeshRef.current = ovaryMesh;

    // Left Ovary (Symmetrical counter-balance)
    const leftOvaryMesh = new THREE.Mesh(ovaryGeo, ovaryMat);
    leftOvaryMesh.position.set(-2.2, 0, 0);
    modelGroup.add(leftOvaryMesh);

    // 4. Follicle Group on the Right Ovary
    const follicleGroup = new THREE.Group();
    follicleGroup.position.set(2.2, 0, 0);
    modelGroup.add(follicleGroup);
    follicleGroupRef.current = follicleGroup;

    // Build initial Follicles
    updateFollicles(mode, follicleGroup);

    // Interaction controls (Touch / Drag)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - previousMousePosition.x;
      const deltaY = clientY - previousMousePosition.y;

      modelGroup.rotation.y += deltaX * 0.008;
      modelGroup.rotation.x += deltaY * 0.008;

      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    dom.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    dom.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      if (autoRotate && !isDragging) {
        modelGroup.rotation.y += 0.006;
      }

      // Gentle biological pulsing
      if (follicleGroupRef.current) {
        const scalePulse = 1 + Math.sin(elapsedTime * 2) * 0.03;
        follicleGroupRef.current.children.forEach((follicle, idx) => {
          follicle.scale.set(scalePulse, scalePulse, scalePulse);
          if ((follicle as any).material?.emissiveIntensity) {
            (follicle as any).material.emissiveIntensity = 0.3 + Math.sin(elapsedTime * 3 + idx) * 0.2;
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });

    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      dom.removeEventListener('mousedown', onPointerDown);
      dom.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('touchstart', onPointerDown);
      dom.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      renderer.dispose();
    };
  }, []);

  // Update follicles when mode changes
  const updateFollicles = (activeMode: 'normal' | 'pcos', group: THREE.Group) => {
    // Clear existing
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
    }

    if (activeMode === 'normal') {
      // Normal: One mature Graafian follicle ready for ovulation
      const matureGeo = new THREE.SphereGeometry(0.25, 24, 24);
      const matureMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8, // Vibrant azure mature follicle
        emissive: 0x0284c7,
        emissiveIntensity: 0.5,
        roughness: 0.1,
        transparent: true,
        opacity: 0.85,
      });
      const matureMesh = new THREE.Mesh(matureGeo, matureMat);
      matureMesh.position.set(0.2, 0.25, 0.45);
      group.add(matureMesh);

      // 1-2 tiny developing primordial follicles
      const primGeo = new THREE.SphereGeometry(0.08, 16, 16);
      const primMat = new THREE.MeshStandardMaterial({ color: 0x93c5fd, roughness: 0.3 });
      const p1 = new THREE.Mesh(primGeo, primMat);
      p1.position.set(-0.25, -0.15, 0.35);
      group.add(p1);
    } else {
      // PCOS: Characteristic "String of Pearls" — 10 to 14 small immature follicles arranged peripherally (2–9mm each)
      const follicleCount = 12;
      const pcosMat = new THREE.MeshStandardMaterial({
        color: 0xf43f5e, // Amber / Rose indicating paused immature development
        emissive: 0xbe123c,
        emissiveIntensity: 0.4,
        roughness: 0.2,
        transparent: true,
        opacity: 0.85,
      });

      for (let i = 0; i < follicleCount; i++) {
        const angle = (i / follicleCount) * Math.PI * 2;
        const radius = 0.48;
        const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.08;
        const y = Math.sin(angle) * radius * 0.8 + (Math.random() - 0.5) * 0.08;
        const z = (Math.random() - 0.5) * 0.2 + 0.35;

        const size = 0.09 + Math.random() * 0.04;
        const geo = new THREE.SphereGeometry(size, 16, 16);
        const mesh = new THREE.Mesh(geo, pcosMat);
        mesh.position.set(x, y, z);
        group.add(mesh);
      }
    }
  };

  const handleModeToggle = (newMode: 'normal' | 'pcos') => {
    setMode(newMode);
    if (follicleGroupRef.current) {
      updateFollicles(newMode, follicleGroupRef.current);
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const newZoom = direction === 'in' ? Math.max(cameraZoomLevel - 0.8, 3.5) : Math.min(cameraZoomLevel + 0.8, 8.0);
    setCameraZoomLevel(newZoom);
    cameraRef.current.position.z = newZoom;
  };

  return (
    <div id="interactive-3d-pelvic-anatomy" className="relative w-full rounded-xl bg-slate-950 border border-slate-700/80 overflow-hidden shadow-2xl">
      {/* Blueprint background grid */}
      <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #334155 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={mountRef}
        className="w-full h-[360px] md:h-[420px] cursor-grab active:cursor-grabbing touch-none select-none relative z-10"
        aria-label="3D Pelvic & Ovarian Anatomy Simulation"
      />

      {/* Top Floating Engineering Controls Bar */}
      <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-20">
        {/* Mode Toggle (Normal vs Polycystic) */}
        <div className="pointer-events-auto flex items-center bg-slate-900/90 backdrop-blur-md p-1 rounded-lg border border-slate-700 shadow-md">
          <button
            type="button"
            id="btn-mode-normal"
            onClick={() => handleModeToggle('normal')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
              mode === 'normal'
                ? 'bg-indigo-600 text-white shadow-sm font-semibold border border-indigo-400/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Ovulatory Mode
          </button>
          <button
            type="button"
            id="btn-mode-pcos"
            onClick={() => handleModeToggle('pcos')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
              mode === 'pcos'
                ? 'bg-rose-600 text-white shadow-sm font-semibold border border-rose-400/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-300" />
            PCOS Morphology
          </button>
        </div>

        {/* Action & Camera Controls */}
        <div className="pointer-events-auto flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-lg border border-slate-700">
          <button
            type="button"
            id="btn-3d-rotate-toggle"
            onClick={() => setAutoRotate(!autoRotate)}
            title="Toggle Auto Rotation"
            className={`p-1.5 rounded text-xs transition ${
              autoRotate ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            id="btn-3d-zoom-in"
            onClick={() => handleZoom('in')}
            title="Zoom In"
            className="p-1.5 rounded text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            id="btn-3d-zoom-out"
            onClick={() => handleZoom('out')}
            title="Zoom Out"
            className="p-1.5 rounded text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Telemetry Coordinate HUD */}
      <div className="absolute top-16 left-3 pointer-events-none z-20 hidden sm:flex flex-col gap-1 font-mono text-[10px] text-slate-500 bg-slate-950/80 p-2 rounded border border-slate-800 backdrop-blur-xs">
        <div className="text-indigo-400 uppercase font-bold text-[9px]">Anatomy Engine HUD</div>
        <div>FOV: 45.0°</div>
        <div>ZOOM: {cameraZoomLevel.toFixed(1)}x</div>
        <div>STATE: {mode.toUpperCase()}</div>
      </div>

      {/* Bottom Educational Anatomical Hotspot Cards */}
      <div className="absolute bottom-3 left-3 right-3 pointer-events-auto z-20">
        <div className="bg-slate-900/95 backdrop-blur-md rounded-lg p-3 border border-slate-700/80 text-slate-200 shadow-xl">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className={`flex h-2 w-2 rounded-full ${mode === 'normal' ? 'bg-emerald-400' : 'bg-rose-500'} animate-ping`} />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
                {mode === 'normal' ? 'Normal Ovulation Micro-Structure' : 'PCOS "String of Pearls" Morphology'}
              </h4>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Orbital 360° Drag • Real-time Shader</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {mode === 'normal'
              ? 'In a typical ovulatory cycle, a single dominant follicle (blue) matures under FSH stimulation and ruptures to release an ovum. The endometrium thickens in synchronization.'
              : 'In PCOS, elevated LH-to-FSH ratio or insulin resistance halts follicular maturation at 2–9 mm. Multiple small immature follicles (glowing red) line the outer ovarian cortex.'}
          </p>

          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span className="flex items-center gap-1 text-cyan-400">
              <Info className="w-3.5 h-3.5" /> Note: Benign egg follicles, not surgical tumors.
            </span>
            <span className="text-indigo-400 uppercase">Interactive Simulation</span>
          </div>
        </div>
      </div>
    </div>
  );
};
