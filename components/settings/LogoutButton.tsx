"use client";

import { Button } from "@/components/ui/button";
import { signOutFromClient } from "@/lib/signOutHelper";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function LogoutButton() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  async function handleLogout() {
    const promise = signOutFromClient().then(() => {
      router.push("/auth/login");
    });
    setLoading(true);
    toast.promise(promise, {
      loading: "Logging out...",
      success: "Logged out successfully",
      error: "Failed to logout",
      finally: () => {
        setLoading(false);
      },
    });
  }

  return (
    <Button disabled={loading} onClick={handleLogout} variant="outline">
      {loading && <Loader2 className="animate-spin" />}
      {loading ? "Logging out..." : "Logout"}
    </Button>
  );
}
