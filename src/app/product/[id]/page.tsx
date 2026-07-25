import { createClient } from "@/utils/supabase/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProductClient } from "./ProductClient";
import { ReviewSection } from "@/components/ui/ReviewSection";
import { notFound } from "next/navigation";

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;
  
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (!product) {
    notFound();
  }

  // Ensure there's always at least one image
  product.images = product.images?.length > 0 
    ? product.images 
    : ["https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop"];

  // Fetch suggested products
  const { data: suggestedProducts } = await supabase
    .from('products')
    .select('*')
    .neq('id', product.id)
    .limit(2);

  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 90);

  // JSON-LD Schema
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description || "",
    "sku": `ANU-${product.id}`,
    "offers": {
      "@type": "Offer",
      "url": `https://Anubandha.com/product/${product.id}`,
      "priceCurrency": "INR",
      "price": product.price,
      "priceValidUntil": validUntil.toISOString().split('T')[0],
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  return (
    <main className="min-h-screen bg-background pt-24">
      <JsonLd data={jsonLdData} />
      <Navbar />
      <ProductClient product={product} suggestedProducts={suggestedProducts || []} />
      <div className="container mx-auto px-4 md:px-6 pb-24 max-w-6xl">
        <ReviewSection productId={product.id} />
      </div>
      <Footer />
    </main>
  );
}
