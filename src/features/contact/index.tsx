import { Suspense, useMemo } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { MathUtils, SRGBColorSpace, TextureLoader } from "three";
import { CrewMember } from "@/features/hero";
import { useRotatingDisplayContext } from "@/contexts/RotatingDisplay";
import { useMediaQuery } from "@/hooks";
import { MOBILE_BREAKPOINT_QUERY } from "@/theme";
import { useSectionsContext } from "@/contexts/Sections";
import storyMinifigures from "@/assets/story_minifigures.png?url";
import storyLicensedWorlds from "@/assets/story_licensed_worlds.png?url";
import ninjago from "@/assets/ninjago.png?url";
import legoFortnite from "@/assets/lego_fortnite.png?url";

const MINIFIGURE_DIMENSIONS = { width: 2.5, depth: 1.5 };

const STORY_BEATS = [
  {
    model: "Intern",
    shirt: "#b11f24",
    trousers: "#15191b",
    year: "1999",
    label: "BORROW A STORY",
    work: storyLicensedWorlds,
  },
  {
    model: "Junior",
    shirt: "#ef6c00",
    trousers: "#174a32",
    year: "2011",
    label: "OWN A WORLD",
    work: ninjago,
  },
  {
    model: "Junior",
    shirt: "#087bc1",
    trousers: "#15191b",
    year: "1978",
    label: "GIVE CHARACTERS",
    work: storyMinifigures,
  },
  {
    model: "Intern",
    shirt: "#6a1b9a",
    trousers: "#15191b",
    year: "2023",
    label: "PARTNER TO SCALE",
    work: legoFortnite,
  },
] as const;

const WorkPlacard = ({ image, position }: { image: string; position: [number, number, number] }) => {
  const texture = useLoader(TextureLoader, image);
  const uprightTexture = useMemo(() => {
    texture.colorSpace = SRGBColorSpace;
    texture.flipY = true;
    texture.needsUpdate = true;
    return texture;
  }, [texture]);

  return (
    <group position={position}>
      <mesh position={[-0.48, -0.66, 0.08]}>
        <boxGeometry args={[0.1, 0.72, 0.1]} />
        <meshPhysicalMaterial color="#8a4f22" roughness={0.5} />
      </mesh>
      <mesh position={[0.48, -0.66, 0.08]}>
        <boxGeometry args={[0.1, 0.72, 0.1]} />
        <meshPhysicalMaterial color="#8a4f22" roughness={0.5} />
      </mesh>
      <sprite scale={[1.9, 1.15, 1]} renderOrder={19}>
        <spriteMaterial color="#111318" depthTest={false} depthWrite={false} />
      </sprite>
      <sprite scale={[1.72, 0.97, 1]} position={[0, 0, 0.01]} renderOrder={20}>
        <spriteMaterial map={uprightTexture} toneMapped={false} depthTest={false} depthWrite={false} />
      </sprite>
    </group>
  );
};

const StoryCard = ({
  year,
  label,
  position,
}: {
  year: string;
  label: string;
  position: [number, number, number];
}) => {
  const canvas = useMemo(() => {
    const node = document.createElement("canvas");
    node.width = 512;
    node.height = 160;
    const context = node.getContext("2d")!;
    context.fillStyle = "#111318";
    context.beginPath();
    context.roundRect(8, 8, 496, 144, 24);
    context.fill();
    context.lineWidth = 8;
    context.strokeStyle = "#ffcf00";
    context.stroke();
    context.textAlign = "center";
    context.fillStyle = "#ffcf00";
    context.font = "800 44px system-ui, sans-serif";
    context.fillText(year, 256, 62);
    context.fillStyle = "#ffffff";
    context.font = "700 34px system-ui, sans-serif";
    context.fillText(label, 256, 116, 454);
    return node;
  }, [label, year]);

  return (
    <sprite position={position} scale={[1.65, 0.52, 1]}>
      <spriteMaterial transparent>
        <canvasTexture attach="map" args={[canvas]} colorSpace={SRGBColorSpace} />
      </spriteMaterial>
    </sprite>
  );
};

export const Contact = () => {
  const { slideIndex } = useSectionsContext();
  const originToCameraDistance = useThree(({ camera }) => camera).position.length();
  const { width: wallWidth } = useRotatingDisplayContext();
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT_QUERY);
  const origin = MathUtils.clamp(
    isMobile ? wallWidth / 2 : wallWidth,
    MINIFIGURE_DIMENSIONS.depth,
    Math.floor(originToCameraDistance / 2),
  );

  if (slideIndex !== 19) return null;

  return (
    <group>
      <mesh position={[-origin - 2.65, 0.28, origin]} receiveShadow>
        <boxGeometry args={[6.3, 0.56, 2.1]} />
        <meshPhysicalMaterial color="#111318" roughness={0.42} clearcoat={0.25} />
      </mesh>
      <mesh position={[-origin, 0.28, origin + 2.65]} receiveShadow>
        <boxGeometry args={[2.1, 0.56, 6.3]} />
        <meshPhysicalMaterial color="#111318" roughness={0.42} clearcoat={0.25} />
      </mesh>
      <mesh position={[-origin - 5.35, 2.25, origin + 0.85]}>
        <boxGeometry args={[0.45, 4.5, 0.45]} />
        <meshPhysicalMaterial color="#e2231a" roughness={0.35} />
      </mesh>
      <mesh position={[-origin + 0.85, 2.25, origin + 5.35]}>
        <boxGeometry args={[0.45, 4.5, 0.45]} />
        <meshPhysicalMaterial color="#e2231a" roughness={0.35} />
      </mesh>

      {STORY_BEATS.map((beat, index) => {
        const isEven = index % 2 === 0;
        const rotationY = isEven ? 0 : -Math.PI / 2;
        const positionOffset = MINIFIGURE_DIMENSIONS.width * (Math.floor(index / 2) + 1) - 1;
        const x = isEven ? -origin - positionOffset : -origin;
        const z = isEven ? origin : origin + positionOffset;
        const cardX = index === 0 ? x - 1 : x;
        const cardZ = index === 1 ? z + 1 : z;
        return (
          <Suspense key={beat.label} fallback={null}>
            <StoryCard year={beat.year} label={beat.label} position={[cardX, 3.35, cardZ]} />
            <WorkPlacard image={beat.work} position={[x, 1.72, z]} />
            <group position={[x, 0.55, z]} rotation-y={rotationY} scale={0.92}>
              <CrewMember
                model={beat.model}
                shirt={beat.shirt}
                trousers={beat.trousers}
                position={[0, 0, 0]}
                phase={index * 0.85}
                name={beat.label}
                labelOffsetY={0}
                revealed
                showNamePlate={false}
              />
            </group>
          </Suspense>
        );
      })}
    </group>
  );
};
