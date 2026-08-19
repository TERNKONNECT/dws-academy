import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Reveal from "./Reveal";

const ClarityCallCta = () => {
  return (
    <section id="clarity" className="bg-background px-6 py-24 md:py-32">
      <Reveal>
        <div
          className="relative mx-auto max-w-[1180px] overflow-hidden rounded-3xl px-8 py-20 text-center md:px-16"
          style={{ background: "linear-gradient(160deg, #17150f, #0B0B0C 60%)" }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 0%, rgba(244,180,0,0.14), transparent 55%)",
            }}
          />
          <div className="relative z-10 mx-auto max-w-xl">

            <Link to="/contact">
              <Button size="lg" className="mt-8">
                Book a Clarity Call
              </Button>
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default ClarityCallCta;
