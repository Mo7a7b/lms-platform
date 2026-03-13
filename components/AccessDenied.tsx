"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function AccessDenied() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10"
      >
        <Card className="w-[90vw] max-w-md border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
          <CardContent className="flex flex-col items-center p-8 text-center">
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10"
            >
              <ShieldAlert className="h-10 w-10 text-red-500" />
            </motion.div>

            <h1 className="mb-2 text-2xl font-bold tracking-tight text-white">
              Access Denied
            </h1>
            <p className="mb-6 text-sm text-slate-300">
              You don’t have permission to view this page. If you believe this
              is a mistake, please contact an administrator.
            </p>

            <div className="flex w-full flex-col gap-3">
              <Button asChild className="w-full">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
