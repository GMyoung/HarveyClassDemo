import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useSectionsContext } from "@/contexts/Sections";
import {
  getFinalePlayback,
  prepareFinaleAudio,
  startFinaleAudio,
  stopFinaleAudio,
} from "./finaleAudio";
import "./FinaleCredits.css";

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

export const FinaleCredits = () => {
  const { resetToStart } = useSectionsContext();
  const params = new URLSearchParams(window.location.search);
  const isLocalHost = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
  const isLocalBarePreview = isLocalHost && params.has("finaleBare");
  const isLocalFinalePreview = isLocalHost && params.has("finalePreview");
  const shouldAutoReturn = !isLocalFinalePreview || params.has("finaleReturnPreview");
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    prepareFinaleAudio();
    let frame = 0;
    let returnTimer = 0;
    let returnScheduled = false;
    let previousPlaying = false;
    let previousStarted = false;
    let previousEnded = false;

    const update = () => {
      const playback = getFinalePlayback();
      const root = rootRef.current;
      const track = trackRef.current;

      if (root) {
        if (track) {
          const startY = root.clientHeight * 0.18;
          const endY = root.clientHeight * 0.74 - track.scrollHeight;
          const rollY = startY + (endY - startY) * playback.progress;
          root.style.setProperty("--finale-roll-y", `${rollY.toFixed(1)}px`);
        }
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
        }, 1100);
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
      data-state={state}
      aria-label="LEGO story journey rolling credits"
    >
      <div className="finale-backdrop" aria-hidden="true">
        <div className="finale-backdrop__glow" />
        <div className="finale-backdrop__bricks">
          {Array.from({ length: 18 }, (_, index) => (
            <i
              key={index}
              style={{
                "--brick-index": index,
                "--brick-x": `${(index * 41) % 101}%`,
                "--brick-delay": `${-((index * 1.13) % 11)}s`,
              } as CSSProperties}
            />
          ))}
        </div>
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

      <div className="finale-roll-window" aria-live="off">
        <div ref={trackRef} className="finale-roll-track">
          <section className="finale-roll-title">
            <p>STORY CREDITS</p>
            <h2>How one brick became an entrance to countless worlds.</h2>
            <span>Character → Translation → Continuity → Participation</span>
          </section>

          {ROLLING_CREDITS.map((credit) => (
            <article
              key={credit.year}
              className="finale-credit"
              style={{ "--credit-color": credit.color } as CSSProperties}
            >
              <div>
                <span>{credit.year}</span>
                <i aria-hidden="true" />
              </div>
              <section>
                <p>{credit.kicker}</p>
                <h2>{credit.title}</h2>
                <small>{credit.copy}</small>
              </section>
            </article>
          ))}

          <section className="finale-roll-answer">
            <p>THE STRATEGIC ANSWER</p>
            <h2>THE BRICK STAYS AT THE CENTER.</h2>
            <span>Entertainment creates reach, continuity, agency, and recurrence.</span>
            <strong>EVERY LOOP MUST RETURN VALUE TO PHYSICAL PLAY.</strong>
            <small>Partner for production. Control the play system.</small>
          </section>

          <section className="finale-roll-thanks">
            <p>THE END IS ANOTHER START</p>
            <h2>KEEP BUILDING.</h2>
            <span>Thank you.</span>
          </section>
        </div>
      </div>

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
