"use client";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { Loader2 } from "lucide-react";
import { useLogin } from "@/lib/mutations/LoginMutation";

type AuthFormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;
  const { trigger, isMutating } = useLogin();

  async function submitAuth(data: AuthFormData) {
    console.log(data);
    toast.promise(trigger(data), {
      loading: "Loading...",
      success: (res) => {
        if (
          res?.message !==
          "We've already sent a verification email. Please check your inbox."
        ) {
          setCookie("academos-logged-in", true);
          router.push("/dashboard");
        }
        return res?.message;
      },
      error: (err) => err.response.data.error,
    });
    reset();
  }

  return (
    <div className="min-h-screen flex items-stretch bg-gray-50">
      {/* LEFT — FORM */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6">
        <form
          onSubmit={handleSubmit((data) => submitAuth(data as AuthFormData))}
          className="w-full max-w-md"
        >
          <div className="relative rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] p-8 space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-gray-900">
                Welcome back 👋
              </h1>
              <p className="text-sm text-gray-500">
                Sign in to continue to your account
              </p>
            </div>

            {/* Inputs */}
            <div className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email address
                </label>
                <Input
                  {...register("email", {
                    required: true,
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  type="email"
                  placeholder="you@example.com"
                  className="h-11 rounded-xl border-gray-300 focus:border-[#3DCBB1] focus:ring-[#3DCBB1]"
                />
                {errors?.email?.message && (
                  <p className="text-xs text-red-500">
                    {errors.email.message as string}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <PasswordInput
                  {...register("password", {
                    required: true,
                    min: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="h-11 rounded-xl"
                />
                {errors?.password?.message && (
                  <p className="text-xs text-red-500">
                    {errors.password.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Submit */}
            <Button
              disabled={isMutating}
              type="submit"
              className="h-11 w-full rounded-xl bg-[#3DCBB1] hover:bg-[#36b19a] transition-all font-medium shadow-lg shadow-[#3DCBB1]/30"
            >
              {isMutating && <Loader2 className="animate-spin" />}
              {isMutating ? "Signning in..." : "Sign in"}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            {/* OAuth */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-11 rounded-xl border-gray-300 hover:bg-gray-50"
              >
                <Image
                  src="/icons/google.png"
                  alt="Google"
                  width={18}
                  height={18}
                  className="mr-2"
                />
                Google
              </Button>

              <Button
                variant="outline"
                className="h-11 rounded-xl border-gray-300 hover:bg-gray-50"
              >
                <Image
                  src="/icons/github.svg"
                  alt="GitHub"
                  width={18}
                  height={18}
                  className="mr-2"
                />
                GitHub
              </Button>
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-gray-600">
              Don’t have an account?
              <Link
                href="/auth/sign-up"
                className="ml-1 font-medium text-[#3DCBB1] hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* RIGHT — IMAGE */}
      <div className="relative hidden lg:block w-1/2">
        <Image
          src="/assets/login.jpg"
          alt="Login"
          fill
          className="object-cover"
          priority
        />
        {/* Optional overlay */}
        <div className="absolute inset-0 bg-black/10" />
      </div>
    </div>
  );
};

export default LoginPage;
