import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  Users,
  Award,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  GraduationCap,
  TrendingUp,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MainLayout from "@/components/layouts/MainLayout";
import { GallerySection } from "@/components/gallery/GallerySection";

const courseSlides = [
  {
    tag: "Wedding Planning",
    title: "Wedding Planning Mastery",
    desc: "Learn to create unforgettable moments with precision and elegance",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop",
  },
  {
    tag: "Corporate Events",
    title: "Corporate Event Excellence",
    desc: "Master the art of professional event coordination and management",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop",
  },
  {
    tag: "Event Setup",
    title: "Creative Event Design",
    desc: "Transform spaces with stunning setups and creative vision",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop",
  },
  {
    tag: "Event Coordination",
    title: "Professional Event Coordination",
    desc: "Build systems that ensure flawless execution every time",
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop",
  },
];

const classes = [
  {
    level: "FOR ASPIRING & PRACTICING PLANNERS",
    title: "Beginners and Intensive Class",
    desc: "Perfect for aspiring planners or those with some experience who want to build a strong foundation and polish their craft to operate more professionally.",
    icon: <TrendingUp className="h-6 w-6" />,
    curriculum: [
      "Understanding the event planning industry",
      "Event types, roles, and core principles",
      "Step-by-step process of planning events",
      "Budgeting, logistics, and client communication basics",
      "Hands-on practical event planning",
      "Vendor coordination, timelines & workflows",
      "Styling, setup, and real-time project exercises",
      "Introduction to event business management",
      "Templates, tools, and guided supervision",
      "Confidence-building & mindset for excellence",
    ],
    featured: true,
    price: "₦350,000",
    duration: "4 weeks",
  },
  {
    level: "FOR ESTABLISHED PLANNERS",
    title: "Advanced Class",
    desc: "For established planners ready to scale and lead at a higher level.",
    icon: <Briefcase className="h-6 w-6" />,
    curriculum: [
      "Business structuring, pricing, and profitability",
      "Leadership, team, and client management",
      "Systems for scaling and quality control",
      "Building brand authority & longevity",
      "Excellence in execution: case studies and mentorship",
    ],
    price: "₦250,000",
    duration: "4 weeks",
  },
];

const Index = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [hash]);

  const [slideIndex, setSlideIndex] = useState(0);

  const prevSlide = () =>
    setSlideIndex((i) => (i - 1 + courseSlides.length) % courseSlides.length);
  const nextSlide = () =>
    setSlideIndex((i) => (i + 1) % courseSlides.length);

  const navigate = useNavigate();

  const handleRegister = () =>
    navigate("/signup");

  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />

        <div className="relative container mx-auto px-4 py-16 lg:py-28 z-10 flex flex-col items-center">
          <div className="max-w-3xl space-y-6 text-center flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-full px-5 py-2 text-yellow-300 text-xs md:text-sm font-semibold tracking-wide">
              <GraduationCap className="h-4 w-4" />
              Next Cohort Starts July 13th, 2026
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.15] tracking-tight drop-shadow-2xl">
              Master the Art, Skill &{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                Business
              </span>{" "}
              of Event Planning
            </h1>

            <p className="text-base md:text-xl text-gray-300 font-medium">
              Beginners • Intensive • Advanced Classes
            </p>

            <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-2xl mx-auto">
              Are you passionate about event planning, or already in the
              industry but want to do it right, with structure and excellence?
              The DWS Events Academy is your next step. Our program goes beyond
              creativity, we teach you the{" "}
              <span className="text-yellow-400 font-semibold">
                business of events
              </span>
              , so your skill becomes sustainable, structured, and profitable.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 w-full">
              <Button
                size="lg"
                onClick={handleRegister}
                className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold h-14 px-8 text-base rounded-xl shadow-[0_0_40px_-10px_rgba(250,204,21,0.5)] hover:shadow-[0_0_60px_-15px_rgba(250,204,21,0.6)] transition-all hover:-translate-y-1"
              >
                REGISTER NOW <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Link to="/courses" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-white/30 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 hover:text-white h-14 px-8 text-base font-semibold rounded-xl transition-all hover:-translate-y-1"
                >
                  Explore Classes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats - Overlapping Hero */}
      <section className="relative z-20 -mt-16 sm:-mt-24 pb-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {[
              { icon: <Users className="h-8 w-8" />, value: "500+", label: "Students Trained" },
              { icon: <BookOpen className="h-8 w-8" />, value: "3", label: "Class Levels" },
              { icon: <Award className="h-8 w-8" />, value: "4 Weeks", label: "Intensive Learning" },
              { icon: <GraduationCap className="h-8 w-8" />, value: "100%", label: "Practical Focus" },
            ].map(({ icon, value, label }) => (
              <div 
                key={label} 
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 flex flex-col items-center text-center space-y-3"
              >
                <div className="w-14 h-14 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mb-2 shadow-inner">
                  {icon}
                </div>
                <p className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight">{value}</p>
                <p className="text-gray-500 font-medium text-sm sm:text-base uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-yellow-50 rounded-l-[100px] z-0 hidden lg:block" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold tracking-wide text-sm">
                <Sparkles className="h-4 w-4" /> Discover Our Academy
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-black leading-tight tracking-tight">
                About <br />
                <span className="text-yellow-500">DWS Events Academy</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
                DWS Events Academy is a training arm of DWS Events, one of Nigeria's leading event consulting and production firms.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We exist to raise a generation of planners who are not only skilled but structured, confident, and business-minded.
              </p>
              <blockquote className="border-l-4 border-yellow-400 pl-6 text-left bg-gray-50/80 rounded-r-2xl py-6 pr-6 shadow-sm mt-8">
                <p className="text-xl text-gray-800 italic leading-relaxed font-medium">
                  "We don't just train planners. We train event entrepreneurs who understand systems, strategy, and sustainability."
                </p>
                <footer className="mt-4 text-yellow-600 font-bold uppercase tracking-wider text-sm">
                  — The DWS Team
                </footer>
              </blockquote>
            </div>
            <div className="relative mt-8 lg:mt-0">
              <div className="aspect-square sm:aspect-video lg:aspect-square rounded-[2rem] overflow-hidden shadow-2xl relative z-10 border-8 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&fit=crop" 
                  alt="DWS Academy Event" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 md:w-48 h-32 md:h-48 bg-yellow-400 rounded-3xl z-0" />
              <div className="absolute -top-6 -right-6 w-24 md:w-32 h-24 md:h-32 bg-gray-900 rounded-full z-0" />
            </div>
          </div>
        </div>
      </section>

      {/* Course Slider */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-10">
            What You'll <span className="text-yellow-500">Learn</span>
          </h2>
          <div className="relative max-w-4xl mx-auto group">
            <div className="overflow-hidden rounded-3xl shadow-2xl">
              <div className="relative h-96">
                <img
                  src={`${courseSlides[slideIndex].image}&q=80&auto=format`}
                  alt={courseSlides[slideIndex].title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 sm:p-12 text-white">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-yellow-400 text-black text-xs font-bold uppercase tracking-wider mb-4 shadow-lg">
                    {courseSlides[slideIndex].tag}
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-bold">
                    {courseSlides[slideIndex].title}
                  </h3>
                  <p className="text-gray-300 mt-3 text-lg max-w-xl leading-relaxed">
                    {courseSlides[slideIndex].desc}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={prevSlide}
              className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-md hover:bg-yellow-400 rounded-full flex items-center justify-center shadow-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
              <ChevronLeft className="h-6 w-6 text-black" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-md hover:bg-yellow-400 rounded-full flex items-center justify-center shadow-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
              <ChevronRight className="h-6 w-6 text-black" />
            </button>
            <div className="flex justify-center gap-3 mt-8">
              {courseSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlideIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${i === slideIndex ? "bg-yellow-400 w-6" : "bg-gray-300"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <GallerySection limit={4} showViewMore />

      {/* Why DWS Academy */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Why <span className="text-yellow-400">DWS Academy?</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Event planning is an amazing skill, but skill alone isn't enough.
              Many talented planners struggle — not because they're not good,
              but because they don't understand the business side: how to build
              systems, manage people, lead teams, and sustain profit.
            </p>
            <p className="text-yellow-400 text-xl font-semibold">
              Here, we teach you all! The skill and the business!
            </p>
            <p className="text-gray-400">
              Whether you're just starting or already in business, our classes
              are tailored to your level of growth.
            </p>
            <Button
              size="lg"
              onClick={handleRegister}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold h-12 px-8"
            >
              REGISTER NOW
            </Button>
          </div>
        </div>
      </section>

      {/* Choose Your Class */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-14 space-y-3">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black">
              Choose Your <span className="text-yellow-500">Class</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {classes.map((cls, i) => (
              <Card
                key={i}
                className={`relative overflow-hidden border-2 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                  cls.featured
                    ? "border-yellow-400 shadow-[0_0_30px_-5px_rgba(250,204,21,0.3)] ring-4 ring-yellow-400/20"
                    : "border-gray-100 shadow-xl"
                }`}
              >
                {cls.featured && (
                  <div className="absolute top-0 left-0 right-0 bg-yellow-400 text-black text-xs font-bold text-center py-1.5 tracking-wider uppercase">
                    Most Popular
                  </div>
                )}
                <CardContent className={`p-8 md:p-10 ${cls.featured ? "pt-12" : ""}`}>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-yellow-100 text-yellow-600 mb-6 shadow-inner">
                    {cls.icon}
                  </div>
                  <div className="text-yellow-600 font-bold text-sm mb-3 tracking-widest uppercase">
                    {cls.level}
                  </div>
                  <h3 className="text-2xl font-bold text-black mb-4">
                    {cls.title}
                  </h3>
                  <p className="text-gray-600 mb-8 leading-relaxed text-sm">
                    {cls.desc}
                  </p>
                  <ul className="space-y-4 mb-8">
                    {cls.curriculum.map((item, idx) => (
                      <li key={idx} className="flex items-start text-sm">
                        <CheckCircle className="h-5 w-5 text-yellow-500 mr-3 shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  {cls.price && (
                    <div className="pt-6 mt-4 border-t border-yellow-100/50 text-center space-y-1">
                      <p className="text-3xl font-bold text-yellow-600">{cls.price}</p>
                      <p className="text-sm text-gray-500 font-medium">{cls.duration}</p>
                    </div>
                  )}
                  <Button
                    onClick={handleRegister}
                    className={`w-full font-bold ${
                      cls.featured
                        ? "bg-yellow-400 hover:bg-yellow-500 text-black"
                        : "bg-black hover:bg-gray-800 text-white"
                    }`}
                  >
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Cohort Info */}
          <div className="mt-14 max-w-2xl mx-auto bg-gray-50 rounded-2xl p-8 text-center space-y-4 border border-yellow-100">
            <h3 className="text-xl font-bold text-black">
              Next Cohort Begins: July 13th, 2026
            </h3>
            <div className="flex flex-col sm:flex-row justify-center gap-6 text-gray-600">
              <span className="flex items-center gap-2 justify-center">
                <Clock className="h-5 w-5 text-yellow-500" />
                Duration: 4 weeks of intensive learning
              </span>
              <span className="flex items-center gap-2 justify-center">
                <MapPin className="h-5 w-5 text-yellow-500" />
                Online & Physical (Live & Interactive)
              </span>
            </div>
            <Button
              size="lg"
              onClick={handleRegister}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold h-12 px-10"
            >
              REGISTER NOW
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
