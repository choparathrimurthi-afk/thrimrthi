import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

let cachedSoftwareGl: boolean | null = null;
let cachedWebGlSupported: boolean | null = null;

/**
 * Detects whether WebGL2 is available in the current browser context.
 */
export function isWebGLAvailable(): boolean {
  if (cachedWebGlSupported !== null) return cachedWebGlSupported;
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    cachedWebGlSupported = Boolean(gl);
    if (gl && 'getExtension' in gl) {
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
    return cachedWebGlSupported;
  } catch {
    cachedWebGlSupported = false;
    return false;
  }
}

/**
 * Detects software WebGL renderers (SwiftShader, llvmpipe, WARP) via GPU renderer string,
 * never via user agent, to gracefully scale DPR/shadows/AA without changing scene geometry.
 */
export function detectSoftwareWebGL(): boolean {
  if (cachedSoftwareGl !== null) return cachedSoftwareGl;
  if (typeof document === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) {
      cachedSoftwareGl = true;
      return true;
    }
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    cachedSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    return cachedSoftwareGl;
  } catch {
    cachedSoftwareGl = true;
    return true;
  }
}

/**
 * Checks whether the user prefers reduced motion.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Configures procedural studio IBL environment map via RoomEnvironment + PMREMGenerator,
 * color space, and ACES Filmic tone mapping for crisp metallic/glass PBR materials.
 */
export function configureStudioRenderer(
  gl: THREE.WebGLRenderer,
  scene: THREE.Scene,
  isSoftwareGl: boolean,
): () => void {
  gl.outputColorSpace = THREE.SRGBColorSpace;
  gl.toneMapping = THREE.ACESFilmicToneMapping;
  gl.toneMappingExposure = 1.15;
  gl.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));

  const pmremGenerator = new THREE.PMREMGenerator(gl);
  const roomEnv = new RoomEnvironment();
  const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
  scene.environment = envTarget.texture;
  roomEnv.dispose();
  pmremGenerator.dispose();

  return () => {
    envTarget.dispose();
    scene.environment = null;
  };
}

/**
 * Generates a soft circular radial sprite texture on an offscreen 2D canvas
 * for 3D particle fields (zero external image dependencies).
 */
export function createParticleSpriteTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const half = size / 2;
    const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.28, 'rgba(216, 180, 254, 0.85)');
    gradient.addColorStop(0.65, 'rgba(96, 165, 250, 0.25)');
    gradient.addColorStop(1, 'rgba(8, 8, 18, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}
