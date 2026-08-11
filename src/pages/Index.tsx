import { useEffect, useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import HeroSection from "@/components/home/HeroSection";
import TrustStrip from "@/components/home/TrustStrip";
import WhoWeAre from "@/components/home/WhoWeAre";
import Faculties from "@/components/home/Faculties";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import Books from "@/components/home/Books";
import FacultyPeople from "@/components/home/FacultyPeople";
import Testimonials from "@/components/home/Testimonials";
import Insights from "@/components/home/Insights";
import ClarityCallCta from "@/components/home/ClarityCallCta";
import FinalCta from "@/components/home/FinalCta";
import { api } from "@/services/api";
import { testimonialsApi, type Testimonial } from "@/api/testimonials";
import type { Course, Instructor } from "@/types";

const dedupeInstructors = (courses: Course[]): Instructor[] => {
  const byName = new Map<string, Instructor>();
  for (const course of courses) {
    if (!byName.has(course.instructor.name)) {
      byName.set(course.instructor.name, course.instructor);
    }
  }
  return Array.from(byName.values());
};

const Index = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const featured = await api.getFeaturedCourses();
        if (!active) return;
        setCourses(featured);
      } finally {
        if (active) setLoadingCourses(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    testimonialsApi.getAll().then((data) => {
      if (active) setTestimonials(data.slice(0, 3));
    });
    return () => {
      active = false;
    };
  }, []);

  const instructors = dedupeInstructors(courses);

  return (
    <MainLayout>
      <HeroSection />
      <TrustStrip />
      <WhoWeAre />
      <Faculties />
      <FeaturedCourses courses={courses} loading={loadingCourses} />
      <Books />
      <FacultyPeople instructors={instructors} />
      <Testimonials testimonials={testimonials} />
      <Insights />
      <ClarityCallCta />
      <FinalCta />
    </MainLayout>
  );
};

export default Index;
