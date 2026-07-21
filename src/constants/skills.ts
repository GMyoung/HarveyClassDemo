type Skill = {
  name: string;
  color: string;
  tags: string[];
  path: string;
};

const film = "M8 18h84v64H8zM35 30v40l36-20z";
const character = "M50 8a20 20 0 1 0 0 40 20 20 0 0 0 0-40M16 92c2-25 16-38 34-38s32 13 34 38z";
const game = "M24 30h52l16 42c4 12-9 21-18 12L62 72H38L26 84C17 93 4 84 8 72zM25 48v10h-9v8h9v10h8V66h10v-8H33V48zM70 54a6 6 0 1 0 0 12 6 6 0 0 0 0-12M82 66a6 6 0 1 0 0 12 6 6 0 0 0 0-12";
const brick = "M8 30h84v48H8zM18 20h20v12H18zM62 20h20v12H62zM18 44h20v20H18zM40 44h20v20H40zM62 44h20v20H62z";
const network = "M50 8a12 12 0 1 0 0 24 12 12 0 0 0 0-24M14 66a12 12 0 1 0 0 24 12 12 0 0 0 0-24M86 66a12 12 0 1 0 0 24 12 12 0 0 0 0-24M43 30 25 58l8 5 17-25 17 25 8-5-18-28z";
const strategy = "M10 76h18V46H10zM41 76h18V26H41zM72 76h18V10H72zM8 86h84v8H8z";

export const SKILLS = [
  { name: "Film", color: "#e2231a", tags: ["movie", "reach"], path: film },
  { name: "Television", color: "#ffcf00", tags: ["series", "continuity"], path: film },
  { name: "Games", color: "#087bc1", tags: ["agency", "play"], path: game },
  { name: "Digital Platforms", color: "#00a651", tags: ["recurrence", "community"], path: network },
  { name: "Characters", color: "#8e44ad", tags: ["heroes", "minifigures"], path: character },
  { name: "Story Worlds", color: "#ef6c00", tags: ["worldbuilding", "ip"], path: network },
  { name: "NINJAGO", color: "#c62828", tags: ["tv", "owned ip"], path: character },
  { name: "The LEGO Movie", color: "#f5b800", tags: ["film", "brand story"], path: film },
  { name: "LEGO Fortnite", color: "#7b2cbf", tags: ["game", "platform"], path: game },
  { name: "Physical Sets", color: "#e53935", tags: ["bricks", "products"], path: brick },
  { name: "New Play", color: "#ff8f00", tags: ["innovation", "sets"], path: brick },
  { name: "Fan Community", color: "#00a651", tags: ["engagement", "fans"], path: network },
  { name: "Licensing", color: "#1565c0", tags: ["partners", "risk"], path: strategy },
  { name: "Creative Control", color: "#6a1b9a", tags: ["brand", "standards"], path: strategy },
  { name: "Brand Meaning", color: "#00838f", tags: ["culture", "trust"], path: character },
  { name: "Brick Sales Loop", color: "#d84315", tags: ["demand", "flywheel"], path: brick },
  { name: "Play Ecosystem", color: "#2e7d32", tags: ["system", "shared resources"], path: network },
  { name: "VRIO", color: "#37474f", tags: ["advantage", "capability"], path: strategy },
  { name: "Related Diversification", color: "#5d4037", tags: ["strategy", "core fit"], path: strategy },
  { name: "Partner Production", color: "#0277bd", tags: ["studios", "execution"], path: film },
  { name: "Brick at the Core", color: "#e2231a", tags: ["recommendation", "core"], path: brick },
] as const satisfies Skill[];
