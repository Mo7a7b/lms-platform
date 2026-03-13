"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DeleteUserAccount } from "@/lib/api";
import { PasswordInput } from "../ui/password-input";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthData } from "@/hooks/useAuthData";

export default function DeleteAccountButton() {
  const { token } = useAuthData();
  const [password, setPassword] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  function handleDeleteAccount() {
    setIsLoading(true);
    toast.promise(DeleteUserAccount(token, password as string), {
      loading: "Loading...",
      success: (res) => {
        router.push("/");
        return res.message;
      },
      error: (err) => err.response.data.error,
      finally: () => {
        setIsLoading(false);
        setPassword(null);
      },
    });
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account from our servers.
          </AlertDialogDescription>
          <div className="space-y-2 w-full">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <PasswordInput
              value={password as string}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
              className="h-11 rounded-xl"
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={!password || password.length < 6 || isLoading}
            onClick={handleDeleteAccount}
          >
            {isLoading && <Loader2 className="animate-spin" />}
            {isLoading ? "Deleting Account..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
