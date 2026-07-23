import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Plus, Edit, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false });

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
        <div>
          <h1 className="text-2xl font-bold font-heading text-primary">Product Management</h1>
          <p className="text-sm text-foreground/70">Manage your catalog, inventory, and pricing.</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2">
            <Plus size={18} /> New Product
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Stock</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!products || products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  No products found. Start by adding one!
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-md bg-muted overflow-hidden flex-shrink-0 relative">
                        {product.images && product.images[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-border flex items-center justify-center text-muted-foreground text-xs">No Img</div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground line-clamp-1">{product.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">ID: {product.id.split('-')[0]}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-primary">
                    ₹{product.price.toLocaleString('en-IN')}
                    {product.original_price && (
                      <span className="text-xs text-muted-foreground line-through ml-2">₹{product.original_price.toLocaleString('en-IN')}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-foreground/70">{product.category || '—'}</td>
                  <td className="px-6 py-4">
                    {product.in_stock ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                        <CheckCircle size={14} /> In Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                        <XCircle size={14} /> Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button variant="outline" size="icon" className="h-8 w-8 text-foreground/70 hover:text-primary">
                          <Edit size={16} />
                        </Button>
                      </Link>
                      <DeleteProductButton productId={product.id} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
