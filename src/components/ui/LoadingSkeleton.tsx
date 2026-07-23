export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full animate-pulse">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex flex-col gap-4">
          <div className="bg-muted aspect-[4/5] rounded-lg w-full"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-24 animate-pulse">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-muted aspect-square rounded-lg w-full"></div>
        <div className="flex flex-col gap-6 mt-8 md:mt-0">
          <div className="h-10 bg-muted rounded w-3/4"></div>
          <div className="h-6 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded w-full mt-4"></div>
          <div className="h-12 bg-muted rounded w-1/2 mt-8"></div>
        </div>
      </div>
    </div>
  );
}
