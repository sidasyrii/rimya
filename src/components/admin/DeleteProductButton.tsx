"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/app/admin/products/actions";

export function DeleteProductButton({ productId }: { productId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setIsDeleting(true);
    const res = await deleteProduct(productId);
    if (!res.success) {
      alert("Failed to delete: " + res.error);
    }
    setIsDeleting(false);
  }

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={handleDelete}
      disabled={isDeleting}
      className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
      title="Delete Product"
    >
      <Trash2 size={16} />
    </Button>
  );
}
