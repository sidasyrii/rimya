import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function AccountLoading() {
  return (
    <main className="min-h-screen bg-background pt-24">
      <Navbar />
      <div className="container mx-auto px-4 md:px-6 py-12 animate-pulse">
        <div className="h-10 w-48 bg-muted rounded mb-12"></div>
        
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-muted"></div>
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-muted rounded"></div>
                  <div className="h-4 w-24 bg-muted rounded"></div>
                </div>
              </div>
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 w-full bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 w-48 bg-muted rounded mb-6"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 w-full bg-muted rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
