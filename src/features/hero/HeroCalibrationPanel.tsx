import { useEffect, useMemo, useState } from "react";
import { useSectionsContext } from "@/contexts/Sections";
import type { CrewHair, HairTransform } from "./hairCalibration";
import {
  HERO_CALIBRATION_LIMITS,
  clampCalibrationValue,
  useHeroCalibration,
  type CrewId,
  type PositionTuple,
} from "./heroCalibrationState";
import "./HeroCalibrationPanel.css";

type CalibrationMode = "crew" | "hair";
type DockSide = "left" | "right";
type TupleIndex = 0 | 1 | 2;

const CREW_OPTIONS: Array<{ id: CrewId; label: string }> = [
  { id: "harvey", label: "Harvey Yang" },
  { id: "olivia", label: "Olivia" },
  { id: "tinya", label: "Tinya" },
  { id: "june", label: "June" },
  { id: "anglea", label: "Angela" },
];

const HAIR_OPTIONS: Array<{ crewId: CrewId; label: string; style: CrewHair }> = [
  { crewId: "olivia", label: "Olivia", style: "HairFrenchBraid" },
  { crewId: "tinya", label: "Tinya", style: "HairSideBraids" },
  { crewId: "june", label: "June", style: "HairPigtailsHigh" },
  { crewId: "anglea", label: "Angela", style: "HairPigtailsClassic" },
];

const POSITION_FIELDS: Array<{ label: string; index: TupleIndex }> = [
  { label: "X", index: 0 },
  { label: "Y", index: 1 },
  { label: "Z", index: 2 },
];

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const didCopy = document.execCommand("copy");
    textarea.remove();
    return didCopy;
  }
};

const CalibrationNumber = ({
  label,
  value,
  step,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  step: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) => {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => setDraft(String(value)), [value]);

  return (
    <label className="hero-calibration__number">
      <span>{label}</span>
      <input
        type="number"
        inputMode="decimal"
        value={draft}
        step={step}
        min={min}
        max={max}
        onChange={(event) => {
          const nextDraft = event.target.value;
          setDraft(nextDraft);
          const nextValue = Number(nextDraft);
          if (nextDraft.trim() !== "" && Number.isFinite(nextValue)) {
            const clampedValue = clampCalibrationValue(nextValue, min, max);
            onChange(clampedValue);
            if (clampedValue !== nextValue) setDraft(String(clampedValue));
          }
        }}
        onBlur={() => {
          const nextValue = Number(draft);
          if (draft.trim() === "" || !Number.isFinite(nextValue)) {
            setDraft(String(value));
          } else {
            setDraft(String(clampCalibrationValue(nextValue, min, max)));
          }
        }}
      />
    </label>
  );
};

export const HeroCalibrationPanel = () => {
  const { slideIndex, hasEntered } = useSectionsContext();
  const {
    calibration,
    setCrewPosition,
    setHairTransform,
    resetCrewPosition,
    resetHairTransform,
  } = useHeroCalibration();
  const [mode, setMode] = useState<CalibrationMode>("crew");
  const [crewId, setCrewId] = useState<CrewId>("harvey");
  const [hairCrewId, setHairCrewId] = useState<CrewId>("olivia");
  const [collapsed, setCollapsed] = useState(false);
  const [dockSide, setDockSide] = useState<DockSide>("right");
  const [copyStatus, setCopyStatus] = useState("Copy JSON");

  const selectedHair = HAIR_OPTIONS.find((option) => option.crewId === hairCrewId) ?? HAIR_OPTIONS[0];
  const crewPosition = calibration.crewPositions[crewId];
  const hairTransform = calibration.hairTransforms[selectedHair.style];

  const exportValue = useMemo(
    () => ({
      version: 1,
      visible: true,
      members: Object.fromEntries(
        CREW_OPTIONS.map((option) => [
          option.label,
          { position: calibration.crewPositions[option.id] },
        ]),
      ),
      transforms: calibration.hairTransforms,
    }),
    [calibration],
  );

  useEffect(() => {
    if (copyStatus === "Copy JSON") return;
    const timeout = window.setTimeout(() => setCopyStatus("Copy JSON"), 1400);
    return () => window.clearTimeout(timeout);
  }, [copyStatus]);

  if (slideIndex !== 0 || !hasEntered) return null;

  const updateCrewAxis = (index: TupleIndex, value: number) => {
    const next = [...crewPosition] as PositionTuple;
    next[index] = value;
    setCrewPosition(crewId, next);
  };

  const updateHairPositionAxis = (index: TupleIndex, value: number) => {
    const next: HairTransform = {
      ...hairTransform,
      position: [...hairTransform.position],
    };
    next.position[index] = value;
    setHairTransform(selectedHair.style, next);
  };

  return (
    <aside
      className={`hero-calibration hero-calibration--${dockSide}`}
      data-deck-interactive
      aria-label="Temporary crew calibration panel"
    >
      <header className="hero-calibration__header">
        <span aria-hidden="true" className="hero-calibration__stud" />
        <div>
          <small>TEMP TOOL</small>
          <strong>Crew tuner</strong>
        </div>
        <button
          type="button"
          className="hero-calibration__icon-button"
          onClick={() => setDockSide((current) => (current === "right" ? "left" : "right"))}
          aria-label={`Dock panel on the ${dockSide === "right" ? "left" : "right"}`}
          title="Switch side"
        >
          ⇄
        </button>
        <button
          type="button"
          className="hero-calibration__icon-button"
          onClick={() => setCollapsed((current) => !current)}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expand calibration panel" : "Collapse calibration panel"}
        >
          {collapsed ? "+" : "−"}
        </button>
      </header>

      {!collapsed && (
        <div className="hero-calibration__body">
          <div className="hero-calibration__tabs" role="tablist" aria-label="Calibration type">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "crew"}
              onClick={() => setMode("crew")}
            >
              Person
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "hair"}
              onClick={() => setMode("hair")}
            >
              Hair
            </button>
          </div>

          {mode === "crew" ? (
            <>
              <label className="hero-calibration__select">
                <span>Character</span>
                <select value={crewId} onChange={(event) => setCrewId(event.target.value as CrewId)}>
                  {CREW_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>{option.label}</option>
                  ))}
                </select>
              </label>
              <div className="hero-calibration__grid">
                {POSITION_FIELDS.map((field) => (
                  <CalibrationNumber
                    key={field.label}
                    label={field.label}
                    value={crewPosition[field.index]}
                    step={0.05}
                    min={HERO_CALIBRATION_LIMITS.crewPosition.min}
                    max={HERO_CALIBRATION_LIMITS.crewPosition.max}
                    onChange={(value) => updateCrewAxis(field.index, value)}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <label className="hero-calibration__select">
                <span>Hair owner</span>
                <select value={hairCrewId} onChange={(event) => setHairCrewId(event.target.value as CrewId)}>
                  {HAIR_OPTIONS.map((option) => (
                    <option key={option.crewId} value={option.crewId}>{option.label}</option>
                  ))}
                </select>
                <small>{selectedHair.style}</small>
              </label>
              <div className="hero-calibration__grid">
                {POSITION_FIELDS.map((field) => (
                  <CalibrationNumber
                    key={field.label}
                    label={field.label}
                    value={hairTransform.position[field.index]}
                    step={0.01}
                    min={HERO_CALIBRATION_LIMITS.hairPosition.min}
                    max={HERO_CALIBRATION_LIMITS.hairPosition.max}
                    onChange={(value) => updateHairPositionAxis(field.index, value)}
                  />
                ))}
                <CalibrationNumber
                  label="ROT Y"
                  value={hairTransform.rotationY}
                  step={0.01}
                  min={HERO_CALIBRATION_LIMITS.hairRotationY.min}
                  max={HERO_CALIBRATION_LIMITS.hairRotationY.max}
                  onChange={(rotationY) => setHairTransform(selectedHair.style, { ...hairTransform, rotationY })}
                />
                <CalibrationNumber
                  label="SCALE"
                  value={hairTransform.scale}
                  step={0.5}
                  min={HERO_CALIBRATION_LIMITS.hairScale.min}
                  max={HERO_CALIBRATION_LIMITS.hairScale.max}
                  onChange={(scale) => setHairTransform(selectedHair.style, { ...hairTransform, scale })}
                />
              </div>
            </>
          )}

          <div className="hero-calibration__actions">
            <button
              type="button"
              onClick={() => {
                if (mode === "crew") resetCrewPosition(crewId);
                else resetHairTransform(selectedHair.style);
              }}
            >
              Reset selected
            </button>
            <button
              type="button"
              className="hero-calibration__copy"
              onClick={async () => {
                const didCopy = await copyText(JSON.stringify(exportValue, null, 2));
                setCopyStatus(didCopy ? "Copied!" : "Copy failed");
              }}
            >
              {copyStatus}
            </button>
          </div>
          <p className="hero-calibration__hint">Auto-saved here. Copy JSON and send it to me when finished.</p>
        </div>
      )}
    </aside>
  );
};
