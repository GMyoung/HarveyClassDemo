import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import type { CrewHair, HairTransform } from "./hairCalibration";
import {
  HERO_CALIBRATION_STORAGE_KEY,
  HeroCalibrationContext,
  cloneHairTransform,
  clonePosition,
  createDefaultHeroCalibration,
  readStoredCalibration,
  type CrewId,
  type PositionTuple,
} from "./heroCalibrationState";

export const HeroCalibrationProvider = ({ children }: PropsWithChildren) => {
  const [calibration, setCalibration] = useState(readStoredCalibration);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        window.localStorage.setItem(HERO_CALIBRATION_STORAGE_KEY, JSON.stringify(calibration));
      } catch {
        // The panel still works in-memory when storage is unavailable.
      }
    }, 120);
    return () => window.clearTimeout(timeout);
  }, [calibration]);

  const setCrewPosition = useCallback((id: CrewId, position: PositionTuple) => {
    setCalibration((current) => ({
      ...current,
      crewPositions: { ...current.crewPositions, [id]: clonePosition(position) },
    }));
  }, []);

  const setHairTransform = useCallback((style: CrewHair, transform: HairTransform) => {
    setCalibration((current) => ({
      ...current,
      hairTransforms: {
        ...current.hairTransforms,
        [style]: cloneHairTransform(transform),
      },
    }));
  }, []);

  const resetCrewPosition = useCallback((id: CrewId) => {
    const defaults = createDefaultHeroCalibration();
    setCrewPosition(id, defaults.crewPositions[id]);
  }, [setCrewPosition]);

  const resetHairTransform = useCallback((style: CrewHair) => {
    const defaults = createDefaultHeroCalibration();
    setHairTransform(style, defaults.hairTransforms[style]);
  }, [setHairTransform]);

  const value = useMemo(
    () => ({
      calibration,
      setCrewPosition,
      setHairTransform,
      resetCrewPosition,
      resetHairTransform,
    }),
    [
      calibration,
      resetCrewPosition,
      resetHairTransform,
      setCrewPosition,
      setHairTransform,
    ],
  );

  return <HeroCalibrationContext.Provider value={value}>{children}</HeroCalibrationContext.Provider>;
};
