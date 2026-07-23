import { createContext, useContext } from "react";
import {
  CREW_HAIR_STYLES,
  HAIR_TRANSFORMS,
  type CrewHair,
  type HairTransform,
} from "./hairCalibration";

export const HERO_CALIBRATION_STORAGE_KEY = "lego-hero-calibration-v4";

export const CREW_IDS = ["harvey", "olivia", "tinya", "june", "anglea"] as const;
export type CrewId = (typeof CREW_IDS)[number];
export type PositionTuple = [number, number, number];

export const HERO_CALIBRATION_LIMITS = {
  crewPosition: { min: -8, max: 8 },
  hairPosition: { min: -4, max: 4 },
  hairRotationY: { min: -3.14, max: 3.14 },
  hairScale: { min: 1, max: 100 },
} as const;

export type HeroCalibration = {
  version: 1;
  crewPositions: Record<CrewId, PositionTuple>;
  hairTransforms: Record<CrewHair, HairTransform>;
};

export type HeroCalibrationContextValue = {
  calibration: HeroCalibration;
  setCrewPosition: (id: CrewId, position: PositionTuple) => void;
  setHairTransform: (style: CrewHair, transform: HairTransform) => void;
  resetCrewPosition: (id: CrewId) => void;
  resetHairTransform: (style: CrewHair) => void;
};

export const clonePosition = (position: PositionTuple): PositionTuple => [...position];
export const cloneHairTransform = (transform: HairTransform): HairTransform => ({
  position: [...transform.position],
  rotationY: transform.rotationY,
  scale: transform.scale,
});

export const createDefaultHeroCalibration = (): HeroCalibration => ({
  version: 1,
  crewPositions: {
    harvey: [0, 0, 0],
    olivia: [-3.5, 0, 1],
    tinya: [-1.75, 0, 0.55],
    june: [1.75, 0, 0.35],
    anglea: [3.5, 0, 0.9],
  },
  hairTransforms: {
    HairFrenchBraid: cloneHairTransform(HAIR_TRANSFORMS.HairFrenchBraid),
    HairSideBraids: cloneHairTransform(HAIR_TRANSFORMS.HairSideBraids),
    HairPigtailsHigh: cloneHairTransform(HAIR_TRANSFORMS.HairPigtailsHigh),
    HairPigtailsClassic: cloneHairTransform(HAIR_TRANSFORMS.HairPigtailsClassic),
  },
});

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export const clampCalibrationValue = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const readPosition = (
  value: unknown,
  fallback: PositionTuple,
  limits: { min: number; max: number },
): PositionTuple => {
  if (!Array.isArray(value) || value.length !== 3 || !value.every(isFiniteNumber)) {
    return clonePosition(fallback);
  }
  return value.map((entry) => clampCalibrationValue(entry, limits.min, limits.max)) as PositionTuple;
};

const readHairTransform = (value: unknown, fallback: HairTransform): HairTransform => {
  if (!value || typeof value !== "object") return cloneHairTransform(fallback);
  const candidate = value as Partial<HairTransform>;
  return {
    position: readPosition(candidate.position, fallback.position, HERO_CALIBRATION_LIMITS.hairPosition),
    rotationY: isFiniteNumber(candidate.rotationY)
      ? clampCalibrationValue(
          candidate.rotationY,
          HERO_CALIBRATION_LIMITS.hairRotationY.min,
          HERO_CALIBRATION_LIMITS.hairRotationY.max,
        )
      : fallback.rotationY,
    scale: isFiniteNumber(candidate.scale)
      ? clampCalibrationValue(
          candidate.scale,
          HERO_CALIBRATION_LIMITS.hairScale.min,
          HERO_CALIBRATION_LIMITS.hairScale.max,
        )
      : fallback.scale,
  };
};

export const readStoredCalibration = (): HeroCalibration => {
  const fallback = createDefaultHeroCalibration();
  try {
    const stored = window.localStorage.getItem(HERO_CALIBRATION_STORAGE_KEY);
    if (!stored) return fallback;
    const parsed = JSON.parse(stored) as Partial<HeroCalibration>;
    return {
      version: 1,
      crewPositions: Object.fromEntries(
        CREW_IDS.map((id) => [
          id,
          readPosition(
            parsed.crewPositions?.[id],
            fallback.crewPositions[id],
            HERO_CALIBRATION_LIMITS.crewPosition,
          ),
        ]),
      ) as Record<CrewId, PositionTuple>,
      hairTransforms: Object.fromEntries(
        CREW_HAIR_STYLES.map((style) => [
          style,
          readHairTransform(parsed.hairTransforms?.[style], fallback.hairTransforms[style]),
        ]),
      ) as Record<CrewHair, HairTransform>,
    };
  } catch {
    return fallback;
  }
};

export const HeroCalibrationContext = createContext<HeroCalibrationContextValue | null>(null);

export const useHeroCalibration = () => {
  const value = useContext(HeroCalibrationContext);
  if (!value) throw new Error("useHeroCalibration must be used within HeroCalibrationProvider");
  return value;
};
