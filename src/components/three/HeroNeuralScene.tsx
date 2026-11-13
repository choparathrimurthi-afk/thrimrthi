import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import {
  configureStudioRenderer,
  createParticleSpriteTexture,
  detectSoftwareWebGL,
  isWebGLAvailable,
  prefersReducedMotion,
} from '../../utils/webgl';

// Pre-allocated math helpers outside render loop (zero GC pressure)
const _dummy = new THREE.Object3D();
const _tempColor = new THREE.Color();
const _purple = new THREE.Color('#a855f7');
const _electricBlue = new THREE.Color('#38bdf8');
const _violet = new THREE.Color('#7c3aed');

interface NeuralCoreProps {
  paused: boolean;
  pulseBoost: number;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  resetSignal: number;
  isSoftwareGl: boolean;
}

function StudioSetup({ isSoftwareGl }: { isSoftwareGl: boolean }) {
  const { gl, scene } = useThree();

  useEffect(() => {
    const cleanup = configureStudioRenderer(gl, scene, isSoftwareGl);
    return cleanup;
  }, [gl, scene, isSoftwareGl]);

  return null;
}

function NeuralCoreRig({
  paused,
  pulseBoost,
  pointerRef,
  resetSignal,
  isSoftwareGl,
}: NeuralCoreProps) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const shellCageRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const timeAccumRef = useRef(0);

  // Generate Fibonacci-sphere neural nodes and synaptic axon connections once
  const { nodePositions, synapseGeometry, nodeCount } = useMemo(() => {
    const count = 88;
    const radius = 1.48;
    const positions: THREE.Vector3[] = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const rAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * i;
      const jitter = 0.92 + ((i * 17) % 11) * 0.014;
      positions.push(
        new THREE.Vector3(
          Math.cos(theta) * rAtY * radius * jitter,
          y * radius * jitter,
          Math.sin(theta) * rAtY * radius * jitter,
        ),
      );
    }

    const linePositions: number[] = [];
    const lineColors: number[] = [];
    const maxDist = 0.92;

    for (let i = 0; i < count; i++) {
      let connections = 0;
      for (let j = i + 1; j < count && connections < 4; j++) {
        const dist = positions[i].distanceTo(positions[j]);
        if (dist < maxDist) {
          linePositions.push(
            positions[i].x,
            positions[i].y,
            positions[i].z,
            positions[j].x,
            positions[j].y,
            positions[j].z,
          );
          const mixFactor = ((i + j) % 10) / 10;
          _tempColor.copy(_violet).lerp(_electricBlue, mixFactor);
          lineColors.push(_tempColor.r, _tempColor.g, _tempColor.b);
          lineColors.push(_tempColor.r, _tempColor.g, _tempColor.b);
          connections++;
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

    return { nodePositions: positions, synapseGeometry: geo, nodeCount: count };
  }, []);

  // Floating particle field geometry & procedural sprite texture
  const { particleGeometry, particleTexture } = useMemo(() => {
    const pCount = 220;
    const positions = new Float32Array(pCount * 3);
    const colors = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount; i++) {
      const r = 2.25 + ((i * 37) % 100) * 0.022;
      const theta = (i * 2.39996) % (Math.PI * 2);
      const phi = Math.acos(1 - 2 * ((i + 0.5) / pCount));
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.85;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const t = (i % 7) / 6;
      _tempColor.copy(_purple).lerp(_electricBlue, t);
      colors[i * 3] = _tempColor.r;
      colors[i * 3 + 1] = _tempColor.g;
      colors[i * 3 + 2] = _tempColor.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    return {
      particleGeometry: geo,
      particleTexture: createParticleSpriteTexture(),
    };
  }, []);

  // Initialize instanced nodes once and dispose procedural geometries on unmount
  useEffect(() => {
    if (nodesRef.current) {
      for (let i = 0; i < nodeCount; i++) {
        _dummy.position.copy(nodePositions[i]);
        _dummy.scale.setScalar(1);
        _dummy.updateMatrix();
        nodesRef.current.setMatrixAt(i, _dummy.matrix);
        _tempColor.copy(_purple).lerp(_electricBlue, (i % 5) / 4);
        nodesRef.current.setColorAt(i, _tempColor);
      }
      nodesRef.current.instanceMatrix.needsUpdate = true;
      if (nodesRef.current.instanceColor) {
        nodesRef.current.instanceColor.needsUpdate = true;
      }
      nodesRef.current.computeBoundingSphere();
    }

    return () => {
      synapseGeometry.dispose();
      particleGeometry.dispose();
      particleTexture.dispose();
    };
  }, [nodeCount, nodePositions, synapseGeometry, particleGeometry, particleTexture]);

  // Reset OrbitControls when user requests reset
  useEffect(() => {
    if (resetSignal > 0 && controlsRef.current) {
      controlsRef.current.reset();
    }
  }, [resetSignal]);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const speed = paused ? 0 : 1 + pulseBoost * 1.4;
    timeAccumRef.current += delta * speed;
    const t = timeAccumRef.current;

    if (rootGroupRef.current) {
      const targetRotX = pointerRef.current.y * 0.32;
      const targetRotY = pointerRef.current.x * 0.45 + t * 0.14;
      rootGroupRef.current.rotation.x = THREE.MathUtils.damp(
        rootGroupRef.current.rotation.x,
        targetRotX,
        4.2,
        delta,
      );
      rootGroupRef.current.rotation.y = THREE.MathUtils.damp(
        rootGroupRef.current.rotation.y,
        targetRotY,
        4.2,
        delta,
      );
      rootGroupRef.current.position.y = Math.sin(t * 1.1) * 0.08;
    }

    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y = -t * 0.25;
      innerCoreRef.current.rotation.z = t * 0.18;
      const breath = 1 + Math.sin(t * 2.2) * 0.035 + pulseBoost * 0.06;
      innerCoreRef.current.scale.setScalar(breath);
    }

    if (shellCageRef.current) {
      shellCageRef.current.rotation.y = t * 0.12;
      shellCageRef.current.rotation.x = Math.sin(t * 0.4) * 0.15;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.28;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = t * 0.22;
      ring2Ref.current.rotation.y = -t * 0.18;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = t * 0.34;
    }

    if (nodesRef.current && !paused) {
      for (let i = 0; i < nodeCount; i++) {
        const wave = 0.72 + 0.45 * Math.sin(t * 2.6 + i * 0.55);
        _dummy.position.copy(nodePositions[i]);
        _dummy.scale.setScalar(wave);
        _dummy.updateMatrix();
        nodesRef.current.setMatrixAt(i, _dummy.matrix);
      }
      nodesRef.current.instanceMatrix.needsUpdate = true;
    }

    if (particlesRef.current && !paused) {
      particlesRef.current.rotation.y = -t * 0.07;
      particlesRef.current.rotation.x = Math.sin(t * 0.2) * 0.08;
    }
  });

  return (
    <>
      <StudioSetup isSoftwareGl={isSoftwareGl} />
      <color attach="background" args={['#080812']} />
      <fogExp2 attach="fog" args={['#080812', 0.07]} />

      {/* Three-Point + Neon Accent Lighting Rig */}
      <hemisphereLight args={['#60a5fa', '#1e1038', 0.55]} />
      <directionalLight position={[5, 6, 5]} intensity={2.2} color="#e0e7ff" />
      <pointLight position={[-4.5, 2.5, 3.5]} intensity={16} distance={14} color="#9333ea" />
      <pointLight position={[4.5, -2.5, 2.5]} intensity={14} distance={14} color="#0ea5e9" />
      <pointLight position={[0, 0, -4.5]} intensity={10} distance={12} color="#7c3aed" />

      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        enableDamping={!isSoftwareGl}
        dampingFactor={0.05}
        rotateSpeed={0.65}
      />

      <group ref={rootGroupRef}>
        {/* 1. Glowing Synaptic Plasma Core */}
        <mesh ref={innerCoreRef}>
          <icosahedronGeometry args={[0.78, 3]} />
          <meshPhysicalMaterial
            color="#1b103a"
            emissive="#6d28d9"
            emissiveIntensity={1.1 + pulseBoost * 0.8}
            metalness={0.35}
            roughness={0.22}
            clearcoat={1.0}
            clearcoatRoughness={0.08}
            iridescence={0.85}
            iridescenceIOR={1.5}
          />
        </mesh>

        {/* 2. Brushed Metallic Geodesic Armature Cage */}
        <mesh ref={shellCageRef}>
          <icosahedronGeometry args={[1.18, 2]} />
          <meshPhysicalMaterial
            color="#3b82f6"
            emissive="#1d4ed8"
            emissiveIntensity={0.45}
            wireframe
            metalness={0.92}
            roughness={0.18}
          />
        </mesh>

        {/* 3. Neural Network Nodes (InstancedMesh) */}
        <instancedMesh ref={nodesRef} args={[undefined, undefined, nodeCount]} frustumCulled={false}>
          <sphereGeometry args={[0.042, 12, 12]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#a855f7"
            emissiveIntensity={1.45}
            metalness={0.4}
            roughness={0.2}
            toneMapped={false}
          />
        </instancedMesh>

        {/* 4. Synaptic Axon Connections */}
        <lineSegments geometry={synapseGeometry}>
          <lineBasicMaterial
            vertexColors
            transparent
            opacity={0.48}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>

        {/* 5. Outer Precision Gyroscopic Orbital Rings */}
        <group ref={ring1Ref} rotation={[Math.PI / 5, 0.3, 0]}>
          <mesh>
            <torusGeometry args={[1.88, 0.022, 16, 96]} />
            <meshPhysicalMaterial
              color="#94a3b8"
              metalness={0.95}
              roughness={0.16}
              clearcoat={1.0}
            />
          </mesh>
          <mesh position={[1.88, 0, 0]}>
            <octahedronGeometry args={[0.075, 0]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0ea5e9"
              emissiveIntensity={2.0}
              toneMapped={false}
            />
          </mesh>
        </group>

        <group ref={ring2Ref} rotation={[-Math.PI / 3.2, -0.4, 0.5]}>
          <mesh>
            <torusGeometry args={[2.12, 0.016, 16, 96]} />
            <meshPhysicalMaterial
              color="#6366f1"
              emissive="#4f46e5"
              emissiveIntensity={0.35}
              metalness={0.9}
              roughness={0.22}
            />
          </mesh>
          <mesh position={[-2.12, 0, 0]}>
            <sphereGeometry args={[0.065, 16, 16]} />
            <meshStandardMaterial
              color="#c084fc"
              emissive="#a855f7"
              emissiveIntensity={2.1}
              toneMapped={false}
            />
          </mesh>
        </group>

        <group ref={ring3Ref} rotation={[Math.PI / 2.2, 0.65, 0]}>
          <mesh>
            <torusGeometry args={[2.32, 0.012, 12, 96]} />
            <meshPhysicalMaterial
              color="#475569"
              metalness={0.94}
              roughness={0.2}
              transparent
              opacity={0.75}
            />
          </mesh>
        </group>
      </group>

      {/* 6. Surrounding Floating Neural Particles */}
      <points ref={particlesRef} geometry={particleGeometry}>
        <pointsMaterial
          size={0.095}
          map={particleTexture}
          vertexColors
          transparent
          opacity={0.88}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </>
  );
}

export function HeroNeuralScene() {
  const [webglReady, setWebglReady] = useState<boolean>(() => isWebGLAvailable());
  const [contextLost, setContextLost] = useState(false);
  const [isSoftwareGl] = useState<boolean>(() => detectSoftwareWebGL());
  const [paused, setPaused] = useState<boolean>(() => prefersReducedMotion());
  const [pulseBoost, setPulseBoost] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWebglReady(isWebGLAvailable());
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    pointerRef.current.x = Math.max(-1, Math.min(1, nx));
    pointerRef.current.y = Math.max(-1, Math.min(1, ny));
  };

  const handlePointerLeave = () => {
    pointerRef.current.x = 0;
    pointerRef.current.y = 0;
  };

  const triggerPulse = () => {
    setPulseBoost(1);
    window.setTimeout(() => setPulseBoost(0), 1100);
  };

  const showFallback = !webglReady || contextLost;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full h-[360px] sm:h-[440px] lg:h-[580px] rounded-2xl overflow-hidden border border-purple-500/20 bg-[#080812]"
      aria-label="Interactive 3D Neural Network Core"
    >
      {/* Subtle radial glow behind 3D canvas */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 48%, rgba(124, 58, 237, 0.22) 0%, rgba(14, 165, 233, 0.1) 38%, rgba(8, 8, 18, 0) 72%)',
        }}
      />

      {showFallback ? (
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center p-6 text-center">
          <svg
            viewBox="0 0 240 240"
            className="h-56 w-56 text-purple-400"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="120" cy="120" r="88" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
            <ellipse
              cx="120"
              cy="120"
              rx="102"
              ry="42"
              transform="rotate(-24 120 120)"
              stroke="#38BDF8"
              strokeOpacity="0.6"
              strokeWidth="1.5"
            />
            <ellipse
              cx="120"
              cy="120"
              rx="102"
              ry="42"
              transform="rotate(32 120 120)"
              stroke="#A855F7"
              strokeOpacity="0.6"
              strokeWidth="1.5"
            />
            <polygon
              points="120,52 178,86 178,154 120,188 62,154 62,86"
              stroke="#818CF8"
              strokeWidth="1.5"
              fill="#4C1D95"
              fillOpacity="0.28"
            />
            <circle cx="120" cy="120" r="24" fill="#7C3AED" fillOpacity="0.55" />
          </svg>
          <p className="mt-3 text-xs text-slate-400">
            Interactive 3D Neural Core (WebGL preview fallback active)
          </p>
        </div>
      ) : (
        <div className="absolute inset-0">
          <Canvas
            dpr={isSoftwareGl ? 1 : [1, 2]}
            gl={{
              antialias: !isSoftwareGl,
              powerPreference: 'high-performance',
              alpha: false,
            }}
            camera={{ position: [0, 0.15, 5.4], fov: 44, near: 0.1, far: 50 }}
            onCreated={({ gl }) => {
              const canvas = gl.domElement;
              canvas.addEventListener('webglcontextlost', (event) => {
                event.preventDefault();
                setContextLost(true);
              });
              canvas.addEventListener('webglcontextrestored', () => {
                setContextLost(false);
              });
            }}
          >
            <NeuralCoreRig
              paused={paused}
              pulseBoost={pulseBoost}
              pointerRef={pointerRef}
              resetSignal={resetSignal}
              isSoftwareGl={isSoftwareGl}
            />
          </Canvas>
        </div>
      )}

      {/* Compact bottom-center interaction controls (solid rgba, zero backdrop-blur over WebGL) */}
      {!showFallback && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 rounded-xl border border-white/10 bg-[#0b0b18]/90 px-3 py-1.5 shadow-lg">
          <span className="hidden sm:inline text-[11px] text-slate-400 whitespace-nowrap pr-1">
            Drag to orbit · Move pointer to tilt
          </span>
          <button
            type="button"
            onClick={triggerPulse}
            className="rounded-lg bg-purple-600/25 px-2.5 py-1 text-xs font-medium text-purple-200 hover:bg-purple-600/40 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Synapse Pulse
          </button>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="rounded-lg bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-white/10 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {paused ? 'Resume' : 'Pause'}
          </button>
          <button
            type="button"
            onClick={() => setResetSignal((s) => s + 1)}
            className="rounded-lg bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-white/10 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Reset View
          </button>
        </div>
      )}
    </div>
  );
}
