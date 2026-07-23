import { ProductForm } from "@/components/admin/ProductForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewProductPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 bg-background border border-border rounded-md hover:bg-muted transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-heading text-primary">Create New Product</h1>
          <p className="text-sm text-foreground/70">Add a new hamper to your catalog.</p>
        </div>
      </div>

      <ProductForm />
    </div>
  );
}
