import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { errorMessage } from "@/lib/utils";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { preordersApi } from "@/api/preorders";

const PRICE_PER_COPY = 15000;

const BookPreorder = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    whatsapp: "",
    quantity: 1,
    deliveryDetails: "",
  });

  const total = PRICE_PER_COPY * (form.quantity || 1);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Math.max(1, Number(value) || 1) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { authorizationUrl } = await preordersApi.initialize(form);
      window.location.href = authorizationUrl;
    } catch (err: unknown) {
      toast({
        title: "Could not start payment",
        description: errorMessage(err),
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="bg-white min-h-screen px-6 py-16 md:py-24">
        <div className="mx-auto max-w-[520px]">
          <Link
            to="/books/money-on-the-table"
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to the book
          </Link>

          <h1 className="mt-6 text-[clamp(26px,3.6vw,36px)] font-extrabold text-[#0B0B0C]">
            Secure your copy of Money on the Table
          </h1>
          <p className="mt-3 text-[15px] text-muted-foreground">
            ₦{PRICE_PER_COPY.toLocaleString()} per copy. Fill in your details below and complete
            payment to reserve your copy ahead of release.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-[#0B0B0C]">
                Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Your full name"
                value={form.fullName}
                onChange={handleChange}
                required
                className="h-12 border-black/10 focus-visible:ring-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#0B0B0C]">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="h-12 border-black/10 focus-visible:ring-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-[#0B0B0C]">
                WhatsApp Number
              </Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                placeholder="+234 800 000 0000"
                value={form.whatsapp}
                onChange={handleChange}
                required
                className="h-12 border-black/10 focus-visible:ring-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-[#0B0B0C]">
                Quantity
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min={1}
                value={form.quantity}
                onChange={handleChange}
                required
                className="h-12 border-black/10 focus-visible:ring-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryDetails" className="text-[#0B0B0C]">
                Delivery Details <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="deliveryDetails"
                name="deliveryDetails"
                placeholder="Address or delivery notes, if you'd like to share them now"
                value={form.deliveryDetails}
                onChange={handleChange}
                className="min-h-[90px] border-black/10 focus-visible:ring-orange-500"
              />
            </div>

            <div className="flex items-center justify-between rounded-xl bg-orange-50 px-4 py-3 text-sm font-semibold text-[#0B0B0C]">
              <span>Total</span>
              <span>₦{total.toLocaleString()}</span>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-14 w-full rounded-full bg-orange-600 text-base font-bold text-white hover:bg-orange-700"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Redirecting to payment...
                </span>
              ) : (
                "Complete payment"
              )}
            </Button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default BookPreorder;
