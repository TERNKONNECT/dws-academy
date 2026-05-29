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
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-300/5" />
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Get in <span className="text-yellow-400">Touch</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Ready to create unforgettable events? Let's discuss how we can bring
            your vision to life.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-black mb-4">
                  Let's Create Magic Together
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Whether you're planning a wedding, corporate event, or special
                  celebration, we're here to make your dreams come true with our
                  expert event planning services.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">
                      Office Location
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Ayodele Okeowo Street
                      <br />
                      Gbagada
                      <br />
                      Lagos, Nigeria
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-black rounded-lg">
                    <Phone className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Phone</h3>
                    <p className="text-gray-600 text-sm">+234 704 375 7985</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-yellow-400 rounded-lg">
                    <Mail className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Email</h3>
                    <p className="text-gray-600 text-sm">
                      dwseventsacademy@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Business Hours</h3>
                    <p className="text-gray-600 text-sm">
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
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-yellow-100">
                {submitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-black mb-2">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Thank you,{" "}
                      <span className="font-semibold text-black">
                        {form.name}
                      </span>
                      ! We've received your message and will get back to you
                      within 24 hours to discuss your event.
                    </p>
                    <Button
                      onClick={() => setSubmitted(false)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-black mb-2">
                        Tell Us About Your Event
                      </h2>
                      <p className="text-gray-600">
                        Share your vision with us and we'll help make it a
                        reality.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label
                            htmlFor="name"
                            className="text-sm font-medium text-black"
                          >
                            Full Name *
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="Your full name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="h-12 border-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="email"
                            className="text-sm font-medium text-black"
                          >
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="h-12 border-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label
                            htmlFor="company"
                            className="text-sm font-medium text-black"
                          >
                            Company/Organization
                          </Label>
                          <Input
                            id="company"
                            name="company"
                            placeholder="Your company (optional)"
                            value={form.company}
                            onChange={handleChange}
                            className="h-12 border-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="subject"
                            className="text-sm font-medium text-black"
                          >
                            Event Type *
                          </Label>
                          <select
                            id="subject"
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
                            required
                            className="h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-yellow-400 focus:ring-yellow-400 focus:outline-none"
                          >
                            <option value="">Select event type</option>
                            <option value="wedding">Wedding</option>
                            <option value="corporate">Corporate Event</option>
                            <option value="birthday">Birthday Party</option>
                            <option value="anniversary">Anniversary</option>
                            <option value="graduation">Graduation</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="message"
                          className="text-sm font-medium text-black"
                        >
                          Event Details *
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell us about your event - date, location, number of guests, special requirements..."
                          rows={6}
                          value={form.message}
                          onChange={handleChange}
                          required
                          className="resize-none border-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold shadow-lg"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">
              Visit Our <span className="text-yellow-500">Studio</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Come see our event planning studio and portfolio. We'd love to
              meet you and discuss your upcoming celebration in person.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-yellow-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.7!2d3.3792!3d6.5244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
