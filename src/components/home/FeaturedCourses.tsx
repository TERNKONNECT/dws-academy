import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Course } from "@/types";
import Reveal from "./Reveal";

const FeaturedCourseCard = ({ course }: { course: Course }) => (
  <Link
    to={`/courses/${course.id}`}
    className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
  >
    <div className="relative h-[130px] overflow-hidden border-b border-border">
      <img
        src={course.thumbnail}
        alt={course.title}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </div>
    <div className="flex flex-1 flex-col p-6">
      <span className="text-[12.5px] font-semibold tracking-tight text-primary">
        {course.instructor.name}
      </span>
      <h4 className="mt-2.5 text-[17.5px] font-bold text-foreground">
        {course.title}
      </h4>
      <p className="mt-2.5 flex-1 text-sm text-muted-foreground">
        {course.shortDescription}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3.5 text-xs text-muted-foreground">
        <span>{course.level}</span>
        {course.duration && <span>{course.duration}</span>}
      </div>
      <span className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-primary">
        View Course
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </span>
    </div>
  </Link>
);

const FeaturedCourses = ({
  courses,
  loading,
}: {
  courses: Course[];
  loading: boolean;
}) => {
  return (
    <section id="courses" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-[1180px] px-8">
        <Reveal>
          <div className="mx-auto mb-16 max-w-xl text-center">
            <span className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-primary">
              Featured Courses
            </span>
            <h2 className="mt-4 text-[clamp(28px,3.6vw,42px)] font-bold text-foreground">
              Practical Education, Built From Practice
            </h2>
            <p className="mt-[18px] text-[16.5px] text-muted-foreground">
              Every course is designed and taught by a professional actively
              building a business in the field they teach.
            </p>
          </div>
        </Reveal>

        {loading ? (
          <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[340px] rounded-2xl bg-muted" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <p className="text-center text-muted-foreground">
            New courses are on the way — check back soon.
          </p>
        ) : (
          <Reveal delay={100}>
            <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
              {courses.slice(0, 5).map((course) => (
                <FeaturedCourseCard key={course.id} course={course} />
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
};

export default FeaturedCourses;
