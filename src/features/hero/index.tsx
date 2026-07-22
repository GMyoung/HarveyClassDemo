import { useFrame, type ObjectMap, type ThreeElements } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import {
  CapsuleGeometry,
  Group,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  SRGBColorSpace,
} from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { useSectionsContext } from "@/contexts/Sections";
import { useAnimationHandle, useGLTF, type AnimationHandle } from "@/hooks";
import { getAssetUrl } from "@/util";
import {
  HAIR_TRANSFORMS,
  type CrewHair,
} from "./hairCalibration";

type CrewModel = "Intern" | "Junior";

type CrewMemberProps = {
  model: CrewModel;
  shirt: string;
  trousers: string;
  position: [number, number, number];
  phase: number;
  name: string;
  labelOffsetY: number;
  revealed: boolean;
  charlieBrownShirt?: boolean;
  hair?: CrewHair;
  hairColor?: string;
  showNamePlate?: boolean;
};

type CrewGLTF = GLTF & Partial<ObjectMap>;

const characterMeshNames = new Set([
  "hat",
  "wig",
  "head",
  "hips",
  "torso",
]);
const topMeshNames = new Set(["torso"]);
const bottomMeshNames = new Set(["hips"]);
const getSourceMeshName = (name: string) => name.replace(/_[0-9]+$/, "");
const standingLegGeometry = new RoundedBoxGeometry(0.42, 0.86, 0.5, 5, 0.07);
const standingArmGeometry = new CapsuleGeometry(0.17, 0.5, 8, 16);

const createClothingMaterial = (color: string) =>
  new MeshPhysicalMaterial({
    color,
    roughness: 0.25,
    metalness: 0.015,
    clearcoat: 0.42,
    clearcoatRoughness: 0.38,
  });

const Hairpiece = ({ style, color }: { style: CrewHair; color: string }) => {
  const gltf = useGLTF<CrewGLTF>(getAssetUrl(style));
  const material = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color,
        roughness: 0.24,
        metalness: 0.01,
        clearcoat: 0.55,
        clearcoatRoughness: 0.32,
      }),
    [color],
  );
  const hair = useMemo(() => {
    const clonedScene = clone(gltf.scene) as Group;
    clonedScene.traverse((object) => {
      if (!(object instanceof Mesh)) return;
      object.material = material;
      object.castShadow = true;
      object.receiveShadow = true;
    });
    return clonedScene;
  }, [gltf.scene, material]);
  const transform = HAIR_TRANSFORMS[style];

  return (
    <primitive
      object={hair}
      position={transform.position}
      rotation-y={transform.rotationY}
      scale={transform.scale}
    />
  );
};

const NamePlate = ({ name, offsetY }: { name: string; offsetY: number }) => {
  const canvas = useMemo(() => {
    const node = document.createElement("canvas");
    node.width = 512;
    node.height = 128;
    const context = node.getContext("2d")!;
    context.fillStyle = "#111318";
    context.beginPath();
    context.roundRect(8, 8, 496, 112, 26);
    context.fill();
    context.lineWidth = 8;
    context.strokeStyle = "#ffcf00";
    context.stroke();
    context.fillStyle = "#ffffff";
    context.font = "700 45px system-ui, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(name, 256, 66, 450);
    return node;
  }, [name]);

  return (
    <sprite
      position={[0, 2.8 + offsetY, -0.72]}
      scale={[name.length > 8 ? 1.28 : 0.92, 0.34, 1]}
    >
      <spriteMaterial transparent depthTest={false}>
        <canvasTexture attach="map" args={[canvas]} colorSpace={SRGBColorSpace} />
      </spriteMaterial>
    </sprite>
  );
};

const CharlieBrownStripe = () => (
  <group position={[0, 1.52, -0.492]}>
    {[-0.36, -0.12, 0.12, 0.36].map((x, index) => (
      <mesh
        key={x}
        position={[x, index % 2 === 0 ? 0.035 : -0.035, 0]}
        rotation-z={index % 2 === 0 ? -0.42 : 0.42}
        castShadow
      >
        <boxGeometry args={[0.3, 0.075, 0.025]} />
        <meshPhysicalMaterial color="#101010" roughness={0.34} />
      </mesh>
    ))}
  </group>
);

const StandingArm = ({
  side,
  material,
}: {
  side: -1 | 1;
  material: MeshPhysicalMaterial;
}) => (
  <group position={[side * 0.66, 1.55, -0.73]} rotation-z={side * 0.08}>
    <mesh geometry={standingArmGeometry} material={material} castShadow receiveShadow />
    <mesh position={[0, -0.44, 0]} castShadow>
      <cylinderGeometry args={[0.105, 0.105, 0.17, 24]} />
      <meshPhysicalMaterial color="#f5c443" roughness={0.24} clearcoat={0.4} />
    </mesh>
    <mesh position={[0, -0.56, 0.015]} castShadow>
      <torusGeometry args={[0.105, 0.043, 12, 24, Math.PI * 1.55]} />
      <meshPhysicalMaterial color="#f5c443" roughness={0.24} clearcoat={0.4} />
    </mesh>
  </group>
);

export const CrewMember = ({
  model,
  shirt,
  trousers,
  position,
  phase,
  name,
  labelOffsetY,
  revealed,
  charlieBrownShirt = false,
  hair,
  hairColor = "#21140f",
  showNamePlate = true,
}: CrewMemberProps) => {
  const member = useRef<Group>(null!);
  const gltf = useGLTF<CrewGLTF>(getAssetUrl(model));
  const shirtMaterial = useMemo(() => createClothingMaterial(shirt), [shirt]);
  const trousersMaterial = useMemo(() => createClothingMaterial(trousers), [trousers]);

  const scene = useMemo(() => {
    const clonedScene = clone(gltf.scene) as Group;

    clonedScene.traverse((object) => {
      if (!(object instanceof Mesh)) return;
      const sourceName = getSourceMeshName(object.name);

      // These GLBs contain office furniture and handheld props. Keep only the
      // original minifigure meshes so the source scenes remain untouched.
      object.visible = characterMeshNames.has(sourceName);
      if (sourceName === "hat" || sourceName === "wig") {
        object.visible = !hair;
      }
      if (!object.visible) return;

      object.castShadow = true;
      object.receiveShadow = true;
      if (topMeshNames.has(sourceName)) object.material = shirtMaterial;
      if (bottomMeshNames.has(sourceName)) object.material = trousersMaterial;
    });

    return clonedScene;
  }, [gltf.scene, hair, shirtMaterial, trousersMaterial]);

  useFrame(({ clock }, delta) => {
    const elapsed = clock.getElapsedTime();
    const targetY =
      position[1] + Math.sin(elapsed * 1.35 + phase) * 0.04 + (revealed ? 0 : -3.5);
    member.current.position.y = MathUtils.damp(member.current.position.y, targetY, 6, delta);
    const targetScale = revealed ? 1.12 : 1.04;
    const scale = MathUtils.damp(member.current.scale.x, targetScale, 8, delta);
    member.current.scale.setScalar(scale);
    member.current.rotation.y = MathUtils.damp(
      member.current.rotation.y,
      Math.sin(elapsed * 0.48 + phase) * 0.04,
      4,
      delta,
    );
  });

  return (
    <group ref={member} position={[position[0], position[1] - 3.5, position[2]]} scale={1.04} dispose={null}>
      <primitive object={scene} />
      <mesh geometry={standingLegGeometry} material={trousersMaterial} position={[-0.24, 0.45, -0.75]} castShadow receiveShadow />
      <mesh geometry={standingLegGeometry} material={trousersMaterial} position={[0.24, 0.45, -0.75]} castShadow receiveShadow />
      <StandingArm side={-1} material={shirtMaterial} />
      <StandingArm side={1} material={shirtMaterial} />
      {hair && <Hairpiece style={hair} color={hairColor} />}
      {charlieBrownShirt && <CharlieBrownStripe />}
      {revealed && showNamePlate && <NamePlate name={name} offsetY={labelOffsetY} />}
    </group>
  );
};

export const Hero = ({
  ref,
  ...props
}: ThreeElements["group"] & { ref: RefObject<AnimationHandle> }) => {
  const crew = useRef<Group>(null!);
  const { slideIndex, hasEntered } = useSectionsContext();
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!hasEntered) {
      setVisibleCount(0);
      return;
    }
    const timers = Array.from({ length: 5 }, (_, index) =>
      window.setTimeout(() => setVisibleCount(index + 1), index * 140),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [hasEntered]);

  useAnimationHandle(ref, (alpha) => {
    if (!crew.current) return;
    crew.current.position.y = MathUtils.lerp(-2.4, 0, alpha);
    const scale = MathUtils.lerp(1.35, 1.55, alpha);
    crew.current.scale.setScalar(scale);
  });

  if (slideIndex !== 0) return null;

  return (
    <group {...props} ref={crew} position={[5.6, 0, 5.6]} rotation-y={Math.PI / 4}>
      <CrewMember name="Harvey Yang" labelOffsetY={0.5} model="Junior" shirt="#f2cc3d" trousers="#15191b" position={[0, 0, 0]} phase={0} revealed={visibleCount >= 1} charlieBrownShirt />
      <CrewMember name="Olivia" labelOffsetY={0} model="Intern" hair="HairFrenchBraid" hairColor="#2d1710" shirt="#ac91de" trousers="#7995c3" position={[-3.1, 0, 0]} phase={0.8} revealed={visibleCount >= 2} />
      <CrewMember name="Tinya" labelOffsetY={0.28} model="Intern" hair="HairSideBraids" hairColor="#15110f" shirt="#174a32" trousers="#15191b" position={[-1.55, 0, 0]} phase={1.6} revealed={visibleCount >= 3} />
      <CrewMember name="June" labelOffsetY={0.28} model="Intern" hair="HairPigtailsHigh" hairColor="#5a2e1d" shirt="#b7a276" trousers="#34383b" position={[1.55, 0, 0]} phase={2.4} revealed={visibleCount >= 4} />
      <CrewMember name="Anglea" labelOffsetY={0} model="Intern" hair="HairFrenchBraid" hairColor="#2d1710" shirt="#9bcb7b" trousers="#f4f2ea" position={[3.1, 0, 0]} phase={3.2} revealed={visibleCount >= 5} />
    </group>
  );
};

useGLTF.preload(getAssetUrl("Intern"));
useGLTF.preload(getAssetUrl("Junior"));
useGLTF.preload(getAssetUrl("HairFrenchBraid"));
useGLTF.preload(getAssetUrl("HairSideBraids"));
useGLTF.preload(getAssetUrl("HairPigtailsHigh"));
useGLTF.preload(getAssetUrl("HairPigtailsClassic"));
