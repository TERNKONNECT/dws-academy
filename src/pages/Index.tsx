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
import type { TestimonialItem } from "@/components/home/types";
import { api } from "@/services/api";
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
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);

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
    if (courses.length === 0) return;
    let active = true;

    (async () => {
      const results = await Promise.all(
        courses.slice(0, 5).map(async (course) => {
          const data = await api.getCourseReviews(course.id);
          const reviews = Array.isArray(data?.reviews) ? data.reviews : [];
          return reviews.map(
            (r: {
              rating: number;
              comment?: string;
              User?: { name?: string };
            }) => ({
              rating: r.rating,
              comment: r.comment,
              name: r.User?.name,
              courseTitle: course.title,
            }),
          );
        }),
      );
      if (!active) return;

      const flattened = results
        .flat()
        .filter(
          (r): r is { rating: number; comment: string; name: string; courseTitle: string } =>
            Boolean(r.comment && r.name),
        )
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3)
        .map((r, i) => ({
          id: `${r.name}-${i}`,
          name: r.name,
          rating: r.rating,
          comment: r.comment,
          courseTitle: r.courseTitle,
        }));

      setTestimonials(flattened);
    })();

    return () => {
      active = false;
    };
  }, [courses]);

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
