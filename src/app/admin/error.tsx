"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AdminError({
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full bg-card border border-border rounded-xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-destructive mb-2">Admin Dashboard Error</h1>
        <p className="text-sm text-foreground/70 mb-6">
          A rendering or data fetching error occurred in the admin panel.
        </p>
        <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-md mb-6 overflow-auto font-mono">
          {error.message || "Unknown error"}
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => window.location.href = '/admin'}>
            Go to Admin Home
          </Button>
          <Button onClick={reset}>Try again</Button>
        </div>
      </div>
    </div>
  );
}
