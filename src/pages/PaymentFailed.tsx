import { Link, useSearchParams } from "react-router-dom";
import { XCircle, RefreshCw, MessageCircle, ArrowLeft } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PaymentFailed = () => {
  const [params] = useSearchParams();
  const courseId = params.get("courseId");
  const reference = params.get("reference");

  return (
    <MainLayout>
      <div className="container flex min-h-[70vh] items-center justify-center py-12">
        <Card className="w-full max-w-xl border-destructive/20">
          <CardContent className="p-10 text-center space-y-6">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-10 w-10 text-destructive" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Payment Unsuccessful</h1>
              <p className="text-muted-foreground leading-relaxed">
                We could not confirm your payment. Your account has not been charged.
                This may have occurred due to a cancelled transaction, insufficient
                funds, or a network error.
              </p>
            </div>

            {reference && (
              <div className="bg-muted rounded-lg px-4 py-3 text-sm">
                <span className="text-muted-foreground">Reference: </span>
                <span className="font-mono font-medium">{reference}</span>
              </div>
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 text-left">
              <p className="font-semibold mb-1">What to do next:</p>
              <ul className="list-disc list-inside space-y-1 text-amber-700">
                <li>Check that your card or bank account has sufficient funds</li>
                <li>Ensure your card is enabled for online transactions</li>
                <li>Try a different payment method</li>
                <li>Contact your bank if the issue persists</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              {courseId ? (
                <Link to={`/courses/${courseId}`}>
                  <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold border-0 gap-2 w-full sm:w-auto">
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </Button>
                </Link>
              ) : (
                <Link to="/courses">
                  <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold border-0 gap-2 w-full sm:w-auto">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Courses
                  </Button>
                </Link>
              )}
              <Link to="/contact">
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <MessageCircle className="h-4 w-4" />
                  Contact Support
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default PaymentFailed;
