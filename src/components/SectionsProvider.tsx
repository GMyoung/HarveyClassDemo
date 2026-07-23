import { useCallback, useEffect, useState, type PropsWithChildren } from "react";
import { SectionsContext } from "@/contexts/Sections";
import { clampAsSectionValue } from "@/util";
import { SLIDE_COUNT, type Section } from "@/constants";
const wrapSlide = (value: number) => ((value % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT;

const classes: Record<Section, string> = {
  0: "home",
  1: "contact",
  2: "workProject",
  3: "workExperience",
};

export const SectionsProvider = ({ children }: PropsWithChildren) => {
  const isLocalFinalePreview =
    (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") &&
    new URLSearchParams(window.location.search).has("finalePreview");
  const [section, setSection] = useState(isLocalFinalePreview ? -19 : 0);
  const [slideIndex, setSlideIndex] = useState(isLocalFinalePreview ? SLIDE_COUNT - 1 : 0);
  const [hasEntered, setHasEntered] = useState(isLocalFinalePreview);
  const activeSection = clampAsSectionValue(section);

  useEffect(() => {
    document.body.classList.add(classes[0]);
    return () => document.body.classList.remove(classes[0]);
  }, []);

  const rotate = useCallback((direction: 1 | -1) => {
    setSlideIndex((current) => wrapSlide(current - direction));
    setSection((q) => {
      const prev = clampAsSectionValue(q);
      const next = clampAsSectionValue(q + direction);
      document.body.classList.remove(classes[prev]);
      document.body.classList.add(classes[next]);
      return q + direction;
    });
  }, []);

  const advance = useCallback(() => {
    if (!hasEntered) {
      setHasEntered(true);
      return;
    }
    rotate(-1);
  }, [hasEntered, rotate]);

  const resetToStart = useCallback(() => {
    Object.values(classes).forEach((className) => document.body.classList.remove(className));
    document.body.classList.add(classes[0]);
    setSection(0);
    setSlideIndex(0);
    setHasEntered(false);
  }, []);

  return (
    <SectionsContext.Provider
      value={{
        section,
        activeSection,
        slideIndex,
        slideCount: SLIDE_COUNT,
        hasEntered,
        rotate,
        advance,
        resetToStart,
      }}
    >
      {children}
    </SectionsContext.Provider>
  );
};
