import {
  ChevronLeft,
  Layers,
} from "lucide-react";
import { APP_MODULES } from "@/app/navigation/modules";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Layers className="h-6 w-6 text-primary shrink-0" />
          {!collapsed && (
            <span className="font-display font-bold text-lg text-foreground tracking-tight">
              SwissKit
            </span>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Módulos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {APP_MODULES.map((module) => (
                <SidebarMenuItem key={module.id}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={module.path}
                      className="hover:bg-sidebar-accent/60"
                      activeClassName="bg-sidebar-accent text-primary font-medium"
                    >
                      <module.icon className="mr-2 h-4 w-4 shrink-0" />
                      {!collapsed && <span>{module.label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
        {!collapsed && (
          <button
            onClick={toggleSidebar}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 w-full"
          >
            <ChevronLeft className="h-3 w-3" />
            Recolher
          </button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
