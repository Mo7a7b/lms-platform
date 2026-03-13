"use client";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Loader2 } from "lucide-react";
import { useAuthData } from "@/hooks/useAuthData";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const UpdatePasswordForm = ({ action }: { action: App.ActionFunction }) => {
  const { token } = useAuthData();
  const [isValidated, setIsValidated] = useState(false);
  const initialState: App.FormState = {
    message: "",
  };
  const [state, formAction, isPending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const prevMessageRef = useRef<string>("");
  const { register, watch } = useForm();

  useEffect(() => {
    if (
      state &&
      "message" in state &&
      state.message &&
      state.message !== prevMessageRef.current
    ) {
      if (state.message === "Password updated successfully") {
        toast.success(state.message);
        formRef.current?.reset();
      } else {
        toast.error(state.message);
      }
      prevMessageRef.current = state && "message" in state ? state.message : "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state && "message" in state ? state.message : ""]);
  const oldPassword = watch("oldPassword");
  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  useEffect(() => {
    if (
      oldPassword &&
      newPassword &&
      confirmPassword &&
      newPassword === confirmPassword &&
      newPassword.length >= 6 &&
      oldPassword.length >= 6 &&
      confirmPassword.length >= 6
    ) {
      setIsValidated(true);
    } else {
      setIsValidated(false);
    }
  }, [oldPassword, newPassword, confirmPassword]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>
          Change your password here. After saving, you&apos;ll be logged out.
        </CardDescription>
      </CardHeader>
      <form ref={formRef} action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="oldPassword">Current Password</Label>
            <Input
              {...register("oldPassword", { minLength: 6, required: true })}
              type="password"
              id="oldPassword"
              name="oldPassword"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              {...register("newPassword", { minLength: 6, required: true })}
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              {...register("confirmPassword", {
                minLength: 6,
                required: true,
                validate: (value) => value === newPassword,
              })}
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
            />
          </div>
          <Input type="hidden" name="token" value={token} />
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button
            disabled={isPending || !isValidated}
            className="w-full sm:w-auto"
            type="submit"
            variant="default"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Updating Password..." : "Save Password"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default UpdatePasswordForm;
