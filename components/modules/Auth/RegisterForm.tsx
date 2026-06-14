"use client"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "@tanstack/react-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Toggle } from "@/components/ui/toggle"
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

type RegisterFormValues = {
  name: string
  email: string
  password: string
  restaurantName: string
  description: string
  address: string
}

export default function RegisterForm() {
  const router = useRouter()
  const [role, setRole] = useState<Role>("CUSTOMER")
  const [serverError, setServerError] = useState<string | null>(null)
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") ?? undefined;

  const { mutateAsync, isPending } = useMutation<IRegisterActionResult, unknown, IRegisterPayload>({
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
        }

        const result = await mutateAsync(payload)

        if (!result || result.success === false) {
          setServerError(result?.message || "Registration failed")
          return
        }

        router.push("/login")
      } catch (err: any) {
        setServerError(err?.message || "Registration failed")
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
            className={role === "CUSTOMER" ? "bg-primary text-white" : ""}
          >
            Customer
          </Toggle>
          <Toggle
            pressed={role === "PROVIDER"}
            onClick={() => setRole("PROVIDER")}
            className={role === "PROVIDER" ? "bg-primary text-white" : ""}
          >
            Provider
          </Toggle>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field name="name">
            {(field) => (
              <AppField field={field} label="Full name" placeholder="Your name" />
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <AppField field={field} label="Email" type="email" placeholder="you@company.com" />
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <AppField field={field} label="Password" type="password" placeholder="Choose a password" />
            )}
          </form.Field>

          {role === "PROVIDER" && (
            <>
              <form.Field name="restaurantName">
                {(field) => (
                  <AppField field={field} label="Restaurant name" placeholder="My Restaurant" />
                )}
              </form.Field>

              <form.Field name="description">
                {(field) => (
                  <AppField field={field} label="Description" placeholder="Short description" />
                )}
              </form.Field>

              <form.Field name="address">
                {(field) => (
                  <AppField field={field} label="Address" placeholder="Street, City" />
                )}
              </form.Field>

              
            </>
          )}

          {serverError && <div className="text-destructive">{serverError}</div>}

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
      </CardContent>

      <CardFooter className="justify-center border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Already have an account? <a href="/login" className="text-primary">Sign in</a>
        </p>
      </CardFooter>
    </Card>
  )
}
