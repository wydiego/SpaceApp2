import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { X, RotateCcw } from 'lucide-react';

interface TrajectoryViewerProps {
  isOpen: boolean;
  onClose: () => void;
  showDeflection: boolean;
}

export default function TrajectoryViewer({ isOpen, onClose, showDeflection }: TrajectoryViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000510);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(3, 2, 4);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffffff, 1, 100);
    sunLight.position.set(10, 0, 0);
    scene.add(sunLight);

    const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
    const earthTexture = new THREE.TextureLoader().load(
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMxZTQwYWYiLz48L3N2Zz4='
    );
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      color: 0x1e40af,
      emissive: 0x0a1f5f,
      shininess: 25
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    const atmosphereGeometry = new THREE.SphereGeometry(1.05, 64, 64);
    const atmosphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x4dabf7,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    const impactPoints = [
      new THREE.Vector3(2.5, 0.8, -1.5),
      new THREE.Vector3(0.9, 0.3, -0.2)
    ];

    const createTrajectory = (
      startPoint: THREE.Vector3,
      color: number,
      curved: boolean = false
    ) => {
      const points = [];
      const steps = 50;

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const point = startPoint.clone().lerp(new THREE.Vector3(0, 0, 0), t);

        if (curved && i > steps * 0.7) {
          const bendAmount = (t - 0.7) * 2;
          point.x += Math.sin(bendAmount * Math.PI) * 0.5;
          point.y += Math.sin(bendAmount * Math.PI) * 0.3;
        }

        points.push(point);
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color,
        linewidth: 2,
        transparent: true,
        opacity: 0.8
      });

      return new THREE.Line(geometry, material);
    };

    const impactTrajectory = createTrajectory(impactPoints[0], 0xff3333, false);
    scene.add(impactTrajectory);

    if (showDeflection) {
      const deflectedTrajectory = createTrajectory(impactPoints[0], 0x33ff33, true);
      scene.add(deflectedTrajectory);
    }

    const asteroidGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const asteroidMaterial = new THREE.MeshPhongMaterial({
      color: 0x8b7355,
      emissive: 0x3d2817
    });
    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
    asteroid.position.copy(impactPoints[0]);
    scene.add(asteroid);

    const stars = new THREE.BufferGeometry();
    const starPositions = [];
    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 50;
      starPositions.push(x, y, z);
    }
    stars.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.8
    });
    const starField = new THREE.Points(stars, starsMaterial);
    scene.add(starField);

    let time = 0;
    const animate = () => {
      time += 0.005;

      earth.rotation.y += 0.001;
      atmosphere.rotation.y += 0.001;

      const t = (Math.sin(time) + 1) / 2;
      asteroid.position.lerpVectors(impactPoints[0], impactPoints[1], t);

      if (autoRotate) {
        camera.position.x = Math.cos(time * 0.3) * 5;
        camera.position.z = Math.sin(time * 0.3) * 5;
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isOpen, showDeflection, autoRotate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-cyan-500/50 rounded-2xl w-[90vw] h-[90vh] max-w-6xl shadow-2xl shadow-cyan-500/20 overflow-hidden">
        <div className="bg-black/60 backdrop-blur-sm border-b border-cyan-500/30 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-cyan-400">3D Trajectory Visualization</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                autoRotate
                  ? 'bg-cyan-600 text-white'
                  : 'bg-black/40 text-gray-400 hover:bg-black/60'
              }`}
              title="Toggle Auto-Rotate"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-600/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div ref={containerRef} className="w-full h-[calc(100%-4rem)]" />

        <div className="absolute bottom-8 left-8 bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-1 bg-red-500"></div>
            <span className="text-sm text-white">Impact Trajectory</span>
          </div>
          {showDeflection && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-1 bg-green-500"></div>
              <span className="text-sm text-white">Deflected Trajectory</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
