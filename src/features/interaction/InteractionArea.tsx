import { useCallback, useEffect } from "react";
import { useSectionsContext } from "@/contexts/Sections";
import { useModalContext } from "@/contexts/Modal";
import { SLIDE_TITLES, type ProjectName } from "@/constants";

const RemoteIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="7" y="2.5" width="10" height="19" rx="4" />
    <circle cx="12" cy="7" r="1.5" />
    <path d="m9.5 12 2.5-2.5 2.5 2.5M12 9.5v6" />
    <circle cx="12" cy="18" r="0.75" fill="currentColor" stroke="none" />
  </svg>
);

const projectSequence: ProjectName[] = ["ninjago", "lego_movie", "lego_fortnite"];

export const InteractionArea = () => {
  const { slideIndex, slideCount, hasEntered, advance, rotate } = useSectionsContext();
  const { activeKey, open, close } = useModalContext();

  const goNext = useCallback(() => {
    if (slideIndex !== 2) {
      advance();
      return;
    }

    const projectIndex = projectSequence.findIndex((key) => key === activeKey);
    if (activeKey === null || projectIndex === -1) {
      open(projectSequence[0]);
    } else if (projectIndex < projectSequence.length - 1) {
      open(projectSequence[projectIndex + 1]);
    } else {
      close();
      advance();
    }
  }, [activeKey, advance, close, open, slideIndex]);

  const goPrevious = useCallback(() => {
    const projectIndex = projectSequence.findIndex((key) => key === activeKey);
    if (slideIndex === 2 && projectIndex >= 0) {
      if (projectIndex === 0) close();
      else open(projectSequence[projectIndex - 1]);
      return;
    }

    if (hasEntered) rotate(1);
    else advance();
  }, [activeKey, advance, close, hasEntered, open, rotate, slideIndex]);

  const cue =
    slideIndex === 2
      ? activeKey === "ninjago"
        ? "Next: The LEGO Movie"
        : activeKey === "lego_movie"
          ? "Next: LEGO Fortnite"
          : activeKey === "lego_fortnite"
            ? `Next: ${SLIDE_TITLES[3]}`
            : "Open: NINJAGO Story"
      : slideIndex === slideCount - 1
        ? "Back to the Crew"
        : `Next: ${SLIDE_TITLES[slideIndex + 1]}`;

  useEffect(() => {
    const nextKeys = new Set(["ArrowRight", "ArrowDown", "PageDown", "Enter", " "]);
    const previousKeys = new Set(["ArrowLeft", "ArrowUp", "PageUp", "Backspace"]);
    const interactiveSelector = "button, a, input, textarea, select, [contenteditable='true']";
    let pointerStart: { x: number; y: number } | null = null;
    let didDrag = false;

    const hasOpenDialog = () => document.querySelector("dialog[open]") !== null;

    const handlePointerDown = (event: PointerEvent) => {
      pointerStart = { x: event.clientX, y: event.clientY };
      didDrag = false;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!pointerStart) return;
      const distance = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
      if (distance > 8) didDrag = true;
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const isInteractive = target?.closest(interactiveSelector) !== null;
      pointerStart = null;

      if (didDrag || isInteractive) {
        didDrag = false;
        return;
      }

      if (hasOpenDialog()) {
        event.stopPropagation();
        didDrag = false;
        goNext();
        return;
      }

      didDrag = false;
      window.setTimeout(() => {
        if (!hasOpenDialog()) goNext();
      }, 0);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (
        event.repeat ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        target?.matches("input, textarea, select, [contenteditable='true']")
      ) {
        return;
      }

      if (nextKeys.has(event.key)) {
        event.preventDefault();
        goNext();
      } else if (previousKeys.has(event.key)) {
        event.preventDefault();
        goPrevious();
      }
    };

    window.addEventListener("pointerdown", handlePointerDown, true);
    window.addEventListener("pointermove", handlePointerMove, true);
    window.addEventListener("click", handleClick, true);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown, true);
      window.removeEventListener("pointermove", handlePointerMove, true);
      window.removeEventListener("click", handleClick, true);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goNext, goPrevious]);

  return (
    <div className="interaction-area">
      <div className="actions">
        <button className="story-advance" onClick={goNext} aria-label="Advance the LEGO story">
          <RemoteIcon />
          <span>
            <strong>{hasEntered ? cue : "Click anywhere to meet the crew"}</strong>
            <small>{hasEntered ? "Click anywhere | Remote next" : "Remote: Space / Right / Page Down"}</small>
          </span>
        </button>
        <div className="story-progress" aria-hidden="true">
          {Array.from({ length: slideCount }, (_, slide) => (
            <span key={slide} className={hasEntered && slideIndex === slide ? "active" : ""} />
          ))}
        </div>
      </div>
    </div>
  );
};
