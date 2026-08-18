import Reveal from "./Reveal";

// Placeholder content — no articles/blog data model exists yet. Swap for
// real posts once that's built.
const insights = [
  {
    tag: "Industry Report",
    title: "The State of the African Event Industry, 2026",
    desc: "What 500+ practitioners told us about pricing, growth and the year ahead.",
    gradient: "linear-gradient(135deg,#0B0B0C,#232016)",
  },
  {
    tag: "Case Study",
    title: "From Solo Planner to Structured Company",
    desc: "How one founder rebuilt her business around systems instead of hustle.",
    gradient: "linear-gradient(135deg,#171512,#0B0B0C)",
  },
  {
    tag: "Interview",
    title: "Building Faculty That Practices What It Teaches",
    desc: "A conversation on why practitioner-led education changes outcomes.",
    gradient: "linear-gradient(135deg,#0f0e10,#1b1811)",
  },
];

const Insights = () => {
  return (
    <section id="insights" className="bg-[#F7F6F3] py-24 md:py-32">
      <div className="mx-auto max-w-[1180px] px-8">
        <Reveal>
          <div className="mb-16 max-w-xl">
            <span className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-amber-700">
              Insights
            </span>
            <h2 className="mt-4 text-[clamp(28px,3.6vw,42px)] font-bold text-[#0B0B0C]">
              Where the Industry Thinks Out Loud
            </h2>
            <p className="mt-[18px] text-[16.5px] text-muted-foreground">
              Articles, research, case studies and interviews from the
              people building the event industry's future across Africa.
            </p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="grid grid-cols-1 gap-[22px] md:grid-cols-3">
            {insights.map((post) => (
              <div
                key={post.title}
                className="overflow-hidden rounded-2xl border border-black/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="h-[150px]" style={{ background: post.gradient }} />
                <div className="p-6">
                  <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-accent">
                    {post.tag}
                  </span>
                  <h4 className="mt-2.5 text-[16.5px] font-bold text-[#0B0B0C]">
                    {post.title}
                  </h4>
                  <p className="mt-2 text-[13.5px] text-muted-foreground">
                    {post.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Insights;
