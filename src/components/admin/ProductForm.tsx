"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { logAdminAction } from "@/lib/auditLog";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud, X, GripVertical } from "lucide-react";
import Image from "next/image";

interface ProductFormProps {
  initialData?: any;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    original_price: initialData?.original_price || "",
    category_id: initialData?.category_id || "",
    category_text: initialData?.category || "", // Fallback
    in_stock: initialData?.in_stock ?? true,
    stock_quantity: initialData?.stock_quantity ?? (initialData?.in_stock ? 10 : 0),
    tags: initialData?.tags?.join(", ") || "",
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(initialData?.images || []);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from('categories').select('*').order('display_order');
      if (data) setCategories(data);
    }
    fetchCategories();
  }, [supabase]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(f => f.size <= 5 * 1024 * 1024);
      
      if (validFiles.length < files.length) {
        setError("Some images were larger than 5MB and were skipped.");
      }
      
      // Limit to 5 total images
      const totalAllowed = 5 - existingImages.length - newImageFiles.length;
      const filesToAdd = validFiles.slice(0, totalAllowed);
      
      setNewImageFiles(prev => [...prev, ...filesToAdd]);
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      urls.push(publicUrl);
    }
    
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Upload new images
      let uploadedUrls: string[] = [];
      if (newImageFiles.length > 0) {
        uploadedUrls = await uploadImages(newImageFiles);
      }

      // Combine existing and new image URLs
      const finalImages = [...existingImages, ...uploadedUrls];

      // Parse tags
      const tagsArray = String(formData.tags)
        .split(",")
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 0);

      const productPayload = {
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price as string),
        original_price: formData.original_price ? parseInt(formData.original_price as string) : null,
        category: formData.category_text || null, // fallback text
        category_id: formData.category_id || null, // proper relation
        in_stock: formData.in_stock,
        stock_quantity: formData.stock_quantity,
        images: finalImages,
        tags: tagsArray,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('products')
          .update(productPayload)
          .eq('id', initialData.id);
        if (error) throw error;
        await logAdminAction(supabase, "UPDATE_PRODUCT", "products", initialData.id, productPayload);
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productPayload);
        if (error) throw error;
        await logAdminAction(supabase, "CREATE_PRODUCT", "products", undefined, productPayload);
      }

      router.push('/admin/products');
      router.refresh();

    } catch (err: any) {
      setError(err.message || "An error occurred while saving the product.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border p-6 md:p-8 rounded-xl shadow-sm">
      
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Details */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Product Name <span className="text-destructive">*</span></label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full h-11 px-4 bg-background border border-border rounded-md focus:outline-none focus:border-primary"
              placeholder="e.g., Luxury Chocolate Box"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Selling Price (₹) <span className="text-destructive">*</span></label>
              <input 
                required
                type="number" 
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full h-11 px-4 bg-background border border-border rounded-md focus:outline-none focus:border-primary"
                placeholder="4999"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Original Price (₹)</label>
              <input 
                type="number" 
                min="0"
                value={formData.original_price}
                onChange={(e) => setFormData({...formData, original_price: e.target.value})}
                className="w-full h-11 px-4 bg-background border border-border rounded-md focus:outline-none focus:border-primary"
                placeholder="5999 (Optional)"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Category</label>
            <div className="flex flex-col gap-3">
              <select 
                value={formData.category_id || formData.category_text || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  // If it's a UUID, it's a category_id, else text fallback
                  if (val.length === 36 && val.includes('-')) {
                    setFormData({...formData, category_id: val, category_text: ""});
                  } else {
                    setFormData({...formData, category_id: "", category_text: val});
                  }
                }}
                className="w-full h-11 px-4 bg-background border border-border rounded-md focus:outline-none focus:border-primary appearance-none cursor-pointer"
              >
                <option value="" disabled>Select a category...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
                {/* Fallbacks if DB category doesn't match ID */}
                {!categories.find(c => c.id === formData.category_id) && formData.category_text && (
                  <option value={formData.category_text}>{formData.category_text}</option>
                )}
              </select>
              <p className="text-xs text-muted-foreground">Manage categories in the Categories tab.</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Tags (Comma separated)</label>
            <input 
              type="text" 
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              className="w-full h-11 px-4 bg-background border border-border rounded-md focus:outline-none focus:border-primary"
              placeholder="e.g., gift, chocolate, luxury"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full h-32 p-4 bg-background border border-border rounded-md focus:outline-none focus:border-primary resize-none"
              placeholder="Detailed description of the hamper contents and quality..."
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-muted/30 border border-border rounded-md">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="in_stock" checked={formData.in_stock} onChange={(e) => setFormData({...formData, in_stock: e.target.checked})} className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" />
              <label htmlFor="in_stock" className="text-sm font-medium">In Stock</label>
            </div>
          </div>
          
          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium">Stock Quantity</label>
            <input type="number" min="0" required value={formData.stock_quantity} onChange={(e) => setFormData({...formData, stock_quantity: parseInt(e.target.value) || 0})} className="w-full h-10 px-3 border border-border rounded-md focus:border-primary focus:outline-none" />
          </div>
        </div>

        {/* Right Column: Images */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold">Product Images</label>
            <span className="text-xs text-muted-foreground">{existingImages.length + newImageFiles.length}/5 max</span>
          </div>
          
          <div className="space-y-4">
            {/* Image Grid */}
            {(existingImages.length > 0 || newImageFiles.length > 0) && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {existingImages.map((url, i) => (
                  <div key={`existing-${i}`} className="relative aspect-square rounded-lg border border-border bg-muted overflow-hidden group">
                    <Image src={url} alt={`Product ${i+1}`} fill sizes="150px" className="object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeExistingImage(i)}
                      className="absolute top-2 right-2 bg-background/80 hover:bg-destructive hover:text-destructive-foreground text-foreground p-1.5 rounded-full shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X size={14} />
                    </button>
                    {i === 0 && <span className="absolute bottom-2 left-2 bg-background/90 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">MAIN</span>}
                  </div>
                ))}
                
                {newImageFiles.map((file, i) => {
                  const preview = URL.createObjectURL(file);
                  return (
                    <div key={`new-${i}`} className="relative aspect-square rounded-lg border-2 border-primary/50 bg-primary/5 overflow-hidden group">
                      <Image src={preview} alt={`New Product ${i+1}`} fill sizes="150px" className="object-cover opacity-80" />
                      <button 
                        type="button"
                        onClick={() => removeNewImage(i)}
                        className="absolute top-2 right-2 bg-background/80 hover:bg-destructive hover:text-destructive-foreground text-foreground p-1.5 rounded-full shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X size={14} />
                      </button>
                      <span className="absolute bottom-2 right-2 bg-primary/90 text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">NEW</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Upload Button */}
            {existingImages.length + newImageFiles.length < 5 && (
              <div 
                className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group"
                onClick={() => document.getElementById('multi-image-upload')?.click()}
              >
                <UploadCloud className="w-10 h-10 text-muted-foreground mb-3 group-hover:text-primary transition-colors" />
                <h3 className="font-semibold text-sm mb-1">Click to add images</h3>
                <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 5MB.</p>
                <input 
                  id="multi-image-upload" 
                  type="file" 
                  accept="image/*" 
                  multiple
                  className="hidden" 
                  onChange={handleImageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-border flex justify-end items-center gap-4">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/products')} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
          {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : (isEditing ? 'Save Changes' : 'Create Product')}
        </Button>
      </div>
    </form>
  );
}
