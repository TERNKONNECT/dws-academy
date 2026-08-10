import { Badge } from "@/components/ui/badge";
import Reveal from "./Reveal";

// Placeholder content — no books data model exists yet. Swap for real
// book records once that's built.
const books = [
  {
    coverLines: ["MONEY", "ON THE", "TABLE"],
    title: "Money on the Table",
    desc: "A practical look at where event businesses lose profit, and how to stop it.",
  },
  {
    coverLines: ["UNTITLED", "·", "2027"],
    title: "A Second Title, In Progress",
    desc: "Details to be announced.",
  },
];

const Books = () => {
  return (
    <section id="books" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1180px] px-8">
        <Reveal>
          <div className="mx-auto mb-16 max-w-xl text-center">
            <span className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-primary/80">
              Books
            </span>
            <h2 className="mt-4 text-[clamp(28px,3.6vw,42px)] font-bold text-[#0B0B0C]">
              Books by Adesuwa Dada
            </h2>
            <p className="mt-[18px] text-[16.5px] text-muted-foreground">
              Practical resources written to help event professionals build
              stronger businesses, think strategically and grow beyond
              creativity.
            </p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="mx-auto grid max-w-[760px] grid-cols-1 gap-[26px] sm:grid-cols-2">
            {books.map((book) => (
              <div
                key={book.title}
                className="flex items-center gap-[22px] rounded-2xl border border-black/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className="flex h-[104px] w-[74px] shrink-0 items-center justify-center rounded-[5px] border border-black/15 p-2 shadow-[3px_3px_0_rgba(0,0,0,0.08)]"
                  style={{
                    background: "linear-gradient(160deg,#111,#2b2413 130%)",
                  }}
                >
                  <span className="text-center text-[10px] font-bold leading-tight text-primary">
                    {book.coverLines.map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < book.coverLines.length - 1 && <br />}
                      </span>
                    ))}
                  </span>
                </div>
                <div>
                  <Badge className="mb-2 border-transparent bg-black/5 text-black/45 hover:bg-black/5">
                    Coming Soon
                  </Badge>
                  <h4 className="text-base font-bold text-[#0B0B0C]">
                    {book.title}
                  </h4>
                  <p className="mt-1.5 text-[13.5px] text-muted-foreground">
                    {book.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Books;
