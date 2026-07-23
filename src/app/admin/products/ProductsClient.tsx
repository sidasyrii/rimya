"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Edit, CheckCircle, XCircle, Trash2, Search, Filter, MoreHorizontal, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProduct, toggleProductStock, bulkDeleteProducts, duplicateProduct } from "./actions";

export function ProductsClient({ initialProducts, categories }: { initialProducts: any[], categories: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter products locally
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory || p.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredProducts.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  const handleToggleStock = async (id: string, currentStock: boolean) => {
    setIsProcessing(true);
    const res = await toggleProductStock(id, !currentStock);
    if (res.success) {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, in_stock: !currentStock } : p));
    } else {
      alert("Error updating stock: " + res.error);
    }
    setIsProcessing(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setIsProcessing(true);
    const res = await deleteProduct(id);
    if (res.success) {
      setProducts(prev => prev.filter(p => p.id !== id));
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    } else {
      alert("Error deleting product: " + res.error);
    }
    setIsProcessing(false);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) return;
    
    setIsProcessing(true);
    const res = await bulkDeleteProducts(selectedIds);
    if (res.success) {
      setProducts(prev => prev.filter(p => !selectedIds.includes(p.id)));
      setSelectedIds([]);
    } else {
      alert("Error deleting products: " + res.error);
    }
    setIsProcessing(false);
  };

  const handleDuplicate = async (id: string) => {
    setIsProcessing(true);
    const res = await duplicateProduct(id);
    if (res.success) {
      // Reload page to get the new product with its correct ID from server
      window.location.reload();
    } else {
      alert("Error duplicating product: " + res.error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border bg-muted/30">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold font-heading text-primary">Products</h1>
            <p className="text-sm text-foreground/70">Manage your catalog, inventory, and pricing.</p>
          </div>
          <Link href="/admin/products/new">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2">
              <Plus size={18} /> New Product
            </Button>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div className="relative hidden sm:block w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-10 pl-10 pr-8 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c.id || c.name} value={c.id || c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="w-full sm:w-auto flex items-center gap-3">
            {selectedIds.length > 0 && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleBulkDelete}
                disabled={isProcessing}
                className="flex items-center gap-2"
              >
                <Trash2 size={16} /> Delete Selected ({selectedIds.length})
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 w-12">
                <input 
                  type="checkbox" 
                  checked={filteredProducts.length > 0 && selectedIds.length === filteredProducts.length}
                  onChange={handleSelectAll}
                  className="rounded border-border accent-primary w-4 h-4 cursor-pointer"
                />
              </th>
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Stock</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                  No products found matching your filters.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className={`border-b border-border transition-colors ${selectedIds.includes(product.id) ? 'bg-primary/5' : 'hover:bg-muted/30'}`}>
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(product.id)}
                      onChange={(e) => handleSelect(product.id, e.target.checked)}
                      className="rounded border-border accent-primary w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-md bg-muted overflow-hidden flex-shrink-0 relative border border-border/50">
                        {product.images && product.images[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-border flex items-center justify-center text-muted-foreground text-xs">No Img</div>
                        )}
                      </div>
                      <div>
                        <Link href={`/admin/products/${product.id}/edit`} className="font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors">
                          {product.name}
                        </Link>
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
                  <td className="px-6 py-4 text-foreground/70">
                    {/* Fallback to text category if ID lookup fails or doesn't exist */}
                    {categories.find(c => c.id === product.category_id)?.name || product.category || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleToggleStock(product.id, product.in_stock)}
                      disabled={isProcessing}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                        product.in_stock 
                          ? 'bg-success/10 text-success hover:bg-success/20' 
                          : 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                      }`}
                    >
                      {product.in_stock ? <><CheckCircle size={14} /> In Stock</> : <><XCircle size={14} /> Out of Stock</>}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => handleDuplicate(product.id)}
                        disabled={isProcessing}
                        title="Duplicate Product"
                        className="p-2 text-foreground/50 hover:text-primary hover:bg-muted rounded-md transition-colors"
                      >
                        <Copy size={16} />
                      </button>
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <div className="p-2 text-foreground/50 hover:text-primary hover:bg-muted rounded-md transition-colors cursor-pointer" title="Edit Product">
                          <Edit size={16} />
                        </div>
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        disabled={isProcessing}
                        title="Delete Product"
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
    </div>
  );
}
