import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { CommandPalette } from "@/components/CommandPalette";

interface AppLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: string[];
}

export function AppLayout({ children, breadcrumbs }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="app-shell flex w-full">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col px-3 py-3 md:px-4 md:py-4">
          <div className="app-main-surface min-h-[calc(100svh-1.5rem)]">
            <AppHeader breadcrumbs={breadcrumbs} />
            <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
          </div>
        </div>
      </div>
      <CommandPalette />
    </SidebarProvider>
  );
}
