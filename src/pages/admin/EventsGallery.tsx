import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsApi, AppEvent, EventImage } from "@/api/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, Trash2, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function EventsGallery() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeEvent, setActiveEvent] = useState<AppEvent | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteEventModalOpen, setIsDeleteEventModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<AppEvent | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  // Gallery management states
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
      toast({ title: "Event created successfully" });
      setIsCreateModalOpen(false);
      setName("");
      setDescription("");
      setDate("");
    },
    onError: (err: any) => {
      toast({ title: "Failed to create event", description: err.message, variant: "destructive" });
    },
  });

  const deleteEventMut = useMutation({
    mutationFn: eventsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({ title: "Event deleted successfully" });
      setIsDeleteEventModalOpen(false);
      setEventToDelete(null);
    },
    onError: (err: any) => {
      toast({ title: "Failed to delete event", description: err.message, variant: "destructive" });
    },
  });

  const saveImagesMut = useMutation({
    mutationFn: ({ eventId, images }: { eventId: string; images: { url: string; key: string }[] }) =>
      eventsApi.saveImages(eventId, images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      // Update local active event if open
      if (activeEvent) {
        queryClient.fetchQuery({ queryKey: ["events"] }).then((data) => {
          if (data) {
            const updated = data.find((e) => e.id === activeEvent.id);
            if (updated) setActiveEvent(updated);
          }
        });
      }
    },
  });

  const deleteImagesMut = useMutation({
    mutationFn: eventsApi.deleteImagesBulk,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({ title: "Images deleted successfully" });
      setSelectedImages([]);
      if (activeEvent) {
        queryClient.fetchQuery({ queryKey: ["events"] }).then((data) => {
          if (data) {
            const updated = data.find((e) => e.id === activeEvent.id);
            if (updated) setActiveEvent(updated);
          }
        });
      }
    },
    onError: (err: any) => {
      toast({ title: "Failed to delete images", description: err.message, variant: "destructive" });
    },
  });

  const handleCreateEvent = () => {
    createEventMut.mutate({ name, description, date: date || undefined });
  };

  const confirmDeleteEvent = (event: AppEvent) => {
    setEventToDelete(event);
    setIsDeleteEventModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !activeEvent) return;
    const files = Array.from(e.target.files);
    
    setIsUploading(true);
    const uploadedImages: { url: string; key: string }[] = [];

    try {
      for (const file of files) {
        // 1. Get presigned URL
        const presignedData = await eventsApi.getPresignedUrl(activeEvent.id, {
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
      await saveImagesMut.mutateAsync({ eventId: activeEvent.id, images: uploadedImages });
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

  if (activeEvent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => setActiveEvent(null)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{activeEvent.name} Gallery</h1>
            <p className="text-muted-foreground">{activeEvent.images?.length || 0} images</p>
          </div>
          <div className="ml-auto flex gap-2">
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
            <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
              {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Upload Images
            </Button>
          </div>
        </div>

        {activeEvent.images && activeEvent.images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {activeEvent.images.map((img) => (
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
        ) : (
          <div className="text-center py-12 border rounded-md bg-muted/20">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No images yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Upload some images to start building the gallery.</p>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              Upload First Image
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Events & Gallery</h1>
          <p className="text-muted-foreground">Manage events and their image galleries.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : events?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <ImageIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium">No events found</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
              Create an event to start uploading images to the public gallery.
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>Create Event</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.map((event) => (
            <Card key={event.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{event.name}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {event.description || "No description"}
                </p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>{event.date ? new Date(event.date).toLocaleDateString() : "No Date"}</span>
                  <span className="flex items-center gap-1">
                    <ImageIcon className="h-4 w-4" /> {event.images?.length || 0}
                  </span>
                </div>
                <div className="flex gap-2 w-full">
                  <Button variant="outline" className="flex-1" onClick={() => setActiveEvent(event)}>
                    Manage Gallery
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => confirmDeleteEvent(event)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Event Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Annual Tech Conference" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of the event..." />
            </div>
            <div className="space-y-2">
              <Label>Date (Optional)</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateEvent} disabled={!name || createEventMut.isPending}>
              {createEventMut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Event Confirmation Modal */}
      <Dialog open={isDeleteEventModalOpen} onOpenChange={setIsDeleteEventModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete <strong>{eventToDelete?.name}</strong>?</p>
            {eventToDelete?.images && eventToDelete.images.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 text-red-900 rounded-md text-sm border border-red-200">
                <strong>Warning:</strong> This event contains {eventToDelete.images.length} images. Deleting it will also permanently delete all associated images.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteEventModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => eventToDelete && deleteEventMut.mutate(eventToDelete.id)} disabled={deleteEventMut.isPending}>
              {deleteEventMut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
