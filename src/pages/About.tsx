import { useState } from "react";
import {
  Heart,
  Sparkles,
  Award,
  Users,
  Target,
  BookOpen,
  Calendar,
  CheckCircle,
  ArrowRight,
  Star,
  GraduationCap,
  TrendingUp,
  Shield,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MainLayout from "@/components/layouts/MainLayout";

const values = [
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Excellence in Every Detail",
    description:
      "We believe every event deserves meticulous attention to detail and flawless execution.",
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Creative Innovation",
    description:
      "We bring fresh, creative ideas to every event, making each celebration unique and memorable.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Client-Centered Approach",
    description:
      "Your vision is our priority. We listen, understand, and bring your dreams to life.",
  },
];

const team = [
  {
    name: "Olayinka Olawunmi Olatunji",
    role: "Director of Academy",
    image: "/profiles/olayinka.jpg",
    bio: "Leading the vision and curriculum at DWS Events Academy to shape the next generation of event professionals.",
  },
  {
    name: "Esther Adebiyi",
    role: "Platform Coordinator",
    image: "/profiles/esther.jpg",
    bio: "Ensuring smooth operations and a seamless learning experience for all academy students and facilitators.",
  },
  {
    name: "Adesuwa Olarenwaju-Dada",
    role: "Facilitator",
    image: "/profiles/adesuwa.jpg",
    bio: "An expert event professional dedicated to teaching and mentoring students with real-world industry insights.",
  },
];

const stats = [
  { value: "200+", label: "Events Planned" },
  { value: "1000+", label: "Happy People" },
  { value: "15+", label: "Years Experience" },
  { value: "4.9/5", label: "Client Rating" },
];

// const academyClasses = [
//   {
//     level: "Beginners Class",
//     target: "FOR ASPIRING PLANNERS",
//     description:
//       "For aspiring planners or anyone curious about the world of events. Learn the foundation you need to start strong.",
//     features: [
//       "Understanding the event planning industry",
//       "Event types, roles, and core principles",
//       "Step-by-step process of planning events",
//       "Budgeting, logistics, and client communication basics",
//       "Confidence-building & mindset for excellence",
//     ],
//     price: "₦150,000",
//     duration: "4 weeks",
//   },
//   {
//     level: "Beginner and Intensive Class",
//     target: "FOR PRACTICING PLANNERS",
//     description:
//       "For planners with some experience who want to polish their craft and operate more professionally.",
//     features: [
//       "Hands-on practical event planning",
//       "Vendor coordination, timelines & workflows",
//       "Styling, setup, and real-time project exercises",
//       "Introduction to event business management",
//       "Templates, tools, and guided supervision",
//     ],
//     price: "₦250,000",
//     duration: "4 weeks",
//   },
//   {
//     level: "Advanced Class",
//     target: "FOR ESTABLISHED PLANNERS",
//     description:
//       "For established planners ready to scale and lead at a higher level.",
//     features: [
//       "Business structuring, pricing, and profitability",
//       "Leadership, team, and client management",
//       "Systems for scaling and quality control",
//       "Building brand authority & longevity",
//       "Excellence in execution: case studies and mentorship",
//     ],
//     price: "₦350,000",
//     duration: "4 weeks",
//   },
// ];

const academyClasses = [
  {
    level: "Beginners and Intensive Class",
    target: "FOR ASPIRING & PRACTICING PLANNERS",
    description:
      "Perfect for aspiring planners or those with some experience who want to build a strong foundation and polish their craft to operate more professionally.",
    features: [
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
    price: "₦350,000",
    duration: "4 weeks",
  },
  {
    level: "Advanced Class",
    target: "FOR ESTABLISHED PLANNERS",
    description:
      "For established planners ready to scale and lead at a higher level.",
    features: [
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

export default function About() {
  const navigate = useNavigate();

  const handleRegister = () =>
    navigate("/signup");

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-300/5" />

        <div className="relative container mx-auto px-4 z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-yellow-400/20 backdrop-blur-sm border border-yellow-400/30 rounded-full px-6 py-3">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              <span className="text-yellow-400 font-medium">
                About DEWHITE SPARKLES
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              Master the Art, Skill &
              <span className="block bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                Business of Event Planning
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
              We don't just plan events. We create unforgettable experiences and
              train event entrepreneurs who understand systems, strategy, and
              sustainability.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-yellow-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center space-y-2">
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                  {value}
                </p>
                <p className="text-gray-600 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About DWS Events Academy */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-black">
                    About{" "}
                    <span className="text-yellow-500">DWS Events Academy</span>
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    DWS Events Academy is a training arm of DWS Events, one of
                    Nigeria's leading event consulting and production firms. We
                    exist to raise a generation of planners who are not only
                    skilled but structured, confident, and business-minded.
                  </p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
                  <blockquote className="text-lg text-gray-700 italic">
                    "We don't just train planners. We train event entrepreneurs
                    who understand systems, strategy, and sustainability."
                  </blockquote>
                  <cite className="text-yellow-600 font-semibold mt-2 block">
                    — The DWS Team
                  </cite>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black mb-1">
                        Skill & Business Training
                      </h3>
                      <p className="text-gray-600">
                        Learn both the creative and business aspects of event
                        planning
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black mb-1">
                        Structured Learning
                      </h3>
                      <p className="text-gray-600">
                        Comprehensive curriculum designed for different skill
                        levels
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black mb-1">
                        Expert Mentorship
                      </h3>
                      <p className="text-gray-600">
                        Learn from experienced professionals in the industry
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=80"
                  alt="Event planning training session"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why DWS Academy */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              Why <span className="text-yellow-500">DWS Academy?</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Event planning is an amazing skill, but skill alone isn't enough.
              Many talented planners struggle, not because they're not good, but
              because they don't understand the business side, how to build
              systems, manage people, lead teams, and sustain profit.
            </p>
            <p className="text-lg text-black font-semibold">
              Here, we teach you all! The skill and the business!
            </p>
            <p className="text-gray-600">
              Whether you're just starting or already in business, our classes
              are tailored to your level of growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 border-yellow-200 hover:border-yellow-400 transition-colors">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center text-yellow-600 mx-auto">
                  <Heart className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-black">
                  Wedding Planning Mastery
                </h3>
                <p className="text-gray-600 text-sm">
                  Learn to create unforgettable moments with precision and
                  elegance
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-200 hover:border-yellow-400 transition-colors">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center text-yellow-600 mx-auto">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-black">
                  Corporate Event Excellence
                </h3>
                <p className="text-gray-600 text-sm">
                  Master the art of professional event coordination and
                  management
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-200 hover:border-yellow-400 transition-colors">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center text-yellow-600 mx-auto">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-black">
                  Creative Event Design
                </h3>
                <p className="text-gray-600 text-sm">
                  Transform spaces with stunning setups and creative vision
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-200 hover:border-yellow-400 transition-colors">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center text-yellow-600 mx-auto">
                  <Calendar className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-black">
                  Professional Event Coordination
                </h3>
                <p className="text-gray-600 text-sm">
                  Build systems that ensure flawless execution every time
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Academy Classes */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              Choose Your <span className="text-yellow-500">Class</span>
            </h2>
            <p className="text-xl text-gray-600">
              Tailored learning experiences for every level of expertise
            </p>
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mt-6">
              <p className="text-black font-semibold">
                Next Cohort Begins: July 13th, 2026
              </p>
              <p className="text-gray-700 text-sm">
                🕓 Duration: 4 weeks of intensive learning
              </p>
              <p className="text-gray-700 text-sm">
                📍 Location: Online & Physical (Live & Interactive Sessions)
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {academyClasses.map((classInfo, index) => (
              <Card
                key={classInfo.level}
                className={`border-2 ${index === 1 ? "border-yellow-400 bg-yellow-50" : "border-yellow-200"} hover:border-yellow-400 transition-colors`}
              >
                <CardContent className="p-8 space-y-6">
                  <div className="text-center">
                    <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wider mb-2">
                      {classInfo.target}
                    </p>
                    <h3 className="text-2xl font-bold text-black mb-4">
                      {classInfo.level}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {classInfo.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {classInfo.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-center pt-4 border-t border-yellow-200">
                    <p className="text-2xl font-bold text-yellow-600 mb-2">
                      {classInfo.price}
                    </p>
                    <p className="text-gray-600 text-sm mb-4">
                      {classInfo.duration}
                    </p>
                    <Button 
                      onClick={handleRegister}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold"
                    >
                      Register Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              Our Core <span className="text-yellow-500">Values</span>
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {values.map(({ icon, title, description }) => (
              <Card
                key={title}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-8 text-center space-y-4">
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

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              Meet Our <span className="text-yellow-500">Team</span>
            </h2>
            <p className="text-xl text-gray-600">
              Passionate event professionals dedicated to excellence and
              innovation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {team.map(({ name, role, image, bio }) => (
              <Card
                key={name}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6 space-y-3">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-black">{name}</h3>
                    <p className="text-yellow-600 font-medium">{role}</p>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-400 to-yellow-500">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              Ready to Master Event Planning?
            </h2>
            <p className="text-xl text-black/80">
              Join our academy and learn from Nigeria's leading event planning
              experts. Turn your passion into a profitable business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-black text-yellow-400 hover:bg-gray-900 font-bold text-lg h-14 px-8"
              >
                <GraduationCap className="mr-2 h-5 w-5" />
                Join Academy
              </Button>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-black text-black hover:bg-black/10 font-semibold text-lg h-14 px-8"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
