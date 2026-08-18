import { useEffect, useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import HeroSection from "@/components/home/HeroSection";
import TrustStrip from "@/components/home/TrustStrip";
import WhoWeAre from "@/components/home/WhoWeAre";
import Partners from "@/components/home/Partners";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import Books from "@/components/home/Books";
import FacultyPeople from "@/components/home/FacultyPeople";
import Testimonials from "@/components/home/Testimonials";
import Insights from "@/components/home/Insights";
import Newsletter from "@/components/home/Newsletter";
import ClarityCallCta from "@/components/home/ClarityCallCta";
import FinalCta from "@/components/home/FinalCta";
import { api } from "@/services/api";
import { testimonialsApi, type Testimonial } from "@/api/testimonials";
import { facultyApi, type Faculty } from "@/api/faculty";
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
  const [faculty, setFaculty] = useState<Faculty[]>([]);

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
      if (active) setTestimonials(data);
    });
    facultyApi.getAll(false, 4).then((data) => {
      if (active) setFaculty(data);
    });
    return () => {
      active = false;
    };
  }, []);

  // We still use instructors for other parts if needed, but not for FacultyPeople anymore
  // const instructors = dedupeInstructors(courses);

  return (
    <MainLayout>
      <HeroSection />
      <TrustStrip />
      <WhoWeAre />
      <Partners />
      <FeaturedCourses courses={courses} loading={loadingCourses} />
      <Books />
      <FacultyPeople faculty={faculty} limit={4} />
      <Testimonials testimonials={testimonials} />
      <Insights />
      <Newsletter />
      <ClarityCallCta />
      <FinalCta />
    </MainLayout>
  );
};

export default Index;
