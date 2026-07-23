"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createCategory, updateCategory, deleteCategory } from "./actions";

export function CategoriesClient({ initialCategories }: { initialCategories: any[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    display_order: 0,
  });

  const handleOpenNew = () => {
    setFormData({ name: "", slug: "", description: "", display_order: categories.length + 1 });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: any) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      display_order: category.display_order,
    });
    setEditingId(category.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (editingId) {
      const res = await updateCategory(editingId, formData);
      if (res.success) {
        setCategories(prev => prev.map(c => c.id === editingId ? { ...c, ...formData } : c));
        setIsModalOpen(false);
      } else {
        alert("Error updating: " + res.error);
      }
    } else {
      const res = await createCategory(formData);
      if (res.success) {
        window.location.reload(); // Quick way to get the new DB ID
      } else {
        alert("Error creating: " + res.error);
      }
    }
    setIsProcessing(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? Products in this category will keep their text category but lose the relation.")) return;
    setIsProcessing(true);
    const res = await deleteCategory(id);
    if (res.success) {
      setCategories(prev => prev.filter(c => c.id !== id));
    } else {
      alert("Error deleting: " + res.error);
    }
    setIsProcessing(false);
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border bg-muted/30 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-heading text-primary">Categories</h1>
          <p className="text-sm text-foreground/70">Manage product categories and collections.</p>
        </div>
        <Button onClick={handleOpenNew} className="gap-2">
          <Plus size={18} /> New Category
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium">Order</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Slug</th>
              <th className="px-6 py-4 font-medium">Description</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  No categories found. Start by adding one.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-muted-foreground">{category.display_order}</td>
                  <td className="px-6 py-4 font-semibold">{category.name}</td>
                  <td className="px-6 py-4 text-muted-foreground bg-muted/30 rounded inline-block mt-3 px-2 py-0.5 ml-6 font-mono text-xs">
                    /{category.slug}
                  </td>
                  <td className="px-6 py-4 text-foreground/70 truncate max-w-[250px]">
                    {category.description || '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => handleOpenEdit(category)}
                        disabled={isProcessing}
                        className="p-2 text-foreground/50 hover:text-primary hover:bg-muted rounded-md transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(category.id)}
                        disabled={isProcessing}
                        className="p-2 text-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md rounded-xl shadow-lg border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-lg font-bold font-heading">{editingId ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    // Auto-generate slug if it's a new category
                    if (!editingId) {
                      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                      setFormData({ ...formData, name, slug });
                    } else {
                      setFormData({ ...formData, name });
                    }
                  }}
                  className="w-full h-10 px-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Slug</label>
                <input 
                  required
                  type="text" 
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="w-full h-10 px-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full h-24 p-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Display Order</label>
                <input 
                  required
                  type="number" 
                  value={formData.display_order}
                  onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value) || 0})}
                  className="w-full h-10 px-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isProcessing}>
                  {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
