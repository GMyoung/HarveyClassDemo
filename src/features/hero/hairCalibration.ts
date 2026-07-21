export const CREW_HAIR_STYLES = [
  "HairFrenchBraid",
  "HairSideBraids",
  "HairPigtailsHigh",
  "HairPigtailsClassic",
] as const;

export type CrewHair = (typeof CREW_HAIR_STYLES)[number];

export type HairTransform = {
  position: [number, number, number];
  rotationY: number;
  scale: number;
};

export const HAIR_TRANSFORMS: Record<CrewHair, HairTransform> = {
  HairFrenchBraid: { position: [0.04, 2.44, -0.6], rotationY: 0.11, scale: 45 },
  HairSideBraids: { position: [0, 2.41, -0.59], rotationY: -0.09, scale: 45 },
  HairPigtailsHigh: { position: [-0.01, 2.43, -0.64], rotationY: 0, scale: 45 },
  HairPigtailsClassic: { position: [-0.08, 2.46, -0.56], rotationY: 0, scale: 45 },
};
