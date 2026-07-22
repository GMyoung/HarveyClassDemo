import { useSectionsContext } from "@/contexts/Sections";
import { StrategySlide } from "./StrategySlide";
import "./StrategySlide.css";

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
      {slideIndex >= 3 && slideIndex <= 16 ? (
        <StrategySlide slideIndex={slideIndex} />
      ) : slideIndex === 17 ? (
        <BrickTest />
      ) : (
        <AudienceChallenge />
      )}
    </div>
  );
};
