import Reveal from "./Reveal";

const Partners = () => {
  return (
    <section className="bg-white py-24 md:py-32 border-t border-black/5">
      <div className="mx-auto max-w-[1180px] px-8 text-center">
        <Reveal>
          <span className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-amber-700">
            With Our Partners
          </span>
          <h2 className="mt-4 text-[clamp(28px,3.6vw,42px)] font-bold text-[#0B0B0C]">
            Trusted by the Best
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-12 opacity-80 hover:opacity-100 transition-opacity">
            {/* Replace this src with the actual DWS logo path once uploaded */}
            <img src="/dws-logo.png" alt="DWS Logo" className="h-16 object-contain" />
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Partners;
