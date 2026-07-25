import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex flex-col flex-1 h-full animate-pulse">
      <div className="flex items-center justify-between mb-8">
        <div className="h-10 w-48 bg-muted rounded"></div>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card border border-border p-6 rounded-xl">
            <div className="h-4 w-24 bg-muted rounded mb-4"></div>
            <div className="h-8 w-16 bg-muted rounded"></div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-6 flex-1">
        <div className="h-6 w-32 bg-muted rounded mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 w-full bg-muted rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
