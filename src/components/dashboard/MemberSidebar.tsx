import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  Bell,
  Settings,
  CreditCard,
  Code2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const memberMenuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Clientes",
    url: "/dashboard/clients",
    icon: Users,
  },
  {
    title: "Projetos",
    url: "/dashboard/projects",
    icon: FolderKanban,
  },
  {
    title: "Contratos",
    url: "/dashboard/contracts",
    icon: FileText,
  },
  {
    title: "Notificações",
    url: "/dashboard/notifications",
    icon: Bell,
  },
];

const settingsItems = [
  {
    title: "Perfil",
    url: "/dashboard/profile",
    icon: Settings,
  },
  {
    title: "Assinatura",
    url: "/dashboard/subscription",
    icon: CreditCard,
  },
];

export function MemberSidebar() {
  const location = useLocation();
  const { profile } = useAuth();

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center">
            <Code2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm">DevManager Pro</span>
            <Badge variant="secondary" className="w-fit text-xs">
              Membro
            </Badge>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {memberMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <RouterNavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </RouterNavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Configurações</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <RouterNavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </RouterNavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="text-xs text-muted-foreground">
          Logado como <span className="font-medium">{profile?.full_name}</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
