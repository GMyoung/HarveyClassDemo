import { useSectionsContext } from "@/contexts/Sections";
import { HeroCalibrationPanel } from "@/features/hero/HeroCalibrationPanel";
import { StoryMotion } from "./StoryMotion";
import { StrategySlide } from "./StrategySlide";
import { FinaleCredits } from "./FinaleCredits";
import { SlideAtmosphere } from "./SlideAtmosphere";
import teamQrCode from "@/assets/team_qr_code.png?url";
import "./StrategySlide.css";

const SHOW_HERO_CALIBRATION_PANEL = false;

const BrickTest = () => (
  <section className="custom-story-slide brick-test">
    <SlideAtmosphere slideIndex={17} />
    <StoryMotion slideIndex={17} placement="card" />
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
    <SlideAtmosphere slideIndex={18} />
    <StoryMotion slideIndex={18} placement="card" />
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
    <div className="skills-story-caption__top">
      <p>WHY ENTERTAINMENT MATTERS</p>
      <StoryMotion slideIndex={1} placement="inline" />
    </div>
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
  const { slideIndex, slideCount, hasEntered } = useSectionsContext();

  if (slideIndex === 0) {
    return (
      <>
        {!hasEntered && (
          <aside className="team-qr-entry" aria-label="Presentation QR code">
            <img src={teamQrCode} alt="QR code for the LEGO presentation" />
            <span>SCAN BEFORE WE BEGIN</span>
          </aside>
        )}
        {SHOW_HERO_CALIBRATION_PANEL && <HeroCalibrationPanel />}
        {hasEntered && <StoryMotion slideIndex={0} placement="overlay" />}
      </>
    );
  }
  if (slideIndex === 1) return <SkillsStory />;
  if (slideIndex === 19) {
    return (
      <>
        <SlideAtmosphere slideIndex={19} placement="scene" />
        <FinaleCredits />
      </>
    );
  }
  if (slideIndex === 2) {
    return <StoryMotion slideIndex={slideIndex} placement="overlay" />;
  }
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
