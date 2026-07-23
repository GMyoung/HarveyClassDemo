import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { SectionsProvider } from "./components/SectionsProvider.tsx";
import { InteractionArea, Modal, NarrativeDeck } from "@/features/interaction";
import { HeroCalibrationProvider } from "@/features/hero/HeroCalibrationProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SectionsProvider>
      <HeroCalibrationProvider>
        <Modal>
          <App />
          <NarrativeDeck />
          <InteractionArea />
        </Modal>
      </HeroCalibrationProvider>
    </SectionsProvider>
  </StrictMode>,
);
