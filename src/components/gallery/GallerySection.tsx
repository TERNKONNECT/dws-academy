import { useQuery } from "@tanstack/react-query";
import { eventsApi } from "@/api/events";
import { Loader2, Image as ImageIcon } from "lucide-react";

export function GallerySection() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: eventsApi.getAll,
  });

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Filter out events that don't have images
  const validEvents = events?.filter((event) => event.images && event.images.length > 0) || [];

  if (validEvents.length === 0) {
    return (
      <section className="py-24 bg-muted/30">
        <div className="container px-4 md:px-6 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Event Gallery</h2>
          <p className="mt-4 text-lg text-muted-foreground">Check back soon for event photos.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">Event Gallery</h2>
          <p className="mt-4 text-lg text-muted-foreground">Highlights from our past events and programs.</p>
        </div>

        <div className="space-y-24">
          {validEvents.map((event) => (
            <div key={event.id} className="space-y-8">
              <div className="border-b pb-4">
                <h3 className="text-2xl font-bold text-foreground">{event.name}</h3>
                {event.date && (
                  <p className="text-sm font-medium text-primary mt-1">
                    {new Date(event.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
                {event.description && (
                  <p className="text-muted-foreground mt-2 max-w-3xl">{event.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {event.images?.map((img) => (
                  <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden bg-muted">
                    <img
                      src={img.url}
                      alt={`Gallery image for ${event.name}`}
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
      </div>
    </section>
  );
}
