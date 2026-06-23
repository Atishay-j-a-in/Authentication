import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function FloatingParticles({ count = 200 }) {
  const meshRef = useRef();
  const lightRef = useRef();

  const geometry = useMemo(() => {
    const rand = seededRandom(42);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const palette = [
      new THREE.Color('#00f0ff'),
      new THREE.Color('#ff00ff'),
      new THREE.Color('#7b2dff'),
      new THREE.Color('#00ff88'),
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * 10;
      positions[i * 3 + 1] = (rand() - 0.5) * 10;
      positions[i * 3 + 2] = (rand() - 0.5) * 5 - 2;

      const c = palette[Math.floor(rand() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = rand() * 0.03 + 0.01;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [count]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.02;
      meshRef.current.rotation.x = Math.sin(t * 0.1) * 0.1;
    }
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(t * 0.3) * 3;
      lightRef.current.position.y = Math.cos(t * 0.2) * 2;
    }
  });

  return (
    <group ref={meshRef}>
      <pointLight ref={lightRef} color="#00f0ff" intensity={2} distance={8} />
      <pointLight color="#ff00ff" intensity={1.5} distance={6} position={[2, -1, -1]} />
      <points geometry={geometry}>
        <pointsMaterial
          size={0.04}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function GlowingRing() {
  const ringRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.15;
      ringRef.current.rotation.z = Math.sin(t * 0.2) * 0.3;
      ringRef.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.05);
    }
  });

  return (
    <mesh ref={ringRef} position={[0, 0, -2]}>
      <torusGeometry args={[2.5, 0.02, 16, 100]} />
      <meshBasicMaterial color="#00f0ff" transparent opacity={0.4} />
    </mesh>
  );
}

const nebulaUniforms = {
  uTime: { value: 0 },
  uColor1: { value: new THREE.Color('#7b2dff') },
  uColor2: { value: new THREE.Color('#00f0ff') },
};

function NebulaPlane() {
  useFrame((state) => {
    nebulaUniforms.uTime.value = state.clock.getElapsedTime();
  });

  return (
    <mesh position={[0, 0, -4]} scale={12}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        transparent
        uniforms={nebulaUniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          varying vec2 vUv;

          float noise(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
          }

          void main() {
            vec2 uv = vUv;
            float n = noise(uv * 3.0 + uTime * 0.1);
            float n2 = noise(uv * 5.0 - uTime * 0.15);
            float blend = smoothstep(0.3, 0.7, n + n2 * 0.5);
            vec3 color = mix(uColor1, uColor2, blend);
            float alpha = smoothstep(0.0, 0.3, n) * 0.15;
            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </mesh>
  );
}

export default function WebGLBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.1} />
        <FloatingParticles />
        <GlowingRing />
        <NebulaPlane />
      </Canvas>
    </div>
  );
}
