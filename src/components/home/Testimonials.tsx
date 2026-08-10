import { Star } from "lucide-react";
import Reveal from "./Reveal";
import type { TestimonialItem } from "./types";

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

// Placeholder content — shown until real student reviews exist. Swap out
// as soon as courses have real reviews (see Index.tsx's testimonials fetch).
const placeholderTestimonials: TestimonialItem[] = [
  {
    id: "placeholder-tariq",
    name: "Tariq Folarin",
    rating: 5,
    comment:
      "I stopped pricing out of fear. Six months after the Business of Events course, I restructured my packages and my company finally has margin, not just movement.",
    courseTitle: "Event Producer, Lagos",
  },
  {
    id: "placeholder-ngozi",
    name: "Ngozi Chukwu",
    rating: 5,
    comment:
      "I came in as a decorator with no systems. I left with a registered company, a pricing model and the confidence to say no to the wrong clients.",
    courseTitle: "Décor Entrepreneur, Abuja",
  },
  {
    id: "placeholder-kwame",
    name: "Kwame Mensah",
    rating: 5,
    comment:
      "The Financial Structure course changed how I run my books. For the first time, I know exactly what each event actually earns.",
    courseTitle: "Production Lead, Accra",
  },
];

const Testimonials = ({ testimonials }: { testimonials: TestimonialItem[] }) => {
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
          <div className="grid grid-cols-1 gap-[22px] md:grid-cols-3">
            {shown.map((t) => (
              <div
                key={t.id}
                className="rounded-2xl border border-black/10 bg-white p-7"
              >
                <div className="mb-4 flex gap-0.5 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5"
                      fill={i < t.rating ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <p className="mb-6 text-[15px] leading-relaxed text-[#333]">
                  {t.comment}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B0B0C] text-sm font-bold text-primary">
                    {initialsOf(t.name)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#0B0B0C]">
                      {t.name}
                    </div>
                    <div className="text-[12.5px] text-muted-foreground">
                      {t.courseTitle}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Testimonials;
