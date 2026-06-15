"use client"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "@tanstack/react-form"
import { Eye, EyeOff } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Toggle } from "@/components/ui/toggle"
import { Button } from "@/components/ui/button"
import AppField from "@/components/shared/Form/AppField"
import AppSubmitButton from "@/components/shared/Form/AppSubmitButton"
import {
  registerCustomerSchema,
  registerProviderSchema,
  type IRegisterPayload,
} from "@/zod/auth.validation"
import {
  IRegisterActionResult,
  registerCustomerAction,
  registerProviderAction,
} from "@/app/(commonLayout)/(authRouteGroup)/register/_actions"

type Role = "CUSTOMER" | "PROVIDER"

export default function RegisterForm() {
  const router = useRouter()
  const [role, setRole] = useState<Role>("CUSTOMER")
  const [serverError, setServerError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") ?? undefined;

  const { mutateAsync } = useMutation<IRegisterActionResult, unknown, IRegisterPayload>({
    mutationFn: async (payload) => {
      if (payload.role === "CUSTOMER") {
        return registerCustomerAction(payload, redirectPath)
      }

      return registerProviderAction(payload, redirectPath)
    },
  })

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      restaurantName: "",
      description: "",
      address: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null)

      try {
        let payload: IRegisterPayload

        if (role === "CUSTOMER") {
          const parsed = registerCustomerSchema.safeParse({
            name: value.name,
            email: value.email,
            password: value.password,
            role: "CUSTOMER",
          })

          if (!parsed.success) {
            setServerError(parsed.error.issues[0]?.message || "Invalid input")
            return
          }

          payload = parsed.data
        } else if (role === "PROVIDER") {
          const parsed = registerProviderSchema.safeParse({
            name: value.name,
            email: value.email,
            password: value.password,
            role: "PROVIDER",
            restaurantName: value.restaurantName,
            description: value.description,
            address: value.address,
          })

          if (!parsed.success) {
            setServerError(parsed.error.issues[0]?.message || "Invalid input")
            return
          }

          payload = parsed.data
        } else {
          setServerError("Invalid account type")
          return
        }

        const result = await mutateAsync(payload)

        if (!result || result.success === false) {
          setServerError(result?.message || "Registration failed")
          return
        }

        router.push("/login")
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Registration failed"
        setServerError(message)
      }
    },
  })

  return (
    <Card className="w-full max-w-lg mx-auto shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>Select account type and enter details</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="mb-4 flex items-center gap-4 justify-center">
          <Toggle
            pressed={role === "CUSTOMER"}
            onClick={() => setRole("CUSTOMER")}
            className={role === "CUSTOMER" ? "bg-primary" : ""}
          >
            Customer
          </Toggle>
          <Toggle
            pressed={role === "PROVIDER"}
            onClick={() => setRole("PROVIDER")}
            className={role === "PROVIDER" ? "bg-primary" : ""}
          >
            Provider
          </Toggle>
        </div>

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field 
            name="name"
            validators={{ onChange: registerCustomerSchema.shape.name }}
          >
            {(field) => (
              <AppField field={field} label="Full name" placeholder="Your name" />
            )}
          </form.Field>

          <form.Field 
            name="email"
            validators={{ onChange: registerCustomerSchema.shape.email }}
          >
            {(field) => (
              <AppField field={field} label="Email" type="email" placeholder="you@company.com" />
            )}
          </form.Field>

          <form.Field 
            name="password"
            validators={{ onChange: registerCustomerSchema.shape.password }}
          >
            {(field) => (
              <AppField 
                field={field} 
                label="Password" 
                type={showPassword ? "text" : "password"} 
                placeholder="Choose a password" 
                append={
                  <Button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    variant="ghost"
                    size="icon"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4 cursor-pointer" aria-hidden="true" />
                    ) : (
                      <Eye className="size-4" aria-hidden="true" />
                    )}
                  </Button>
                }
              />
            )}
          </form.Field>

          {role === "PROVIDER" && (
            <>
              <form.Field 
                name="restaurantName"
                validators={{ onChange: registerProviderSchema.shape.restaurantName }}
              >
                {(field) => (
                  <AppField field={field} label="Restaurant name" placeholder="My Restaurant" />
                )}
              </form.Field>

              <form.Field name="description">
                {(field) => (
                  <AppField field={field} label="Description" placeholder="Short description" />
                )}
              </form.Field>

              <form.Field 
                name="address"
                validators={{ onChange: registerProviderSchema.shape.address }}
              >
                {(field) => (
                  <AppField field={field} label="Address" placeholder="Street, City" />
                )}
              </form.Field>
            </>
          )}

          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
            {([canSubmit, isSubmitting]) => (
              <div className="pt-2">
                <AppSubmitButton isPending={isSubmitting} disabled={!canSubmit}>
                  Create account
                </AppSubmitButton>
              </div>
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
          onClick={() => {
            router.push("/login");
          }}
        >
          Login as Admin
        </Button>
      </CardContent>

      <CardFooter className="justify-center border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Already have an account? <a href="/login" className="text-primary">Sign in</a>
        </p>
      </CardFooter>
    </Card>
  )
}
