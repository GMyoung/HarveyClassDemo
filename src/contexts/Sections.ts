import { createContext, useContext } from "react";
import type { Section } from "@/constants";

type SectionsContextValue = {
  section: number;
  activeSection: Section;
  slideIndex: number;
  slideCount: number;
  hasEntered: boolean;
  rotate: (direction: 1 | -1) => void;
  advance: () => void;
  resetToStart: () => void;
};

export const SectionsContext = createContext<SectionsContextValue | null>(null);

export const useSectionsContext = () => {
  const value = useContext(SectionsContext);
  if (!value) throw new Error("SectionsContext must be used within provider");
  return value;
};
