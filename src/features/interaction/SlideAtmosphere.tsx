import minifigureStory from "@/assets/atmosphere/minifigure_story.gif?url";
import starWarsOrbit from "@/assets/atmosphere/star_wars_orbit.gif?url";
import crisisFall from "@/assets/atmosphere/crisis_fall.gif?url";
import ninjagoSpin from "@/assets/atmosphere/ninjago_spin.gif?url";
import movieClapper from "@/assets/atmosphere/movie_clapper.gif?url";
import fortniteBuild from "@/assets/atmosphere/fortnite_build.gif?url";
import mediaJobs from "@/assets/atmosphere/media_jobs.gif?url";
import ecosystemLoop from "@/assets/atmosphere/ecosystem_loop.gif?url";
import pathsForward from "@/assets/atmosphere/paths_forward.gif?url";
import vrioShield from "@/assets/atmosphere/vrio_shield.gif?url";
import relatedLoop from "@/assets/atmosphere/related_loop.gif?url";
import recommendationCompass from "@/assets/atmosphere/recommendation_compass.gif?url";
import lastBrickOrbit from "@/assets/atmosphere/last_brick_orbit.gif?url";
import brickTest from "@/assets/atmosphere/brick_test.gif?url";
import audienceBuild from "@/assets/atmosphere/audience_build.gif?url";
import storyTheater from "@/assets/atmosphere/story_theater.gif?url";
import "./SlideAtmosphere.css";

type SlideAtmosphereProps = {
  slideIndex: number;
  placement?: "card" | "scene";
};

const atmosphereBySlide: Record<number, { src: string; label: string }> = {
  4: { src: minifigureStory, label: "Animated minifigure and story bricks" },
  5: { src: starWarsOrbit, label: "Animated brick-built starfighter" },
  6: { src: crisisFall, label: "Animated falling red bricks" },
  7: { src: ninjagoSpin, label: "Animated ninja and Spinjitzu star" },
  8: { src: movieClapper, label: "Animated brick-built movie clapper" },
  9: { src: fortniteBuild, label: "Animated brick pickaxe and build" },
  10: { src: mediaJobs, label: "Animated four-part media system" },
  11: { src: ecosystemLoop, label: "Animated circular brick ecosystem" },
  12: { src: pathsForward, label: "Animated branching brick paths" },
  13: { src: vrioShield, label: "Animated brick shield" },
  14: { src: relatedLoop, label: "Animated screen-to-shelf loop" },
  15: { src: recommendationCompass, label: "Animated brick compass" },
  16: { src: lastBrickOrbit, label: "Animated worlds orbiting the brick" },
  17: { src: brickTest, label: "Animated three-step brick test" },
  18: { src: audienceBuild, label: "Animated audience build prompt" },
  19: { src: storyTheater, label: "Animated minifigure theater confetti" },
};

export const SlideAtmosphere = ({ slideIndex, placement = "card" }: SlideAtmosphereProps) => {
  const atmosphere = atmosphereBySlide[slideIndex];
  if (!atmosphere) return null;

  return (
    <div
      className={`slide-atmosphere slide-atmosphere--${placement}`}
      data-atmosphere-slide={slideIndex + 1}
      data-atmosphere-variant={slideIndex % 4}
      aria-hidden="true"
    >
      <img className="slide-atmosphere__sprite slide-atmosphere__sprite--primary" src={atmosphere.src} alt="" />
      <img className="slide-atmosphere__sprite slide-atmosphere__sprite--echo" src={atmosphere.src} alt={atmosphere.label} />
    </div>
  );
};
