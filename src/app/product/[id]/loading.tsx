import { ProductDetailsSkeleton } from "@/components/ui/LoadingSkeleton";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ProductLoading() {
  return (
    <main className="min-h-screen bg-background pt-24">
      <Navbar />
      <ProductDetailsSkeleton />
      <Footer />
    </main>
  );
}
