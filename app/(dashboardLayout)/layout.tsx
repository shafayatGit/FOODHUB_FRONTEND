import DashboardSidebar from "@/components/modules/Dashboard/DashboardSidebar"

export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <DashboardSidebar />
        {children}</body>
    </html>
  )
}
