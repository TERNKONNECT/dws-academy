import React, { useEffect, useMemo, useRef, useState } from "react";
import { errorMessage } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsApi } from "@/api/events";
import { galleryCategoriesApi, GalleryCategory, GalleryCategoryInput } from "@/api/galleryCategories";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, Trash2, Image as ImageIcon, Pencil } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

const ALL_CATEGORIES = "all";

export default function EventsGallery() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [filterCategoryId, setFilterCategoryId] = useState<string>(ALL_CATEGORIES);
  const [uploadCategoryId, setUploadCategoryId] = useState<string>("");

  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: eventsApi.getAll,
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["gallery-categories-admin"],
    queryFn: galleryCategoriesApi.getAllAdmin,
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

  // Default the upload target to the first available category once categories load
  useEffect(() => {
    if (categories && categories.length > 0 && !uploadCategoryId) {
      setUploadCategoryId(String(categories[0].id));
    }
  }, [categories, uploadCategoryId]);

  const saveImagesMut = useMutation({
    mutationFn: ({ eventId, images, categoryId }: { eventId: string; images: { url: string; key: string }[]; categoryId: number }) =>
      eventsApi.saveImages(eventId, images, categoryId),
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
    onError: (err: unknown) => {
      toast({ title: "Failed to delete images", description: errorMessage(err), variant: "destructive" });
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const targetEventId = events?.[0]?.id;
    if (!targetEventId) {
      toast({ title: "Gallery not ready", description: "Please wait while we initialize the gallery.", variant: "destructive" });
      return;
    }

    const categoryId = Number(uploadCategoryId);
    if (!categoryId) {
      toast({ title: "Select a category", description: "Choose a category to upload these images to.", variant: "destructive" });
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
      await saveImagesMut.mutateAsync({ eventId: targetEventId, images: uploadedImages, categoryId });
      toast({ title: `${uploadedImages.length} images uploaded successfully` });
    } catch (err: unknown) {
      toast({ title: "Failed to upload images", description: errorMessage(err), variant: "destructive" });
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
  const allImages = useMemo(() => events?.flatMap((event) => event.images || []) || [], [events]);
  const filteredImages = useMemo(
    () =>
      filterCategoryId === ALL_CATEGORIES
        ? allImages
        : allImages.filter((img) => String(img.categoryId) === filterCategoryId),
    [allImages, filterCategoryId]
  );

  const categoryName = (id: number) => categories?.find((c) => c.id === id)?.name || "Uncategorized";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gallery Manager</h1>
        <p className="text-muted-foreground">Manage your gallery images and categories.</p>
      </div>

      <Tabs defaultValue="images">
        <TabsList>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="images" className="space-y-6 pt-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground whitespace-nowrap">Filter:</Label>
              <Select value={filterCategoryId} onValueChange={setFilterCategoryId}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_CATEGORIES}>All categories</SelectItem>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Select value={uploadCategoryId} onValueChange={setUploadCategoryId}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Upload to category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                disabled={isUploading || isLoading || !uploadCategoryId || (events && events.length === 0)}
              >
                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Upload Images
              </Button>
            </div>
          </div>

          {isLoading || isLoadingCategories ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : categories && categories.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <h3 className="text-lg font-medium">No categories yet</h3>
                <p className="text-sm text-muted-foreground mb-1 text-center max-w-sm">
                  Create a category first, then upload images to it.
                </p>
              </CardContent>
            </Card>
          ) : filteredImages.length === 0 ? (
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
                  disabled={isUploading || !uploadCategoryId || (events && events.length === 0)}
                >
                  Upload First Image
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredImages.map((img) => (
                <div
                  key={img.id}
                  className="relative group aspect-square rounded-md overflow-hidden border bg-muted"
                >
                  <img src={img.url} alt="Gallery" className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2">
                    <Checkbox
                      checked={selectedImages.includes(img.id)}
                      onCheckedChange={() => toggleImageSelection(img.id)}
                      className="bg-black/10 dark:bg-[#151517]/80 data-[state=checked]:bg-primary"
                    />
                  </div>
                  <Badge className="absolute bottom-2 left-2 bg-black/70 text-white hover:bg-black/70 text-[11px]">
                    {categoryName(img.categoryId)}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="categories" className="pt-4">
          <CategoriesManager categories={categories} isLoading={isLoadingCategories} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CategoriesManager({ categories, isLoading }: { categories?: GalleryCategory[]; isLoading: boolean }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<GalleryCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryCategory | null>(null);

  const [form, setForm] = useState<GalleryCategoryInput>({
    name: "",
    description: "",
    isActive: true,
    date: "",
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["gallery-categories-admin"] });
    queryClient.invalidateQueries({ queryKey: ["events"] });
  };

  const createMut = useMutation({
    mutationFn: (data: GalleryCategoryInput) => galleryCategoriesApi.create(data),
    onSuccess: () => {
      invalidate();
      toast({ title: "Category created" });
      setDialogOpen(false);
    },
    onError: (err: unknown) => {
      toast({ title: "Failed to create category", description: errorMessage(err), variant: "destructive" });
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: GalleryCategoryInput }) => galleryCategoriesApi.update(id, data),
    onSuccess: () => {
      invalidate();
      toast({ title: "Category updated" });
      setDialogOpen(false);
    },
    onError: (err: unknown) => {
      toast({ title: "Failed to update category", description: errorMessage(err), variant: "destructive" });
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => galleryCategoriesApi.delete(id),
    onSuccess: (data) => {
      invalidate();
      toast({ title: "Category deleted", description: `${data.deletedImages} image(s) removed with it.` });
      setDeleteTarget(null);
    },
    onError: (err: unknown) => {
      toast({ title: "Failed to delete category", description: errorMessage(err), variant: "destructive" });
    },
  });

  const openCreate = () => {
    setEditingCategory(null);
    setForm({ name: "", description: "", isActive: true, date: "" });
    setDialogOpen(true);
  };

  const openEdit = (category: GalleryCategory) => {
    setEditingCategory(category);
    setForm({
      name: category.name,
      description: category.description || "",
      isActive: category.isActive,
      date: category.date ? category.date.slice(0, 10) : "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    const payload: GalleryCategoryInput = {
      ...form,
      date: form.date || null,
    };
    if (editingCategory) {
      updateMut.mutate({ id: editingCategory.id, data: payload });
    } else {
      createMut.mutate(payload);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Category
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : !categories || categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-medium">No categories yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Create your first category to start organizing gallery images.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold">{category.name}</h4>
                    {category.date && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(category.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Badge variant={category.isActive ? "default" : "secondary"}>
                    {category.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {category.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
                )}
                <div className="flex gap-2 pt-1">
                  <Button variant="outline" size="sm" onClick={() => openEdit(category)}>
                    <Pencil className="mr-1.5 h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setDeleteTarget(category)}>
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "New Category"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Name</Label>
              <Input
                id="category-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Academy"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-description">Description</Label>
              <Textarea
                id="category-description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Optional description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-date">Date</Label>
              <Input
                id="category-date"
                type="date"
                value={form.date || ""}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <Label htmlFor="category-active">Active</Label>
                <p className="text-xs text-muted-foreground">Only active categories are shown publicly.</p>
              </div>
              <Switch
                id="category-active"
                checked={form.isActive}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, isActive: checked }))}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createMut.isPending || updateMut.isPending}>
                {(createMut.isPending || updateMut.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingCategory ? "Save Changes" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteTarget?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this category and every image filed under it. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && deleteMut.mutate(deleteTarget.id)}
              disabled={deleteMut.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
