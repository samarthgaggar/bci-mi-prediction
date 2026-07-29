"use client";

import { Line, Sparkles } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type BrainSceneProps = {
  progress: number;
  motionEnabled: boolean;
  dark: boolean;
};

const cameraFrames = [
  { at: 0, position: [0, 0, 7.8] },
  { at: 0.14, position: [2.45, 0.55, 5.2] },
  { at: 0.27, position: [-2.25, 0.15, 4.7] },
  { at: 0.4, position: [0.55, -0.45, 3.9] },
  { at: 0.52, position: [-1.65, 0.65, 4.15] },
  { at: 0.65, position: [1.8, 0.35, 4.2] },
  { at: 0.77, position: [-1.9, -0.45, 4.45] },
  { at: 0.89, position: [1.35, 0.2, 5.35] },
  { at: 1, position: [0, 0, 8.4] },
] as const;

function makeBrainGeometry(side: -1 | 1) {
  const geometry = new THREE.IcosahedronGeometry(1.62, 6);
  const position = geometry.attributes.position;
  const vector = new THREE.Vector3();

  for (let index = 0; index < position.count; index += 1) {
    vector.fromBufferAttribute(position, index);
    const radius = vector.length();
    const wave =
      Math.sin(vector.y * 10.4 + side * 0.8) *
      Math.cos(vector.z * 11.7) *
      Math.sin(vector.x * 14.2);
    const ripple = Math.sin((vector.y + vector.z) * 17) * 0.032;
    vector.normalize().multiplyScalar(radius * (1 + wave * 0.075 + ripple));
    vector.x *= 0.66;
    vector.y *= 1.05;
    vector.z *= 0.88;
    position.setXYZ(index, vector.x, vector.y, vector.z);
  }

  geometry.computeVertexNormals();
  return geometry;
}

function Hemisphere({
  side,
  dark,
}: {
  side: -1 | 1;
  dark: boolean;
}) {
  const geometry = useMemo(() => makeBrainGeometry(side), [side]);
  const color = side === -1 ? "#ff6b54" : "#5a6cff";
  const emissive = side === -1 ? "#a92419" : "#182fba";

  return (
    <group position={[side * 0.58, 0.1, 0]} rotation={[0.05, side * -0.07, side * 0.03]}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={dark ? 0.34 : 0.16}
          roughness={0.38}
          metalness={0.04}
          clearcoat={0.35}
          clearcoatRoughness={0.55}
        />
      </mesh>
      <mesh geometry={geometry} scale={1.006}>
        <meshBasicMaterial
          color={dark ? "#fffbf1" : "#152041"}
          wireframe
          transparent
          opacity={dark ? 0.045 : 0.035}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

const neuralPaths = [
  [
    [-1.45, 0.95, 0.35],
    [-0.85, 1.45, 0.75],
    [-0.05, 1.25, 1.12],
    [0.78, 0.9, 1.05],
    [1.45, 0.2, 0.45],
  ],
  [
    [-1.35, -0.2, 0.95],
    [-0.7, 0.25, 1.35],
    [0.05, 0.15, 1.52],
    [0.75, -0.35, 1.2],
    [1.28, -0.85, 0.55],
  ],
  [
    [-1.15, 0.25, -1.05],
    [-0.55, 0.75, -1.25],
    [0.1, 1.05, -1.35],
    [0.75, 0.65, -1.1],
    [1.3, 0.05, -0.7],
  ],
] as const;

function NeuralSignals({ dark }: { dark: boolean }) {
  const pulses = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!pulses.current) return;
    pulses.current.children.forEach((child, index) => {
      const pulse = 0.8 + Math.sin(clock.elapsedTime * 2.2 + index * 1.4) * 0.35;
      child.scale.setScalar(pulse);
    });
  });

  return (
    <>
      {neuralPaths.map((points, index) => (
        <Line
          key={index}
          points={points.map((point) => new THREE.Vector3(...point))}
          color={index === 1 ? "#ffbd54" : dark ? "#8dc8ff" : "#1b54d9"}
          lineWidth={dark ? 1.4 : 1.15}
          transparent
          opacity={0.72}
        />
      ))}
      <group ref={pulses}>
        {neuralPaths.flatMap((path, pathIndex) =>
          path.slice(1, -1).map((point, pointIndex) => (
            <mesh key={`${pathIndex}-${pointIndex}`} position={point}>
              <sphereGeometry args={[0.055, 16, 16]} />
              <meshBasicMaterial color={pathIndex === 1 ? "#ffd67e" : "#a6deff"} />
            </mesh>
          )),
        )}
      </group>
    </>
  );
}

function CameraJourney({
  progress,
  motionEnabled,
}: {
  progress: number;
  motionEnabled: boolean;
}) {
  const { camera, size } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const clamped = THREE.MathUtils.clamp(progress, 0, 1);
    const nextIndex = cameraFrames.findIndex((frame) => frame.at >= clamped);
    const endIndex = nextIndex <= 0 ? 1 : nextIndex;
    const startIndex = Math.max(0, endIndex - 1);
    const start = cameraFrames[startIndex];
    const end = cameraFrames[Math.min(endIndex, cameraFrames.length - 1)];
    const localProgress =
      start.at === end.at ? 0 : (clamped - start.at) / (end.at - start.at);
    const mobileScale = size.width < 768 ? 1.24 : size.width < 1100 ? 1.1 : 1;
    target
      .set(start.position[0], start.position[1], start.position[2])
      .lerp(new THREE.Vector3(...end.position), motionEnabled ? localProgress : 0)
      .multiplyScalar(mobileScale);
    camera.position.lerp(target, motionEnabled ? 0.055 : 0.16);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function Brain({
  progress,
  motionEnabled,
  dark,
}: BrainSceneProps) {
  const brain = useRef<THREE.Group>(null);
  const { size } = useThree();

  useFrame(({ clock }, delta) => {
    if (!brain.current) return;
    const direction = progress < 0.5 ? 1 : -1;
    const heroOffset =
      size.width >= 768 ? Math.max(0, 1.35 * (1 - progress / 0.11)) : 0;
    brain.current.position.x = THREE.MathUtils.lerp(
      brain.current.position.x,
      heroOffset,
      0.08,
    );
    if (motionEnabled) {
      brain.current.rotation.y += delta * 0.075 * direction;
      brain.current.rotation.z = Math.sin(clock.elapsedTime * 0.22) * 0.025;
    }
  });

  return (
    <>
      <CameraJourney progress={progress} motionEnabled={motionEnabled} />
      <ambientLight intensity={dark ? 0.7 : 1.35} />
      <directionalLight
        position={[4, 5, 7]}
        intensity={dark ? 3.6 : 4.4}
        color="#fff5df"
      />
      <pointLight position={[-4, -1, 4]} intensity={dark ? 3.2 : 2.3} color="#ff624f" />
      <pointLight position={[4, 1, 2]} intensity={dark ? 3.4 : 2.5} color="#5371ff" />
      <group ref={brain} scale={0.94}>
        <Hemisphere side={-1} dark={dark} />
        <Hemisphere side={1} dark={dark} />
        <mesh position={[0, -1.48, -0.2]} scale={[0.52, 0.42, 0.48]}>
          <sphereGeometry args={[1, 48, 48]} />
          <meshPhysicalMaterial
            color="#f4a25d"
            roughness={0.54}
            emissive="#813f22"
            emissiveIntensity={dark ? 0.25 : 0.08}
          />
        </mesh>
        <mesh position={[0, -2.05, -0.08]} scale={[0.22, 0.68, 0.22]}>
          <capsuleGeometry args={[0.48, 1.1, 8, 24]} />
          <meshPhysicalMaterial color="#ff8064" roughness={0.48} />
        </mesh>
        <NeuralSignals dark={dark} />
        <Sparkles
          count={70}
          scale={[4.4, 3.8, 3.4]}
          size={2.1}
          speed={motionEnabled ? 0.2 : 0}
          opacity={dark ? 0.72 : 0.38}
          color={dark ? "#d5e8ff" : "#3159b7"}
          noise={0.7}
        />
      </group>
    </>
  );
}

export default function BrainScene(props: BrainSceneProps) {
  return (
    <Canvas
      aria-label="Animated scientific illustration of a brain with pulsing signal paths"
      camera={{ position: [0, 0, 7.8], fov: 35, near: 0.1, far: 100 }}
      dpr={[1, 1.55]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      shadows={false}
    >
      <Brain {...props} />
    </Canvas>
  );
}
