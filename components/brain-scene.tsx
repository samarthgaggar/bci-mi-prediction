"use client";

import { Sparkles } from "@react-three/drei";
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

function seeded(index: number) {
  const value = Math.sin(index * 144.31 + 17.73) * 43758.5453;
  return value - Math.floor(value);
}

type PulsePath = readonly [THREE.Vector3, THREE.Vector3, THREE.Vector3];

function pushSegment(
  segments: number[],
  start: THREE.Vector3,
  end: THREE.Vector3,
) {
  segments.push(start.x, start.y, start.z, end.x, end.y, end.z);
}

function createNeuronField() {
  const somas: THREE.Vector3[] = [];
  const terminals: THREE.Vector3[] = [];
  const pulsePaths: PulsePath[] = [];
  const segments: number[] = [];

  for (let neuron = 0; neuron < 24; neuron += 1) {
    const depth = -3.8 - neuron * 2.55;
    const spread = 1.55 + seeded(neuron * 13 + 1) * 1.25;
    const soma = new THREE.Vector3(
      (seeded(neuron * 13 + 2) - 0.5) * spread * 2,
      (seeded(neuron * 13 + 3) - 0.5) * spread * 1.35,
      depth,
    );
    somas.push(soma);

    const branchCount = 7 + (neuron % 3);
    for (let branch = 0; branch < branchCount; branch += 1) {
      const angle =
        (branch / branchCount) * Math.PI * 2 +
        seeded(neuron * 31 + branch) * 0.36;
      const rise =
        (seeded(neuron * 41 + branch + 4) - 0.5) * 0.58;
      const length = 0.72 + seeded(neuron * 47 + branch + 8) * 0.62;
      const direction = new THREE.Vector3(
        Math.cos(angle),
        Math.sin(angle) * 0.82,
        rise,
      ).normalize();
      let previous = soma;

      for (let joint = 1; joint <= 3; joint += 1) {
        const bend = new THREE.Vector3(
          Math.sin(angle + joint * 0.85) * 0.09 * joint,
          Math.cos(angle - joint * 0.63) * 0.07 * joint,
          (seeded(neuron * 97 + branch * 5 + joint) - 0.5) * 0.16,
        );
        const point = soma
          .clone()
          .addScaledVector(direction, (length * joint) / 3)
          .add(bend);
        pushSegment(segments, previous, point);
        previous = point;
      }

      terminals.push(previous);
      if (branch % 2 === 0) {
        const forkA = previous.clone().add(
          new THREE.Vector3(
            Math.cos(angle + 0.72) * 0.25,
            Math.sin(angle + 0.72) * 0.21,
            -0.08,
          ),
        );
        const forkB = previous.clone().add(
          new THREE.Vector3(
            Math.cos(angle - 0.72) * 0.23,
            Math.sin(angle - 0.72) * 0.2,
            0.08,
          ),
        );
        pushSegment(segments, previous, forkA);
        pushSegment(segments, previous, forkB);
      }
    }

    const control = soma.clone().add(
      new THREE.Vector3(
        (seeded(neuron * 17 + 6) - 0.5) * 0.8,
        (seeded(neuron * 17 + 7) - 0.5) * 0.6,
        -1.25,
      ),
    );
    const axonEnd = control.clone().add(
      new THREE.Vector3(
        (seeded(neuron * 19 + 9) - 0.5) * 0.7,
        (seeded(neuron * 19 + 10) - 0.5) * 0.55,
        -1.4 - seeded(neuron * 19 + 11) * 0.8,
      ),
    );
    pushSegment(segments, soma, control);
    pushSegment(segments, control, axonEnd);
    pulsePaths.push([soma, control, axonEnd]);
  }

  return {
    somas,
    terminals: terminals.filter((_, index) => index % 5 === 0),
    pulsePaths,
    segments: new Float32Array(segments),
  };
}

function NeuralPulses({
  paths,
  motionEnabled,
}: {
  paths: PulsePath[];
  motionEnabled: boolean;
}) {
  const pulses = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!pulses.current) return;
    pulses.current.children.forEach((child, index) => {
      const speed = motionEnabled ? 0.2 + (index % 4) * 0.04 : 0;
      const t = motionEnabled ? (clock.elapsedTime * speed + index * 0.17) % 1 : 0.5;
      const path = paths[index];
      if (t < 0.5) {
        child.position.lerpVectors(path[0], path[1], t * 2);
      } else {
        child.position.lerpVectors(path[1], path[2], (t - 0.5) * 2);
      }
      const pulse = 0.72 + Math.sin(t * Math.PI) * 0.75;
      child.scale.setScalar(pulse);
    });
  });

  return (
    <group ref={pulses}>
      {paths.map((path, index) => (
        <mesh key={index} position={path[0]}>
          <sphereGeometry args={[0.085, 14, 14]} />
          <meshBasicMaterial
            color={index % 4 === 0 ? "#ffd27d" : "#91e9ff"}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function InteriorWorld({
  progress,
  dark,
  motionEnabled,
}: BrainSceneProps) {
  const group = useRef<THREE.Group>(null);
  const { somas, terminals, pulsePaths, segments } = useMemo(
    () => createNeuronField(),
    [],
  );
  const opacity = Math.min(
    range(progress, 0.105, 0.255),
    1 - range(progress, 0.91, 0.975),
  );
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
          color={dark ? "#f28ca8" : "#a5365a"}
          transparent
          opacity={opacity * (dark ? 0.72 : 0.5)}
          depthWrite={false}
        />
      </lineSegments>

      {somas.map((soma, index) => (
        <group key={index} position={soma}>
          <mesh>
            <sphereGeometry args={[0.19 + (index % 3) * 0.015, 18, 18]} />
            <meshBasicMaterial
              color={index % 5 === 0 ? "#ffb1a8" : "#ee7898"}
              transparent
              opacity={opacity * 0.96}
              toneMapped={false}
            />
          </mesh>
          <mesh scale={0.42}>
            <sphereGeometry args={[0.19, 14, 14]} />
            <meshBasicMaterial
              color="#7f2148"
              transparent
              opacity={opacity * 0.9}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      {terminals.map((terminal, index) => (
        <mesh key={index} position={terminal}>
          <sphereGeometry args={[0.045, 9, 9]} />
          <meshBasicMaterial
            color={index % 4 === 0 ? "#ffd17d" : "#f7a3b8"}
            transparent
            opacity={opacity * 0.78}
            toneMapped={false}
          />
        </mesh>
      ))}

      <NeuralPulses
        paths={pulsePaths.filter((_, index) => index % 2 === 0)}
        motionEnabled={motionEnabled}
      />
      <Sparkles
        count={size.width < 768 ? 48 : 120}
        scale={[7, 5.5, 66]}
        position={[0, 0, -34]}
        size={size.width < 768 ? 1.2 : 1.65}
        speed={motionEnabled ? 0.2 : 0}
        opacity={opacity * (dark ? 0.6 : 0.34)}
        color="#ffd4df"
        noise={1.1}
      />
    </group>
  );
}

function CameraSequence({
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
      <CameraSequence
        progress={props.progress}
        motionEnabled={props.motionEnabled}
      />
      <InteriorWorld {...props} />
    </>
  );
}

export default function BrainScene(props: BrainSceneProps) {
  return (
    <Canvas
      aria-label="A proportional pink anatomical brain transitions into branching neuron networks as the BCI research sections progress"
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
