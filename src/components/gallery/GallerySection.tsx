import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { eventsApi, EventImage } from "@/api/events";
import { Loader2, Image as ImageIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface GallerySectionProps {
  limit?: number;
  showViewMore?: boolean;
}

interface CategoryGroup {
  categoryId: number;
  categoryName: string;
  images: (EventImage & { eventName: string })[];
}

export function GallerySection({ limit, showViewMore = false }: GallerySectionProps) {
  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: eventsApi.getAll,
  });

  const groups = useMemo(() => {
    const allImages = Array.isArray(events)
      ? events.flatMap((event) =>
          (event.images || []).map((img) => ({ ...img, eventName: event.name }))
        )
      : [];

    // Only show images whose category is active; images without a resolved
    // category are treated as visible so nothing silently disappears.
    const visibleImages = allImages.filter((img) => img.category?.isActive !== false);

    const byCategory = new Map<number, CategoryGroup>();
    for (const img of visibleImages) {
      const categoryId = img.categoryId ?? 0;
      const categoryName = img.category?.name || "Gallery";
      if (!byCategory.has(categoryId)) {
        byCategory.set(categoryId, { categoryId, categoryName, images: [] });
      }
      byCategory.get(categoryId)!.images.push(img);
    }

    const sorted = Array.from(byCategory.values()).sort((a, b) =>
      a.categoryName.localeCompare(b.categoryName)
    );

    if (limit && limit > 0) {
      let remaining = limit;
      const capped: CategoryGroup[] = [];
      for (const group of sorted) {
        if (remaining <= 0) break;
        const images = group.images.slice(0, remaining);
        remaining -= images.length;
        capped.push({ ...group, images });
      }
      return capped;
    }

    return sorted;
  }, [events, limit]);

  if (isLoading) {
    return (
      <div id="gallery" className="py-24 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalImages = groups.reduce((sum, g) => sum + g.images.length, 0);

  if (totalImages === 0) {
    return (
      <section id="gallery" className="py-24 bg-muted/30">
        <div className="container px-4 md:px-6 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Past Academy Sessions</h2>
          <p className="mt-4 text-lg text-muted-foreground">Check back soon for session photos.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">Past Academy Sessions</h2>
          <p className="mt-4 text-lg text-muted-foreground">Highlights from our past trainings.</p>
        </div>

        <div className="space-y-14">
          {groups.map((group) => (
            <div key={group.categoryId}>
              <h3 className="mb-6 text-xl font-bold text-foreground">{group.categoryName}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {group.images.map((img) => (
                  <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden bg-muted">
                    <img
                      src={img.url}
                      alt={`Gallery image from ${img.eventName}`}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                      <ImageIcon className="text-white h-6 w-6" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {showViewMore && events && events.length > 0 && (
          <div className="mt-16 flex justify-center">
            <Link to="/gallery">
              <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold h-12 px-8 text-base">
                View Full Gallery <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
