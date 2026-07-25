"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { X, UploadCloud, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bulkCreateProducts } from "@/app/admin/products/actions";

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: any[];
}

export function BulkUploadModal({ isOpen, onClose, categories }: BulkUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseExcel(selectedFile);
    }
  };

  const parseExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        
        if (jsonData.length === 0) {
          setError("The uploaded file is empty.");
          return;
        }

        // Map to our database fields
        const mappedData = jsonData.map((row: any) => {
          // Find keys ignoring case and spaces
          const getField = (keywords: string[]) => {
            const key = Object.keys(row).find(k => 
              keywords.some(keyword => k.toLowerCase().replace(/[^a-z0-9]/g, '').includes(keyword))
            );
            return key ? row[key] : null;
          };

          const name = getField(['productname', 'name', 'itemname']) || "Unnamed Product";
          const sellingPrice = parseInt(getField(['sellingprice', 'price', 'mrp']) || "0");
          const originalPriceRaw = getField(['originalprice', 'compareprice', 'oldprice']);
          const originalPrice = originalPriceRaw ? parseInt(originalPriceRaw) : null;
          const quantity = parseInt(getField(['quantity', 'stock', 'qty']) || "0");
          const description = getField(['description', 'desc', 'details']) || "";
          const categoryName = getField(['category', 'type', 'collection']) || "";

          // Try to match category ID
          let categoryId = null;
          if (categoryName) {
            const matchedCat = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
            if (matchedCat) {
              categoryId = matchedCat.id;
            }
          }

          return {
            name,
            price: isNaN(sellingPrice) ? 0 : sellingPrice,
            original_price: isNaN(originalPrice as number) ? null : originalPrice,
            stock_quantity: isNaN(quantity) ? 0 : quantity,
            in_stock: quantity > 0,
            description,
            category: categoryId ? null : categoryName, // Use text if no ID matched
            category_id: categoryId,
            tags: [],
            images: [],
          };
        });

        setPreviewData(mappedData);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Error parsing the file. Please ensure it is a valid Excel sheet.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleUpload = async () => {
    if (previewData.length === 0) return;
    setIsProcessing(true);
    setError(null);

    const res = await bulkCreateProducts(previewData);
    
    setIsProcessing(false);
    
    if (res.success) {
      onClose();
      // Reset state for next time
      setFile(null);
      setPreviewData([]);
    } else {
      setError(res.error || "Failed to create products.");
    }
  };

  const resetFile = () => {
    setFile(null);
    setPreviewData([]);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-4xl max-h-[90vh] flex flex-col rounded-xl shadow-lg border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold">Bulk Upload Products</h2>
            <p className="text-sm text-muted-foreground mt-1">Upload an Excel sheet to add multiple products.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="mt-0.5" />
              <div className="text-sm">{error}</div>
            </div>
          )}

          {!file ? (
            <div className="border-2 border-dashed border-border rounded-xl p-12 flex flex-col items-center justify-center text-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group relative">
              <UploadCloud className="w-12 h-12 text-muted-foreground mb-4 group-hover:text-primary transition-colors" />
              <h3 className="font-semibold text-lg mb-2">Click or drag Excel file to upload</h3>
              <p className="text-sm text-muted-foreground mb-4">Supported formats: .xlsx, .xls, .csv</p>
              <div className="text-xs text-muted-foreground max-w-sm">
                Expected columns: Product Name, Selling Price, Original Price, Quantity, Product Description, Category
              </div>
              <input 
                type="file" 
                accept=".xlsx, .xls, .csv" 
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-md">
                    <XLSXIcon />
                  </div>
                  <div>
                    <div className="font-medium">{file.name}</div>
                    <div className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB • {previewData.length} rows found</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={resetFile} disabled={isProcessing}>
                  Change File
                </Button>
              </div>

              {previewData.length > 0 && (
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="bg-muted px-4 py-2 border-b border-border text-sm font-medium">
                    Preview Data ({Math.min(previewData.length, 5)} of {previewData.length} shown)
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border">
                        <tr>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Price</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">Qty</th>
                          <th className="px-4 py-3">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.slice(0, 5).map((row, i) => (
                          <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20">
                            <td className="px-4 py-3 font-medium">{row.name}</td>
                            <td className="px-4 py-3 text-primary">₹{row.price}</td>
                            <td className="px-4 py-3">{row.category || (categories.find(c => c.id === row.category_id)?.name) || '-'}</td>
                            <td className="px-4 py-3">{row.stock_quantity}</td>
                            <td className="px-4 py-3 text-muted-foreground truncate max-w-[200px]">{row.description || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex justify-end items-center gap-4 bg-muted/20">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!file || previewData.length === 0 || isProcessing}
            className="min-w-[120px]"
          >
            {isProcessing ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
            ) : (
              'Upload Products'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function XLSXIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="8" y1="13" x2="16" y2="13"/>
      <line x1="8" y1="17" x2="16" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  );
}
