import Reveal from "./Reveal";

const WhoWeAre = () => {
  return (
    <section className="bg-[#F7F6F3] py-24 md:py-32">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-14 px-8 md:grid-cols-2 md:gap-[70px]">
        <Reveal>
          <div
            className="relative aspect-[4/5] overflow-hidden rounded-[18px]"
            style={{
              background:
                "linear-gradient(160deg, #17161a 0%, #0B0B0C 60%), repeating-linear-gradient(115deg, rgba(244,180,0,0.05) 0 2px, transparent 2px 46px)",
            }}
          >
            <div className="absolute inset-x-6 bottom-6 rounded-xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
              <div className="text-xs font-bold uppercase tracking-[0.1em] text-primary">
                Est. Practitioner-Led
              </div>
              <div className="mt-1.5 text-[14.5px] text-white">
                Taught by founders currently running event businesses across
                Africa.
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div>
            <span className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-amber-700">
              Who We Are
            </span>
            <h2 className="mt-4 text-[clamp(26px,3.2vw,38px)] font-bold text-[#0B0B0C]">
              More Than an Event Planning School
            </h2>
            <p className="mt-6 text-xl font-semibold text-[#0B0B0C]">
              School of Events Africa exists to raise a new generation of
              event professionals across Africa.
            </p>
            <p className="mt-[18px] text-[16.5px] leading-relaxed text-[#3c3c3e]">
              We believe talent alone is not enough. Professionals need
              technical excellence, business knowledge, leadership and
              systems to build sustainable careers and companies.
            </p>
            <p className="mt-[18px] text-[16.5px] leading-relaxed text-[#3c3c3e]">
              Our courses are designed and taught by experienced
              practitioners who are actively building successful businesses
              within the event industry.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default WhoWeAre;
