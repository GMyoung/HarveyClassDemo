import type { CSSProperties, ReactNode } from "react";
import ninjago from "@/assets/case_ninjago.jpeg?url";
import legoMovie from "@/assets/case_lego_movie.jpeg?url";
import legoFortnite from "@/assets/case_lego_fortnite.jpeg?url";

type StrategySlideProps = { slideIndex: number };
type Tone = "yellow" | "red" | "blue" | "green" | "purple" | "dark";

type SlideShellProps = {
  slideIndex: number;
  eyebrow: string;
  title: string;
  lead?: string;
  tone?: Tone;
  source?: string;
  children: ReactNode;
};

const enterStyle = (step: number) => ({ "--enter-step": step } as CSSProperties);

const SlideShell = ({ slideIndex, eyebrow, title, lead, tone = "yellow", source, children }: SlideShellProps) => (
  <section
    className={`strategy-slide strategy-slide--${tone}`}
    aria-labelledby={`strategy-slide-${slideIndex}`}
    data-native-slide={slideIndex}
  >
    <header className="strategy-slide__header" style={enterStyle(0)}>
      <div>
        <p className="strategy-slide__eyebrow">{eyebrow}</p>
        <h2 id={`strategy-slide-${slideIndex}`}>{title}</h2>
        {lead && <p className="strategy-slide__lead">{lead}</p>}
      </div>
      <span className="strategy-slide__mark" aria-hidden="true">BUILDING<br />BEYOND<br />THE BRICK</span>
    </header>
    <div className="strategy-slide__body">{children}</div>
    {source && <footer className="strategy-slide__source">{source}</footer>}
  </section>
);

const OriginalAdvantage = () => {
  const milestones = [
    ["1932", "Toy company"], ["1958", "Compatible brick system"],
    ["1978", "Minifigure characters"], ["1999", "LEGO Star Wars"],
    ["2011", "Owned NINJAGO world"], ["2023", "Persistent Fortnite world"],
  ];
  return (
    <SlideShell slideIndex={3} eyebrow="THE ORIGINAL ADVANTAGE" title="LEGO's advantage was a system—not a hit toy." lead="Each step translated the same compatible play grammar into a larger world." source="Source: LEGO Group history and company timeline.">
      <div className="native-timeline" role="list">
        {milestones.map(([year, label], index) => (
          <article key={year} role="listitem" style={enterStyle(index + 1)}>
            <span>{year}</span><i aria-hidden="true" /><p>{label}</p>
          </article>
        ))}
      </div>
      <p className="strategy-thesis" style={enterStyle(7)}>The brick created compatibility. The minifigure added identity. Entertainment made both repeatable across media.</p>
    </SlideShell>
  );
};

const MinifigureStory = () => {
  const steps = [
    ["01", "PHYSICAL BRICKS"], ["02", "LOCATIONS & VEHICLES"],
    ["03", "MINIFIGURE ROLES"], ["04", "CHARACTERS & WORLDS"],
    ["05", "RULES & CONFLICT"], ["06", "CONTINUING STORIES"],
  ];
  return (
    <SlideShell slideIndex={4} eyebrow="THE STORY PRIMITIVE" title="Minifigures turned construction into storytelling." lead="Before LEGO entered entertainment, the brick system already contained the same primitives used by film, television, and games." tone="red">
      <div className="story-primitive-flow" role="list">
        {steps.map(([number, label], index) => (
          <article key={number} role="listitem" style={enterStyle(index + 1)}><span>{number}</span><strong>{label}</strong></article>
        ))}
      </div>
      <div className="primitive-equation" style={enterStyle(7)}><strong>STORY</strong><b>+</b><strong>PLAY</strong><b>=</b><strong>A RENEWABLE WORLD</strong></div>
    </SlideShell>
  );
};

const LicensedWorlds = () => {
  const stages = [
    ["EXTERNAL IP", "Borrow recognition"], ["LEGO TRANSLATION", "Apply visual and play grammar"],
    ["BUILD · BREAK · REMIX", "Give fans agency"], ["SETS & COLLECTORS", "Return demand to bricks"],
  ];
  return (
    <SlideShell slideIndex={5} eyebrow="LEARNING THROUGH PARTNERSHIP" title="Licensed worlds taught LEGO to translate fandom into buildable play." lead="Star Wars proved the capability was not copying outside IP—it was converting a story into LEGO-shaped participation." tone="blue">
      <div className="translation-flow">
        {stages.map(([title, copy], index) => (
          <article key={title} style={enterStyle(index + 1)}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{copy}</p></article>
        ))}
      </div>
      <p className="strategy-thesis" style={enterStyle(5)}>Borrowed reach became a training ground for LEGO's own world-to-product capability.</p>
    </SlideShell>
  );
};

const Crisis = () => (
  <SlideShell slideIndex={6} eyebrow="THE 2004 COMPLEXITY TRAP" title="The crisis exposed the cost of expansion without core fit." lead="The lesson is not “avoid entertainment.” It is “do not let complexity outrun capability.”" tone="red" source="Source: The LEGO Group Annual Report 2004. Causality is interpreted cautiously.">
    <div className="crisis-layout">
      <div className="metric-pair" style={enterStyle(1)}>
        <article><strong>DKK 6.704B</strong><span>2004 REVENUE</span></article>
        <article><strong>−DKK 1.931B</strong><span>2004 NET LOSS</span></article>
      </div>
      <div className="crisis-response" style={enterStyle(2)}>
        <p>THE RESPONSE</p>
        <ul><li>Separate non-core, capital-intensive businesses.</li><li>Transfer game-platform execution to licensing partners.</li><li>Reduce product complexity and rebuild capital discipline.</li></ul>
      </div>
    </div>
    <aside className="causality-note" style={enterStyle(3)}><strong>CAUSALITY BOUNDARY</strong><span>Entertainment alone did not cause the crisis. Uncontrolled complexity did.</span></aside>
  </SlideShell>
);

type CaseVisualProps = {
  slideIndex: number; eyebrow: string; title: string; lead: string; image: string;
  imageAlt: string; tone: Tone; stats: [string, string][]; points: string[]; source: string;
};

const CaseVisual = ({ slideIndex, eyebrow, title, lead, image, imageAlt, tone, stats, points, source }: CaseVisualProps) => (
  <SlideShell slideIndex={slideIndex} eyebrow={eyebrow} title={title} lead={lead} tone={tone} source={source}>
    <div className="case-study-layout">
      <figure className="case-study-visual" style={enterStyle(1)}><img src={image} alt={imageAlt} /><figcaption>SCREEN → STORY → BUILD</figcaption></figure>
      <div className="case-study-content">
        <div className="case-stats">
          {stats.map(([value, label], index) => <article key={label} style={enterStyle(index + 2)}><strong>{value}</strong><span>{label}</span></article>)}
        </div>
        <ul className="case-points" style={enterStyle(stats.length + 2)}>{points.map((point) => <li key={point}>{point}</li>)}</ul>
      </div>
    </div>
  </SlideShell>
);

const MediaJobs = () => {
  const jobs = [
    ["FILM", "BURST REACH", "Turns play into culture", "#e2231a"],
    ["TELEVISION", "CONTINUITY", "Lets characters and worlds compound", "#ffcf00"],
    ["GAMES", "AGENCY", "Lets players remake the world", "#087bc1"],
    ["PLATFORMS", "RECURRENCE", "Connects content, community, insight, and products", "#00a651"],
  ];
  return (
    <SlideShell slideIndex={10} eyebrow="ONE IP SYSTEM · FOUR DISTINCT JOBS" title="The media portfolio works because the roles are complementary." lead="Film creates peaks. Television compounds relationships. Games create agency. Platforms sustain participation." tone="purple">
      <div className="media-jobs" role="list">
        {jobs.map(([medium, role, copy, color], index) => (
          <article key={medium} role="listitem" style={{ ...enterStyle(index + 1), "--job-color": color } as CSSProperties}>
            <span>{String(index + 1).padStart(2, "0")}</span><p>{medium}</p><h3>{role}</h3><small>{copy}</small>
          </article>
        ))}
      </div>
      <p className="strategy-thesis" style={enterStyle(5)}>Together, the four media extend IP life and feed new ideas and demand back to physical play.</p>
    </SlideShell>
  );
};

const Ecosystem = () => {
  const loop = ["PHYSICAL BRICKS", "CHARACTERS & STORIES", "FILM · TV · GAMES", "ENGAGEMENT & COMMUNITY", "INSIGHT & IDEAS", "NEW SETS · NEW PLAY"];
  return (
    <SlideShell slideIndex={11} eyebrow="FROM PRODUCT PIPELINE TO PLAY ECOSYSTEM" title="Entertainment changed LEGO from selling products to renewing relationships." lead="The new system repeatedly generates stories, participation, insight, and products." tone="green">
      <div className="ecosystem-loop" role="list">
        {loop.map((label, index) => <article key={label} role="listitem" style={enterStyle(index + 1)}><span>{String(index + 1).padStart(2, "0")}</span><strong>{label}</strong><i aria-hidden="true">→</i></article>)}
      </div>
      <div className="shared-resource-bar" style={enterStyle(7)}>SHARED CORE: brand · minifigure grammar · compatibility · design capability · retail channels</div>
    </SlideShell>
  );
};

const StrategicOptions = () => {
  const options = [
    ["A", "BRICK-FIRST LICENSING", "Low capital · low control", "Safer, but cedes owned worlds and digital relationships."],
    ["B", "FULL VERTICAL INTEGRATION", "High capital · high control", "Adds volatile capabilities that are not rare for LEGO."],
    ["C", "ECOSYSTEM ORCHESTRATOR", "Own the architecture · rent execution", "Best fit with LEGO's VRIO advantage."],
  ];
  return (
    <SlideShell slideIndex={12} eyebrow="THREE PATHS FORWARD" title="The strategic choice is what LEGO must control—and what it should outsource." tone="dark">
      <div className="option-cards" role="list">
        {options.map(([letter, title, profile, copy], index) => (
          <article key={letter} role="listitem" className={letter === "C" ? "recommended" : ""} style={enterStyle(index + 1)}>
            <span>{letter}</span><h3>{title}</h3><strong>{profile}</strong><p>{copy}</p>{letter === "C" && <em>RECOMMENDED</em>}
          </article>
        ))}
      </div>
      <p className="strategy-thesis" style={enterStyle(4)}>Grow entertainment without repeating the complexity trap: control the play system, partner for specialist production.</p>
    </SlideShell>
  );
};

const Vrio = () => {
  const rows = [
    ["System in Play", "✓", "✓", "✓", "✓", "SUSTAINED"], ["Brand + family trust", "✓", "✓", "✓", "✓", "SUSTAINED"],
    ["Brick / minifigure grammar", "✓", "✓", "✓", "✓", "SUSTAINED"], ["World → play → product", "✓", "✓", "✓", "✓", "SUSTAINED"],
    ["Film production", "✓", "—", "—", "△", "PARTNER"], ["AAA / platform operations", "✓", "—", "—", "△", "PARTNER"],
  ];
  return (
    <SlideShell slideIndex={13} eyebrow="VRIO TEST" title="LEGO's durable advantage still comes from the core—not from owning a studio." tone="blue" source="VRIO: Value · Rarity · Inimitability · Organization. Framework: Barney (1991).">
      <div className="vrio-table-wrap" style={enterStyle(1)}>
        <table className="vrio-table"><thead><tr><th>RESOURCE / CAPABILITY</th><th>V</th><th>R</th><th>I</th><th>O</th><th>VERDICT</th></tr></thead>
          <tbody>{rows.map(([resource, ...cells]) => <tr key={resource}><th scope="row">{resource}</th>{cells.map((cell, index) => <td key={`${resource}-${index}`}>{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
      <p className="strategy-thesis" style={enterStyle(2)}>Control architecture and translation. Do not vertically integrate every specialist production step.</p>
    </SlideShell>
  );
};

const RelatedDiversification = () => (
  <SlideShell slideIndex={14} eyebrow="RELATED DIVERSIFICATION BOUNDARY" title="Entertainment creates scope economies only when value returns to the brick." tone="green">
    <div className="related-loop" style={enterStyle(1)}>
      <div><strong>PHYSICAL BRICKS</strong><span>core resources</span></div><i>→</i>
      <div><strong>CHARACTERS & STORIES</strong><span>owned IP</span></div><i>→</i>
      <div><strong>MEDIA & PLATFORMS</strong><span>reach + participation</span></div><i>→</i>
      <div><strong>NEW SETS & PLAY</strong><span>return to core</span></div>
    </div>
    <div className="boundary-cards">
      <article className="related" style={enterStyle(2)}><span>RELATED</span><h3>Shared resources + product return</h3><p>Stories become sets. Platforms activate physical demand. Insight improves play.</p></article>
      <article className="over-line" style={enterStyle(3)}><span>OVER THE LINE</span><h3>Isolated content bets</h3><p>No shared resources, no buildable translation, and no return to physical play.</p></article>
    </div>
  </SlideShell>
);

const Recommendation = () => (
  <SlideShell slideIndex={15} eyebrow="RECOMMENDATION" title="Keep bricks at the core; use entertainment to expand the system." lead="The winning model is a hybrid entertainment ecosystem orchestrator.">
    <div className="recommendation-columns">
      <article style={enterStyle(1)}><span>OWN MORE WORLDS</span><ul><li>Build owned characters and story universes.</li><li>Create persistent digital spaces and communities.</li><li>Back projects that generate sets, repeat play, and new mechanics.</li></ul></article>
      <article style={enterStyle(2)}><span>OWN FEWER STUDIOS</span><ul><li>Partner for film, AAA games, and platform operations.</li><li>Retain brand, play principles, data, and child-safety control.</li><li>Require every project to return value to physical play.</li></ul></article>
    </div>
    <div className="recommendation-verdict" style={enterStyle(3)}><strong>PARTNER FOR PRODUCTION.</strong><strong>CONTROL THE PLAY SYSTEM.</strong></div>
  </SlideShell>
);

const LastBrick = () => (
  <SlideShell slideIndex={16} eyebrow="THE LAST BRICK" title="LEGO's future is not to become an entertainment conglomerate." tone="dark">
    <div className="last-brick-statement" style={enterStyle(1)}><span>OWN MORE WORLDS</span><b>+</b><span>PARTNER FOR PRODUCTION</span><b>+</b><span>CONTROL THE PLAY SYSTEM</span></div>
    <p className="last-brick-test" style={enterStyle(2)}>The test: will the next entertainment investment make a physical brick more valuable?</p>
  </SlideShell>
);

export const StrategySlide = ({ slideIndex }: StrategySlideProps) => {
  switch (slideIndex) {
    case 3: return <OriginalAdvantage />;
    case 4: return <MinifigureStory />;
    case 5: return <LicensedWorlds />;
    case 6: return <Crisis />;
    case 7: return <CaseVisual slideIndex={7} eyebrow="TELEVISION · OWNED IP" title="NINJAGO turned product characters into a renewable story world." lead="Television became the operating rhythm for heroes, villains, vehicles, locations, and recurring set demand." image={ninjago} imageAlt="LEGO NINJAGO characters and sets" tone="red" stats={[["500+", "SETS"], ["200+", "EPISODES"], ["15 YEARS", "OWNED IP"]]} points={["Continuity compounds character value.", "Every season introduces buildable conflict.", "Stories return attention to physical play."]} source="Source: LEGO NINJAGO 15th Anniversary announcement (2026)." />;
    case 8: return <CaseVisual slideIndex={8} eyebrow="FILM · BRAND MEANING" title="The LEGO Movie made LEGO's play philosophy the story." lead="Film translated rebuilding, rule-breaking, and open-ended imagination into mass culture." image={legoMovie} imageAlt="The LEGO Movie characters" tone="yellow" stats={[["≈ $1.1B", "LEGO FILM BOX OFFICE BY 2020"]]} points={["Everything can be rebuilt and recombined.", "Instructions guide—but do not limit—imagination.", "LEGO should own the voice while studios absorb production risk."]} source="Source: Universal Pictures and LEGO Group partnership announcement (2020)." />;
    case 9: return <CaseVisual slideIndex={9} eyebrow="DIGITAL PLATFORMS · RECURRENCE" title="LEGO Fortnite turned one-off content into a persistent relationship." lead="Live worlds turn audiences into participants—and turn digital characters, places, and mechanics into physical opportunities." image={legoFortnite} imageAlt="LEGO Fortnite world and characters" tone="purple" stats={[["ON SCREEN", "OPEN WORLDS · LIVE UPDATES"], ["OFF SCREEN", "SETS · REWARDS · NEW PLAY"]]} points={["Players build, explore, create, and return.", "Digital behavior reveals new product ideas.", "The strongest platform loop travels in both directions."]} source="Sources: LEGO Fortnite releases (2023–2025); LEGO Group Annual Report 2025." />;
    case 10: return <MediaJobs />;
    case 11: return <Ecosystem />;
    case 12: return <StrategicOptions />;
    case 13: return <Vrio />;
    case 14: return <RelatedDiversification />;
    case 15: return <Recommendation />;
    case 16: return <LastBrick />;
    default: return null;
  }
};
