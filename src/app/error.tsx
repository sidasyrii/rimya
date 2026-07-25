"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <h1 className="text-4xl font-heading font-bold mb-4 text-center">Something went wrong</h1>
      <p className="text-foreground/70 mb-8 max-w-md text-center">
        We apologize for the inconvenience. An unexpected error occurred while processing your request.
      </p>
      <div className="flex gap-4">
        <Button onClick={reset} size="lg">Try again</Button>
        <Link href="/">
          <Button variant="outline" size="lg">Return Home</Button>
        </Link>
      </div>
    </main>
  );
}
