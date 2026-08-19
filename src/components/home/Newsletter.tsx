import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { errorMessage } from "@/lib/utils";
import { newsletterApi } from "@/api/newsletter";
import Reveal from "./Reveal";

const Newsletter = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { message } = await newsletterApi.subscribe(email);
      toast({ title: message });
      setEmail("");
    } catch (err: unknown) {
      toast({ title: "Failed to subscribe", description: errorMessage(err), variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white py-12 md:py-16 border-t border-black/5">
      <div className="mx-auto max-w-[1180px] px-8">
        <Reveal>
          <div className="mx-auto max-w-xl text-center">
            <span className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-amber-700">
              Newsletter
            </span>
            <h2 className="mt-4 text-[clamp(28px,3.6vw,42px)] font-bold text-[#0B0B0C]">
              Subscribe to Our Newsletter
            </h2>
            <p className="mt-[18px] text-[16.5px] text-muted-foreground">
              Get insights, industry reports and updates from School of Events
              Africa, direct to your inbox.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="h-12 rounded-full border-black/10 pl-11"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="h-12 rounded-full px-8 font-bold"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
              </Button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Newsletter;
