"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import AppField from "@/components/shared/Form/AppField"
import AppSubmitButton from "@/components/shared/Form/AppSubmitButton"
import { registerCustomerSchema, registerProviderSchema } from "@/zod/auth.validation"

type Role = "CUSTOMER" | "PROVIDER"

export default function RegisterForm() {
  const router = useRouter()
  const [role, setRole] = useState<Role>("CUSTOMER")
  const [serverError, setServerError] = useState<string | null>(null)

  const mutation = useMutation(async (payload: Record<string, unknown>) => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL
    if (!base) throw new Error("API base url missing")
    const res = await fetch(`${base}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    return data
  })

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      restaurantName: "",
      description: "",
      address: "",
      isOpen: true,
      openTime: "",
      closeTime: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null)
      try {
        // validate according to role
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
        } else {
          const parsed = registerProviderSchema.safeParse({
            name: value.name,
            email: value.email,
            password: value.password,
            role: "PROVIDER",
            restaurantName: value.restaurantName,
            description: value.description,
            address: value.address,
            isOpen: !!value.isOpen,
            openTime: value.openTime || null,
            closeTime: value.closeTime || null,
          })
          if (!parsed.success) {
            setServerError(parsed.error.issues[0]?.message || "Invalid input")
            return
          }
        }

        const payload: Record<string, unknown> = {
          name: value.name,
          email: value.email,
          password: value.password,
          role: role,
        }

        if (role === "PROVIDER") {
          payload.restaurantName = value.restaurantName
          payload.description = value.description
          payload.address = value.address
          payload.isOpen = !!value.isOpen
          payload.openTime = value.openTime || null
          payload.closeTime = value.closeTime || null
        }

        const result = await mutation.mutateAsync(payload)

        if (!result || result.success === false) {
          setServerError(result?.message || "Registration failed")
          return
        }

        // on success, redirect to login
        router.push('/login')
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

              <div className="flex gap-4">
                <form.Field name="isOpen">
                  {(field) => (
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={field.value as boolean}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                      <span>Open now</span>
                    </label>
                  )}
                </form.Field>

                <form.Field name="openTime">
                  {(field) => (
                    <AppField field={field} label="Open time" type="time" />
                  )}
                </form.Field>

                <form.Field name="closeTime">
                  {(field) => (
                    <AppField field={field} label="Close time" type="time" />
                  )}
                </form.Field>
              </div>
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
