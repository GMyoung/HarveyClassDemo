import {
  useCallback,
  useRef,
  useState,
  type PropsWithChildren,
  type CSSProperties,
  type TransitionEventHandler,
} from "react";
import { ModalContext, type ModalContextValue, type ModalKey } from "@/contexts/Modal";
import { workExperience, type JobTitle, workProjects, type ProjectName } from "@/constants";
import type { WorkExperience } from "@johnrdoty92/resume-generator";

const MODAL_CLASSNAMES = {
  VISIBLE: "modal-visible",
} as const;

type Entry = (typeof workExperience)[JobTitle] | (typeof workProjects)[ProjectName];

const formatWorkExperienceDateDelta = ({ start, end: _end }: WorkExperience) => {
  const end = _end === "Present" ? new Date() : _end;
  const yearDelta = end.getFullYear() - start.getFullYear();
  const monthDelta = end.getMonth() - start.getMonth() + 12 * yearDelta;
  const years = Math.floor(monthDelta / 12);
  const months = monthDelta % 12;
  const yearLabel = years > 0 ? `${years} year${years > 1 ? "s" : ""}` : "";
  const monthLabel = months > 0 ? `${months} month${months > 1 ? "s" : ""}` : "";
  return "(" + `${yearLabel} ${monthLabel}`.trim() + ")";
};

export const Modal = ({ children }: PropsWithChildren) => {
  const modal = useRef<HTMLDialogElement>(null!);
  const onCloseRef = useRef<(() => void) | undefined>(undefined);
  const activeKeyRef = useRef<ModalKey | null>(null);
  const [entry, setEntry] = useState<Entry | null>(null);
  const [activeKey, setActiveKey] = useState<ModalKey | null>(null);

  const open: ModalContextValue["open"] = useCallback((key, onClose) => {
    const relevantEntry = workExperience[key as JobTitle] || workProjects[key as ProjectName];
    if (activeKeyRef.current !== null && activeKeyRef.current !== key) onCloseRef.current?.();
    setEntry(relevantEntry);
    setActiveKey(key);
    activeKeyRef.current = key;
    if (!modal.current.open) modal.current.showModal();
    modal.current.classList.add(MODAL_CLASSNAMES.VISIBLE);
    onCloseRef.current = onClose;
  }, []);

  const close: ModalContextValue["close"] = useCallback(() => {
    modal.current.classList.remove(MODAL_CLASSNAMES.VISIBLE);
    onCloseRef.current?.();
    onCloseRef.current = undefined;
    activeKeyRef.current = null;
    setActiveKey(null);
  }, []);

  const handleTransitionEnd: TransitionEventHandler<HTMLDialogElement> = (e) => {
    const { propertyName, target } = e;
    if (propertyName !== "opacity" || !(target instanceof HTMLDialogElement)) return;
    e.stopPropagation();
    const isExited = !(target as HTMLDialogElement).classList.contains(MODAL_CLASSNAMES.VISIBLE);
    if (isExited) modal.current.close();
  };

  return (
    <ModalContext.Provider value={{ activeKey, open, close }}>
      {children}
      <dialog
        ref={modal}
        onTransitionEnd={handleTransitionEnd}
        onClick={(e) => {
          const isCloseRequest = e.target === modal.current;
          if (isCloseRequest) close();
        }}
      >
        {entry &&
          ("company" in entry ? (
            <>
              <div className="dialog-title">
                <h2 slot="title">{entry.title}</h2>
                <button aria-label="Close" onClick={close}>
                  X
                </button>
              </div>
              <div className="stack">
                <a href={entry.companyUrl} target="_blank" className="company-logo">
                  <img src={entry.logoSrc} alt={`${entry.company} logo`} />
                </a>
                <p className="company">
                  <a href={entry.companyUrl} target="_blank">
                    {entry.company}
                  </a>
                  <span>({entry.location})</span>
                </p>
                <p className="duration">
                  <span className="dates">
                    {entry.start.toLocaleDateString()} -{" "}
                    {entry.end === "Present" ? entry.end : entry.end.toLocaleDateString()}{" "}
                  </span>
                  <span className="delta">{formatWorkExperienceDateDelta(entry)}</span>
                </p>
                <ul className="achievements">
                  {entry.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="lego-story-modal">
              <nav className="story-project-tabs" aria-label="Choose a LEGO work">
                {(Object.keys(workProjects) as ProjectName[]).map((projectKey) => (
                  <button
                    key={projectKey}
                    type="button"
                    className={activeKey === projectKey ? "active" : ""}
                    aria-pressed={activeKey === projectKey}
                    onClick={() => open(projectKey)}
                  >
                    {projectKey === "ninjago"
                      ? "NINJAGO"
                      : projectKey === "lego_movie"
                        ? "LEGO Movie"
                        : "LEGO Fortnite"}
                  </button>
                ))}
              </nav>
              <div className="dialog-title">
                <div>
                  <p className="story-eyebrow">{entry.eyebrow}</p>
                  <h2 slot="title">{entry.projectName}</h2>
                </div>
                <button aria-label="Close" onClick={close}>
                  X
                </button>
              </div>
              <p className="story-summary">{entry.description}</p>
              <ol className="story-sequence">
                {entry.achievements.map((achievement, i) => (
                  <li key={i} style={{ "--story-index": i } as CSSProperties}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <p>{achievement}</p>
                  </li>
                ))}
              </ol>
              <p className="story-click-note">Click anywhere or use remote next to continue.</p>
            </div>
          ))}
      </dialog>
    </ModalContext.Provider>
  );
};
