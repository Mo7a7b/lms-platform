"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StripeReturnPage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect after 3 seconds
    const timeout = setTimeout(() => {
      router.push("/dashboard/settings");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle>Stripe Account Connected!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            You have successfully connected your Stripe account. You can now
            start receiving payouts.
          </p>
          <p className="text-sm text-muted-foreground">
            Redirecting to settings...
          </p>
          <Button
            className="w-full"
            onClick={() => router.push("/dashboard/settings")}
          >
            Go back to Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
