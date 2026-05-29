import { useState } from "react";
import {
  Heart,
  Users,
  Calendar,
  Camera,
  Music,
  Sparkles,
  CheckCircle,
  Star,
  Award,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MainLayout from "@/components/layouts/MainLayout";

const services = [
  {
    icon: <Heart className="h-8 w-8" />,
    title: "Wedding Planning",
    description:
      "Create your dream wedding with our comprehensive planning services. From intimate ceremonies to grand celebrations.",
    features: [
      "Complete wedding coordination",
      "Venue selection and booking",
      "Vendor management and coordination",
      "Timeline planning and execution",
      "Bridal party coordination",
      "Day-of wedding management",
    ],
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
    price: "Starting from ₦500,000",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Corporate Events",
    description:
      "Professional corporate events that leave lasting impressions. Perfect for product launches, conferences, and team building.",
    features: [
      "Conference and seminar planning",
      "Product launch coordination",
      "Team building activities",
      "Corporate dinner arrangements",
      "Brand activation events",
      "Executive meeting planning",
    ],
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80",
    price: "Starting from ₦300,000",
  },
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: "Birthday Celebrations",
    description:
      "Memorable birthday parties for all ages. From children's themed parties to milestone adult celebrations.",
    features: [
      "Themed party planning",
      "Age-appropriate entertainment",
      "Custom decoration design",
      "Cake and catering coordination",
      "Photography and videography",
      "Party favor arrangements",
    ],
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop&q=80",
    price: "Starting from ₦150,000",
  },
  {
    icon: <Calendar className="h-8 w-8" />,
    title: "Special Occasions",
    description:
      "Celebrate life's precious moments with our special occasion planning. Anniversaries, graduations, and milestone events.",
    features: [
      "Anniversary celebrations",
      "Graduation parties",
      "Retirement celebrations",
      "Baby showers and gender reveals",
      "Engagement parties",
      "Holiday celebrations",
    ],
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format&fit=crop&q=80",
    price: "Starting from ₦200,000",
  },
];

const features = [
  {
    icon: <Camera className="h-6 w-6" />,
    title: "Professional Photography",
    description:
      "Capture every precious moment with our team of expert photographers and videographers.",
  },
  {
    icon: <Music className="h-6 w-6" />,
    title: "Entertainment & Music",
    description:
      "Live bands, DJs, and entertainment options to keep your guests engaged throughout the event.",
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Custom Decorations",
    description:
      "Unique themes and decorations tailored to your vision and personal style preferences.",
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "Premium Vendors",
    description:
      "Access to our network of trusted, high-quality vendors for catering, flowers, and more.",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Timeline Management",
    description:
      "Detailed timeline planning and coordination to ensure your event runs smoothly from start to finish.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Guest Coordination",
    description:
      "Complete guest management including invitations, RSVPs, and special accommodation arrangements.",
  },
];

const testimonials = [
  {
    name: "Sarah & Michael Johnson",
    event: "Wedding",
    rating: 5,
    text: "DEWHITE SPARKLES made our wedding absolutely magical! Every detail was perfect and stress-free.",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Tech Solutions Ltd",
    event: "Corporate Launch",
    rating: 5,
    text: "Professional, creative, and flawless execution. Our product launch exceeded all expectations!",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "The Davis Family",
    event: "Birthday Celebration",
    rating: 5,
    text: "They turned our daughter's 16th birthday into a fairy tale. Absolutely incredible work!",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
];

export default function Services() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

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
              <Sparkles className="h-5 w-5 text-yellow-400" />
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              Our <span className="text-yellow-500">Services</span>
            </h2>
            <p className="text-xl text-gray-600">
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
                        <h3 className="text-2xl md:text-3xl font-bold text-black">
                          {service.title}
                        </h3>
                        <p className="text-yellow-600 font-semibold text-lg">
                          {service.price}
                        </p>
                      </div>
                    </div>

                    <p className="text-lg text-gray-600 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {service.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">
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
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              What's <span className="text-yellow-500">Included</span>
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need for a successful and memorable event
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map(({ icon, title, description }) => (
              <Card
                key={title}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white"
              >
                <CardContent className="p-6 space-y-4 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center text-yellow-600 mx-auto">
                    {icon}
                  </div>
                  <h3 className="text-xl font-bold text-black">{title}</h3>
                  <p className="text-gray-600 leading-relaxed">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Client <span className="text-yellow-400">Testimonials</span>
            </h2>
            <p className="text-xl text-gray-300">
              Hear what our satisfied clients say about their experiences
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-8">
              <CardContent className="text-center space-y-6">
                <div className="flex justify-center space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-6 w-6 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <blockquote className="text-2xl text-white leading-relaxed">
                  "{testimonials[activeTestimonial].text}"
                </blockquote>

                <div className="flex items-center justify-center space-x-4">
                  <img
                    src={testimonials[activeTestimonial].image}
                    alt={testimonials[activeTestimonial].name}
                    className="w-16 h-16 rounded-full border-2 border-yellow-400"
                  />
                  <div className="text-left">
                    <p className="font-bold text-white">
                      {testimonials[activeTestimonial].name}
                    </p>
                    <p className="text-yellow-400">
                      {testimonials[activeTestimonial].event}
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
                      : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              Transparent <span className="text-yellow-500">Pricing</span>
            </h2>
            <p className="text-xl text-gray-600">
              No hidden fees. Clear, upfront pricing for all our services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {services.map((service) => (
              <Card
                key={service.title}
                className="border-2 border-yellow-200 hover:border-yellow-400 transition-colors"
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center text-yellow-600 mx-auto">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-bold text-black">
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
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center text-yellow-600 mx-auto">
                  <Phone className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-black">Call Us</h3>
                <p className="text-gray-600">+234 704 375 7985</p>
                <p className="text-sm text-gray-500">Mon - Fri: 9AM - 6PM</p>
              </div>

              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center text-yellow-600 mx-auto">
                  <Mail className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-black">Email Us</h3>
                <p className="text-gray-600">dwseventsacademy@gmail.com</p>
                <p className="text-sm text-gray-500">
                  We respond within 24 hours
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center text-yellow-600 mx-auto">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-black">Visit Us</h3>
                <p className="text-gray-600">
                  Ayodele Okeowo Street, Gbagada , Lagos State
                </p>
                <p className="text-sm text-gray-500">By appointment only</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-400 to-yellow-500">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              Ready to Plan Your Perfect Event?
            </h2>
            <p className="text-xl text-black/80">
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
                className="border-2 border-black text-black hover:bg-black/10 font-semibold text-lg h-14 px-8"
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
