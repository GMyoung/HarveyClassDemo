import { Suspense } from "react";
import { Laptop } from "./Laptop";
import { useSectionsContext } from "@/contexts/Sections";

export const WorkProjects = () => {
  const { slideIndex } = useSectionsContext();
  if (slideIndex !== 2) return null;

  return (
    <Suspense>
      <Laptop position="left" screen="ninjago" />
      <Laptop position="center" screen="lego_movie" />
      <Laptop position="right" screen="lego_fortnite" />
    </Suspense>
  );
};
