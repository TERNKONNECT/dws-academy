import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";

const paragraphs = [
  "This morning, I found myself looking at my favourite mug.",
  "A simple mug. But one that carries a story.",
  "It was a gift from Wemi Jones after one of our conversations, and every time I use it, I am reminded of the people, lessons and moments that have shaped my journey.",
  "I was holding that mug after a meeting with one of my mentees.",
  "She is incredibly talented.",
  "Skilled. Creative. Passionate. The kind of person you know has something special.",
  "But as we talked, one thing became clear.",
  "The challenge was not her ability to do the work.",
  "The challenge was understanding how to turn that ability into a sustainable business.",
  "And that conversation stayed with me.",
  "Because over the years, I have met so many brilliant people who can create, execute and deliver at a high level, but struggle with the things that make a business grow.",
  "How do you position yourself?",
  "How do you recognise opportunities?",
  "How do you build systems?",
  "How do you move from simply being busy to actually building something?",
  "That question is the reason Money on the Table was written.",
  "This book is a collection of lessons, reflections and experiences from my journey of building, failing, learning and discovering that success is not just about how hard you work.",
  "It is about recognising what is already within your reach.",
  "It is about understanding the opportunities you may be overlooking.",
  "It is about knowing that talent alone is not enough. Talent needs structure. Passion needs strategy. Work needs a business behind it.",
  "Money on the Table is for every entrepreneur, creative and professional who knows they are capable of more.",
  "For those who are ready to stop leaving opportunities unseen and start building with intention.",
  "Because sometimes, the biggest opportunities are not somewhere far away.",
  "Sometimes, they are already sitting right in front of you.",
];

const MoneyOnTheTable = () => {
  return (
    <MainLayout>
      <div className="bg-white">
        {/* Hero */}
        <section className="px-6 pb-16 pt-20 md:pt-28">
          <div className="mx-auto grid max-w-[980px] grid-cols-1 items-center gap-14 md:grid-cols-2">
            <div className="order-2 text-center md:order-1 md:text-left">
              <span className="text-[11.5px] font-bold uppercase tracking-[0.2em] text-orange-600">
                A Book by Adesuwa Olanrewaju-Dada
              </span>
              <h1 className="mt-4 text-[clamp(34px,5.5vw,58px)] font-extrabold uppercase leading-[1.02] text-[#0B0B0C]">
                Money <span className="text-orange-600">on the</span> Table
              </h1>
              <p className="mt-5 text-lg italic leading-relaxed text-[#3c3c3e]">
                A conversation, a mug, and a question I could not ignore.
              </p>
              <div className="mt-8">
                <Link to="/books/money-on-the-table/preorder">
                  <Button
                    size="lg"
                    className="h-14 rounded-full bg-orange-600 px-8 text-base font-bold text-white hover:bg-orange-700"
                  >
                    Preorder Your Copy
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="order-1 flex justify-center md:order-2">
              <img
                src="/money-on-the-table-cover.png"
                alt="Money on the Table book cover"
                className="w-full max-w-[360px] rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.15)]"
              />
            </div>
          </div>
        </section>

        {/* Photo */}
        <section className="border-t border-black/5 px-6 py-12 md:py-16">
          <div className="mx-auto max-w-[980px]">
            <img
              src="/money-on-the-table-photo.jpg"
              alt="Money on the Table"
              className="w-full rounded-2xl object-cover shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
            />
          </div>
        </section>

        {/* Essay */}
        <section className="border-t border-black/5 px-6 py-16 md:py-24">
          <div className="mx-auto max-w-[640px]">
            <div className="space-y-6 text-[17px] leading-[1.85] text-[#1a1a1c]">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <p className="mt-10 text-[clamp(24px,3.4vw,34px)] font-extrabold leading-tight text-[#0B0B0C]">
              What are you leaving on the table?
            </p>

            <div className="mt-12 flex justify-center">
              <Link to="/books/money-on-the-table/preorder">
                <Button
                  size="lg"
                  className="h-14 rounded-full bg-orange-600 px-10 text-base font-bold text-white hover:bg-orange-700"
                >
                  Preorder Your Copy
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default MoneyOnTheTable;
