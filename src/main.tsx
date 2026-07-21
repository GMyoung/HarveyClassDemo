import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { SectionsProvider } from "./components/SectionsProvider.tsx";
import { InteractionArea, Modal, NarrativeDeck } from "@/features/interaction";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SectionsProvider>
      <Modal>
        <App />
        <NarrativeDeck />
        <InteractionArea />
      </Modal>
    </SectionsProvider>
  </StrictMode>,
);
