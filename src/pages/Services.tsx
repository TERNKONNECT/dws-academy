import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle,
  ClipboardList,
  Gift,
  Handshake,
  Mail,
  MapPin,
  PartyPopper,
  Phone,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { testimonialsApi, type Testimonial } from "@/api/testimonials";

const services = [
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: "Weddings",
    price: "From ₦1,500,000",
    description:
      "Full planning and coordination for traditional, white, and destination weddings — from the first venue visit to the last dance.",
    features: [
      "Venue sourcing and site visits",
      "Vendor selection and management",
      "Décor concept and styling",
      "Day-of coordination team",
      "Budget tracking",
      "Guest and logistics management",
    ],
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  },
  {
    icon: <Building2 className="h-8 w-8" />,
    title: "Corporate Events",
    price: "From ₦2,000,000",
    description:
      "Conferences, product launches, and end-of-year parties delivered to brand, on schedule, and within budget.",
    features: [
      "Programme and run-of-show design",
      "Stage, AV, and technical production",
      "Branding and stage design",
      "Delegate registration",
      "Speaker and MC coordination",
      "Post-event reporting",
    ],
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
  },
  {
    icon: <PartyPopper className="h-8 w-8" />,
    title: "Private Celebrations",
    price: "From ₦800,000",
    description:
      "Birthdays, anniversaries, and milestone parties planned around the story you want the night to tell.",
    features: [
      "Theme and concept development",
      "Venue styling and décor",
      "Catering and bar coordination",
      "Entertainment booking",
      "Photography and videography",
      "On-the-night management",
    ],
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    icon: <Handshake className="h-8 w-8" />,
    title: "Consulting & Training",
    price: "From ₦350,000",
    description:
      "Hands-on advisory for teams and event businesses, plus bespoke training drawn from the DWS Academy curriculum.",
    features: [
      "Event business strategy sessions",
      "Team training workshops",
      "Supplier network introductions",
      "Pricing and costing reviews",
      "Process and checklist design",
      "Ongoing mentorship",
    ],
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  },
];

const features = [
  {
    icon: <ClipboardList className="h-8 w-8" />,
    title: "One Plan, Start to Finish",
    description:
      "A single written plan covering budget, timeline, vendors, and contingencies — so nothing lives only in someone's head.",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "A Named Team",
    description:
      "You know exactly who is running your event and how to reach them, from the first meeting through to the pack-down.",
  },
  {
    icon: <Handshake className="h-8 w-8" />,
    title: "Vetted Suppliers",
    description:
      "Caterers, décor, AV, and entertainment we have worked with before and would book again for our own events.",
  },
  {
    icon: <Calendar className="h-8 w-8" />,
    title: "Run-of-Show Discipline",
    description:
      "Every event runs to a minute-by-minute schedule that the whole team, and every vendor, is working from.",
  },
  {
    icon: <Gift className="h-8 w-8" />,
    title: "Design That Fits the Budget",
    description:
      "Concepts costed before they are presented, so what you approve is what you can actually afford to build.",
  },
  {
    icon: <CheckCircle className="h-8 w-8" />,
    title: "Clear, Upfront Pricing",
    description:
      "Fees agreed in writing before work starts. No commissions taken behind your back, no surprises on the final invoice.",
  },
];

const fallbackTestimonials: Testimonial[] = [
  {
    id: "fb-1",
    name: "Sarah & Michael Johnson",
    jobTitle: "Clients",
    companyName: "Wedding",
    content: "DEWHITE SPARKLES made our wedding absolutely magical! Every detail was perfect and stress-free.",
    date: new Date().toISOString(),
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "fb-2",
    name: "Tech Solutions Ltd",
    jobTitle: "Corporate Client",
    companyName: "Tech Solutions",
    content: "Professional, creative, and flawless execution. Our product launch exceeded all expectations!",
    date: new Date().toISOString(),
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "fb-3",
    name: "The Davis Family",
    jobTitle: "Clients",
    companyName: "Birthday Celebration",
    content: "They turned our daughter's 16th birthday into a fairy tale. Absolutely incredible work!",
    date: new Date().toISOString(),
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function Services() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);

  useEffect(() => {
    let active = true;
    testimonialsApi.getAll().then((data) => {
      if (active && data.length > 0) {
        setTestimonials(data);
      }
    }).catch(console.error);
    return () => { active = false; };
  }, []);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-300/5" />

        <div className="relative container mx-auto px-4 z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-yellow-400/20 backdrop-blur-sm border border-yellow-400/30 rounded-full px-6 py-3">
              
              <span className="text-yellow-400 font-medium">
                Premium Event Services
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              Comprehensive Event
              <span className="block bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                Planning Services
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
              From intimate gatherings to grand celebrations, we provide
              complete event planning solutions tailored to your unique vision
              and budget.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50 dark:bg-[#151517]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Our <span className="text-yellow-500">Services</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-white/70">
              Professional event planning services for every occasion and budget
            </p>
          </div>

          <div className="space-y-20">
            {services.map((service, index) => (
              <div key={service.title} className="max-w-6xl mx-auto">
                <div
                  className={`grid md:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? "md:grid-flow-col-dense" : ""
                  }`}
                >
                  <div
                    className={`space-y-6 ${index % 2 === 1 ? "md:col-start-2" : ""}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center text-yellow-600">
                        {service.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                          {service.title}
                        </h3>
                        <p className="text-yellow-600 font-semibold text-lg">
                          {service.price}
                        </p>
                      </div>
                    </div>

                    <p className="text-lg text-slate-600 dark:text-white/70 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {service.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-white/80 text-sm">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      <Link to="/contact">
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold"
                        >
                          Get Quote
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-2 border-yellow-400 text-yellow-600 hover:bg-yellow-50"
                      >
                        View Portfolio
                      </Button>
                    </div>
                  </div>

                  <div className={`${index % 2 === 1 ? "md:col-start-1" : ""}`}>
                    <div className="relative">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="rounded-2xl shadow-2xl w-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-[#0B0B0C]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              What's <span className="text-yellow-500">Included</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-white/70">
              Everything you need for a successful and memorable event
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map(({ icon, title, description }) => (
              <Card
                key={title}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gray-50 dark:bg-[#151517]"
              >
                <CardContent className="p-6 space-y-4 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center text-yellow-600 mx-auto">
                    {icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
                  <p className="text-slate-600 dark:text-white/70 leading-relaxed">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-gray-100 via-white to-gray-100 dark:from-black dark:via-gray-900 dark:to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Client <span className="text-yellow-400">Testimonials</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-gray-300">
              Hear what our satisfied people say about their experiences
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/50 dark:bg-[#151517]/50 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-8">
              <CardContent className="text-center space-y-6">
                <div className="flex justify-center space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-6 w-6 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <blockquote className="text-2xl text-slate-900 dark:text-white leading-relaxed">
                  "{testimonials[activeTestimonial]?.content}"
                </blockquote>

                <div className="flex items-center justify-center space-x-4">
                  <img
                    src={
                      testimonials[activeTestimonial]?.image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonials[activeTestimonial]?.name || 'User')}&background=random`
                    }
                    alt={testimonials[activeTestimonial]?.name}
                    className="w-16 h-16 rounded-full border-2 border-yellow-400 object-cover"
                  />
                  <div className="text-left">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {testimonials[activeTestimonial]?.name}
                    </p>
                    <p className="text-yellow-400">
                      {[testimonials[activeTestimonial].jobTitle, testimonials[activeTestimonial].companyName].filter(Boolean).join(' • ')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center space-x-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === activeTestimonial
                      ? "bg-yellow-400"
                      : "bg-[#151517]/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white dark:bg-[#151517]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Transparent <span className="text-yellow-500">Pricing</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-white/70">
              No hidden fees. Clear, upfront pricing for all our services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {services.map((service) => (
              <Card
                key={service.title}
                className="border-2 border-gray-200 dark:border-yellow-200 hover:border-yellow-400 dark:hover:border-yellow-400 transition-colors bg-white dark:bg-[#1C1C1E]"
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center text-yellow-600 mx-auto">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {service.title}
                  </h3>
                  <p className="text-2xl font-bold text-yellow-600">
                    {service.price}
                  </p>
                  <Link to="/contact">
                    <Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold">
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-20 bg-gray-50 dark:bg-[#0B0B0C]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center text-yellow-600 mx-auto">
                  <Phone className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Call Us</h3>
                <p className="text-slate-600 dark:text-white/70">+234 704 375 7985</p>
                <p className="text-sm text-slate-500 dark:text-white/60">Mon - Fri: 9AM - 6PM</p>
              </div>

              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center text-yellow-600 mx-auto">
                  <Mail className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Email Us</h3>
                <p className="text-slate-600 dark:text-white/70">schoolofeventsafrica@gmail.com</p>
                <p className="text-sm text-slate-500 dark:text-white/60">
                  We respond within 24 hours
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center text-yellow-600 mx-auto">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Visit Us</h3>
                <p className="text-slate-600 dark:text-white/70">
                  Ayodele Okeowo Street, Gbagada , Lagos State
                </p>
                <p className="text-sm text-slate-500 dark:text-white/60">By appointment only</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-400 to-yellow-500">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Ready to Plan Your Perfect Event?
            </h2>
            <p className="text-xl text-slate-800">
              Let's turn your vision into an unforgettable celebration. Contact
              us today for a free consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button
                  size="lg"
                  className="bg-black text-yellow-400 hover:bg-gray-900 font-bold text-lg h-14 px-8"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Free Consultation
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-black text-white hover:bg-black/10 font-semibold text-lg h-14 px-8"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
