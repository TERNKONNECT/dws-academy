import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import Reveal from "./Reveal";

// Placeholder content — no books data model exists yet. Swap for real
// book records once that's built.
const books = [
  {
    coverImage: "/money-on-the-table-cover.png",
    title: "Money on the Table",
    desc: "A practical look at where event businesses lose profit, and how to stop it.",
    href: "/books/money-on-the-table",
    badge: "Preorder Now",
  },
];

const Books = () => {
  return (
    <section id="books" className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-[1180px] px-8">
        <Reveal>
          <div className="mx-auto mb-16 max-w-xl text-center">
            <span className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-amber-700">
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
              <Link
                key={book.title}
                to={book.href}
                className="flex items-center gap-[22px] rounded-2xl border border-black/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <img
                  src={book.coverImage}
                  alt={`${book.title} cover`}
                  className="h-[104px] w-[74px] shrink-0 rounded-[5px] border border-black/15 object-cover shadow-[3px_3px_0_rgba(0,0,0,0.08)]"
                />
                <div>
                  <Badge className="mb-2 border-transparent bg-orange-100 text-orange-700 hover:bg-orange-100">
                    {book.badge}
                  </Badge>
                  <h4 className="text-base font-bold text-[#0B0B0C]">
                    {book.title}
                  </h4>
                  <p className="mt-1.5 text-[13.5px] text-muted-foreground">
                    {book.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Books;
