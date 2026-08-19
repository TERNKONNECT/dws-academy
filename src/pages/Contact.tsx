import { useState } from "react";
import { Send, CheckCircle, MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import MainLayout from "@/components/layouts/MainLayout";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    category: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL
          ? `${import.meta.env.VITE_API_URL}/api/contact`
          : "/api/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert("Failed to send message. Please try again or use the email link directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-100 via-white to-gray-100 dark:from-black dark:via-gray-900 dark:to-black">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-300/5" />
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Get in <span className="text-yellow-500 dark:text-yellow-400">Touch</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-gray-300 max-w-2xl mx-auto">
            Ready to start your journey in event planning? Let's discuss how the
            Academy can help you.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 bg-gray-50 dark:bg-[#0B0B0C]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Join the Academy
                </h2>
                <p className="text-slate-600 dark:text-white/70 leading-relaxed">
                  Whether you're looking to master event planning, build a professional
                  network, or start your own business, we're here to equip you with
                  expert knowledge and hands-on experience.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <MapPin className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Office Location
                    </h3>
                    <p className="text-slate-600 dark:text-white/70 text-sm">
                      Ayodele Okeowo Street
                      <br />
                      Gbagada
                      <br />
                      Lagos, Nigeria
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-200 dark:bg-black rounded-lg">
                    <Phone className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Phone</h3>
                    <p className="text-slate-600 dark:text-white/70 text-sm">+234 704 375 7985</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-yellow-400 rounded-lg">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Email</h3>
                    <p className="text-slate-600 dark:text-white/70 text-sm">
                      <a href="mailto:schoolofeventsafrica@gmail.com" className="hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">
                        schoolofeventsafrica@gmail.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-200 dark:bg-gray-800 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Business Hours</h3>
                    <p className="text-slate-600 dark:text-white/70 text-sm">
                      Monday - Friday: 9:00 AM - 6:00 PM
                      <br />
                      Saturday: 10:00 AM - 4:00 PM
                      <br />
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-[#151517] rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-white/10">
                {submitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-slate-600 dark:text-gray-300 mb-6">
                      Thank you,{" "}
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {form.firstName}
                      </span>
                      ! We've received your message and will get back to you
                      within 24 hours.
                    </p>
                    <Button
                      onClick={() => setSubmitted(false)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="firstName"
                          className="text-base font-bold text-[#0A2640] dark:text-white"
                        >
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder="eg. Jane"
                          value={form.firstName}
                          onChange={handleChange}
                          required
                          className="h-14 border-gray-200 dark:border-white/10 bg-white dark:bg-[#0B0B0C] text-slate-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-yellow-400 focus:ring-yellow-400 text-base"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="lastName"
                          className="text-base font-bold text-[#0A2640] dark:text-white"
                        >
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="eg. Olusegun"
                          value={form.lastName}
                          onChange={handleChange}
                          required
                          className="h-14 border-gray-200 dark:border-white/10 bg-white dark:bg-[#0B0B0C] text-slate-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-yellow-400 focus:ring-yellow-400 text-base"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-base font-bold text-[#0A2640] dark:text-white"
                      >
                        What's your phone number? (Optional)
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="+234 805 250 6710"
                        value={form.phone}
                        onChange={handleChange}
                        className="h-14 border-gray-200 dark:border-white/10 bg-white dark:bg-[#0B0B0C] text-slate-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-yellow-400 focus:ring-yellow-400 text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-base font-bold text-[#0A2640] dark:text-white"
                      >
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="mail@mail.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="h-14 border-gray-200 dark:border-white/10 bg-white dark:bg-[#0B0B0C] text-slate-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-yellow-400 focus:ring-yellow-400 text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="category"
                        className="text-base font-bold text-[#0A2640] dark:text-white"
                      >
                        How can we help?
                      </Label>
                      <select
                        id="category"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                        className="h-14 w-full rounded-md border border-yellow-400 bg-white dark:bg-[#0B0B0C] px-3 py-2 text-base text-slate-900 dark:text-white focus:border-yellow-400 focus:ring-yellow-400 focus:outline-none"
                      >
                        <option value="" disabled>Select Category</option>
                        <option value="Quick help">Quick help</option>
                        <option value="Contact us">Contact us</option>
                        <option value="What was I debited">What was I debited</option>
                      </select>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-14 rounded-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg shadow-none"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <span className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full mr-2"></span>
                          Sending...
                        </span>
                      ) : (
                        "Send your message"
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

    </MainLayout>
  );
}
