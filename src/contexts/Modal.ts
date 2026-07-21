import { createContext, useContext } from "react";
import type { JobTitle, ProjectName } from "@/constants";

export type ModalKey = JobTitle | ProjectName;

export type ModalContextValue = {
  activeKey: ModalKey | null;
  open: (key: ModalKey, onClose?: () => void) => void;
  close: () => void;
};

export const ModalContext = createContext<ModalContextValue | null>(null);

export const useModalContext = () => {
  const value = useContext(ModalContext);
  if (!value) throw new Error("ModalContext must be used within provider");
  return value;
};
