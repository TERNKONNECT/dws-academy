import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const beams = [
  { left: "12%", delay: "0s" },
  { left: "38%", delay: "-4s" },
  { left: "64%", delay: "-8s" },
  { left: "88%", delay: "-2s" },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background px-6 pt-40 pb-24 md:pt-48 md:pb-28">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 18% 30%, rgba(244,180,0,0.10), transparent 40%), radial-gradient(circle at 85% 20%, rgba(244,180,0,0.07), transparent 45%)",
        }}
      />
      {beams.map((b, i) => (
        <span
          key={i}
          className="animate-beam-drift pointer-events-none absolute top-[-10%] h-[120%] w-px opacity-50"
          style={{
            left: b.left,
            animationDelay: b.delay,
            background:
              "linear-gradient(to bottom, transparent, rgba(244,180,0,0.35), transparent)",
          }}
        />
      ))}

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <span className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-primary">
          Africa's Business School for the Event Industry
        </span>
        <h1 className="mt-5 text-[clamp(38px,6vw,66px)] font-bold leading-[1.06] text-foreground">
          Africa's School for{" "}
          <span className="text-primary">Event Professionals</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Build the skills, systems and business required to succeed in
          today's event industry. Whether you're an event planner, decorator,
          photographer, MC, production expert or venue owner, School of
          Events Africa gives you practical education from professionals
          building real businesses.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/courses">
            <Button size="lg">Explore Courses</Button>
          </Link>
          <Link to="/contact">
            <Button size="lg" variant="outline">
              Book a Clarity Call
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
