import { ClipboardList, TrendingUp, Palette, Video, Radio, Mic2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Reveal from "./Reveal";

const faculties = [
  {
    icon: ClipboardList,
    title: "Planning & Production",
    desc: "Learn event planning, logistics, operations and execution.",
    available: true,
  },
  {
    icon: TrendingUp,
    title: "Business & Leadership",
    desc: "Marketing, pricing, finance, leadership, systems and growth.",
    available: true,
  },
  {
    icon: Palette,
    title: "Event Design & Décor",
    desc: "Composition, materials and atmosphere for unforgettable spaces.",
    available: false,
  },
  {
    icon: Video,
    title: "Media & Content Creation",
    desc: "Documenting, marketing and storytelling for the modern event brand.",
    available: false,
  },
  {
    icon: Radio,
    title: "Technical Production",
    desc: "Lighting, sound and stage systems for live experiences.",
    available: false,
  },
  {
    icon: Mic2,
    title: "Entertainment",
    desc: "MCs, DJs and live experience professionals shaping the room.",
    available: false,
  },
];

const Faculties = () => {
  return (
    <section id="faculties" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1180px] px-8">
        <Reveal>
          <div className="mx-auto mb-16 max-w-xl text-center">
            <span className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-primary/80">
              Our Faculties
            </span>
            <h2 className="mt-4 text-[clamp(28px,3.6vw,42px)] font-bold text-[#0B0B0C]">
              Six Disciplines. One Industry.
            </h2>
            <p className="mt-[18px] text-[16.5px] text-muted-foreground">
              Each faculty brings together the technical craft and the
              business thinking that surrounds it.
            </p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
            {faculties.map((f) => (
              <div
                key={f.title}
                className="group relative rounded-2xl border border-black/10 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-black/20 hover:shadow-xl"
              >
                <Badge
                  className={
                    f.available
                      ? "absolute right-6 top-6 border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                      : "absolute right-6 top-6 border-transparent bg-black/5 text-black/45 hover:bg-black/5"
                  }
                >
                  {f.available ? "Available" : "Coming Soon"}
                </Badge>
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-[11px] bg-[#0B0B0C]">
                  <f.icon className="h-5 w-5 text-primary" strokeWidth={1.8} />
                </div>
                <h4 className="text-lg font-bold text-[#0B0B0C]">{f.title}</h4>
                <p className="mt-2 text-[14.5px] text-muted-foreground">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Faculties;
