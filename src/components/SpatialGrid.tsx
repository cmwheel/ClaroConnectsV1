"use client";

import { useRef, useMemo, useState, MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

const GRID = 28;
const SPACING = 1.4;
const NODE_COUNT = GRID * GRID;
const WAVE_SPEED = 0.34;
const WAVE_XZ_FACTOR = 0.24;
const WAVE_HEIGHT = 0.09;
const ROUTE_STEPS: [number, number][] = [
  [9, 8],
  [10, 9],
  [11, 10],
  [12, 11],
  [13, 12],
  [14, 13],
  [14, 14],
  [15, 15],
  [16, 16],
  [17, 17],
  [18, 18],
  [18, 19],
  [19, 20],
];

function idx(row: number, col: number) {
  return row * GRID + col;
}

function easedProgress(progress: number, start: number, end: number) {
  const t = THREE.MathUtils.clamp((progress - start) / (end - start), 0, 1);
  return t * t * (3 - 2 * t);
}

function gridWave(time: number, x: number, z: number) {
  return Math.sin(time * WAVE_SPEED + x * WAVE_XZ_FACTOR + z * WAVE_XZ_FACTOR) * WAVE_HEIGHT;
}

function GridNodes({
  scrollRef,
}: {
  scrollRef: MutableRefObject<number>;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const clock = useRef(0);

  const basePositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    const offset = ((GRID - 1) * SPACING) / 2;
    for (let i = 0; i < GRID; i++) {
      for (let j = 0; j < GRID; j++) {
        positions.push([i * SPACING - offset, 0, j * SPACING - offset]);
      }
    }
    return positions;
  }, []);

  const { leftSite, rightSite, pathNodes } = useMemo(() => {
    const left = [idx(8, 6), idx(8, 7), idx(9, 6), idx(9, 7), idx(10, 7)];
    const right = [
      idx(19, 21),
      idx(19, 22),
      idx(20, 21),
      idx(20, 22),
      idx(18, 20),
      idx(21, 22),
    ];

    const path: number[] = [];
    for (const [r, c] of ROUTE_STEPS) {
      path.push(idx(r, c));
    }

    return { leftSite: new Set(left), rightSite: new Set(right), pathNodes: path };
  }, []);

  const ambientGreen = useMemo(() => {
    const indices = new Set<number>();
    for (let cursor = 0; indices.size < 10 && cursor < NODE_COUNT * 3; cursor++) {
      const row = (cursor * 7 + 3) % GRID;
      const col = (cursor * 11 + 5) % GRID;
      const candidate = idx(row, col);
      if (
        !leftSite.has(candidate) &&
        !rightSite.has(candidate) &&
        !pathNodes.includes(candidate)
      ) {
        indices.add(candidate);
      }
    }
    return indices;
  }, [leftSite, rightSite, pathNodes]);

  const heatmapCenters = useMemo(
    () => [
      { x: 8.5 * SPACING - ((GRID - 1) * SPACING) / 2, z: 6.5 * SPACING - ((GRID - 1) * SPACING) / 2, radius: 6.5, color: new THREE.Color("#2ECC71") },
      { x: 18 * SPACING - ((GRID - 1) * SPACING) / 2, z: 18 * SPACING - ((GRID - 1) * SPACING) / 2, radius: 5.5, color: new THREE.Color("#ff8a33") },
      { x: 14 * SPACING - ((GRID - 1) * SPACING) / 2, z: 14 * SPACING - ((GRID - 1) * SPACING) / 2, radius: 4.5, color: new THREE.Color("#3ddf85") },
    ],
    []
  );

  const baseColor = useMemo(() => new THREE.Color("#808080"), []);
  const greenColor = useMemo(() => new THREE.Color("#2ECC71"), []);
  const dimColor = useMemo(() => new THREE.Color("#d4d4d4"), []);
  const brightGreen = useMemo(() => new THREE.Color("#3ddf85"), []);
  const orangeColor = useMemo(() => new THREE.Color("#ff8a33"), []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    clock.current += delta;
    const p = scrollRef.current;

    const leftActivation = easedProgress(p, 0.08, 0.26);
    const pathActivation = easedProgress(p, 0.2, 0.72);
    const rightActivation = easedProgress(p, 0.5, 0.82);
    const routeSettled = easedProgress(p, 0.66, 0.92);

    for (let i = 0; i < NODE_COUNT; i++) {
      const [x, baseY, z] = basePositions[i];
      const wave = gridWave(clock.current, x, z);
      dummy.position.set(x, baseY + wave, z);

      const isLeft = leftSite.has(i);
      const isRight = rightSite.has(i);
      const pathIdx = pathNodes.indexOf(i);
      const isPath = pathIdx !== -1;
      const isAmbient = ambientGreen.has(i);

      if (isLeft) {
        const activation = leftActivation;
        const pulse =
          activation > 0.1
            ? 0.5 + 0.5 * Math.sin(clock.current * 2.2 + i * 0.26)
            : 0;
        const s = 0.09 + activation * 0.12 + pulse * activation * 0.04;
        dummy.scale.setScalar(s);
        const color = dimColor
          .clone()
          .lerp(brightGreen, activation * (0.68 + pulse * 0.32));
        meshRef.current.setColorAt(i, color);
      } else if (isRight) {
        const activation = rightActivation;
        const pulse =
          activation > 0.1
            ? 0.5 + 0.5 * Math.sin(clock.current * 2.2 + i * 0.26)
            : 0;
        const s = 0.09 + activation * 0.12 + pulse * activation * 0.04;
        dummy.scale.setScalar(s);
        const color = dimColor
          .clone()
          .lerp(brightGreen, activation * (0.68 + pulse * 0.32));
        meshRef.current.setColorAt(i, color);
      } else if (isPath) {
        const nodeProgress = pathIdx / pathNodes.length;
        const activation = easedProgress(pathActivation, nodeProgress * 0.75, nodeProgress * 0.75 + 0.24);
        const pulse =
          activation > 0.4
            ? 0.35 + 0.35 * Math.sin(clock.current * 2.8 + pathIdx * 0.7)
            : 0;
        const s = 0.08 + activation * 0.09 + pulse * activation * 0.02;
        dummy.scale.setScalar(s);
        const color = dimColor
          .clone()
          .lerp(greenColor, activation * (0.6 + pulse * 0.4));
        meshRef.current.setColorAt(i, color);
      } else if (isAmbient) {
        const ambientPulse = 0.5 + 0.5 * Math.sin(clock.current * 1.6 + i * 0.45);
        const ambientScale = 0.09 + ambientPulse * 0.04;
        const fade = 1 - p * 0.3;
        dummy.scale.setScalar(ambientScale * Math.max(0.3, fade));
        const color = dimColor
          .clone()
          .lerp(greenColor, ambientPulse * 0.45 * Math.max(0.2, fade));
        meshRef.current.setColorAt(i, color);
      } else {
        const dist = Math.sqrt(x * x + z * z);
        const fade = Math.max(0.3, 1 - dist / 22);
        const heatActivation = easedProgress(p, 0.3, 0.85);
        let heatIntensity = 0;
        const heatColor = dimColor.clone();

        for (const center of heatmapCenters) {
          const dx = x - center.x;
          const dz = z - center.z;
          const d = Math.sqrt(dx * dx + dz * dz);
          const influence = Math.max(0, 1 - d / center.radius);
          const shaped = influence * influence;
          if (shaped > heatIntensity) {
            heatIntensity = shaped;
            heatColor.copy(center.color);
          }
        }

        const pulse = 0.85 + 0.15 * Math.sin(clock.current * 1.4 + x * 0.2 + z * 0.2);
        const heatBlend = heatIntensity * heatActivation * pulse;
        const baseScale = (0.06 + routeSettled * 0.02 + heatBlend * 0.06) * fade;
        dummy.scale.setScalar(baseScale);
        const color = dimColor.clone().lerp(baseColor, fade).lerp(heatColor, heatBlend * 0.7);
        meshRef.current.setColorAt(i, color);
      }

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor)
      meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, NODE_COUNT]}>
      <boxGeometry args={[1, 0.35, 1]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

function SiteCells({
  scrollRef,
}: {
  scrollRef: MutableRefObject<number>;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const clock = useRef(0);

  const cellDefs = useMemo(
    () => [
      { row: 8, col: 6, type: "primary" as const },
      { row: 12, col: 11, type: "secondary" as const, order: 0 },
      { row: 16, col: 16, type: "secondary" as const, order: 1 },
      { row: 13, col: 9, type: "candidate" as const, phase: 0.2 },
      { row: 17, col: 14, type: "candidate" as const, phase: 0.6 },
      { row: 18, col: 18, type: "keyCandidate" as const, phase: 0.7 },
    ],
    []
  );

  const colors = useMemo(
    () => ({
      dark: new THREE.Color("#d8d8d8"),
      green: new THREE.Color("#2ECC71"),
      orange: new THREE.Color("#ff7a1a"),
    }),
    []
  );

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    clock.current += delta;
    const p = scrollRef.current;

    const offset = ((GRID - 1) * SPACING) / 2;
    const primaryActivation = easedProgress(p, 0.08, 0.26);
    const routeActivation = easedProgress(p, 0.2, 0.74);
    const settleActivation = easedProgress(p, 0.64, 0.92);

    cellDefs.forEach((cell, i) => {
      const x = (cell.row + 0.5) * SPACING - offset;
      const z = (cell.col + 0.5) * SPACING - offset;
      const baseWave = gridWave(clock.current, x, z) * 0.7;

      let activation = 0;
      let color = colors.dark.clone();
      let scale = 0.45;

      if (cell.type === "primary") {
        const pulse = 0.5 + 0.5 * Math.sin(clock.current * 2.4);
        activation = primaryActivation;
        scale = 0.54 + activation * 0.28 + pulse * activation * 0.08;
        color = colors.dark
          .clone()
          .lerp(colors.green, activation * (0.72 + pulse * 0.28));
      } else if (cell.type === "secondary") {
        const stagger = (cell.order ?? 0) * 0.22;
        activation = easedProgress(routeActivation, 0.28 + stagger, 0.56 + stagger);
        const pulse =
          activation > 0.45 ? 0.5 + 0.5 * Math.sin(clock.current * 2 + i) : 0;
        scale = 0.45 + activation * 0.26 + pulse * activation * 0.06;
        color = colors.dark
          .clone()
          .lerp(colors.green, activation * (0.62 + pulse * 0.38));
      } else if (cell.type === "keyCandidate") {
        const phase = cell.phase ?? 0;
        activation = easedProgress(p, 0.14, 0.82);
        const glow = 0.5 + 0.5 * Math.sin(clock.current * 2.2 + phase * Math.PI);
        scale = 0.65 + settleActivation * 0.3 + glow * activation * 0.12;
        color = colors.dark
          .clone()
          .lerp(colors.orange, activation * (0.7 + glow * 0.3));
      } else {
        const phase = cell.phase ?? 0;
        activation = easedProgress(p, 0.16 + phase * 0.04, 0.92);
        const glow = 0.45 + 0.55 * Math.sin(clock.current * 1.8 + phase * Math.PI * 1.6);
        scale = 0.4 + settleActivation * 0.18 + glow * activation * 0.07;
        color = colors.dark
          .clone()
          .lerp(colors.orange, activation * (0.46 + glow * 0.54));
      }

      dummy.position.set(x, -0.05 + baseWave, z);
      dummy.rotation.set(-Math.PI / 2, 0, 0);
      dummy.scale.set(scale, scale, 1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, cellDefs.length]}>
      <planeGeometry args={[SPACING * 0.92, SPACING * 0.92]} />
      <meshBasicMaterial toneMapped={false} transparent opacity={0.95} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

function HudLabels({
  scrollRef,
}: {
  scrollRef: MutableRefObject<number>;
}) {
  const offset = ((GRID - 1) * SPACING) / 2;
  const clock = useRef(0);

  const simpleLabels = useMemo(
    () => [
      {
        row: 8,
        col: 6,
        text: "Optimal Hub",
        sub: "Score 94.2",
        scrollStart: 0.08,
        scrollEnd: 0.26,
        type: "primary" as const,
      },
      {
        row: 12,
        col: 11,
        text: "Charging Depot",
        sub: "Operational",
        scrollStart: 0.28,
        scrollEnd: 0.52,
        type: "secondary" as const,
      },
      {
        row: 16,
        col: 16,
        text: "Charging Depot",
        sub: "Operational",
        scrollStart: 0.36,
        scrollEnd: 0.58,
        type: "secondary" as const,
      },
    ],
    []
  );

  const [labelOpacities, setLabelOpacities] = useState(() =>
    simpleLabels.map(() => 0)
  );

  useFrame((_, delta) => {
    clock.current += delta;
    const p = scrollRef.current;
    setLabelOpacities(
      simpleLabels.map((l) => easedProgress(p, l.scrollStart, l.scrollEnd))
    );
  });

  return (
    <>
      {simpleLabels.map((label, i) => {
        const x = (label.row + 0.5) * SPACING - offset;
        const z = (label.col + 0.5) * SPACING - offset;
        const wave = gridWave(clock.current, x, z);
        const opacity = labelOpacities[i];
        if (opacity < 0.02) return null;

        const isPrimary = label.type === "primary";

        return (
          <Html
            key={i}
            position={[x, 1.8 + wave, z]}
            center
            distanceFactor={isPrimary ? 14 : 18}
            style={{
              opacity,
              transition: "opacity 0.15s",
              pointerEvents: "none",
            }}
          >
            <div className="flex items-center gap-2 rounded-[2px] border border-[#2ECC71]/40 bg-white/75 px-3 py-2 shadow-sm backdrop-blur-sm">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full bg-[#2ECC71]"
                style={{ boxShadow: "0 0 4px #2ECC71" }}
              />
              <div className="flex flex-col leading-none">
                <span
                  className={`whitespace-nowrap font-semibold text-[#1A1A1A] ${
                    isPrimary ? "text-[12px]" : "text-[10px]"
                  }`}
                >
                  {label.text}
                </span>
                <span
                  className={`whitespace-nowrap text-[#6B6B6B] ${
                    isPrimary ? "text-[9px]" : "text-[8px]"
                  }`}
                >
                  {label.sub}
                </span>
              </div>
            </div>
          </Html>
        );
      })}
    </>
  );
}

function VehicleTrails({
  scrollRef,
}: {
  scrollRef: MutableRefObject<number>;
}) {
  const VEHICLE_COUNT = 3;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const clock = useRef(0);

  const routePositions = useMemo(() => {
    const offset = ((GRID - 1) * SPACING) / 2;
    const steps: [number, number][] = [
      [8, 6],
      [8, 7],
      [9, 7],
      ...ROUTE_STEPS,
      [19, 21],
    ];
    return steps.map(([r, c]) => [r * SPACING - offset, c * SPACING - offset] as [number, number]);
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    clock.current += delta;
    const p = scrollRef.current;
    const pathActivation = easedProgress(p, 0.22, 0.78);

    for (let v = 0; v < VEHICLE_COUNT; v++) {
      const phase = v / VEHICLE_COUNT;
      const speed = 0.06 + v * 0.012;
      const t = ((clock.current * speed + phase) % 1);
      const totalSegments = routePositions.length - 1;
      const segFloat = t * totalSegments;
      const segIdx = Math.min(Math.floor(segFloat), totalSegments - 1);
      const segFrac = segFloat - segIdx;

      const [x1, z1] = routePositions[segIdx];
      const [x2, z2] = routePositions[Math.min(segIdx + 1, totalSegments)];
      const x = x1 + (x2 - x1) * segFrac;
      const z = z1 + (z2 - z1) * segFrac;
      const wave = gridWave(clock.current, x, z);

      const visible = pathActivation > 0.15;
      const scale = visible ? 0.07 + Math.sin(clock.current * 1.6 + v) * 0.01 : 0;

      dummy.position.set(x, 0.22 + wave, z);
      dummy.scale.setScalar(scale * pathActivation);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(v, dummy.matrix);

      const glow = 0.8 + 0.2 * Math.sin(clock.current * 2.4 + v * 2);
      const color = new THREE.Color("#2ECC71").multiplyScalar(glow);
      meshRef.current.setColorAt(v, color);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor)
      meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, VEHICLE_COUNT]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

function ConnectionLines({
  scrollRef,
}: {
  scrollRef: MutableRefObject<number>;
}) {
  const lineRef = useRef<THREE.Line>(null);
  const clock = useRef(0);
  const drawProgressRef = useRef(0);

  const { positions, totalPoints } = useMemo(() => {
    const offset = ((GRID - 1) * SPACING) / 2;
    const steps: [number, number][] = [[8, 6], [8, 7], [9, 7], ...ROUTE_STEPS, [19, 21]];
    const pts: number[] = [];

    for (const [r, c] of steps) {
      const x = r * SPACING - offset;
      const z = c * SPACING - offset;
      pts.push(x, 0.2, z);
    }

    return { positions: new Float32Array(pts), totalPoints: steps.length };
  }, []);

  useFrame((_, delta) => {
    if (!lineRef.current) return;
    clock.current += delta;
    const p = scrollRef.current;

    const targetProgress = easedProgress(p, 0.16, 0.78);
    const targetDraw = targetProgress * totalPoints;
    drawProgressRef.current = THREE.MathUtils.lerp(
      drawProgressRef.current,
      targetDraw,
      Math.min(1, delta * 5.2)
    );
    lineRef.current.geometry.setDrawRange(0, Math.max(0, Math.floor(drawProgressRef.current)));

    const posArr = lineRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < totalPoints; i++) {
      const ii = i * 3;
      const x = posArr[ii];
      const z = posArr[ii + 2];
      posArr[ii + 1] = 0.2 + gridWave(clock.current, x, z);
    }
    lineRef.current.geometry.attributes.position.needsUpdate = true;

    const lineMat = lineRef.current.material as THREE.LineBasicMaterial;
    const settle = easedProgress(p, 0.22, 0.88);
    lineMat.opacity = 0.35 + settle * 0.45;
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#2ECC71" transparent opacity={0.6} />
    </line>
  );
}

function GridLines() {
  const linesRef = useRef<THREE.LineSegments>(null);
  const clock = useRef(0);

  const { positions, lineCount } = useMemo(() => {
    const pts: number[] = [];
    const offset = ((GRID - 1) * SPACING) / 2;
    let count = 0;

    for (let i = 0; i < GRID; i++) {
      for (let j = 0; j < GRID; j++) {
        const x = i * SPACING - offset;
        const z = j * SPACING - offset;

        if (j < GRID - 1) {
          pts.push(x, 0, z, x, 0, (j + 1) * SPACING - offset);
          count++;
        }
        if (i < GRID - 1) {
          pts.push(x, 0, z, (i + 1) * SPACING - offset, 0, z);
          count++;
        }
      }
    }

    return { positions: new Float32Array(pts), lineCount: count };
  }, []);

  useFrame((_, delta) => {
    if (!linesRef.current) return;
    clock.current += delta;

    const posArr = linesRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < lineCount; i++) {
      const ii = i * 6;
      const x1 = posArr[ii];
      const z1 = posArr[ii + 2];
      const x2 = posArr[ii + 3];
      const z2 = posArr[ii + 5];

      posArr[ii + 1] = gridWave(clock.current, x1, z1);
      posArr[ii + 4] = gridWave(clock.current, x2, z2);
    }

    linesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#d8d8d8" transparent opacity={0.35} />
    </lineSegments>
  );
}

function CameraRig({
  scrollRef,
}: {
  scrollRef: MutableRefObject<number>;
}) {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime();
    const scrollTurn = easedProgress(scrollRef.current, 0.04, 0.92);

    const yaw = THREE.MathUtils.lerp(-0.1, 0.32, scrollTurn);
    const radius = THREE.MathUtils.lerp(18.6, 17.2, scrollTurn);
    const height = THREE.MathUtils.lerp(14.2, 12.6, scrollTurn);

    const driftX = Math.sin(t * 0.09) * 0.45;
    const driftZ = Math.cos(t * 0.08) * 0.38;
    const driftY = Math.sin(t * 0.12) * 0.15;

    camera.position.x = Math.sin(yaw) * radius + driftX;
    camera.position.y = height + driftY;
    camera.position.z = Math.cos(yaw) * radius + driftZ;

    const lookX = THREE.MathUtils.lerp(-2.4, 2.9, scrollTurn);
    const lookZ = THREE.MathUtils.lerp(-2.5, 2.7, scrollTurn);
    const lookY = THREE.MathUtils.lerp(-1.0, -0.55, scrollTurn);
    camera.lookAt(lookX, lookY, lookZ);
  });
  return null;
}

const CANDIDATE_ROW = 18;
const CANDIDATE_COL = 18;

function CandidateProjector({
  screenRef,
}: {
  screenRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera, size } = useThree();
  const worldPos = useMemo(() => {
    const offset = ((GRID - 1) * SPACING) / 2;
    return new THREE.Vector3(
      (CANDIDATE_ROW + 0.5) * SPACING - offset,
      0,
      (CANDIDATE_COL + 0.5) * SPACING - offset
    );
  }, []);
  const projected = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    projected.copy(worldPos);
    projected.y = gridWave(0, worldPos.x, worldPos.z);
    projected.project(camera);
    screenRef.current = {
      x: (projected.x * 0.5 + 0.5) * size.width,
      y: (-projected.y * 0.5 + 0.5) * size.height,
    };
  });

  return null;
}

export default function SpatialGrid({
  scrollRef,
  candidateScreenRef,
}: {
  scrollRef: MutableRefObject<number>;
  candidateScreenRef: MutableRefObject<{ x: number; y: number }>;
}) {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 14, 18], fov: 45, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <CameraRig scrollRef={scrollRef} />
        <GridNodes scrollRef={scrollRef} />
        <SiteCells scrollRef={scrollRef} />
        <GridLines />
        <ConnectionLines scrollRef={scrollRef} />
        <VehicleTrails scrollRef={scrollRef} />
        <HudLabels scrollRef={scrollRef} />
        <CandidateProjector screenRef={candidateScreenRef} />
      </Canvas>
    </div>
  );
}
