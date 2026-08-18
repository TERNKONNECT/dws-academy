import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { eventsApi, EventImage } from "@/api/events";
import { Loader2, Image as ImageIcon, ArrowLeft } from "lucide-react";

interface CategoryGroup {
  categoryId: number;
  categoryName: string;
  images: (EventImage & { eventName: string })[];
}

export function GallerySection() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: eventsApi.getAll,
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

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

    return Array.from(byCategory.values()).sort((a, b) =>
      a.categoryName.localeCompare(b.categoryName)
    );
  }, [events]);

  const selectedGroup = groups.find((g) => g.categoryId === selectedCategoryId) || null;

  if (isLoading) {
    return (
      <div id="gallery" className="py-24 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <section id="gallery" className="py-24 bg-muted/30">
        <div className="container px-4 md:px-6 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="mt-4 text-lg text-muted-foreground">Check back soon for session photos.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        {selectedGroup ? (
          <div>
            <button
              onClick={() => setSelectedCategoryId(null)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline mb-8"
            >
              <ArrowLeft className="h-4 w-4" /> Back to categories
            </button>
            <h3 className="mb-8 text-2xl font-bold text-foreground">{selectedGroup.categoryName}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedGroup.images.map((img) => (
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <button
                key={group.categoryId}
                onClick={() => setSelectedCategoryId(group.categoryId)}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted text-left"
              >
                <img
                  src={group.images[0]?.url}
                  alt={group.categoryName}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors duration-300 flex flex-col items-center justify-center text-center p-4">
                  <span className="text-xl font-bold text-white">{group.categoryName}</span>
                  <span className="mt-1 text-sm text-white/70">
                    {group.images.length} photo{group.images.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
