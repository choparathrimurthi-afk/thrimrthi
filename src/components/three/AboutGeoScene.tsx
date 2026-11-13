import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import {
  configureStudioRenderer,
  detectSoftwareWebGL,
  isWebGLAvailable,
  prefersReducedMotion,
} from '../../utils/webgl';

const _dummy = new THREE.Object3D();

function AboutStudioSetup({ isSoftwareGl }: { isSoftwareGl: boolean }) {
  const { gl, scene } = useThree();
  useEffect(() => {
    return configureStudioRenderer(gl, scene, isSoftwareGl);
  }, [gl, scene, isSoftwareGl]);
  return null;
}

function GeometricSculpture({
  pointerRef,
  isSoftwareGl,
  reducedMotion,
}: {
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  isSoftwareGl: boolean;
  reducedMotion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const knotRef = useRef<THREE.Mesh>(null);
  const outerCageRef = useRef<THREE.Mesh>(null);
  const innerCageRef = useRef<THREE.Mesh>(null);
  const satellitesRef = useRef<THREE.InstancedMesh>(null);
  const timeAccumRef = useRef(0);
  const satelliteCount = 16;

  const satelliteOrbits = useMemo(() => {
    return Array.from({ length: satelliteCount }, (_, i) => ({
      radius: 1.55 + (i % 3) * 0.24,
      speed: 0.45 + (i % 4) * 0.14,
      phase: (i / satelliteCount) * Math.PI * 2,
      tilt: ((i % 5) - 2) * 0.32,
      scale: 0.75 + (i % 3) * 0.25,
    }));
  }, [satelliteCount]);

  useEffect(() => {
    if (!satellitesRef.current) return;
    const cPurple = new THREE.Color('#a855f7');
    const cBlue = new THREE.Color('#38bdf8');
    const temp = new THREE.Color();
    for (let i = 0; i < satelliteCount; i++) {
      temp.copy(cPurple).lerp(cBlue, (i % 4) / 3);
      satellitesRef.current.setColorAt(i, temp);
    }
    if (satellitesRef.current.instanceColor) {
      satellitesRef.current.instanceColor.needsUpdate = true;
    }
    satellitesRef.current.computeBoundingSphere();
  }, [satelliteCount]);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    if (!reducedMotion) {
      timeAccumRef.current += delta;
    }
    const t = reducedMotion ? 0 : timeAccumRef.current;

    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        pointerRef.current.y * 0.35,
        4,
        delta,
      );
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        pointerRef.current.x * 0.45 + t * 0.18,
        4,
        delta,
      );
    }

    if (knotRef.current && !reducedMotion) {
      knotRef.current.rotation.z = t * 0.22;
    }

    if (outerCageRef.current && !reducedMotion) {
      outerCageRef.current.rotation.y = -t * 0.26;
      outerCageRef.current.rotation.x = t * 0.14;
    }

    if (innerCageRef.current && !reducedMotion) {
      innerCageRef.current.rotation.y = t * 0.35;
      innerCageRef.current.rotation.z = -t * 0.2;
    }

    if (satellitesRef.current) {
      for (let i = 0; i < satelliteCount; i++) {
        const orb = satelliteOrbits[i];
        const angle = orb.phase + t * orb.speed;
        _dummy.position.set(
          Math.cos(angle) * orb.radius,
          Math.sin(angle * 1.3) * 0.45 + orb.tilt * 0.35,
          Math.sin(angle) * orb.radius,
        );
        _dummy.rotation.set(t + i, t * 0.7, 0);
        _dummy.scale.setScalar(orb.scale);
        _dummy.updateMatrix();
        satellitesRef.current.setMatrixAt(i, _dummy.matrix);
      }
      satellitesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <AboutStudioSetup isSoftwareGl={isSoftwareGl} />
      <color attach="background" args={['#0b0b18']} />

      <hemisphereLight args={['#38bdf8', '#2e1065', 0.6]} />
      <directionalLight position={[4, 5, 4]} intensity={2.2} color="#f8fafc" />
      <pointLight position={[-3.5, 2, 3]} intensity={14} distance={12} color="#9333ea" />
      <pointLight position={[3.5, -2, 3]} intensity={12} distance={12} color="#3b82f6" />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping={!isSoftwareGl}
        dampingFactor={0.05}
      />

      <group ref={groupRef}>
        {/* 1. Brushed Iridescent TorusKnot Core */}
        <mesh ref={knotRef}>
          <torusKnotGeometry args={[0.76, 0.24, 140, 24, 2, 3]} />
          <meshPhysicalMaterial
            color="#312e81"
            emissive="#4c1d95"
            emissiveIntensity={0.45}
            metalness={0.92}
            roughness={0.16}
            clearcoat={1.0}
            clearcoatRoughness={0.08}
            iridescence={0.9}
            iridescenceIOR={1.4}
          />
        </mesh>

        {/* 2. Inner Electric Blue Wireframe Icosahedron */}
        <mesh ref={innerCageRef}>
          <icosahedronGeometry args={[1.38, 0]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0ea5e9"
            emissiveIntensity={0.8}
            wireframe
          />
        </mesh>

        {/* 3. Outer Violet Octahedral Geometry Frame */}
        <mesh ref={outerCageRef}>
          <octahedronGeometry args={[1.72, 0]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#7c3aed"
            emissiveIntensity={0.55}
            wireframe
          />
        </mesh>

        {/* 4. Orbiting Geometric Satellites */}
        <instancedMesh
          ref={satellitesRef}
          args={[undefined, undefined, satelliteCount]}
          frustumCulled={false}
        >
          <octahedronGeometry args={[0.055, 0]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#8b5cf6"
            emissiveIntensity={1.3}
            metalness={0.6}
            roughness={0.2}
          />
        </instancedMesh>
      </group>
    </>
  );
}

export function AboutGeoScene() {
  const [webglReady] = useState(() => isWebGLAvailable());
  const [contextLost, setContextLost] = useState(false);
  const [isSoftwareGl] = useState(() => detectSoftwareWebGL());
  const [reducedMotion] = useState(() => prefersReducedMotion());
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    pointerRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointerRef.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };

  const handlePointerLeave = () => {
    pointerRef.current.x = 0;
    pointerRef.current.y = 0;
  };

  const showFallback = !webglReady || contextLost;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full h-[320px] sm:h-[380px] lg:h-full lg:min-h-[380px] rounded-2xl overflow-hidden border border-purple-500/20 bg-[#0b0b18]"
      aria-label="Interactive 3D Geometric Sculpture"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.16) 0%, rgba(124, 58, 237, 0.1) 42%, rgba(11, 11, 24, 0) 75%)',
        }}
      />

      {showFallback ? (
        <div className="relative z-10 flex h-full w-full items-center justify-center p-6">
          <svg viewBox="0 0 200 200" className="h-44 w-44 text-blue-400" fill="none">
            <polygon
              points="100,20 175,100 100,180 25,100"
              stroke="#A855F7"
              strokeWidth="1.5"
              fill="#4C1D95"
              fillOpacity="0.2"
            />
            <polygon
              points="100,40 155,100 100,160 45,100"
              stroke="#38BDF8"
              strokeWidth="1.5"
            />
            <circle cx="100" cy="100" r="24" stroke="#C084FC" strokeWidth="2" />
          </svg>
        </div>
      ) : (
        <Canvas
          dpr={isSoftwareGl ? 1 : [1, 2]}
          gl={{ antialias: !isSoftwareGl, powerPreference: 'high-performance', alpha: false }}
          camera={{ position: [0, 0, 4.4], fov: 44, near: 0.1, far: 40 }}
          onCreated={({ gl }) => {
            const canvas = gl.domElement;
            canvas.addEventListener('webglcontextlost', (e) => {
              e.preventDefault();
              setContextLost(true);
            });
            canvas.addEventListener('webglcontextrestored', () => {
              setContextLost(false);
            });
          }}
        >
          <GeometricSculpture
            pointerRef={pointerRef}
            isSoftwareGl={isSoftwareGl}
            reducedMotion={reducedMotion}
          />
        </Canvas>
      )}

      <div className="pointer-events-none absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-400">
        <span>Interactive 3D Polyhedron</span>
        <span>Drag to rotate</span>
      </div>
    </div>
  );
}
