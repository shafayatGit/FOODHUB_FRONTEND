"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { loginAction } from "@/app/(commonLayout)/(authRouteGroup)/login/_actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppField from "../../shared/Form/AppField";
import AppSubmitButton from "../../shared/Form/AppSubmitButton";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";

const LoginForm = () => {
  // const queryClient = useQueryClient();

  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") ?? undefined;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ILoginPayload) => loginAction(payload, redirectPath),
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },

    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = (await mutateAsync(value)) as any;

        if (result && !result.success) {
          setServerError(result.message || "Login failed. Please try again.");
          return;
        }

        // Successful login - redirect to the appropriate dashboard
        if (result && result.success && result.redirectPath) {
          router.push(result.redirectPath);
        }
      } catch (error: any) {
        console.error(`Login failed:`, error);
        setServerError(`Login failed: ${error?.message || "Unexpected error"}`);
      }
    },
  });
  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
        <CardDescription>
          Please enter your credentials to log in.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          method="POST"
          action="#"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="email"
            validators={{ onChange: loginZodSchema.shape.email }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Email"
                type="email"
                placeholder="Enter your email"
              />
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{ onChange: loginZodSchema.shape.password }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Password"
                type={showPassword ? "text" : "password"}
                // type="text"
                placeholder="Enter your password"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="cursor-pointer"
                append={
                  <Button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    variant="ghost"
                    size="icon"
                  >
                    {showPassword ? (
                      <EyeOff
                        className="size-4 cursor-pointer"
                        aria-hidden="true"
                      />
                    ) : (
                      <Eye className="size-4" aria-hidden="true" />
                    )}
                  </Button>
                }
              />
            )}
          </form.Field>

          <div className="text-right mt-2">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline underline-offset-4"
            >
              Forgot password?
            </Link>
          </div>

          {serverError && (
            <Alert variant={"destructive"}>
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <form.Subscribe
            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting || isPending}
                pendingLabel="Logging In...."
                disabled={!canSubmit}
              >
                Log In
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or quick access
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full border-primary/20 bg-primary/5 hover:bg-primary/10 hover:text-primary"
          disabled={isPending}
          onClick={() =>
            form.onSubmit({
              value: {
                email: "foodhubadmin@gmail.com",
                password: "12345Am@",
              },
            } as any)
          }
        >
          Login as Admin
        </Button>
      </CardContent>

      <CardFooter className="justify-center border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary font-medium hover:underline underline-offset-4"
          >
            Sign Up for an account
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
