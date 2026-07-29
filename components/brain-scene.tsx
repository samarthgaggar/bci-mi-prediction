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

type CameraFrame = {
  at: number;
  position: readonly [number, number, number];
  target: readonly [number, number, number];
};

const cameraFrames: readonly CameraFrame[] = [
  { at: 0, position: [0, 0, 8.1], target: [0, 0, 0] },
  { at: 0.055, position: [0, 0, 7.7], target: [0.4, 0.15, 0] },
  { at: 0.19, position: [0.65, 0.2, 3.4], target: [0.55, 0.18, 0] },
  { at: 0.255, position: [0.56, 0.16, 1.25], target: [0.5, 0.1, -2] },
  { at: 0.31, position: [0.25, 0.05, -7], target: [0, 0, -12] },
  { at: 0.39, position: [-0.8, 0.35, -14], target: [0.4, 0, -19] },
  { at: 0.47, position: [0.9, -0.2, -21], target: [-0.4, 0.1, -26] },
  { at: 0.55, position: [-0.65, 0.35, -28], target: [0.45, -0.1, -33] },
  { at: 0.63, position: [0.85, -0.3, -35], target: [-0.35, 0.1, -40] },
  { at: 0.71, position: [-0.85, 0.2, -42], target: [0.35, 0, -47] },
  { at: 0.79, position: [0.75, -0.25, -49], target: [-0.4, 0.1, -54] },
  { at: 0.87, position: [-0.5, 0.2, -56], target: [0.2, 0, -61] },
  { at: 0.915, position: [0, 0, -47], target: [0, 0, -39] },
  { at: 0.955, position: [0.35, 0.05, -2.3], target: [0, 0, 0] },
  { at: 1, position: [0, 0, 8.4], target: [0, 0, 0] },
] as const;

function clamp01(value: number) {
  return THREE.MathUtils.clamp(value, 0, 1);
}

function range(value: number, start: number, end: number) {
  return clamp01((value - start) / (end - start));
}

function ease(value: number) {
  const clamped = clamp01(value);
  return clamped * clamped * (3 - 2 * clamped);
}

function makeBrainGeometry(side: -1 | 1) {
  const geometry = new THREE.IcosahedronGeometry(1.72, 6);
  const position = geometry.attributes.position;
  const vector = new THREE.Vector3();

  for (let index = 0; index < position.count; index += 1) {
    vector.fromBufferAttribute(position, index);
    const radius = vector.length();
    const fold =
      Math.sin(vector.y * 10.8 + side * 0.7) *
      Math.cos(vector.z * 12.4) *
      Math.sin(vector.x * 14.8);
    const smallFold = Math.sin((vector.y - vector.z) * 19) * 0.027;
    vector.normalize().multiplyScalar(radius * (1 + fold * 0.073 + smallFold));
    vector.x *= 0.66;
    vector.y *= 1.04;
    vector.z *= 0.88;
    position.setXYZ(index, vector.x, vector.y, vector.z);
  }

  geometry.computeVertexNormals();
  return geometry;
}

function Hemisphere({
  side,
  opacity,
  dark,
}: {
  side: -1 | 1;
  opacity: number;
  dark: boolean;
}) {
  const geometry = useMemo(() => makeBrainGeometry(side), [side]);
  const glow = dark ? "#8dc7ff" : "#2d79d9";

  return (
    <group
      position={[side * 0.61, 0.08, 0]}
      rotation={[0.035, side * -0.065, side * 0.025]}
    >
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color={dark ? "#6eaafa" : "#b9ddff"}
          emissive="#285fb8"
          emissiveIntensity={dark ? 0.62 : 0.22}
          roughness={0.16}
          metalness={0.02}
          clearcoat={1}
          clearcoatRoughness={0.13}
          transparent
          opacity={opacity * (dark ? 0.43 : 0.58)}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh geometry={geometry} scale={1.012}>
        <meshBasicMaterial
          color={glow}
          wireframe
          transparent
          opacity={opacity * (dark ? 0.24 : 0.15)}
          depthWrite={false}
        />
      </mesh>
      <mesh geometry={geometry} scale={1.03}>
        <meshBasicMaterial
          color="#e9f7ff"
          transparent
          opacity={opacity * 0.055}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

const exteriorPaths = [
  [
    [-1.6, 0.95, 0.35],
    [-0.9, 1.5, 0.8],
    [-0.05, 1.28, 1.18],
    [0.82, 0.95, 1.08],
    [1.52, 0.2, 0.45],
  ],
  [
    [-1.45, -0.18, 1],
    [-0.72, 0.25, 1.42],
    [0.05, 0.12, 1.62],
    [0.8, -0.35, 1.28],
    [1.38, -0.85, 0.56],
  ],
  [
    [-1.25, 0.28, -1.06],
    [-0.58, 0.78, -1.29],
    [0.12, 1.08, -1.42],
    [0.8, 0.65, -1.14],
    [1.42, 0.05, -0.72],
  ],
] as const;

function ExteriorSignals({
  opacity,
  dark,
  motionEnabled,
}: {
  opacity: number;
  dark: boolean;
  motionEnabled: boolean;
}) {
  const pulses = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!pulses.current || !motionEnabled) return;
    pulses.current.children.forEach((child, index) => {
      const pulse = 0.75 + Math.sin(clock.elapsedTime * 2.4 + index * 1.35) * 0.38;
      child.scale.setScalar(pulse);
    });
  });

  return (
    <>
      {exteriorPaths.map((points, index) => (
        <Line
          key={index}
          points={points.map((point) => new THREE.Vector3(...point))}
          color={index === 1 ? "#ffcf78" : dark ? "#b8e7ff" : "#1768ca"}
          lineWidth={dark ? 1.4 : 1.1}
          transparent
          opacity={opacity * 0.82}
        />
      ))}
      <group ref={pulses}>
        {exteriorPaths.flatMap((path, pathIndex) =>
          path.slice(1, -1).map((point, pointIndex) => (
            <mesh key={`${pathIndex}-${pointIndex}`} position={point}>
              <sphereGeometry args={[0.06, 14, 14]} />
              <meshBasicMaterial
                color={pathIndex === 1 ? "#ffd67e" : "#d6f5ff"}
                transparent
                opacity={opacity}
              />
            </mesh>
          )),
        )}
      </group>
    </>
  );
}

function OuterBrain({
  progress,
  dark,
  motionEnabled,
}: BrainSceneProps) {
  const group = useRef<THREE.Group>(null);
  const { size } = useThree();
  const entering = ease(range(progress, 0.05, 0.28));
  const returning = ease(range(progress, 0.91, 1));
  const opacity = Math.max(1 - range(progress, 0.245, 0.31), returning);
  const scale = 0.96 + entering * 0.06;

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const heroShift =
      size.width >= 980 ? 1.35 * (1 - range(progress, 0.045, 0.16)) : 0;
    const returnShift =
      size.width >= 980 ? 0.55 * range(progress, 0.965, 1) : 0;
    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      Math.max(heroShift, returnShift),
      0.08,
    );
    if (motionEnabled) {
      const direction = progress < 0.5 ? 1 : -1;
      group.current.rotation.y += delta * 0.08 * direction;
      group.current.rotation.z = Math.sin(clock.elapsedTime * 0.24) * 0.022;
    }
  });

  if (opacity <= 0.002) return null;

  return (
    <group ref={group} scale={scale}>
      <Hemisphere side={-1} opacity={opacity} dark={dark} />
      <Hemisphere side={1} opacity={opacity} dark={dark} />
      <mesh position={[0, 0.02, 1.54]} scale={[0.055, 1.55, 0.05]}>
        <sphereGeometry args={[1, 20, 20]} />
        <meshBasicMaterial
          color="#f4fbff"
          transparent
          opacity={opacity * 0.92}
          depthWrite={false}
        />
      </mesh>
      <ExteriorSignals
        opacity={opacity}
        dark={dark}
        motionEnabled={motionEnabled}
      />
      <Sparkles
        count={96}
        scale={[5.4, 4.4, 4]}
        size={2}
        speed={motionEnabled ? 0.2 : 0}
        opacity={opacity * (dark ? 0.8 : 0.48)}
        color={dark ? "#d9f2ff" : "#2462b8"}
        noise={0.75}
      />
    </group>
  );
}

function seeded(index: number) {
  const value = Math.sin(index * 144.31 + 17.73) * 43758.5453;
  return value - Math.floor(value);
}

function createNetwork() {
  const nodes: THREE.Vector3[] = [];
  for (let index = 0; index < 82; index += 1) {
    const z = -5 - seeded(index * 3 + 1) * 61;
    const spread = 2.1 + Math.sin(Math.abs(z) * 0.22) * 0.75;
    nodes.push(
      new THREE.Vector3(
        (seeded(index * 3 + 2) - 0.5) * spread * 2,
        (seeded(index * 3 + 3) - 0.5) * spread * 1.55,
        z,
      ),
    );
  }
  nodes.sort((a, b) => b.z - a.z);

  const segments: number[] = [];
  nodes.forEach((node, index) => {
    const candidates = nodes
      .slice(index + 1, Math.min(nodes.length, index + 7))
      .sort((a, b) => node.distanceTo(a) - node.distanceTo(b))
      .slice(0, index % 3 === 0 ? 2 : 1);
    candidates.forEach((target) => {
      segments.push(node.x, node.y, node.z, target.x, target.y, target.z);
    });
  });

  return {
    nodes,
    segments: new Float32Array(segments),
  };
}

function SignalTravel({
  nodes,
  motionEnabled,
}: {
  nodes: THREE.Vector3[];
  motionEnabled: boolean;
}) {
  const pulses = useRef<THREE.Group>(null);
  const paths = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => {
        const startIndex = (index * 6) % (nodes.length - 5);
        return [nodes[startIndex], nodes[startIndex + 3 + (index % 2)]];
      }),
    [nodes],
  );

  useFrame(({ clock }) => {
    if (!pulses.current) return;
    pulses.current.children.forEach((child, index) => {
      const speed = motionEnabled ? 0.22 + (index % 4) * 0.045 : 0;
      const t = motionEnabled ? (clock.elapsedTime * speed + index * 0.17) % 1 : 0.5;
      child.position.lerpVectors(paths[index][0], paths[index][1], t);
      const pulse = 0.72 + Math.sin(t * Math.PI) * 0.75;
      child.scale.setScalar(pulse);
    });
  });

  return (
    <group ref={pulses}>
      {paths.map((path, index) => (
        <mesh key={index} position={path[0]}>
          <sphereGeometry args={[0.095, 14, 14]} />
          <meshBasicMaterial
            color={index % 5 === 0 ? "#ffbb68" : "#b6f1ff"}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

const stationDepths = [-8, -15, -22, -29, -36, -43, -50, -57];

function InteriorWorld({
  progress,
  dark,
  motionEnabled,
}: BrainSceneProps) {
  const group = useRef<THREE.Group>(null);
  const { nodes, segments } = useMemo(() => createNetwork(), []);
  const opacity = Math.min(range(progress, 0.24, 0.31), 1 - range(progress, 0.9, 0.97));
  const { size } = useThree();

  useFrame(({ clock }) => {
    if (!group.current || !motionEnabled) return;
    group.current.rotation.z = Math.sin(clock.elapsedTime * 0.12) * 0.018;
  });

  if (opacity <= 0.002) return null;

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[segments, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color={dark ? "#52b9ff" : "#176fc8"}
          transparent
          opacity={opacity * (dark ? 0.34 : 0.25)}
          depthWrite={false}
        />
      </lineSegments>

      {nodes.map((node, index) => (
        <mesh key={index} position={node}>
          <sphereGeometry args={[index % 7 === 0 ? 0.12 : 0.065, 10, 10]} />
          <meshBasicMaterial
            color={index % 9 === 0 ? "#ffbc6c" : "#a6e4ff"}
            transparent
            opacity={opacity * (index % 7 === 0 ? 0.95 : 0.68)}
            toneMapped={false}
          />
        </mesh>
      ))}

      {stationDepths.map((depth, index) => (
        <group key={depth} position={[0, 0, depth]}>
          <mesh rotation={[0, 0, index * 0.42]}>
            <torusGeometry args={[3.25, 0.018, 8, 96, Math.PI * 1.52]} />
            <meshBasicMaterial
              color={index % 3 === 0 ? "#ffc46f" : "#79d4ff"}
              transparent
              opacity={opacity * 0.43}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[2.7, index % 2 === 0 ? 0.7 : -0.65, 0]}>
            <sphereGeometry args={[0.15, 14, 14]} />
            <meshBasicMaterial
              color={index % 3 === 0 ? "#ffd289" : "#d4f5ff"}
              transparent
              opacity={opacity}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      <SignalTravel nodes={nodes} motionEnabled={motionEnabled} />
      <Sparkles
        count={size.width < 768 ? 58 : 180}
        scale={[7, 5.5, 66]}
        position={[0, 0, -34]}
        size={size.width < 768 ? 1.35 : 1.8}
        speed={motionEnabled ? 0.24 : 0}
        opacity={opacity * (dark ? 0.72 : 0.4)}
        color="#9bddff"
        noise={1.1}
      />
    </group>
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
  const currentTarget = useRef(new THREE.Vector3());

  useFrame(() => {
    const clamped = clamp01(progress);
    let endIndex = cameraFrames.findIndex((frame) => frame.at >= clamped);
    if (endIndex < 0) endIndex = cameraFrames.length - 1;
    const startIndex = Math.max(0, endIndex - 1);
    const start = cameraFrames[startIndex];
    const end = cameraFrames[endIndex];
    const local = start.at === end.at ? 0 : ease((clamped - start.at) / (end.at - start.at));
    const mobile = size.width < 768;

    const desiredPosition = new THREE.Vector3(...start.position)
      .lerp(new THREE.Vector3(...end.position), local);
    const desiredTarget = new THREE.Vector3(...start.target).lerp(
      new THREE.Vector3(...end.target),
      local,
    );

    if (mobile && clamped > 0.3 && clamped < 0.91) {
      desiredPosition.x *= 0.5;
      desiredPosition.y *= 0.5;
    }

    camera.position.lerp(desiredPosition, motionEnabled ? 0.065 : 0.2);
    currentTarget.current.lerp(desiredTarget, motionEnabled ? 0.08 : 0.25);
    camera.lookAt(currentTarget.current);
  });

  return null;
}

function BrainWorld(props: BrainSceneProps) {
  return (
    <>
      <CameraJourney
        progress={props.progress}
        motionEnabled={props.motionEnabled}
      />
      <ambientLight intensity={props.dark ? 0.42 : 1.1} />
      <directionalLight
        position={[3, 4, 7]}
        intensity={props.dark ? 3.1 : 4.2}
        color="#edf9ff"
      />
      <pointLight
        position={[-4, 1, 4]}
        intensity={props.dark ? 3.8 : 2.2}
        color="#368dff"
      />
      <pointLight
        position={[4, -1, 2]}
        intensity={props.dark ? 2.4 : 1.6}
        color="#ff9e65"
      />
      <OuterBrain {...props} />
      <InteriorWorld {...props} />
    </>
  );
}

export default function BrainScene(props: BrainSceneProps) {
  return (
    <Canvas
      aria-label="A luminous brain opens into an animated neural route with eight research stations"
      camera={{ position: [0, 0, 8.1], fov: 36, near: 0.06, far: 130 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      shadows={false}
    >
      <BrainWorld {...props} />
    </Canvas>
  );
}
