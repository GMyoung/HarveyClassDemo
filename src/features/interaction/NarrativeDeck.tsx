import { useSectionsContext } from "@/contexts/Sections";
import { SLIDE_TITLES } from "@/constants";
import storySystem from "@/assets/story_system.png?url";
import storyMinifigures from "@/assets/story_minifigures.png?url";
import storyLicensedWorlds from "@/assets/story_licensed_worlds.png?url";
import storyCrisis from "@/assets/story_crisis.png?url";
import ninjago from "@/assets/ninjago.png?url";
import legoMovie from "@/assets/lego_movie.png?url";
import legoFortnite from "@/assets/lego_fortnite.png?url";
import storyMediaJobs from "@/assets/story_media_jobs.png?url";
import storyEcosystem from "@/assets/story_ecosystem.png?url";
import storyOptions from "@/assets/story_options.png?url";
import storyVrio from "@/assets/story_vrio.png?url";
import storyDiversification from "@/assets/story_diversification.png?url";
import storyRecommendation from "@/assets/story_recommendation.png?url";
import storyFinal from "@/assets/story_final.png?url";

const slideImages: Partial<Record<number, string>> = {
  3: storySystem,
  4: storyMinifigures,
  5: storyLicensedWorlds,
  6: storyCrisis,
  7: ninjago,
  8: legoMovie,
  9: legoFortnite,
  10: storyMediaJobs,
  11: storyEcosystem,
  12: storyOptions,
  13: storyVrio,
  14: storyDiversification,
  15: storyRecommendation,
  16: storyFinal,
};

const BrickTest = () => (
  <section className="custom-story-slide brick-test">
    <p className="deck-eyebrow">RELATED DIVERSIFICATION DECISION GATE</p>
    <h2>Every entertainment bet must pass the Brick Test.</h2>
    <div className="test-grid">
      {[
        ["01", "CORE FIT", "Does it use LEGO's system, brand, visual grammar, or world-building capability?"],
        ["02", "PLAY RETURN", "Can characters, places, or mechanics become new physical building experiences?"],
        ["03", "CONTROL", "Can LEGO own the play rules while partners provide specialist production?"],
      ].map(([number, title, copy]) => (
        <article key={number}>
          <span>{number}</span>
          <h3>{title}</h3>
          <p>{copy}</p>
        </article>
      ))}
    </div>
    <strong className="deck-verdict">3x YES → BUILD THE WORLD</strong>
  </section>
);

const AudienceChallenge = () => (
  <section className="custom-story-slide audience-challenge">
    <p className="deck-eyebrow">INTERACTIVE FINALE</p>
    <h2>If you controlled LEGO's next world, what would you build?</h2>
    <div className="challenge-path">
      <span>CHARACTER</span>
      <b>+</b>
      <span>CONFLICT</span>
      <b>+</b>
      <span>BUILDABLE PLACE</span>
      <b>→</b>
      <span>NEW PLAY</span>
    </div>
    <p>Use the final theater to tell the story in one sentence.</p>
  </section>
);

const SkillsStory = () => (
  <aside className="skills-story-caption" aria-live="polite">
    <p>WHY ENTERTAINMENT MATTERS</p>
    <h2>Stories turn LEGO bricks into a repeatable play engine.</h2>
    <ol>
      <li><strong>Film</strong> creates cultural reach.</li>
      <li><strong>TV</strong> keeps characters alive.</li>
      <li><strong>Games</strong> turn audiences into players.</li>
      <li><strong>Platforms</strong> make participation recurrent.</li>
    </ol>
    <span>Every loop must return new ideas and demand to physical sets.</span>
  </aside>
);

export const NarrativeDeck = () => {
  const { slideIndex, slideCount } = useSectionsContext();
  const slideImage = slideImages[slideIndex];

  if (slideIndex === 0) {
    return (
      <div className="hero-slide-title" aria-label="Meet the Crew">
        <span>01</span>
        <strong>MEET THE<br />CREW</strong>
      </div>
    );
  }
  if (slideIndex === 1) return <SkillsStory />;
  if (slideIndex < 3 || slideIndex > 18) return null;

  return (
    <div className="narrative-deck" key={slideIndex} aria-live="polite">
      <div className="deck-counter">
        {String(slideIndex + 1).padStart(2, "0")} / {String(slideCount).padStart(2, "0")}
      </div>
      {slideImage ? (
        <figure className="ppt-story-frame">
          <img
            src={slideImage}
            alt={SLIDE_TITLES[slideIndex] ?? "LEGO entertainment strategy"}
          />
        </figure>
      ) : slideIndex === 17 ? (
        <BrickTest />
      ) : (
        <AudienceChallenge />
      )}
    </div>
  );
};
