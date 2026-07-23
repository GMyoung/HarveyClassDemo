import { useEffect, useRef } from "react";
import {
  BlocksIcon,
  BookOpenTextIcon,
  BoxesIcon,
  CheckCheckIcon,
  CompassIcon,
  GamepadIcon,
  GitBranchIcon,
  GitCompareArrowsIcon,
  GlobeIcon,
  LayoutGridIcon,
  LinkIcon,
  MousePointerClickIcon,
  PlayIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SwordsIcon,
  TriangleAlertIcon,
  UserStarIcon,
  UsersRoundIcon,
  type BlocksIconHandle,
} from "@animateicons/react/lucide";
import "./StoryMotion.css";

type StoryMotionPlacement = "slide" | "overlay" | "inline" | "card";

type StoryMotionProps = {
  slideIndex: number;
  placement?: StoryMotionPlacement;
};

const STORY_ICONS: Partial<Record<number, typeof BlocksIcon>> = {
  0: UsersRoundIcon,
  1: BlocksIcon,
  2: MousePointerClickIcon,
  3: BlocksIcon,
  4: UserStarIcon,
  5: GlobeIcon,
  6: TriangleAlertIcon,
  7: SwordsIcon,
  8: PlayIcon,
  9: GamepadIcon,
  10: LayoutGridIcon,
  11: GitCompareArrowsIcon,
  12: GitBranchIcon,
  13: ShieldCheckIcon,
  14: LinkIcon,
  15: CompassIcon,
  16: BoxesIcon,
  17: CheckCheckIcon,
  18: SparklesIcon,
  19: BookOpenTextIcon,
};

const STORY_LABELS: Partial<Record<number, string>> = {
  0: "crew",
  1: "story engines",
  2: "interactive worlds",
  3: "brick system",
  4: "characters",
  5: "licensed worlds",
  6: "complexity warning",
  7: "NINJAGO",
  8: "film",
  9: "games",
  10: "media portfolio",
  11: "play ecosystem",
  12: "strategic paths",
  13: "VRIO protection",
  14: "related diversification",
  15: "strategic direction",
  16: "brick core",
  17: "brick test",
  18: "audience ideas",
  19: "story theater",
};

export const StoryMotion = ({ slideIndex, placement = "slide" }: StoryMotionProps) => {
  const animationRef = useRef<BlocksIconHandle>(null);
  const Icon = STORY_ICONS[slideIndex] ?? SparklesIcon;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => animationRef.current?.startAnimation());
    const stop = window.setTimeout(() => animationRef.current?.stopAnimation(), 1600);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(stop);
    };
  }, [slideIndex]);

  return (
    <div
      className={`story-motion story-motion--${placement}`}
      data-story-motion={slideIndex}
      data-story-topic={STORY_LABELS[slideIndex] ?? "LEGO story"}
      aria-hidden="true"
    >
      <span className="story-motion__stud story-motion__stud--red" />
      <span className="story-motion__stud story-motion__stud--blue" />
      <Icon
        ref={animationRef}
        className="story-motion__icon"
        color="currentColor"
        duration={0.82}
        isAnimated={false}
        size={placement === "slide" ? 42 : 48}
      />
      <span className="story-motion__stud story-motion__stud--green" />
      <span className="story-motion__stud story-motion__stud--yellow" />
    </div>
  );
};
