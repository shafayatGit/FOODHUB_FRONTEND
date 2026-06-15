import { Geist_Mono, Raleway } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import QueryProviders from "@/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/components/modules/Cart/CartProvider";

const raleway = Raleway({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", raleway.variable)}
    >
      <body className="min-h-full flex flex-col">
        <QueryProviders>
          <ThemeProvider>
            <CartProvider>{children}</CartProvider>
            <Toaster richColors />
          </ThemeProvider>
        </QueryProviders>
      </body>

    </html>
  )
}
