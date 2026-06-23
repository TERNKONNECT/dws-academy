import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsApi, AppEvent, EventImage } from "@/api/events";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function EventsGallery() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: eventsApi.getAll,
  });

  const createEventMut = useMutation({
    mutationFn: eventsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  // Automatically create a default gallery event if none exists
  useEffect(() => {
    if (events && events.length === 0 && !createEventMut.isPending && !createEventMut.isSuccess) {
      createEventMut.mutate({ name: "Unified Gallery", description: "Default gallery for all images" });
    }
  }, [events, createEventMut]);

  const saveImagesMut = useMutation({
    mutationFn: ({ eventId, images }: { eventId: string; images: { url: string; key: string }[] }) =>
      eventsApi.saveImages(eventId, images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const deleteImagesMut = useMutation({
    mutationFn: eventsApi.deleteImagesBulk,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({ title: "Images deleted successfully" });
      setSelectedImages([]);
    },
    onError: (err: any) => {
      toast({ title: "Failed to delete images", description: err.message, variant: "destructive" });
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    // Upload to the first available event (the unified gallery)
    let targetEventId = events?.[0]?.id;
    if (!targetEventId) {
      toast({ title: "Gallery not ready", description: "Please wait while we initialize the gallery.", variant: "destructive" });
      return;
    }

    const files = Array.from(e.target.files);
    setIsUploading(true);
    const uploadedImages: { url: string; key: string }[] = [];

    try {
      for (const file of files) {
        // 1. Get presigned URL
        const presignedData = await eventsApi.getPresignedUrl(targetEventId, {
          filename: file.name,
          contentType: file.type,
        });

        // 2. Upload directly to S3
        await fetch(presignedData.uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        uploadedImages.push({ url: presignedData.url, key: presignedData.key });
      }

      // 3. Save to DB
      await saveImagesMut.mutateAsync({ eventId: targetEventId, images: uploadedImages });
      toast({ title: `${uploadedImages.length} images uploaded successfully` });
    } catch (err: any) {
      toast({ title: "Failed to upload images", description: err.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const toggleImageSelection = (id: string) => {
    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((imgId) => imgId !== id) : [...prev, id]
    );
  };

  // Flatten all images from all events
  const allImages = events?.flatMap((event) => event.images || []) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gallery Manager</h1>
          <p className="text-muted-foreground">Manage all your gallery images here.</p>
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          {selectedImages.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => deleteImagesMut.mutate(selectedImages)}
              disabled={deleteImagesMut.isPending}
            >
              {deleteImagesMut.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Delete Selected ({selectedImages.length})
            </Button>
          )}
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={isUploading || isLoading || (events && events.length === 0)}
          >
            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Upload Images
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : allImages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <ImageIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium">No images found</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
              Upload images to start building your gallery.
            </p>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || (events && events.length === 0)}
            >
              Upload First Image
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {allImages.map((img) => (
            <div
              key={img.id}
              className="relative group aspect-square rounded-md overflow-hidden border bg-muted"
            >
              <img src={img.url} alt="Gallery" className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2">
                <Checkbox
                  checked={selectedImages.includes(img.id)}
                  onCheckedChange={() => toggleImageSelection(img.id)}
                  className="bg-white/80 data-[state=checked]:bg-primary"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
