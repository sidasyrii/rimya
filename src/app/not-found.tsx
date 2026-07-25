import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] flex flex-col items-center justify-center p-4 pt-32 pb-20">
        <h1 className="text-9xl font-heading font-bold text-primary/20 mb-4 tracking-tighter">404</h1>
        <h2 className="text-4xl font-heading font-bold mb-4 text-center">Page Not Found</h2>
        <p className="text-foreground/70 mb-8 max-w-md text-center">
          We couldn't find the page you were looking for. It might have been moved or doesn't exist anymore.
        </p>
        <div className="flex gap-4">
          <Link href="/shop">
            <Button size="lg">Continue Shopping</Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg">Return Home</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
