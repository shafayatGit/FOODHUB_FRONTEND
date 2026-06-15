import { Geist_Mono, Raleway } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import QueryProviders from "@/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/components/modules/Cart/CartProvider";
import { UserProvider } from "@/providers/UserProvider";
import { getUserInfo } from "@/services/auth.services";
import type { Metadata } from "next";

const raleway = Raleway({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})
export const metadata: Metadata = {
  title: "HobbyHub",
  description:
    "A platform for hobbyists to connect, share, and discover new activities. Users can create profiles, join communities, and participate in events.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const userInfo = await getUserInfo();

  
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", raleway.variable)}
    >
      <body className="min-h-full flex flex-col">
        <QueryProviders>
          <ThemeProvider>
            <UserProvider userInfo={userInfo}>
              <CartProvider>{children}</CartProvider>
            </UserProvider>
            <Toaster richColors />
          </ThemeProvider>
        </QueryProviders>
      </body>

    </html>
  )
}
