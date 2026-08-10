import { Plus } from "lucide-react";
import type { Instructor } from "@/types";
import Reveal from "./Reveal";

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

const FacultyPeople = ({ instructors }: { instructors: Instructor[] }) => {
  const shown = instructors.slice(0, 4);
  const placeholders = Math.max(0, 4 - shown.length);

  if (shown.length === 0) return null;

  return (
    <section id="faculty" className="bg-[#F7F6F3] py-24 md:py-32">
      <div className="mx-auto max-w-[1180px] px-8">
        <Reveal>
          <div className="mx-auto mb-16 max-w-xl text-center">
            <span className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-primary/80">
              Meet Our Faculty
            </span>
            <h2 className="mt-4 text-[clamp(28px,3.6vw,42px)] font-bold text-[#0B0B0C]">
              Learn From People Building It Now
            </h2>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="grid grid-cols-2 gap-[22px] md:grid-cols-4">
            {shown.map((person) => (
              <div
                key={person.id}
                className="rounded-2xl border border-black/10 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mx-auto mb-4 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[linear-gradient(150deg,#1a1a1d,#0B0B0C)] text-xl font-extrabold text-primary">
                  {person.avatar &&
                  /^https?:\/\//.test(person.avatar) ? (
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    initialsOf(person.name)
                  )}
                </div>
                <h4 className="text-[15.5px] font-bold text-[#0B0B0C]">
                  {person.name}
                </h4>
                <div className="mt-1.5 text-xs font-semibold uppercase tracking-[0.04em] text-primary/80">
                  Faculty
                </div>
              </div>
            ))}
            {Array.from({ length: placeholders }).map((_, i) => (
              <div
                key={`placeholder-${i}`}
                className="rounded-2xl border border-dashed border-black/15 p-6 text-center text-muted-foreground"
              >
                <div className="mx-auto mb-4 flex h-[72px] w-[72px] items-center justify-center rounded-full border-[1.5px] border-dashed border-black/15 text-[#c8c8c8]">
                  <Plus className="h-6 w-6" />
                </div>
                <h4 className="text-[15.5px] font-bold">Future Faculty</h4>
                <div className="mt-1.5 text-xs font-semibold uppercase tracking-[0.04em]">
                  Reserved
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default FacultyPeople;
