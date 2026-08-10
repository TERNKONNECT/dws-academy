import { Link } from "react-router-dom";
import { Star, Clock, BarChart3, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Course } from "@/types";

const CourseCard = ({ course }: { course: Course }) => {
  const price =
    course.pricingType === "paid" && Number(course.price || 0) > 0
      ? new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: course.currency || "NGN",
          minimumFractionDigits: 0,
        }).format(course.price || 0)
      : "Free";
  const levelColor = {
    Beginner: "bg-emerald-100 text-emerald-700",
    Intermediate: "bg-primary/15 text-accent",
    Advanced: "bg-red-100 text-red-700",
  }[course.level];

  return (
    <Link to={`/courses/${course.id}`}>
      <Card className="group overflow-hidden rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
        <div className="aspect-video overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full text-xs">
              {course.category}
            </Badge>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${levelColor}`}
            >
              {course.level}
            </span>
          </div>
          <h3 className="font-bold text-sm leading-tight line-clamp-2 group-hover:text-accent transition-colors">
            {course.title}
          </h3>

          <p className="text-xs font-medium text-accent">
            {course.instructor.name}
          </p>
          <p className="text-sm font-bold text-foreground">{price}</p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              <span className="font-medium text-foreground">
                {course.rating}
              </span>
              <span>({course.reviewCount.toLocaleString()})</span>
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {course.duration}
            </span>
            <span className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              {course.level}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {(course.totalStudents / 1000).toFixed(0)}K
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CourseCard;
