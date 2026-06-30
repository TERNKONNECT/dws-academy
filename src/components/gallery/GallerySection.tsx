import { useQuery } from "@tanstack/react-query";
import { eventsApi } from "@/api/events";
import { Loader2, Image as ImageIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface GallerySectionProps {
  limit?: number;
  showViewMore?: boolean;
}

export function GallerySection({ limit, showViewMore = false }: GallerySectionProps) {
  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: eventsApi.getAll,
  });

  if (isLoading) {
    return (
      <div id="gallery" className="py-24 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Flatten all images from all events, ensuring events is an array
  let allImages = Array.isArray(events)
    ? events.flatMap((event) => 
        (event.images || []).map(img => ({ ...img, eventName: event.name }))
      )
    : [];
  
  if (limit && limit > 0) {
    allImages = allImages.slice(0, limit);
  }

  if (allImages.length === 0) {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allImages.map((img) => (
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
