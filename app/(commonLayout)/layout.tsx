import PublicFooter from "@/components/modules/Common/PublicFooter";
import PublicHeader from "@/components/modules/Common/PublicHeader";

export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-svh flex-col">
      <PublicHeader />
      <main className="flex-1 pt-16">{children}</main>
      <PublicFooter />
    </div>
  )
}
