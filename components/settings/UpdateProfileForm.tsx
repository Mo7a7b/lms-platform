"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { Loader2, Upload, User } from "lucide-react";
import { useAuthData } from "@/hooks/useAuthData";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UpdateProfileForm({
  action,
}: {
  action: App.ActionFunction;
}) {
  const { token, user } = useAuthData();
  const initialState: App.FormState = {
    message: "",
  };
  const [state, formAction, isPending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const prevMessageRef = useRef<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user?.profileImg?.url) {
      setPreview(user.profileImg.url);
    }
  }, [user]);

  useEffect(() => {
    if (
      state &&
      "message" in state &&
      state.message &&
      state.message !== prevMessageRef.current
    ) {
      if (state.message === "Profile picture updated") {
        toast.success(state.message);
        formRef.current?.reset();
        setFile(null);
        // Keep the preview of the uploaded image
      } else {
        toast.error(state.message);
      }
      prevMessageRef.current = state && "message" in state ? state.message : "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state && "message" in state ? state.message : ""]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
        <CardDescription>Update your profile picture.</CardDescription>
      </CardHeader>
      <form ref={formRef} encType="multipart/form-data" action={formAction}>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center gap-6 md:flex-row-reverse md:mb-2 md:justify-between">
            <Avatar className="w-24 h-24 border-2 border-border">
              <AvatarImage
                src={preview || ""}
                alt="Profile preview"
                className="object-cover"
              />
              <AvatarFallback className="text-2xl bg-muted">
                {user?.name?.charAt(0) || (
                  <User className="w-10 h-10 text-muted-foreground" />
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2 w-full max-w-sm">
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full relative overflow-hidden"
                  onClick={() =>
                    document.getElementById("profile-upload")?.click()
                  }
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload new picture
                </Button>
                <Input
                  id="profile-upload"
                  accept="image/*"
                  required
                  onChange={handleFileChange}
                  className="hidden"
                  name="profilePicture"
                  type="file"
                />
              </div>
              <p className="text-xs text-muted-foreground text-center sm:text-left">
                JPG, GIF or PNG. 1MB max.
              </p>
            </div>
            <Input name="token" type="hidden" value={token} />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4 justify-end">
          <Button
            disabled={isPending || !file}
            className="w-full sm:w-auto"
            type="submit"
            variant="default"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Saving..." : "Save Picture"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
