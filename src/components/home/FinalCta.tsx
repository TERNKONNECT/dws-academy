import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Reveal from "./Reveal";

const FinalCta = () => {
  return (
    <section className="bg-background px-6 py-12 text-center md:py-16">
      <Reveal>
        <h2 className="mx-auto max-w-[720px] text-[clamp(30px,4.4vw,50px)] font-bold text-foreground">
          Ready to Build Your Future in the Event Industry?
        </h2>
        <p className="mx-auto mt-5 max-w-[520px] text-[16.5px] text-muted-foreground">
          Join thousands of professionals building the future of events
          across Africa.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link to="/courses">
            <Button size="lg">Explore Courses</Button>
          </Link>
          <Link to="/contact">
            <Button size="lg" variant="outline">
              Book a Clarity Call
            </Button>
          </Link>
        </div>
      </Reveal>
    </section>
  );
};

export default FinalCta;
