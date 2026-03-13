"use client";

import { useRouter } from "next/navigation";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StripeRefreshPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-yellow-500" />
          </div>
          <CardTitle>Connection Expired</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            The link to connect your Stripe account has expired or was invalid.
            Please try again.
          </p>
          <Button
            className="w-full"
            onClick={() => router.push("/dashboard/settings")}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Return to Settings to Retry
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
