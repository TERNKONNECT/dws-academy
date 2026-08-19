import { Plus } from "lucide-react";
import type { Faculty } from "@/api/faculty";
import Reveal from "./Reveal";

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

const FacultyPeople = ({ faculty, limit }: { faculty: Faculty[], limit?: number }) => {
  const safeFaculty = Array.isArray(faculty) ? faculty : [];
  const shown = limit ? safeFaculty.slice(0, limit) : safeFaculty;

  return (
    <section id="teampage" className="bg-[#F7F6F3] dark:bg-black py-14 md:py-20">
      <div className="mx-auto max-w-[1180px] px-8">
        <Reveal>
          <div className="mx-auto mb-10 max-w-xl text-center">
            <span className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-amber-700">
              Meet Our Team
            </span>
            <h2 className="mt-4 text-[clamp(28px,3.6vw,42px)] font-bold text-[#0B0B0C] dark:text-white">
              Learn From People Building It Now
            </h2>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="grid grid-cols-2 gap-[22px] md:grid-cols-4">
            {shown.map((person) => (
                <div
                  key={person.id}
                  className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#151517] p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                <div className="mx-auto mb-4 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[linear-gradient(150deg,#1a1a1d,#0B0B0C)] text-xl font-extrabold text-primary">
                  {person.avatar && /^https?:\/\//.test(person.avatar) ? (
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    initialsOf(person.name)
                  )}
                </div>
                <h4 className="text-[15.5px] font-bold text-[#0B0B0C] dark:text-white">
                  {person.name}
                </h4>
                <div className="mt-1.5 text-xs font-semibold uppercase tracking-[0.04em] text-amber-700 dark:text-amber-500">
                  {[person.jobTitle, person.company].filter(Boolean).join(' • ') || 'Faculty'}
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
