import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background overflow-hidden">
      {/* Gradient background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-r from-primary/40 via-purple-500/30 to-cyan-500/40 blur-3xl animate-pulse" />
      </div>

      {/* Glass card */}
      <Card className="w-[90%] max-w-md border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <CardContent className="flex flex-col items-center gap-6 py-10">
          {/* Spinner */}
          <div className="relative">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <div className="absolute inset-0 h-10 w-10 rounded-full border border-primary/30 animate-ping" />
          </div>

          {/* Text */}
          <div className="text-center space-y-2">
            <h2 className="text-lg font-semibold tracking-wide">
              Loading experience
            </h2>
            <p className="text-sm text-muted-foreground">
              Preparing something awesome for you
            </p>
          </div>

          {/* Fake content skeleton */}
          <div className="w-full space-y-3 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[85%]" />
            <Skeleton className="h-4 w-[70%]" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
