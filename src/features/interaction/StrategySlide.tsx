import type { CSSProperties, ReactNode } from "react";
import ninjago from "@/assets/case_ninjago.jpeg?url";
import legoMovie from "@/assets/case_lego_movie.jpeg?url";
import legoFortnite from "@/assets/case_lego_fortnite.jpeg?url";
import legoFortnitePhysical from "@/assets/lego_fortnite.png?url";
import storyStarWars from "@/assets/story_star_wars.png?url";
import ninjagoAnniversaryVideo from "@/assets/story_ninjago_anniversary.mp4?url";
import fortniteKeyArt from "@/assets/story_fortnite_key_art.jpg?url";
import fortniteFrame14 from "@/assets/story_fortnite_frame_14.jpg?url";
import fortniteFrame31 from "@/assets/story_fortnite_frame_31.jpg?url";
import { StoryMotion } from "./StoryMotion";
import { StoryImage, StorySlideshow, StoryVideo } from "./StoryMedia";

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
      <div className="strategy-slide__header-aside">
        <StoryMotion slideIndex={slideIndex} placement="slide" />
        <span className="strategy-slide__mark" aria-hidden="true">BUILDING<br />BEYOND<br />THE BRICK</span>
      </div>
    </header>
    <div className="strategy-slide__body">{children}</div>
    {source && <footer className="strategy-slide__source">{source}</footer>}
  </section>
);

type PersonCardProps = {
  year: string;
  name: string;
  role: string;
  decision: string;
};

const PersonCard = ({ year, name, role, decision }: PersonCardProps) => (
  <article className="person-card">
    <span>{year}</span>
    <div>
      <h3>{name}</h3>
      <small>{role}</small>
    </div>
    <p>{decision}</p>
  </article>
);

const MiniSilhouette = ({ kind }: { kind: "brick" | "extra" | "modern" }) => (
  <div className={`mini-silhouette mini-silhouette--${kind}`} aria-hidden="true">
    <span className="mini-silhouette__head" />
    <span className="mini-silhouette__body" />
    <i className="mini-silhouette__arm mini-silhouette__arm--left" />
    <i className="mini-silhouette__arm mini-silhouette__arm--right" />
    <b className="mini-silhouette__leg mini-silhouette__leg--left" />
    <b className="mini-silhouette__leg mini-silhouette__leg--right" />
  </div>
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
  const figures: ["brick" | "extra" | "modern", string, string][] = [
    ["brick", "1974", "A brick-built figure"],
    ["extra", "1975", "A fixed stage extra"],
    ["modern", "1978", "A character with a role"],
  ];
  return (
    <SlideShell slideIndex={4} eyebrow="1978 · THE CHARACTER ARRIVES" title="The designer who gave bricks a face." lead="Jens N. Knudsen did not add decoration. He gave children a character who could enter any build and become anyone." tone="red" source="Sources: The LEGO Group History · ‘Role play’ and ‘The minifigure timeline’; Jens N. Knudsen worked at LEGO, 1968–2000.">
      <div className="minifigure-documentary">
        <div className="documentary-copy" style={enterStyle(1)}>
          <PersonCard year="32 YEARS" name="Jens N. Knudsen" role="LEGO designer · 1968–2000" decision="Make one small, articulated character neutral enough to play every role." />
          <div className="story-beat-row" role="list">
            {[["BUILDINGS", "needed inhabitants"], ["CHARACTERS", "created identity"], ["STORIES", "made worlds repeatable"]].map(([title, copy], index) => (
              <article role="listitem" key={title} style={enterStyle(index + 2)}><span>0{index + 1}</span><strong>{title}</strong><small>{copy}</small></article>
            ))}
          </div>
        </div>
        <div className="minifigure-evolution" role="list" aria-label="Evolution of the LEGO figure">
          {figures.map(([kind, year, label], index) => (
            <article key={year} role="listitem" className={kind === "modern" ? "is-breakthrough" : ""} style={enterStyle(index + 2)}>
              <MiniSilhouette kind={kind} />
              <strong>{year}</strong><span>{label}</span>
            </article>
          ))}
        </div>
      </div>
      <p className="strategy-thesis" style={enterStyle(5)}>LEGO did not enter entertainment in 1978. It invented the character that made entertainment possible.</p>
    </SlideShell>
  );
};

const LicensedWorlds = () => {
  const stages = [
    ["LATE 1997", "Peter Eio proposes Lucasfilm"],
    ["6 MONTHS", "Internal debate tests brand fit"],
    ["1998", "LEGO signs its first IP licence"],
    ["1999", "LEGO Star Wars launches"],
  ];
  return (
    <SlideShell slideIndex={5} eyebrow="1997–1999 · THE FIRST LICENCE" title="The bet that broke LEGO's purist rule." lead="For the first time, LEGO would borrow another company's story—and translate it into its own system of play." tone="blue" source="Sources: The LEGO Group, ‘LEGO Star Wars celebrates 25 years’ (2024); Peter Eio’s account of the 1997 proposal and internal debate.">
      <div className="documentary-layout">
        <StoryImage src={storyStarWars} alt="LEGO Star Wars Millennium Falcon set with minifigures" contain credit={{ label: "The LEGO Group · LEGO Star Wars 25th Anniversary", year: "2024" }} />
        <div className="documentary-copy">
          <PersonCard year="LATE 1997" name="Peter Eio" role="President · LEGO Americas" decision="Propose a partnership with Lucasfilm—even though LEGO had never licensed an outside story." />
          <div className="decision-chain" role="list">
            {stages.map(([year, copy], index) => (
              <article role="listitem" key={year} style={enterStyle(index + 2)}><span>{year}</span><p>{copy}</p></article>
            ))}
          </div>
        </div>
      </div>
      <p className="strategy-thesis" style={enterStyle(6)}>The result was more than a hit licence: LEGO learned how to turn fandom into buildable participation.</p>
    </SlideShell>
  );
};

const Crisis = () => (
  <SlideShell slideIndex={6} eyebrow="2004 · THE COMPLEXITY TRAP" title="The year LEGO had to choose." lead="Expansion had created reach—but also too many products, activities, and capabilities for one company to control." tone="red" source="Sources: The LEGO Group Annual Reports 2004–2005. 2005 profit includes effects from restructuring and asset transactions.">
    <div className="crisis-story-layout">
      <div className="annual-report-card" style={enterStyle(1)}>
        <span>THE LEGO GROUP · 2004</span>
        <strong>−DKK 1.9B</strong>
        <p>NET LOSS</p>
        <small>Revenue: DKK 6.7B</small>
      </div>
      <div className="leadership-handoff" style={enterStyle(2)}>
        <PersonCard year="1979–2004" name="Kjeld Kirk Kristiansen" role="CEO · 25 years" decision="Hands operational leadership to a new generation after the deepest crisis in company history." />
        <i aria-hidden="true">→</i>
        <PersonCard year="2004" name="Jørgen Vig Knudstorp" role="Joined LEGO 2001 · CEO at 35" decision="Refocus the portfolio, release capital, and rebuild around the profitable core." />
      </div>
    </div>
    <div className="turnaround-actions" style={enterStyle(3)}>
      <strong>THE PLAN</strong><span>Cut complexity</span><span>Sell capital-heavy assets</span><span>Partner for specialist execution</span><b>2005: +DKK 702M PRE-TAX PROFIT</b>
    </div>
    <aside className="causality-note" style={enterStyle(4)}><strong>THE LESSON</strong><span>Entertainment was not the problem. Expansion without a clear return to the core was.</span></aside>
  </SlideShell>
);

const StoryStat = ({ value, label }: { value: string; label: string }) => <article className="story-stat"><strong>{value}</strong><span>{label}</span></article>;

const NinjagoStory = () => (
  <SlideShell slideIndex={7} eyebrow="2011 · FROM BORROWED TO OWNED" title="NINJAGO turned a toy line into a story world." lead="LEGO applied what licensing had taught it—then built characters, lore, and continuity it could own." tone="red" source="Source: The LEGO Group, NINJAGO 15th Anniversary media release and official footage (2026).">
    <div className="documentary-layout">
      <StoryVideo src={ninjagoAnniversaryVideo} poster={ninjago} alt="Official LEGO NINJAGO 15th anniversary footage" startAt={2} endAt={9} credit={{ label: "The LEGO Group · NINJAGO 15th Anniversary", year: "2026" }} />
      <div className="documentary-copy">
        <PersonCard year="18 MONTHS" name="Tommy Andreasen + team" role="LEGO creative development" decision="Research enduring play patterns, then combine ninja, elemental powers, vehicles, and serialized conflict." />
        <PersonCard year="2011" name="Dan + Kevin Hageman" role="Series developers and head writers" decision="Give the product idea a continuing mythology children could return to between builds." />
        <div className="documentary-stats"><StoryStat value="500+" label="SETS" /><StoryStat value="200+" label="EPISODES" /><StoryStat value="15 YEARS" label="OWNED IP" /></div>
      </div>
    </div>
    <p className="strategy-thesis" style={enterStyle(4)}>Star Wars taught translation. NINJAGO proved LEGO could own the world being translated.</p>
  </SlideShell>
);

const MovieStory = () => (
  <SlideShell slideIndex={8} eyebrow="2008–2014 · BRAND AS STORY" title="The LEGO Movie made the play philosophy the plot." lead="The breakthrough was not placing LEGO in a movie. It was building a movie around the tension between instructions and imagination." tone="yellow" source="Sources: The LEGO Group 2014 Annual Results; LEGO–Universal film partnership announcement (2020). Box office is the combined franchise total reported in 2020.">
    <div className="documentary-layout documentary-layout--movie">
      <StoryImage src={legoMovie} alt="Emmet and Wyldstyle in The LEGO Movie" credit={{ label: "Warner Bros. Pictures · The LEGO Movie", year: "2014" }} />
      <div className="documentary-copy">
        <div className="decision-chain decision-chain--movie" role="list">
          <article role="listitem"><span>2008</span><p><b>Dan Lin</b> pitches a theatrical LEGO film.</p></article>
          <article role="listitem"><span>LEGO</span><p><b>Jill Wilfert + leadership</b> protect brand voice and open-ended play.</p></article>
          <article role="listitem"><span>2014</span><p><b>Phil Lord + Chris Miller</b> release a story about rebuilding the rules.</p></article>
        </div>
        <div className="movie-outcome"><StoryStat value="+15%" label="2014 CONSUMER SALES" /><StoryStat value="≈$1.1B" label="FRANCHISE BOX OFFICE BY 2020" /></div>
        <small className="evidence-caveat">The company named The LEGO Movie a significant contributor—not the only cause—of 2014 growth.</small>
      </div>
    </div>
    <p className="strategy-thesis" style={enterStyle(4)}>The studio made the film. LEGO kept the meaning: anything can be rebuilt.</p>
  </SlideShell>
);

const FortniteStory = () => (
  <SlideShell slideIndex={9} eyebrow="2022–2024 · THE LIVE WORLD" title="LEGO Fortnite turned a campaign into a place." lead="A long-term Epic partnership moved LEGO from scheduled content into a persistent world where players build, explore, and return." tone="purple" source="Sources: Epic Games × LEGO partnership (2022); LEGO Fortnite launch (2023); first physical sets (2024); LEGO Group 2024 Annual Results.">
    <div className="documentary-layout">
      <StorySlideshow images={[
        { src: fortniteKeyArt, alt: "LEGO Fortnite key art" },
        { src: fortniteFrame14, alt: "Players building in LEGO Fortnite" },
        { src: fortniteFrame31, alt: "LEGO Fortnite digital world" },
        { src: legoFortnitePhysical, alt: "LEGO Fortnite physical product range" },
      ]} credit={{ label: "The LEGO Group × Epic Games · official launch assets", year: "2023–2024" }} />
      <div className="documentary-copy">
        <div className="partner-pair">
          <PersonCard year="2022" name="Niels B. Christiansen" role="CEO · The LEGO Group" decision="Create a safe, long-term digital partnership instead of trying to operate the platform alone." />
          <span aria-hidden="true">×</span>
          <PersonCard year="2022" name="Tim Sweeney" role="CEO · Epic Games" decision="Open Fortnite's scale and creation tools to LEGO's play system." />
        </div>
        <div className="decision-chain decision-chain--compact"><article><span>DEC 2023</span><p>Free game launches inside Fortnite.</p></article><article><span>OCT 2024</span><p>Digital characters return to shelves as physical sets.</p></article></div>
        <div className="documentary-stats documentary-stats--fortnite"><StoryStat value="87M+" label="PLAYERS BY END OF 2024" /><StoryStat value="SCREEN → SHELF" label="TWO-WAY VALUE LOOP" /></div>
      </div>
    </div>
  </SlideShell>
);

const MediaJobs = () => {
  const jobs = [
    ["FILM", "BURST REACH", "Turns play into culture", "#e2231a", legoMovie],
    ["TELEVISION", "CONTINUITY", "Lets characters and worlds compound", "#ffcf00", ninjago],
    ["GAMES", "AGENCY", "Lets players remake the world", "#087bc1", legoFortnite],
    ["PLATFORMS", "RECURRENCE", "Connects content, community, insight, and products", "#00a651", fortniteFrame31],
  ];
  return (
    <SlideShell slideIndex={10} eyebrow="ONE IP SYSTEM · FOUR DISTINCT JOBS" title="The media portfolio works because the roles are complementary." lead="Film creates peaks. Television compounds relationships. Games create agency. Platforms sustain participation." tone="purple">
      <div className="media-jobs" role="list">
        {jobs.map(([medium, role, copy, color, image], index) => (
          <article key={medium} role="listitem" style={{ ...enterStyle(index + 1), "--job-color": color } as CSSProperties}>
            <img className="media-jobs__thumb" src={image} alt="" /><span>{String(index + 1).padStart(2, "0")}</span><p>{medium}</p><h3>{role}</h3><small>{copy}</small>
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
  return (
    <SlideShell slideIndex={13} eyebrow="VRIO TEST" title="LEGO's durable advantage still comes from the core—not from owning a studio." tone="blue" source="VRIO: Value · Rarity · Inimitability · Organization. Framework: Barney (1991).">
      <div className="capability-ownership" style={enterStyle(1)}>
        <article className="capability-ownership__control"><span>LEGO MUST CONTROL</span><h3>The architecture of play</h3><ul><li>Brand and family trust</li><li>Brick + minifigure grammar</li><li>World → play → product translation</li><li>Safety, data, and community principles</li></ul><strong>VALUABLE · RARE · HARD TO COPY · ORGANIZED</strong></article>
        <div className="capability-divider" aria-hidden="true"><b>OWN</b><i>↔</i><b>PARTNER</b></div>
        <article className="capability-ownership__partner"><span>LEGO SHOULD RENT</span><h3>Specialist execution</h3><ul><li>Feature-film production</li><li>AAA game engineering</li><li>Live-platform operations</li><li>Distribution at global scale</li></ul><strong>VALUABLE · AVAILABLE FROM PARTNERS</strong></article>
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
    <div className="screen-shelf-proof" style={enterStyle(4)}><img src={fortniteKeyArt} alt="LEGO Fortnite digital world" /><span>SCREEN</span><i>→</i><span>SHELF</span><img src={legoFortnitePhysical} alt="LEGO Fortnite physical sets" /></div>
  </SlideShell>
);

const Recommendation = () => (
  <SlideShell slideIndex={15} eyebrow="RECOMMENDATION" title="Keep bricks at the core; use entertainment to expand the system." lead="The winning model is a hybrid entertainment ecosystem orchestrator.">
    <div className="recommendation-columns">
      <article style={enterStyle(1)}><span>OWN MORE WORLDS</span><ul><li>Build owned characters and story universes.</li><li>Create persistent digital spaces and communities.</li><li>Back projects that generate sets, repeat play, and new mechanics.</li></ul></article>
      <article style={enterStyle(2)}><span>OWN FEWER STUDIOS</span><ul><li>Partner for film, AAA games, and platform operations.</li><li>Retain brand, play principles, data, and child-safety control.</li><li>Require every project to return value to physical play.</li></ul></article>
    </div>
    <div className="partner-chip-row" style={enterStyle(3)}><span>LUCASFILM</span><span>FILM STUDIOS</span><span>EPIC GAMES</span><strong>LEGO CONTROLS THE PLAY SYSTEM</strong></div>
    <div className="recommendation-verdict" style={enterStyle(4)}><strong>PARTNER FOR PRODUCTION.</strong><strong>CONTROL THE PLAY SYSTEM.</strong></div>
  </SlideShell>
);

const LastBrick = () => (
  <SlideShell slideIndex={16} eyebrow="THE LAST BRICK" title="LEGO's future is not to become an entertainment conglomerate." tone="dark">
    <div className="last-brick-system" style={enterStyle(1)}>
      <div className="last-brick-core"><i /><i /><i /><i /><strong>THE BRICK</strong><span>CORE SYSTEM</span></div>
      <span className="orbit-chip orbit-chip--one">CHARACTERS</span><span className="orbit-chip orbit-chip--two">LICENSED STORIES</span><span className="orbit-chip orbit-chip--three">OWNED WORLDS</span><span className="orbit-chip orbit-chip--four">LIVE PLATFORMS</span>
    </div>
    <p className="last-brick-test" style={enterStyle(2)}>One final test: will the next entertainment investment make a physical brick more valuable?</p>
  </SlideShell>
);

export const StrategySlide = ({ slideIndex }: StrategySlideProps) => {
  switch (slideIndex) {
    case 3: return <OriginalAdvantage />;
    case 4: return <MinifigureStory />;
    case 5: return <LicensedWorlds />;
    case 6: return <Crisis />;
    case 7: return <NinjagoStory />;
    case 8: return <MovieStory />;
    case 9: return <FortniteStory />;
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
