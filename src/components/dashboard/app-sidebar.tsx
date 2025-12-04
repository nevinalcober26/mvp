import {
  BookOpen,
  LayoutDashboard,
  Archive,
  ShoppingCart,
  Ticket,
  Settings,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';

export const EMenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="6" fill="hsl(var(--primary))"/>
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontFamily="PT Sans, sans-serif" fontSize="16" fontWeight="bold" fill="hsl(var(--primary-foreground))">eM</text>
  </svg>
);

export function AppSidebar() {
  return (
    <Sidebar variant="inset" collapsible="icon" className="border-r">
      <SidebarHeader className="hidden">
        <div className="flex items-center gap-2">
          <EMenuIcon />
          <span className="text-lg font-semibold font-headline">eMenu</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton href="#" isActive tooltip="Dashboard">
              <LayoutDashboard />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="#" tooltip="Menu">
              <BookOpen />
              <span>Menu</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="#" tooltip="Promotions">
              <Ticket />
              <span>Promotions</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="#" tooltip="Orders">
              <ShoppingCart />
              <span>Orders</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="#" tooltip="Inventory">
              <Archive />
              <span>Inventory</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton href="#" tooltip="Settings">
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
