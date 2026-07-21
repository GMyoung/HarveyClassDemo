import { useMemo, useRef, type RefObject } from "react";
import { Group, MathUtils, SpriteMaterial, SRGBColorSpace } from "three";
import { type ThreeElements } from "@react-three/fiber";
import { brickWidth } from "@/util";
import { useAnimationHandle, type AnimationHandle, useResponsiveFontSize } from "@/hooks";
import { TEXT_HEIGHT } from "@/constants/text";
import { useSectionsContext } from "@/contexts/Sections";

const startingYOffset = 4;

type HeaderProps = { label: string } & ThreeElements["group"];

const Header = ({ label, ...props }: HeaderProps) => {
  const size = useResponsiveFontSize();
  const canvas = useMemo(() => {
    const node = document.createElement("canvas");
    node.width = 1024;
    node.height = 420;
    const context = node.getContext("2d")!;
    context.fillStyle = "rgba(17, 19, 24, 0.92)";
    context.beginPath();
    context.roundRect(18, 18, 988, 384, 46);
    context.fill();
    context.lineWidth = 18;
    context.strokeStyle = "#e2231a";
    context.stroke();
    context.fillStyle = "#ffcf00";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "900 108px system-ui, sans-serif";
    const words = label.toUpperCase().split(" ");
    const splitAt = Math.ceil(words.length / 2);
    const lines = words.length > 2
      ? [words.slice(0, splitAt).join(" "), words.slice(splitAt).join(" ")]
      : [words.join(" ")];
    lines.forEach((line, index) => {
      const y = lines.length === 1 ? 210 : 145 + index * 130;
      context.fillText(line, 512, y, 900);
    });
    return node;
  }, [label]);

  return (
    <group {...props}>
      <sprite scale={[size * 5.8, size * 2.38, 1]}>
        <spriteMaterial transparent depthTest={false}>
          <canvasTexture attach="map" args={[canvas]} colorSpace={SRGBColorSpace} />
        </spriteMaterial>
      </sprite>
    </group>
  );
};

export const SectionHeaders = ({ ref }: { ref: RefObject<AnimationHandle> }) => {
  const { slideIndex } = useSectionsContext();
  const groupRef = useRef<Group>(null!);
  const [x, y, z] = [brickWidth, TEXT_HEIGHT, brickWidth];

  useAnimationHandle(ref, (alpha: number) => {
    groupRef.current.position.y = MathUtils.lerp(startingYOffset, 0, alpha);
    groupRef.current.traverse((object) => {
      if (object instanceof SpriteMaterial) object.opacity = alpha;
      if ("material" in object && object.material instanceof SpriteMaterial) {
        object.material.opacity = alpha;
      }
    });
  });

  const headerProps: (HeaderProps & { slide: number })[] = [
    { slide: 1, label: "LEGO Story Engines", position: [0, y, z - 2], rotation: [0, Math.PI / 2, 0] },
    { slide: 2, label: "LEGO Worlds", position: [-x - 1, y, z - 2], rotation: [0, Math.PI, 0] },
    { slide: 19, label: "Story Theater", position: [-x + 1, y + 1.4, z], rotation: [0, -Math.PI / 2, 0] },
  ];

  return (
    <group ref={groupRef}>
      {headerProps.map(({ slide, ...props }, index) => (
        <group key={index} visible={slideIndex === slide}>
          <Header {...props} />
        </group>
      ))}
    </group>
  );
};
