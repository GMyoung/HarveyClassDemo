import { type ObjectMap, type ThreeElements } from "@react-three/fiber";
import { AnimationAction, AnimationClip, LoopOnce } from "three";
import { useEffect, useRef } from "react";
import { useGLTF, useAnimations, type OnFinished } from "@/hooks";
import { getAssetUrl, hoverHandlers } from "@/util";
import { useSectionsContext } from "@/contexts/Sections";
import { SECTIONS } from "@/constants";

const getRandomTimeout = (duration = 2500) => Math.random() * duration;

const queueAction = (action: AnimationAction) => {
  return setTimeout(() => action.reset().play(), getRandomTimeout());
};

interface MinifigureGLTF extends Partial<ObjectMap> {
  animations: (AnimationClip & { name: "look_left" | "look_right" })[];
}

type SocialMediaMinifigureProps = {
  minifigure: "Spaceman" | "Overalls" | "Pirate" | "Knight";
  animation: MinifigureGLTF["animations"][number]["name"];
  href?: string;
} & ThreeElements["group"];

export function SocialMediaMinifigure({
  minifigure,
  animation,
  href,
  ...props
}: SocialMediaMinifigureProps) {
  const modelPath = getAssetUrl(minifigure);
  const gltf = useGLTF<MinifigureGLTF>(modelPath);
  const propNames = {
    Spaceman: ["spaceman_post", "linkedin"],
    Overalls: ["hand_r", "youtube"],
    Pirate: ["pirate_sign", "github"],
    Knight: ["knight_post", "vimeo"],
  }[minifigure];
  gltf.scene.traverse((object) => {
    const objectName = object.name.toLowerCase();
    if (propNames.some((propName) => objectName.includes(propName))) object.visible = false;
  });
  const { mixer, actions } = useAnimations(gltf);
  const timeout = useRef<number | null>(null);

  const { activeSection } = useSectionsContext();
  const isActiveSection = activeSection === SECTIONS.contact;

  useEffect(() => {
    const action = actions[animation];
    action.loop = LoopOnce;

    if (!isActiveSection) {
      action.fadeOut(0.5).stop();
      return;
    }

    timeout.current = queueAction(action);

    const handleFinished: OnFinished = ({ action }) => (timeout.current = queueAction(action));
    mixer.addEventListener("finished", handleFinished);

    return () => {
      if (timeout.current !== null) clearTimeout(timeout.current);
      mixer.removeEventListener("finished", handleFinished);
    };
  }, [mixer, actions, animation, isActiveSection]);

  return (
    <group
      {...props}
      {...(href ? hoverHandlers : {})}
      dispose={null}
      onClick={(e) => {
        e.stopPropagation();
        if (href) window.open(href, "_blank");
      }}
    >
      <primitive object={gltf.scene} />
    </group>
  );
}
