import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { errorMessage } from "@/lib/utils";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { preordersApi, PreorderRecord } from "@/api/preorders";

const COMMUNITY_URL = "https://www.instagram.com/channel/AbZw-Yo56-tG_h53/";

const perks = [
  "Behind-the-scenes moments from the journey of creating the book",
  "Exclusive launch updates",
  "First announcements and release information",
  "Special conversations around building, growth and opportunities",
  "Details on launch activities",
];

const BookPreorderSuccess = () => {
  const [params] = useSearchParams();
  const reference = params.get("reference");
  const [state, setState] = useState<{
    loading: boolean;
    preorder?: PreorderRecord;
    error?: string;
  }>({ loading: true });

  useEffect(() => {
    if (!reference) {
      setState({ loading: false, error: "We couldn't find your preorder reference." });
      return;
    }

    preordersApi
      .verify(reference)
      .then((result) => {
        if (result.status !== "success") {
          setState({
            loading: false,
            preorder: result.preorder,
            error:
              "Payment is still processing. We'll confirm your preorder as soon as it clears.",
          });
          return;
        }
        setState({ loading: false, preorder: result.preorder });
      })
      .catch((err: unknown) => {
        setState({ loading: false, error: errorMessage(err, "Unable to verify your payment.") });
      });
  }, [reference]);

  return (
    <MainLayout>
      <div className="bg-background min-h-[70vh] flex items-center justify-center px-6 py-20">
        <div className="mx-auto w-full max-w-[560px] text-center">
          {state.loading ? (
            <>
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-orange-600" />
              <p className="mt-4 text-muted-foreground">Confirming your preorder...</p>
            </>
          ) : state.error && !state.preorder?.status ? (
            <>
              <h1 className="text-2xl font-bold text-[#0B0B0C]">Something went wrong</h1>
              <p className="mt-3 text-muted-foreground">{state.error}</p>
              <Link to="/books/money-on-the-table/preorder">
                <Button className="mt-6 rounded-full bg-orange-600 text-white hover:bg-orange-700">
                  Try Again
                </Button>
              </Link>
            </>
          ) : state.error ? (
            <>
              <h1 className="text-2xl font-bold text-[#0B0B0C]">Almost there</h1>
              <p className="mt-3 text-muted-foreground">{state.error}</p>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
                <CheckCircle2 className="h-10 w-10 text-orange-600" />
              </div>
              <h1 className="mt-6 text-[clamp(26px,3.6vw,36px)] font-extrabold text-[#0B0B0C]">
                You Are Officially On The List 🎉
              </h1>
              <p className="mt-4 text-[16px] leading-relaxed text-[#3c3c3e]">
                Thank you for pre-ordering <strong>Money on the Table</strong>. You have secured
                your copy before the official release.
              </p>
              <p className="mt-4 text-[16px] leading-relaxed text-[#3c3c3e]">
                This book is more than pages. It is a collection of lessons, conversations and
                experiences created for people who know they are capable of more.
              </p>

              <div className="mt-10 rounded-2xl bg-orange-50 p-6 text-left">
                <p className="font-bold text-[#0B0B0C]">
                  While you wait for your copy, join the Money on the Table Launch Community.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Inside the community, you will receive:
                </p>
                <ul className="mt-4 space-y-2.5">
                  {perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2.5 text-sm text-[#1a1a1c]">
                      <span className="mt-0.5 text-orange-600">✓</span>
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a href={COMMUNITY_URL} target="_blank" rel="noopener noreferrer">
                <Button className="mt-8 h-14 rounded-full bg-orange-600 px-8 text-base font-bold text-white hover:bg-orange-700">
                  Join the Community <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default BookPreorderSuccess;
