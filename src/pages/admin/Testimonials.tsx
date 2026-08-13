import { useEffect, useState } from 'react';
import { testimonialsApi, type Testimonial } from '@/api/testimonials';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { TableSkeleton } from '@/components/shared/SkeletonLoader';
import { MessageSquare, Plus, Pencil, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { errorMessage } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    companyName: '',
    content: '',
    isActive: true,
  });

  const fetchTestimonials = () => {
    setLoading(true);
    testimonialsApi
      .getAdminAll()
      .then(setTestimonials)
      .catch(() => toast.error('Failed to load testimonials'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await testimonialsApi.delete(deleteId);
      setTestimonials(testimonials.filter((t) => t.id !== deleteId));
      toast.success('Testimonial deleted');
    } catch {
      toast.error('Failed to delete testimonial');
    } finally {
      setDeleteId(null);
    }
  };

  const handleOpenAdd = () => {
    setEditingTestimonial(null);
    setFormData({ name: '', jobTitle: '', companyName: '', content: '', isActive: true });
    setImageFile(null);
    setRemoveExistingImage(false);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      jobTitle: testimonial.jobTitle,
      companyName: testimonial.companyName || '',
      content: testimonial.content,
      isActive: testimonial.isActive,
    });
    setImageFile(null);
    setRemoveExistingImage(false);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.jobTitle || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      let saved: Testimonial;
      if (editingTestimonial) {
        saved = await testimonialsApi.update(editingTestimonial.id, formData);
      } else {
        saved = await testimonialsApi.create(formData);
      }

      // The photo is optional and uploaded separately, after the testimonial
      // itself exists (a fresh one needs an id to upload against).
      if (imageFile) {
        saved = await testimonialsApi.uploadImage(saved.id, imageFile);
      } else if (removeExistingImage && editingTestimonial?.image) {
        saved = await testimonialsApi.removeImage(saved.id);
      }

      setTestimonials((prev) => {
        const exists = prev.some((t) => t.id === saved.id);
        return exists
          ? prev.map((t) => (t.id === saved.id ? saved : t))
          : [saved, ...prev];
      });
      toast.success(editingTestimonial ? 'Testimonial updated' : 'Testimonial created');
      setIsFormOpen(false);
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to save testimonial'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <MessageSquare className="h-6 w-6 text-muted-foreground" />
            <h1 className="text-2xl font-bold text-foreground">Testimonials</h1>
          </div>
          <p className="text-sm text-muted-foreground ml-9">
            Manage student success stories shown on the public pages
          </p>
        </div>
        <Button onClick={handleOpenAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          {!loading && (
            <p className="text-xs text-muted-foreground mb-3">
              {testimonials.length} testimonial{testimonials.length !== 1 ? 's' : ''} found
            </p>
          )}

          {loading ? (
            <TableSkeleton />
          ) : !testimonials.length ? (
            <EmptyState
              title="No testimonials found"
              description="Click the Add Testimonial button to create your first one."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-0" />
                  <TableHead>Name</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead className="w-1/3">Content</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      {t.image ? (
                        <img
                          src={t.image}
                          alt={t.name}
                          className="h-9 w-9 rounded-full object-cover border border-black/10"
                        />
                      ) : (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0B0B0C] text-xs font-bold text-primary">
                          {t.name
                            .split(' ')
                            .map((part) => part[0])
                            .filter(Boolean)
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell className="text-muted-foreground">{t.jobTitle}</TableCell>
                    <TableCell className="text-muted-foreground">{t.companyName || '-'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="line-clamp-2">{t.content}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={t.isActive ? 'default' : 'secondary'}>
                        {t.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(t.date || t.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(t)}
                        title="Edit testimonial"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(t.id)}
                        title="Delete testimonial"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Testimonial"
        description="This will permanently delete this testimonial. This action cannot be undone."
        onConfirm={handleDelete}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Photo (Optional)</Label>
              {editingTestimonial?.image && !removeExistingImage && !imageFile ? (
                <div className="flex items-center gap-3">
                  <img
                    src={editingTestimonial.image}
                    alt={editingTestimonial.name}
                    className="h-12 w-12 rounded-full object-cover border border-black/10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setRemoveExistingImage(true)}
                    className="text-muted-foreground"
                  >
                    <X className="h-3.5 w-3.5 mr-1" />
                    Remove photo
                  </Button>
                </div>
              ) : (
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setImageFile(e.target.files?.[0] || null);
                    setRemoveExistingImage(false);
                  }}
                />
              )}
              <p className="text-xs text-muted-foreground">
                Shown next to the quote on the public site. Without one, the
                testimonial displays with the person's initials instead.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                placeholder="e.g. Software Engineer"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="e.g. Google (Optional)"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Testimonial Content</Label>
              <Textarea
                id="content"
                placeholder="Write the testimonial here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                maxLength={500}
                required
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.content.length} / 500
              </p>
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="isActive" className="flex flex-col space-y-1">
                <span>Active</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Show this testimonial on the public pages
                </span>
              </Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving
                  ? 'Saving...'
                  : editingTestimonial
                    ? 'Save Changes'
                    : 'Create Testimonial'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Testimonials;
