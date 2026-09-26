import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import MainLayout from "@/components/layouts/MainLayout";
import CourseCard from "@/components/CourseCard";
import { api } from "@/services/api";
import type { Course } from "@/types";

const RATING_THRESHOLDS = [4, 3, 2, 1];

const FilterSidebar = ({
  categoryCounts,
  selectedCategory,
  onToggleCategory,
  ratingCounts,
  minRating,
  onToggleRating,
  onClear,
  hasActiveFilters,
  showHeading = true,
}: {
  categoryCounts: [string, number][];
  selectedCategory: string;
  onToggleCategory: (cat: string) => void;
  ratingCounts: Record<number, number>;
  minRating: number;
  onToggleRating: (threshold: number) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  showHeading?: boolean;
}) => (
  <div className="space-y-6">
    {showHeading && (
      <div className="flex items-center justify-between">
        <h2 className="font-bold">Filters</h2>
        {hasActiveFilters && (
          <Button variant="link" className="h-auto p-0 text-sm" onClick={onClear}>
            Clear all
          </Button>
        )}
      </div>
    )}

    {RATING_THRESHOLDS.some((t) => ratingCounts[t] > 0) && (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground">Ratings</h3>
        <div className="space-y-2.5">
          {RATING_THRESHOLDS.filter((t) => ratingCounts[t] > 0).map((threshold) => (
            <label
              key={threshold}
              className="flex cursor-pointer items-center gap-2.5 text-sm"
            >
              <Checkbox
                checked={minRating === threshold}
                onCheckedChange={() => onToggleRating(threshold)}
              />
              <span className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < threshold
                        ? "fill-primary text-primary"
                        : "fill-none text-muted-foreground/40"
                    }`}
                  />
                ))}
              </span>
              <span>
                {threshold} & up ({ratingCounts[threshold]})
              </span>
            </label>
          ))}
        </div>
      </div>
    )}

    {categoryCounts.length > 0 && (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground">Category</h3>
        <div className="space-y-2.5">
          {categoryCounts.map(([category, count]) => (
            <label
              key={category}
              className="flex cursor-pointer items-center gap-2.5 text-sm"
            >
              <Checkbox
                checked={selectedCategory === category}
                onCheckedChange={() => onToggleCategory(category)}
              />
              <span>
                {category} ({count})
              </span>
            </label>
          ))}
        </div>
      </div>
    )}
  </div>
);

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "",
  );
  const [minRating, setMinRating] = useState(
    Number(searchParams.get("rating")) || 0,
  );

  useEffect(() => {
    setLoading(true);
    api
      .getCourses()
      .then(setAllCourses)
      .finally(() => setLoading(false));
  }, []);

  const updateParams = (next: {
    q?: string;
    category?: string;
    rating?: number;
  }) => {
    const params = new URLSearchParams();
    const q = next.q ?? query;
    const category = next.category ?? selectedCategory;
    const rating = next.rating ?? minRating;
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (rating) params.set("rating", String(rating));
    setSearchParams(params);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({});
  };

  const toggleCategory = (cat: string) => {
    const next = selectedCategory === cat ? "" : cat;
    setSelectedCategory(next);
    updateParams({ category: next });
  };

  const toggleRating = (threshold: number) => {
    const next = minRating === threshold ? 0 : threshold;
    setMinRating(next);
    updateParams({ rating: next });
  };

  const clearAllFilters = () => {
    setQuery("");
    setSelectedCategory("");
    setMinRating(0);
    setSearchParams({});
  };

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of allCourses) {
      counts.set(c.category, (counts.get(c.category) || 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [allCourses]);

  const ratingCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const threshold of RATING_THRESHOLDS) {
      counts[threshold] = allCourses.filter((c) => c.rating >= threshold).length;
    }
    return counts;
  }, [allCourses]);

  const courses = useMemo(() => {
    let filtered = allCourses;
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.shortDescription.toLowerCase().includes(q) ||
          c.instructor.name.toLowerCase().includes(q),
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter((c) => c.category === selectedCategory);
    }
    if (minRating) {
      filtered = filtered.filter((c) => c.rating >= minRating);
    }
    return filtered;
  }, [allCourses, query, selectedCategory, minRating]);

  const hasActiveFilters = Boolean(query || selectedCategory || minRating);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explore Classes</h1>
          <p className="text-muted-foreground">
            Find the perfect course to advance your skills
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                className="pl-9 rounded-full focus-visible:ring-primary"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button type="submit">
              <SlidersHorizontal className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Search</span>
            </Button>
          </form>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filter
                {hasActiveFilters && (
                  <span className="ml-2 h-2 w-2 rounded-full bg-primary" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="overflow-y-auto">
              <SheetHeader className="mb-6 flex-row items-center justify-between space-y-0">
                <SheetTitle>Filters</SheetTitle>
                {hasActiveFilters && (
                  <Button
                    variant="link"
                    className="h-auto p-0 text-sm mr-6"
                    onClick={clearAllFilters}
                  >
                    Clear all
                  </Button>
                )}
              </SheetHeader>
              <FilterSidebar
                categoryCounts={categoryCounts}
                selectedCategory={selectedCategory}
                onToggleCategory={toggleCategory}
                ratingCounts={ratingCounts}
                minRating={minRating}
                onToggleRating={toggleRating}
                onClear={clearAllFilters}
                hasActiveFilters={hasActiveFilters}
                showHeading={false}
              />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                categoryCounts={categoryCounts}
                selectedCategory={selectedCategory}
                onToggleCategory={toggleCategory}
                ratingCounts={ratingCounts}
                minRating={minRating}
                onToggleRating={toggleRating}
                onClear={clearAllFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i}>
                    <Skeleton className="aspect-video" />
                    <CardContent className="p-4 space-y-3">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-3 w-32" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <Search className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="text-lg font-semibold">No courses found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
                <Button
                  variant="outline"
                  className="border-primary text-accent hover:bg-primary/10"
                  onClick={clearAllFilters}
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  {courses.length} course{courses.length !== 1 ? "s" : ""} found
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Courses;
