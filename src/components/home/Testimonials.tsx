import { Star } from "lucide-react";
import Reveal from "./Reveal";
import type { Testimonial } from "@/api/testimonials";

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

// Placeholder content — shown until real student reviews exist.
const placeholderTestimonials: Testimonial[] = [
  {
    id: "placeholder-tariq",
    name: "Tariq Folarin",
    content:
      "I stopped pricing out of fear. Six months after the Business of Events course, I restructured my packages and my company finally has margin, not just movement.",
    jobTitle: "Event Producer",
    companyName: "Lagos",
    date: new Date().toISOString(),
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "placeholder-ngozi",
    name: "Ngozi Chukwu",
    content:
      "I came in as a decorator with no systems. I left with a registered company, a pricing model and the confidence to say no to the wrong clients.",
    jobTitle: "Décor Entrepreneur",
    companyName: "Abuja",
    date: new Date().toISOString(),
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "placeholder-kwame",
    name: "Kwame Mensah",
    content:
      "The Financial Structure course changed how I run my books. For the first time, I know exactly what each event actually earns.",
    jobTitle: "Production Lead",
    companyName: "Accra",
    date: new Date().toISOString(),
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const Testimonials = ({ testimonials }: { testimonials: Testimonial[] }) => {
  const shown = testimonials.length > 0 ? testimonials : placeholderTestimonials;

  return (
    <section id="testimonials" className="bg-[#F7F6F3] py-24 md:py-32">
      <div className="mx-auto max-w-[1180px] px-8">
        <Reveal>
          <div className="mx-auto mb-16 max-w-xl text-center">
            <span className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-primary/80">
              Success Stories
            </span>
            <h2 className="mt-4 text-[clamp(28px,3.6vw,42px)] font-bold text-[#0B0B0C]">
              Hear From Our Students
            </h2>
          </div>
        </Reveal>
        <Reveal delay={100}>
          {shown.length > 3 ? (
            <div className="overflow-hidden py-4 -mx-4 px-4 sm:-mx-8 sm:px-8">
              <div className="flex w-max gap-[22px] animate-marquee">
                {[...shown, ...shown].map((t, index) => (
                  <div
                    key={`${t.id}-${index}`}
                    className="w-[350px] shrink-0 rounded-2xl border border-black/10 bg-white p-7 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="mb-4 flex gap-0.5 text-primary">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5" fill="currentColor" />
                      ))}
                    </div>
                    <p className="mb-6 text-[15px] leading-relaxed text-[#333]">
                      {t.content}
                    </p>
                    <div className="flex items-center gap-3 mt-auto">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0B0B0C] text-sm font-bold text-primary">
                        {initialsOf(t.name)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#0B0B0C]">
                          {t.name}
                        </div>
                        <div className="text-[12.5px] text-muted-foreground">
                          {[t.jobTitle, t.companyName].filter(Boolean).join(", ")}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-[22px] md:grid-cols-3">
              {shown.map((t) => (
                <div
                  key={t.id}
                  className="rounded-2xl border border-black/10 bg-white p-7 transition-all duration-300 hover:shadow-lg flex flex-col"
                >
                  <div className="mb-4 flex gap-0.5 text-primary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5" fill="currentColor" />
                    ))}
                  </div>
                  <p className="mb-6 text-[15px] leading-relaxed text-[#333] flex-grow">
                    {t.content}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0B0B0C] text-sm font-bold text-primary">
                      {initialsOf(t.name)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#0B0B0C]">
                        {t.name}
                      </div>
                      <div className="text-[12.5px] text-muted-foreground">
                        {[t.jobTitle, t.companyName].filter(Boolean).join(", ")}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
};

export default Testimonials;
