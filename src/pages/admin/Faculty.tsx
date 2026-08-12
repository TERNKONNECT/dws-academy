import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { facultyApi, type Faculty } from '@/api/faculty';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, Loader2, Users } from 'lucide-react';
import { toast } from 'sonner';

const getInitials = (name: string) => {
  if (!name) return '';
  return name.split(' ').map(n => n[0]).filter(Boolean).join('').substring(0, 2).toUpperCase();
};

export default function AdminFaculty() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    company: '',
    shortDescription: '',
    isActive: true,
  });

  const { data: faculties = [], isLoading } = useQuery({
    queryKey: ['admin-faculty'],
    queryFn: () => facultyApi.getAll(true),
  });

  const createMutation = useMutation({
    mutationFn: facultyApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-faculty'] });
      toast.success('Faculty member added successfully');
      setIsFormOpen(false);
    },
    onError: () => toast.error('Failed to add faculty member'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Faculty> }) =>
      facultyApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-faculty'] });
      toast.success('Faculty member updated successfully');
      setIsFormOpen(false);
    },
    onError: () => toast.error('Failed to update faculty member'),
  });

  const deleteMutation = useMutation({
    mutationFn: facultyApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-faculty'] });
      toast.success('Faculty member deleted successfully');
      setIsDeleteDialogOpen(false);
    },
    onError: () => toast.error('Failed to delete faculty member'),
  });

  const handleOpenAdd = () => {
    setEditingFaculty(null);
    setFormData({ name: '', jobTitle: '', company: '', shortDescription: '', isActive: true });
    setAvatarFile(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (faculty: Faculty) => {
    setEditingFaculty(faculty);
    setFormData({
      name: faculty.name,
      jobTitle: faculty.jobTitle || '',
      company: faculty.company || '',
      shortDescription: faculty.shortDescription || '',
      isActive: faculty.isActive,
    });
    setAvatarFile(null);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let facultyId = editingFaculty?.id;
      
      if (editingFaculty) {
        await facultyApi.update(editingFaculty.id, formData);
      } else {
        const result = await facultyApi.create(formData);
        facultyId = result.id;
      }
      
      if (avatarFile && facultyId) {
        await facultyApi.uploadAvatar(facultyId, avatarFile);
      }
      
      queryClient.invalidateQueries({ queryKey: ['admin-faculty'] });
      toast.success(editingFaculty ? 'Faculty member updated successfully' : 'Faculty member added successfully');
      setIsFormOpen(false);
    } catch (error) {
      toast.error('Failed to save faculty member');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Faculty Management</h1>
          <p className="text-muted-foreground">
            Manage the people showcased in the "Learn From People Building It Now" section.
          </p>
        </div>
        <Button onClick={handleOpenAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Faculty
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        {faculties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No faculty members yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add your first faculty member to showcase them on the homepage.
            </p>
            <Button className="mt-6" onClick={handleOpenAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add Faculty
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="w-1/3">Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faculties.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      {f.avatar ? (
                        <img 
                          src={f.avatar} 
                          alt={f.name} 
                          className="h-10 w-10 rounded-full object-cover border border-black/10" 
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0B0B0C] font-bold text-primary text-sm">
                          {getInitials(f.name)}
                        </div>
                      )}
                      <span>{f.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{f.jobTitle || '-'}</TableCell>
                  <TableCell className="text-muted-foreground">{f.company || '-'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="line-clamp-2">{f.shortDescription || '-'}</div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        f.isActive
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {f.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(f)}
                      >
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDelete(f.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingFaculty ? 'Edit Faculty Member' : 'Add Faculty Member'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">Profile Image (Optional)</Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  placeholder="e.g. Google"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="shortDescription">Short Description</Label>
                <span className="text-xs text-muted-foreground">
                  {formData.shortDescription.length}/500
                </span>
              </div>
              <Textarea
                id="shortDescription"
                placeholder="Brief bio or description..."
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                maxLength={500}
                className="h-24"
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">Active Status</Label>
                <p className="text-sm text-muted-foreground">
                  Show this faculty member on the homepage
                </p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
              >
                {isSaving && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingFaculty ? 'Save Changes' : 'Add Faculty'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this faculty member. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && deleteMutation.mutate(deletingId)}
              className="bg-red-500 hover:bg-red-600"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
