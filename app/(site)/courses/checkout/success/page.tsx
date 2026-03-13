"use client";

import Link from "next/link";
import { CheckCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckoutSuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-md shadow-lg border-2 border-green-500/20">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-green-700 dark:text-green-400">
            Enrollment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6 pt-4">
          <p className="text-muted-foreground text-lg">
            Thank you for your purchase. You now have full access to the course.
          </p>

          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              className="w-full font-semibold text-lg h-12"
              asChild
            >
              <Link href="/dashboard/courses">
                <BookOpen className="mr-2 h-5 w-5" />
                Go to My Courses
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/">Browse More Courses</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
