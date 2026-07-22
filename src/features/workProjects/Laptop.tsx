import { useLoader, type ThreeElements, type ThreeEvent } from "@react-three/fiber";
import {
  MathUtils,
  Matrix4,
  type Mesh,
  type MeshPhysicalMaterial,
  type MeshStandardMaterial,
  SRGBColorSpace,
  TextureLoader,
  Vector3,
} from "three";
import { useMemo, useRef } from "react";
import { useGLTF, useTargetFocusedPosition, useToggleAnimationState, useWiggle } from "@/hooks";
import { getAssetUrl, hoverHandlers, brickHeight, studDepth } from "@/util";
import { useRotatingDisplayContext } from "@/contexts/RotatingDisplay";
import { useModalContext } from "@/contexts/Modal";
import { ClickIndicator } from "../../components/ClickIndicator";
import type { ProjectName } from "@/constants";

type LaptopGraph = {
  nodes: { laptop: Mesh; stool: Mesh };
  materials: { laptop: MeshPhysicalMaterial; black: MeshStandardMaterial };
};

const laptopModelPath = getAssetUrl("Laptop");
const laptopOrigin = new Vector3(0, (brickHeight + studDepth) * 2, 0);
const facingCenter = (5 * Math.PI) / 4;

const getTransforms = (length: number, spacing: number) =>
  ({
    left: { position: [-length, 0, -length - spacing], rotation: [0, (3 * Math.PI) / 2, 0] },
    right: { position: [-length - spacing, 0, -length], rotation: [0, Math.PI, 0] },
    center: { position: [-length, 0, -length], rotation: [0, facingCenter, 0] },
  }) as const;

const MIN_OBJECT_CLEARANCE = 2;

export function Laptop({
  screen,
  position,
  ...props
}: Omit<ThreeElements["group"], "position"> & {
  screen: ProjectName;
  position: "left" | "right" | "center";
}) {
  const { width } = useRotatingDisplayContext();
  const { activeKey, open } = useModalContext();
  const floatPhase = position === "left" ? 0 : position === "center" ? 1.7 : 3.4;
  const wiggle = useWiggle({ amplitude: 0.12, frequency: 1.8, phaseShift: floatPhase });

  const laptop = useRef<Mesh>(null!);
  const screenTexture = useLoader(TextureLoader, getAssetUrl(screen, ".png"));
  screenTexture.colorSpace = SRGBColorSpace;
  screenTexture.flipY = false;
  const { nodes, materials } = useGLTF<LaptopGraph>(laptopModelPath);

  const isFocused = activeKey === screen;

  const length = Math.max(width, MIN_OBJECT_CLEARANCE);
  const spacing = Math.max(MIN_OBJECT_CLEARANCE, width / 2 - 0.5);
  const transforms = getTransforms(length, spacing)[position];
  const rawFocusedPosition = useTargetFocusedPosition(0.85);
  const focusedPosition = useMemo(
    () => new Vector3(rawFocusedPosition.z, rawFocusedPosition.y, rawFocusedPosition.x),
    [rawFocusedPosition.x, rawFocusedPosition.y, rawFocusedPosition.z],
  );

  const parentMatrix = new Matrix4();
  const targetPosition = new Vector3();

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    open(screen);
  };

  useToggleAnimationState(isFocused, (alpha) => {
    parentMatrix.copy(laptop.current.parent!.matrixWorld).invert();
    targetPosition.copy(focusedPosition).applyMatrix4(parentMatrix);
    laptop.current.position.lerpVectors(laptopOrigin, targetPosition, alpha);
    const idleFloat = wiggle({ amplitude: 0.11, frequency: 1.6 });
    const focusedFloat = wiggle({ amplitude: 0.18, frequency: 2.1, verticalShift: -0.04 });
    laptop.current.position.y += MathUtils.lerp(idleFloat, focusedFloat, alpha);
    if (!isFocused) {
      const heightAmplitude = 2;
      laptop.current.position.y += heightAmplitude * Math.sin(MathUtils.lerp(0, Math.PI, alpha));
    }
    const rotationDiff = transforms.rotation[1] - facingCenter;
    laptop.current.rotation.y = MathUtils.lerp(0, -rotationDiff, alpha);
  });

  return (
    <group
      {...props}
      {...hoverHandlers}
      dispose={null}
      {...transforms}
      onClick={handleClick}
    >
      <ClickIndicator position={[0, 2.75, 0]} />
      <mesh ref={laptop} geometry={nodes.laptop.geometry}>
        <meshStandardMaterial
          map={screenTexture}
          metalness={0.8}
          roughness={0.5}
        />
      </mesh>
      <mesh
        geometry={nodes.stool.geometry}
        material={materials.black}
        rotation-y={position === "center" ? Math.PI / 4 : 0}
      />
    </group>
  );
}

useGLTF.preload(laptopModelPath);
