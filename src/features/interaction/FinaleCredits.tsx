import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useSectionsContext } from "@/contexts/Sections";
import {
  getFinalePlayback,
  prepareFinaleAudio,
  startFinaleAudio,
  stopFinaleAudio,
} from "./finaleAudio";
import "./FinaleCredits.css";

const CHAPTERS = [
  { year: "1978", action: "GIVE CHARACTERS", start: 0.055, color: "#087bc1" },
  { year: "1999", action: "BORROW A STORY", start: 0.255, color: "#e2231a" },
  { year: "2011", action: "OWN A WORLD", start: 0.455, color: "#f57c00" },
  { year: "2023", action: "PARTNER TO SCALE", start: 0.655, color: "#a86ee8" },
] as const;

const ROLLING_CREDITS = [
  {
    year: "1932—1958",
    kicker: "THE SYSTEM",
    title: "A toy company becomes a compatible language of play.",
    copy: "The brick created the repeatable rules. Everything that followed had to strengthen that system.",
    color: "#ffcf00",
  },
  {
    year: "1978",
    kicker: "JENS N. KNUDSEN · 32 YEARS AT LEGO",
    title: "The brick system found its cast.",
    copy: "The minifigure gave every build an identity, a role, and the beginning of a story.",
    color: "#087bc1",
  },
  {
    year: "1997—1999",
    kicker: "PETER EIO + LUCASFILM",
    title: "Fandom became buildable play.",
    copy: "LEGO Star Wars proved another company's story could enter the system without replacing the brick.",
    color: "#e2231a",
  },
  {
    year: "2004—2005",
    kicker: "JØRGEN VIG KNUDSTORP · THE TURNAROUND",
    title: "Complexity was cut. The core became the test.",
    copy: "LEGO sold capital-heavy activities, simplified the portfolio, and learned to partner for specialist execution.",
    color: "#ffcf00",
  },
  {
    year: "2011",
    kicker: "TOMMY ANDREASEN + DAN & KEVIN HAGEMAN",
    title: "Continuity became renewable.",
    copy: "NINJAGO turned a product idea into characters, conflict, and an owned world audiences could revisit.",
    color: "#f57c00",
  },
  {
    year: "2014",
    kicker: "DAN LIN + JILL WILFERT + LORD & MILLER",
    title: "The play philosophy became the plot.",
    copy: "The LEGO Movie made the tension between instructions and imagination into a global brand story.",
    color: "#ffcf00",
  },
  {
    year: "2022—2023",
    kicker: "NIELS B. CHRISTIANSEN + TIM SWEENEY",
    title: "Participation became persistent.",
    copy: "LEGO Fortnite connected screen to shelf—and shelf back to screen—inside a living platform.",
    color: "#a86ee8",
  },
] as const;

const FINAL_CHAPTER_START = 0.835;
const SCENE_STARTS = [0, 0.055, 0.155, 0.255, 0.355, 0.455, 0.555, 0.655, 0.835, 0.94] as const;

const formatTime = (seconds: number) => {
  const whole = Math.max(0, Math.floor(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
};

export const FinaleCredits = () => {
  const { resetToStart } = useSectionsContext();
  const params = new URLSearchParams(window.location.search);
  const isLocalHost = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
  const isLocalBarePreview = isLocalHost && params.has("finaleBare");
  const isLocalFinalePreview = isLocalHost && params.has("finalePreview");
  const shouldAutoReturn = !isLocalFinalePreview || params.has("finaleReturnPreview");
  const rootRef = useRef<HTMLElement>(null);
  const [activeChapter, setActiveChapter] = useState(-1);
  const [activeScene, setActiveScene] = useState(0);
  const [elapsedSecond, setElapsedSecond] = useState(0);
  const [durationSecond, setDurationSecond] = useState(143);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    prepareFinaleAudio();
    let frame = 0;
    let returnTimer = 0;
    let returnScheduled = false;
    let previousChapter = -2;
    let previousScene = -1;
    let previousSecond = -1;
    let previousDuration = -1;
    let previousPercent = -1;
    let previousPlaying = false;
    let previousStarted = false;
    let previousEnded = false;

    const update = () => {
      const playback = getFinalePlayback();
      const chapter = playback.progress >= FINAL_CHAPTER_START
        ? CHAPTERS.length
        : CHAPTERS.reduce(
            (latest, item, index) => playback.progress >= item.start ? index : latest,
            -1,
          );
      const scene = SCENE_STARTS.reduce<number>(
        (latest, start, index) => playback.progress >= start ? index : latest,
        0,
      );
      const root = rootRef.current;
      const progressWidth = `${(playback.progress * 100).toFixed(3)}%`;
      root?.style.setProperty("--finale-progress", String(playback.progress));
      root?.style.setProperty("--finale-progress-width", progressWidth);
      root?.style.setProperty("--finale-progress-left", progressWidth);

      if (chapter !== previousChapter) {
        previousChapter = chapter;
        setActiveChapter(chapter);
      }
      if (scene !== previousScene) {
        previousScene = scene;
        setActiveScene(scene);
      }
      const nextSecond = Math.floor(playback.currentTime);
      if (nextSecond !== previousSecond) {
        previousSecond = nextSecond;
        setElapsedSecond(nextSecond);
      }
      const nextDuration = Math.round(playback.duration);
      if (nextDuration !== previousDuration) {
        previousDuration = nextDuration;
        setDurationSecond(nextDuration);
      }
      const nextPercent = Math.round(playback.progress * 100);
      if (nextPercent !== previousPercent) {
        previousPercent = nextPercent;
        setProgressPercent(nextPercent);
      }
      if (playback.isPlaying !== previousPlaying) {
        previousPlaying = playback.isPlaying;
        setIsPlaying(playback.isPlaying);
      }
      if (playback.hasStarted !== previousStarted) {
        previousStarted = playback.hasStarted;
        setHasStarted(playback.hasStarted);
      }
      if (playback.hasEnded !== previousEnded) {
        previousEnded = playback.hasEnded;
        setHasEnded(playback.hasEnded);
      }

      if (playback.hasEnded && !returnScheduled && shouldAutoReturn) {
        returnScheduled = true;
        returnTimer = window.setTimeout(() => {
          stopFinaleAudio();
          resetToStart();
        }, 900);
      }

      frame = window.requestAnimationFrame(update);
    };

    frame = window.requestAnimationFrame(update);
    return () => {
      window.cancelAnimationFrame(frame);
      if (returnTimer) window.clearTimeout(returnTimer);
    };
  }, [resetToStart, shouldAutoReturn]);

  const state = hasEnded ? "returning" : isPlaying ? "rolling" : hasStarted ? "paused" : "ready";

  const toggleCredits = () => {
    const playback = getFinalePlayback();
    if (playback.hasStarted || playback.isPlaying || playback.hasEnded) {
      stopFinaleAudio();
      resetToStart();
      return;
    }
    void startFinaleAudio();
  };

  return (
    <section
      ref={rootRef}
      className={`finale-credits${isLocalBarePreview ? " finale-credits--bare" : ""}`}
      data-phase={activeChapter < 0 ? "opening" : activeChapter >= CHAPTERS.length ? "final" : "chapter"}
      data-state={state}
      aria-label="LEGO story journey rolling credits"
    >
      <div className="finale-credits__vignette" aria-hidden="true" />
      <div className="finale-credits__scan" aria-hidden="true" />
      <div className="finale-studs" aria-hidden="true">
        {Array.from({ length: 24 }, (_, index) => (
          <i
            key={index}
            style={{
              "--stud-index": index,
              "--stud-x": `${(index * 37) % 101}%`,
              "--stud-size": `${6 + (index % 4) * 3}px`,
              "--stud-delay": `${-((index * 0.83) % 7)}s`,
            } as CSSProperties}
          />
        ))}
      </div>

      <header className="finale-credits__header">
        <div>
          <span>BUILDING BEYOND THE BRICK</span>
          <strong>THE LEGO JOURNEY · 1932—2023</strong>
        </div>
        <p>
          {hasEnded
            ? "RETURNING TO START"
            : isPlaying
              ? "CLICK ANYWHERE TO END"
              : "CLICK ANYWHERE TO START"}
        </p>
      </header>

      <div className="finale-scenes" aria-live="off">
        <section className={`finale-scene finale-roll__opening${activeScene === 0 ? " is-active" : ""}`}>
          <p>FOUR MOVES. ONE SYSTEM.</p>
          <h2>How one brick became an entrance to countless worlds.</h2>
          <span>Character → Translation → Continuity → Participation</span>
        </section>

        {ROLLING_CREDITS.map((credit, index) => (
          <article
            key={credit.year}
            className={`finale-scene finale-roll__beat${activeScene === index + 1 ? " is-active" : ""}`}
            style={{ "--credit-color": credit.color } as CSSProperties}
          >
            <span>{credit.year}</span>
            <p>{credit.kicker}</p>
            <h2>{credit.title}</h2>
            <small>{credit.copy}</small>
          </article>
        ))}

        <section className={`finale-scene finale-roll__resolution${activeScene === 8 ? " is-active" : ""}`}>
          <p>THE STRATEGIC ANSWER</p>
          <h2>THE BRICK STAYS AT THE CENTER.</h2>
          <span>Entertainment creates reach, continuity, agency, and recurrence.</span>
          <strong>EVERY LOOP MUST RETURN VALUE TO PHYSICAL PLAY.</strong>
          <small>Partner for production. Control the play system.</small>
        </section>

        <section className={`finale-scene finale-roll__closing${activeScene === 9 ? " is-active" : ""}`}>
          <p>THE END IS ANOTHER START</p>
          <h2>KEEP BUILDING.</h2>
          <span>Thank you.</span>
        </section>
      </div>

      <footer className="finale-timeline">
        <div className="finale-timeline__rail" aria-hidden="true"><i /></div>
        <ol>
          {CHAPTERS.map((item, index) => (
            <li
              key={item.year}
              className={activeChapter >= index ? "is-revealed" : ""}
              style={{ "--chapter-color": item.color } as CSSProperties}
            >
              <i />
              <strong>{item.year}</strong>
              <span>{item.action}</span>
            </li>
          ))}
        </ol>
        <div className="finale-timeline__status">
          <strong>{progressPercent}%</strong>
          <span>{formatTime(elapsedSecond)} / {formatTime(durationSecond)}</span>
        </div>
      </footer>

      <button
        type="button"
        className="finale-click-surface"
        data-deck-interactive
        aria-label={isPlaying ? "End credits and return to the beginning" : "Start rolling credits"}
        onClick={toggleCredits}
      />
    </section>
  );
};
