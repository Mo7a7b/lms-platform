"use client";

import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckoutCancelPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-md shadow-lg border-red-200 dark:border-red-900/50">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            Checkout Cancelled
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6 pt-4">
          <p className="text-muted-foreground text-lg">
            Your payment was not processed. No charges were made to your
            account.
          </p>

          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              className="w-full font-semibold text-lg h-12"
              asChild
            >
              <Link href="/">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Browse Courses
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
