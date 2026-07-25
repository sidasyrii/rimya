import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ShopLoading() {
  return (
    <main className="min-h-screen bg-background pt-24">
      <Navbar />
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="h-10 w-48 bg-muted rounded animate-pulse mb-2"></div>
            <div className="h-5 w-64 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
        <LoadingSkeleton />
      </div>
      <Footer />
    </main>
  );
}
