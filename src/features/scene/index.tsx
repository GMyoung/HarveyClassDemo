import { Suspense, useRef } from "react";
import { Group, MathUtils } from "three";
import { useFrame } from "@react-three/fiber";
import type { AnimationHandle } from "@/hooks";
import { Contact } from "@/features/contact";
import { WorkProjects } from "@/features/workProjects";
import { SectionHeaders } from "@/features/headings";
import { Hero } from "@/features/hero";
import { Skills } from "@/features/skills";
import { useSectionsContext } from "@/contexts/Sections";
import { Floor } from "./Floor";
import { Walls } from "./Walls";
import { Environment, type EnvironmentHandle } from "./Environment";

const overlap = 0.25;
const floorDuration = 0.65;
const wallsDuration = 2.5;
const heroDuration = 1.5;
const headersDuration = 0.75;
const durations: [number, number, number, number] = [
  floorDuration,
  wallsDuration,
  headersDuration,
  heroDuration,
];
const { timings } = durations.reduce<{
  timings: { min: number; max: number }[];
  currentStart: number;
}>(
  (result, duration) => {
    result.timings.push({ min: result.currentStart, max: result.currentStart + duration });
    result.currentStart = result.currentStart + duration - overlap;
    return result;
  },
  { timings: [], currentStart: 0 },
);

export const Scene = () => {
  const { slideIndex } = useSectionsContext();
  const acc = useRef(0);
  const skillAlpha = useRef(0);
  const environment = useRef<EnvironmentHandle>(null);
  const floor = useRef<AnimationHandle>(null!);
  const headers = useRef<AnimationHandle>(null!);
  const hero = useRef<AnimationHandle>(null!);
  const skills = useRef<AnimationHandle>(null!);
  const walls = useRef<AnimationHandle>(null!);
  const sections = useRef<Group>(null!);

  useFrame((_, delta) => {
    if (environment.current?.checkIsLoaded()) {
      acc.current += delta;
    }
    floor.current.animate(MathUtils.smootherstep(acc.current, timings[0].min, timings[0].max));
    walls.current.animate(MathUtils.smootherstep(acc.current, timings[1].min, timings[1].max));
    headers.current.animate(MathUtils.smootherstep(acc.current, timings[2].min, timings[2].max));
    hero.current?.animate(MathUtils.smootherstep(acc.current, timings[3].min, timings[3].max));
    skillAlpha.current = MathUtils.damp(
      skillAlpha.current,
      slideIndex === 1 ? 1 : 0,
      5,
      delta,
    );
    skills.current?.animate(skillAlpha.current);
    const isComplete = acc.current >= timings[3].max;
    sections.current.visible = isComplete;
    if (!document.body.classList.contains("show-interaction-area") && isComplete) {
      // Delay until next frame for Safari
      requestAnimationFrame(() => document.body.classList.add("show-interaction-area"));
    }
  });
  return (
    <>
      <Suspense fallback={null}>
        <Environment ref={environment} />
      </Suspense>
      <SectionHeaders ref={headers} />
      <Suspense fallback={null}>
        <Hero ref={hero} />
      </Suspense>
      <group ref={sections}>
        <group rotation-y={Math.PI / 2}>
          <Skills ref={skills} />
        </group>
        <WorkProjects />
        <Contact />
      </group>
      <Walls ref={walls} />
      <Floor ref={floor} />
    </>
  );
};
