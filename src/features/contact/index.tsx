import { Suspense, useMemo, useRef } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { MathUtils, SRGBColorSpace, TextureLoader, type Group, type PointLight } from "three";
import { CrewMember } from "@/features/hero";
import { useRotatingDisplayContext } from "@/contexts/RotatingDisplay";
import { useMediaQuery } from "@/hooks";
import { MOBILE_BREAKPOINT_QUERY } from "@/theme";
import { useSectionsContext } from "@/contexts/Sections";
import storyMinifigures from "@/assets/story_minifigures.png?url";
import storyLicensedWorlds from "@/assets/story_licensed_worlds.png?url";
import ninjago from "@/assets/ninjago.png?url";
import legoFortnite from "@/assets/lego_fortnite.png?url";
import { getFinalePlayback } from "@/features/interaction/finaleAudio";

const MINIFIGURE_DIMENSIONS = { width: 2.5, depth: 1.5 };

const STORY_BEATS = [
  {
    model: "Intern",
    shirt: "#b11f24",
    trousers: "#15191b",
    year: "1999",
    label: "BORROW A STORY",
    work: storyLicensedWorlds,
    sequence: 1,
    light: "#e2231a",
  },
  {
    model: "Junior",
    shirt: "#ef6c00",
    trousers: "#174a32",
    year: "2011",
    label: "OWN A WORLD",
    work: ninjago,
    sequence: 2,
    light: "#f57c00",
  },
  {
    model: "Junior",
    shirt: "#087bc1",
    trousers: "#15191b",
    year: "1978",
    label: "GIVE CHARACTERS",
    work: storyMinifigures,
    sequence: 0,
    light: "#087bc1",
  },
  {
    model: "Intern",
    shirt: "#6a1b9a",
    trousers: "#15191b",
    year: "2023",
    label: "PARTNER TO SCALE",
    work: legoFortnite,
    sequence: 3,
    light: "#a86ee8",
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
    context.font = "800 46px system-ui, sans-serif";
    context.fillText(year, 256, 62);
    context.fillStyle = "#ffffff";
    context.font = "700 36px system-ui, sans-serif";
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

type StoryBeat = (typeof STORY_BEATS)[number];

const StoryBeatSequence = ({
  beat,
  index,
  position,
  rotationY,
  cardOffset,
}: {
  beat: StoryBeat;
  index: number;
  position: [number, number, number];
  rotationY: number;
  cardOffset: [number, number, number];
}) => {
  const root = useRef<Group>(null!);
  const light = useRef<PointLight>(null!);

  useFrame(({ clock }, delta) => {
    const playback = getFinalePlayback();
    const revealStart = 0.055 + beat.sequence * 0.2;
    const nextStart = revealStart + 0.2;
    const reveal = MathUtils.smootherstep(playback.progress, revealStart, revealStart + 0.055);
    const focusIn = MathUtils.smootherstep(playback.progress, revealStart, revealStart + 0.025);
    const focusOut = 1 - MathUtils.smootherstep(playback.progress, nextStart - 0.035, nextStart);
    const finalAssembly = MathUtils.smootherstep(playback.progress, 0.835, 0.94);
    const focus = Math.max(0, focusIn * focusOut);
    const visibleScale = reveal * (0.88 + focus * 0.18 + finalAssembly * 0.08);
    const slideDirection = beat.sequence % 2 === 0 ? -1 : 1;
    const bob = focus * Math.sin(clock.elapsedTime * 1.6 + beat.sequence) * 0.055;

    root.current.visible = reveal > 0.001 || playback.hasEnded;
    const scale = MathUtils.damp(root.current.scale.x, visibleScale, 5.2, delta);
    root.current.scale.setScalar(scale);
    root.current.position.x = MathUtils.damp(
      root.current.position.x,
      position[0] + (1 - reveal) * slideDirection * 2.4,
      4.4,
      delta,
    );
    root.current.position.y = MathUtils.damp(
      root.current.position.y,
      position[1] - (1 - reveal) * 1.7 + bob,
      4.4,
      delta,
    );
    root.current.position.z = MathUtils.damp(
      root.current.position.z,
      position[2] + (1 - reveal) * slideDirection * 0.65,
      4.4,
      delta,
    );
    light.current.intensity = MathUtils.damp(
      light.current.intensity,
      0.15 + focus * 2.7 + finalAssembly * 0.65,
      4,
      delta,
    );
  });

  return (
    <group ref={root} position={position} scale={0.001} visible={false}>
      <pointLight ref={light} color={beat.light} position={[0, 2.15, 0]} distance={5.5} decay={1.7} />
      <StoryCard year={beat.year} label={beat.label} position={cardOffset} />
      <WorkPlacard image={beat.work} position={[0, 1.17, 0]} />
      <group rotation-y={rotationY}>
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
    </group>
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
        const cardOffset: [number, number, number] = [
          index === 0 ? -1 : 0,
          2.8,
          index === 1 ? 1 : 0,
        ];
        return (
          <Suspense key={beat.label} fallback={null}>
            <StoryBeatSequence
              beat={beat}
              index={index}
              position={[x, 0.55, z]}
              rotationY={rotationY}
              cardOffset={cardOffset}
            />
          </Suspense>
        );
      })}
    </group>
  );
};
