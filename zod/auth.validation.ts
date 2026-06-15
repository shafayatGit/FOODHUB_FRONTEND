import { z } from "zod";

export const loginZodSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[@$!%*?&]/,
      "Password must contain at least one special character (@, $, !, %, *, ?, &)",
    ),
});

export type ILoginPayload = z.infer<typeof loginZodSchema>;

// Registration schemas (for JSON validation)
export const registerCustomerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: loginZodSchema.shape.password,
  role: z.literal("CUSTOMER"),
});

export const registerProviderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: loginZodSchema.shape.password,
  role: z.literal("PROVIDER"),
  restaurantName: z.string().min(1, "Restaurant name is required"),
  description: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  isOpen: z.boolean().optional(),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
});

export const registerSchema = z.union([registerCustomerSchema, registerProviderSchema]);

export type IRegisterCustomerPayload = z.infer<typeof registerCustomerSchema>;
export type IRegisterProviderPayload = z.infer<typeof registerProviderSchema>;
export type IRegisterPayload = z.infer<typeof registerSchema>;

// FormData types for file uploads
export interface IRegisterCustomerFormData {
  name: string;
  email: string;
  password: string;
  role: "CUSTOMER";
  image?: File;
}

export interface IRegisterProviderFormData {
  name: string;
  email: string;
  password: string;
  role: "PROVIDER";
  restaurantName: string;
  description?: string;
  address: string;
  isOpen?: boolean;
  openTime?: string;
  closeTime?: string;
  image?: File;
}
