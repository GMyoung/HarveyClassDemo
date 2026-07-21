import type { ResumeProps } from "@johnrdoty92/resume-generator";

export const workProjects = {
  ninjago: {
    projectName: "NINJAGO: An Owned Story Engine",
    eyebrow: "TV → CHARACTERS → SETS → NEW STORIES",
    url: "https://www.lego.com/themes/ninjago",
    description:
      "NINJAGO turned product characters into a renewable story world. Television gave LEGO a recurring rhythm for heroes, villains, vehicles, and locations.",
    achievements: [
      "Characters create continuity beyond a single box.",
      "Each season introduces buildable places, vehicles, and conflicts.",
      "The story returns attention and demand to physical play.",
    ],
  },
  lego_movie: {
    projectName: "The LEGO Movie: Brand as Story",
    eyebrow: "FILM → CULTURAL REACH → BRAND MEANING",
    url: "https://www.lego.com/themes/the-lego-movie-2",
    description:
      "The LEGO Movie made the brand's play philosophy the story: everything can be rebuilt, instructions can be challenged, and any world can become LEGO play.",
    achievements: [
      "Film created recognizable characters and a reusable comic voice.",
      "The movie translated product grammar into mass culture.",
      "LEGO controlled the brand and play loop while studios carried production risk.",
    ],
  },
  lego_fortnite: {
    projectName: "LEGO Fortnite: A Persistent Relationship",
    eyebrow: "PLATFORM → PARTICIPATION → PHYSICAL PLAY",
    url: "https://www.lego.com/themes/fortnite",
    description:
      "LEGO Fortnite extends one-off content into an always-on world where players build, explore, create, and return across digital and physical play.",
    achievements: [
      "Live updates turn audiences into recurring participants.",
      "Digital mechanics reveal new characters, places, and set ideas.",
      "The strongest platform loop sends value back to the brick.",
    ],
  },
} as const satisfies Record<
  string,
  ResumeProps["workProjects"][number] & { description: string; eyebrow: string }
>;

export type ProjectName = keyof typeof workProjects;
