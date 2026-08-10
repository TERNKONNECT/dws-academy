import Reveal from "./Reveal";

const stats = [
  { num: "500+", label: "Professionals Trained" },
  { num: "17+", label: "Years of Industry Experience" },
  { num: "Expert", label: "Learn From Practitioners" },
  { num: "Anywhere", label: "Study at Your Own Pace" },
];

const TrustStrip = () => {
  return (
    <div className="bg-background px-6 pb-24">
      <Reveal>
        <div className="mx-auto grid max-w-[1100px] grid-cols-2 overflow-hidden rounded-[20px] border border-border md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`border-border px-5 py-9 text-center max-md:[&:nth-child(-n+2)]:border-b max-md:[&:nth-child(odd)]:border-r md:border-r md:last:border-r-0`}
            >
              <div className="text-[30px] font-extrabold tracking-tight text-primary [font-family:'Plus_Jakarta_Sans',sans-serif]">
                {s.num}
              </div>
              <div className="mt-2 text-[13px] font-medium text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
};

export default TrustStrip;
