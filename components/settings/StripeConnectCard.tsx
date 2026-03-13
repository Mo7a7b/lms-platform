"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { connectStripeAccount } from "@/lib/api/stripe.api";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuthData } from "@/hooks/useAuthData";
import { useStripeAccount } from "@/lib/queries/useStripeAccount";
import { useStripeDashboard } from "@/lib/queries/useStripeDashboard";
import Link from "next/link";

export default function StripeConnectCard() {
  const { token, user } = useAuthData();
  const { data, isLoading: isStripeLoading } = useStripeAccount(token);
  const { data: stripeDashboard, isLoading: isGettingDashboardLink } =
    useStripeDashboard(token);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      const data = await connectStripeAccount(token);
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to get Stripe Connect URL");
      }
    } catch (error) {
      console.error("Stripe connect error:", error);
      toast.error("Something went wrong with Stripe connection");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <>
      {user.role === "Instructor" && (
        <Card>
          <CardHeader>
            <CardTitle>Stripe Connect</CardTitle>
            <CardDescription>
              Connect your Stripe account to start receiving payouts from your
              courses.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isStripeLoading ? (
              <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
                <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                <div className="flex-1">
                  <p className="font-medium">Loading Stripe Account Status</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Please wait while we check your Stripe account status.
                  </p>
                </div>
              </div>
            ) : data?.isStripeConnected ? (
              <div className="flex items-center gap-3 p-4 border rounded-lg bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400">
                <CheckCircle className="h-5 w-5" />
                <div className="flex-1">
                  <p className="font-medium">Stripe Account Connected</p>
                  <p className="text-xs opacity-90 mt-0.5">
                    Account ID: {data?.stripeAccountId}
                  </p>
                </div>
                {isGettingDashboardLink ? (
                  <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                ) : (
                  <Link href={stripeDashboard?.url} target="_blank">
                    <Button variant="outline" size="sm">
                      Go To Stripe Dashboard
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">No Account Connected</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    You need to connect Stripe to publish paid courses.
                  </p>
                </div>
                <Button
                  onClick={handleConnect}
                  disabled={isStripeLoading || isConnecting}
                >
                  {isConnecting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Connect Stripe
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
