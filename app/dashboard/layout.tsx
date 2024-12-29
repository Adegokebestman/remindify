import { AppSidebar } from '@/components/Siderbar'
import { Navbar } from '@/components/Navbar'
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex-1 overflow-auto">
          <div className="flex flex-col h-full">
            <Navbar />
            <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4">
              {children}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

