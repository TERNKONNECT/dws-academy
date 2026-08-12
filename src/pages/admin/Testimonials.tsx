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
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.jobTitle || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingTestimonial) {
        const updated = await testimonialsApi.update(editingTestimonial.id, formData);
        setTestimonials(testimonials.map((t) => (t.id === updated.id ? updated : t)));
        toast.success('Testimonial updated');
      } else {
        const created = await testimonialsApi.create(formData);
        setTestimonials([created, ...testimonials]);
        toast.success('Testimonial created');
      }
      setIsFormOpen(false);
    } catch {
      toast.error('Failed to save testimonial');
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
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingTestimonial ? 'Save Changes' : 'Create Testimonial'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Testimonials;
