'use client';
import {
  PieChart,
  Settings,
  Briefcase,
  ClipboardList,
  Plug,
  Plus,
  Minus,
  LayoutDashboard,
  Search,
  Rocket,
  CircleHelp,
  ChevronDown,
  PlusCircle,
  Loader2,
  BarChart,
  TrendingUp,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import NextLink from 'next/link';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { mockBranches, type Branch } from '@/lib/mock-data-store';
import { useToast } from '@/hooks/use-toast';

export const EMenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.0"
    viewBox="0 0 1896 592"
    width="240"
    height="76"
  >
    <path
      fill="black"
      d="M474 167v19h42v-38h-42zm69 0v19h310v-38H543zm-69 89.5V275h42v-37h-42zm69 0V275h152v-37H543zm-69 90V365h42v-37h-42zm69 0V365h76v-37h-76z"
    />
    <path
      fill="black"
      fillOpacity=".6"
      d="M516.4 167c0 10.7.2 15.1.3 9.7.2-5.3.2-14.1 0-19.5-.1-5.3-.3-.9-.3 9.8m0 89.5c0 10.4.2 14.6.3 9.2.2-5.4.2-13.9 0-19-.1-5.1-.3-.7-.3 9.8m0 90c0 10.4.2 14.6.3 9.2.2-5.4.2-13.9 0-19-.1-5.1-.3-.7-.3 9.8"
    />
    <path
      fill="black"
      fillOpacity=".7"
      d="M542.4 167c0 10.7.2 15.1.3 9.7.2-5.3.2-14.1 0-19.5-.1-5.3-.3-.9-.3 9.8m0 89.5c0 10.4.2 14.6.3 9.2.2-5.4.2-13.9 0-19-.1-5.1-.3-.7-.3 9.8m153 0c0 10.4.2 14.6.3 9.2.2-5.4.2-13.9 0-19-.1-5.1-.3-.7-.3 9.8m-153 90c0 10.4.2 14.6.3 9.2.2-5.4.2-13.9 0-19-.1-5.1-.3-.7-.3 9.8"
    />
    <path
      fillOpacity=".5"
      fill="black"
      d="M853.4 167c0 10.7.2 15.1.3 9.7.2-5.3.2-14.1 0-19.5-.1-5.3-.3-.9-.3 9.8m-369.1 70.7c5.9.2 15.5.2 21.5 0 5.9-.1 1-.3-10.8-.3s-16.7.2-10.7.3m96.5 0c21 .2 55.4.2 76.5 0 21-.1 3.8-.2-38.3-.2s-59.3.1-38.2.2m-96.5 128c5.9.2 15.5.2 21.5 0 5.9-.1 1-.3-10.8-.3s-16.7.2-10.7.3m77.5 0c10.5.2 27.9.2 38.5 0 10.5-.1 1.9-.2-19.3-.2s-29.8.1-19.2.2"
    />
    <path
      fillOpacity=".3"
      fill="black"
      d="M484.3 186.7c5.9.2 15.5.2 21.5 0 5.9-.1 1-.3-10.8-.3s-16.7.2-10.7.3m136 0c42.7.2 112.7.2 155.5 0 42.7-.1 7.7-.2-77.8-.2s-120.5.1-77.7.2"
    />
    <path
      fillOpacity=".1"
      fill="black"
      d="M859.5 296.5c0 38.5.1 54.1.2 34.7.2-19.5.2-51 0-70-.1-19.1-.2-3.2-.2 35.3m158 0c0 38.5.1 54.1.2 34.7.2-19.5.2-51 0-70-.1-19.1-.2-3.2-.2 35.3m205.8-41.8c.4.3 1 .3 1.4 0 .3-.4 0-.7-.7-.7s-1 .3-.7.7m72.1 35.3c0 19 .2 26.7.3 17.2.2-9.4.2-25 0-34.5-.1-9.4-.3-1.7-.3 17.3m-35.4-24.5c1.3 1.4 2.6 2.5 2.8 2.5.3 0-.5-1.1-1.8-2.5s-2.6-2.5-2.8-2.5c-.3 0 .5 1.1 1.8 2.5m-436 .8c0 .2 1.5 1.6 3.3 3.3l3.2 2.9-2.9-3.3c-2.8-3-3.6-3.7-3.6-2.9m225.4 2.9-1.9 2.3 2.3-1.9c2.1-1.8 2.7-2.6 1.9-2.6-.2 0-1.2 1-2.3 2.2m-264.1 12.5c.9.2 2.3.2 3 0 .6-.3-.1-.5-1.8-.5-1.6 0-2.2.2-1.2.5m303 0c.9.2 2.5.2 3.5 0 .9-.3-.1-.5-1.8-.5s-2.7.2-1.7.5m184.8 14.9c0 1.1.3 1.4.6.6.3-.7.2-1.6-.1-1.9-.3-.4-.6.2-.5 1.3M1145 301c0 .7.3 1 .7.7.3-.4.3-1 0-1.4-.4-.3-.7 0-.7.7m-110.9 6.6c0 1.1.3 1.4.6.6.3-.7.2-1.6-.1-1.9-.3-.4-.6.2-.5 1.3m0 7c0 1.1.3 1.4.6.6.3-.7.2-1.6-.1-1.9-.3-.4-.6.2-.5 1.3M731 321c0 .7.3 1 .7.7.3-.4.3-1 0-1.4-.4-.3-.7 0-.7.7m108 9c0 .7.3 1 .7.7.3-.4.3-1 0-1.4-.4-.3-.7 0-.7.7m496.5 3c1 1.1 2 2 2.3 2s-.3-.9-1.3-2-2-2-2.3-2 .3.9 1.3 2m-565 1c.3.5.8 1 1.1 1s.2-.5-.1-1c-.3-.6-.8-1-1.1-1s-.2.4.1 1m28.4.7c-1.3 1.6-1.2 1.7.4.4s2.1-2.1 1.3-2.1c-.2 0-1 .8-1.7 1.7m550.9 4c.6.2 1.8.2 2.5 0 .6-.3.1-.5-1.3-.5s-1.9.2-1.2.5m-257.5 1c.4.3 1 .3 1.4 0 .3-.4 0-.7-.7-.7s-1 .3-.7.7m-266.4 13-2.4 2.8 2.8-2.4c1.5-1.4 2.7-2.6 2.7-2.8 0-.8-.8-.1-3.1 2.4m-80.9-1.3c0 .2.8 1 1.8 1.7 1.5 1.3 1.6 1.2.3-.4s-2.1-2.1-2.1-1.3m622.4 4.8-2.9 3.3 3.3-2.9c3-2.8 3.7-3.6 2.9-3.6-.2 0-1.6 1.5-3.3 3.2m-314.9-1.2c.3.5.8 1 1.1 1s.2-.5-.1-1c-.3-.6-.8-1-1.1-1s-.2.4.1 1m284.3 12.7c1.2.2 3 .2 4 0 .9-.3-.1-.5-2.3-.4-2.2 0-3 .2-1.7.4"
    />
    <path
      fillOpacity=".8"
      fill="black"
      d="M869.8 227.7c5.6.2 14.8.2 20.5 0 5.6-.1 1-.3-10.3-.3s-15.9.2-10.2.3m118 0c5.7.2 14.7.2 20 0 5.3-.1.7-.3-10.3-.3s-15.4.2-9.7.3m-206.5 27c.4.3 1 .3 1.4 0 .3-.4 0-.7-.7-.7s-1 .3-.7.7m10 0c.4.3 1 .3 1.4 0 .3-.4 0-.7-.7-.7s-1 .3-.7.7m294 0c.4.3 1 .3 1.4 0 .3-.4 0-.7-.7-.7s-1 .3-.7.7m9 0c.4.3 1 .3 1.4 0 .3-.4 0-.7-.7-.7s-1 .3-.7.7m311.2 56.3c0 30.5.1 43 .2 27.7.2-15.2.2-40.2 0-55.5-.1-15.2-.2-2.7-.2 27.8m-148-47c.3.5.8 1 1.1 1s.2-.5-.1-1c-.3-.6-.8-1-1.1-1s-.2.4.1 1m-434 3c.3.5.8 1 1.1 1s.2-.5-.1-1c-.3-.6-.8-1-1.1-1s-.2.4.1 1m226.4 2.7-2.4 2.8 2.8-2.4c1.5-1.4 2.7-2.6 2.7-2.8 0-.8-.8-.1-3.1 2.4m211.6-1.7c.3.5.8 1 1.1 1s.2-.5-.1-1c-.3-.6-.8-1-1.1-1s-.2.4.1 1m-132 1c.3.5.8 1 1.1 1s.2-.5-.1-1c-.3-.6-.8-1-1.1-1s-.2.4.1 1m-301 3c.3.5.8 1 1.1 1s.2-.5-.1-1c-.3-.6-.8-1-1.1-1s-.2.4.1 1m275 13c.3.5.8 1 1.1 1s.2-.5-.1-1c-.3-.6-.8-1-1.1-1s-.2.4.1 1m168.5 8c0 .7.3 1 .7.7.3-.4.3-1 0-1.4-.4-.3-.7 0-.7.7m-496.7 7.7c5.9.2 15.5.2 21.5 0 5.9-.1 1-.3-10.8-.3s-16.7.2-10.7.3m304 0c5.9.2 15.5.2 21.5 0 5.9-.1 1-.3-10.8-.3s-16.7.2-10.7.3M841 305c0 .7.3 1 .7.7.3-.4.3-1 0-1.4-.4-.3-.7 0-.7.7m-109.8 6c0 1.9.2 2.7.5 1.7.2-.9.2-2.5 0-3.5-.3-.9-.5-.1-.5 1.8m109.8 2c0 .7.3 1 .7.7.3-.4.3-1 0-1.4-.4-.3-.7 0-.7.7m-76.3 5.7c-.5.7 29.1.7 63.3 0 7.4-.1-3.7-.4-24.7-.5s-38.4.1-38.6.5m323.1 0c10.5.2 27.9.2 38.5 0 10.5-.1 1.9-.2-19.3-.2s-29.8.1-19.2.2M1296 327c0 .7.3 1 .7.7.3-.4.3-1 0-1.4-.4-.3-.7 0-.7.7m-223.5 6c.3.5.8 1 1.1 1s.2-.5-.1-1c-.3-.6-.8-1-1.1-1s-.2.4.1 1m261.5-.6c0 .2.8 1 1.8 1.7 1.5 1.3 1.6 1.2.3-.4s-2.1-2.1-2.1-1.3m-535.1 3.3c-1.3 1.6-1.2 1.7.4.4.9-.7 1.7-1.5 1.7-1.7 0-.8-.8-.3-2.1 1.3m276.6.3c.3.5.8 1 1.1 1s.2-.5-.1-1c-.3-.6-.8-1-1.1-1s-.2.4.1 1m-250.1 16.2-2.9 3.3 3.3-2.9c1.7-1.7 3.2-3.1 3.2-3.3 0-.8-.8-.3-2.1 1.3m-78.4.3c1.3 1.4 2.6 2.5 2.8 2.5c-.3 0 .5 1.1 1.8 2.5s2.6 2.5 2.8 2.5c.3 0-.5-1.1-1.8-2.5m622.4.7c-.4.7-.3.8.4.4 1.2-.7 1.6-1.6.8-1.6-.3 0-.8.5-1.2 1.2m-315.9 1.8c.3.5.8 1 1.1 1s.2-.5-.1-1c-.3-.6-.8-1-1.1-1s-.2.4.1 1"
    />
    <path
      fill="black"
      d="M474 167v19h42v-38h-42zm69 0v19h310v-38H543zm-69 89.5V275h42v-37h-42zm69 0V275h152v-37H543zm-69 90V365h42v-37h-42zm69 0V365h76v-37h-76z"
    />
    <text x="950" y="380" fontFamily="PT Sans, sans-serif" fontSize="300" fontWeight="bold" fill="black">eMenu</text>
  </svg>
);

interface SidebarItem {
  label: string;
  id: string;
  path?: string;
  icon: any;
  items?: { label: string; path: string }[];
}

const OVERVIEW: SidebarItem[] = [
  { label: 'Dashboard', id: 'dashboard', path: '/dashboard', icon: PieChart },
  { label: 'Analytics', id: 'analytics', path: '/dashboard/reports/staff-performance', icon: BarChart },
  { 
    label: 'Reports', 
    id: 'reports', 
    icon: TrendingUp, 
    items: [
      { label: 'Order Report', path: '/dashboard/reports/payments' },
      { label: 'Split Bill Report', path: '/dashboard/reports/split-bills' },
      { label: 'Tips Report', path: '/dashboard/reports/tips-and-charges' },
    ] 
  },
];

const MANAGEMENT: SidebarItem[] = [
  {
    label: 'Catalog',
    id: 'catalog',
    icon: Briefcase,
    items: [
        { label: 'Menu Builder', path: '/dashboard/catalog/categories' },
        { label: 'Products', path: '/dashboard/products' },
        { label: 'Variations', path: '/dashboard/catalog/variations' },
        { label: 'Properties', path: '/dashboard/catalog/properties' },
        { label: 'Combo Groups', path: '/dashboard/catalog/combo-groups' },
    ],
  },
  {
    label: 'Operations',
    id: 'operations',
    icon: Briefcase,
    items: [{ label: 'QR Code', path: '/dashboard/operations/qr-code' }],
  },
  {
    label: 'Orders',
    id: 'orders',
    icon: ClipboardList,
    items: [{ label: 'All Orders', path: '/dashboard/orders' }],
  },
  {
    label: 'Settings',
    id: 'settings',
    icon: Settings,
    items: [{ label: 'Manage Restaurants', path: '/dashboard/categories' }],
  },
];

const CONNECTIONS: SidebarItem[] = [
  { 
    label: 'Integration', 
    id: 'integration', 
    icon: Plug, 
    items: [
      { label: 'POS', path: '/dashboard/integration/pos' },
      { label: 'Payment Gateway', path: '/dashboard/integration/payment-gateway' },
    ] 
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenus, setActiveMenu] = useState<string[]>([]);
  const [isBranchSwitcherOpen, setIsBranchSwitcherOpen] = useState(false);
  const [isBranchSearching, setIsBranchSearching] = useState(false);
  const [branchSearchQuery, setBranchSearchQuery] = useState('');
  const [activeBranch, setActiveBranch] = useState(mockBranches[0]);
  const [isBranchLoading, setIsBranchLoading] = useState(false);

  useEffect(() => {
    // Initial load from local storage
    const savedBranch = localStorage.getItem('activeBranch');
    if (savedBranch) {
      try {
        const branchData = JSON.parse(savedBranch);
        const match = mockBranches.find(b => b.id === branchData.id);
        if (match) setActiveBranch(match);
      } catch (e) {
        // Fallback to default
      }
    }

    // Sync when branch is changed from Manage Restaurant page
    const syncBranch = () => {
      setIsBranchLoading(true);
      const updatedBranch = localStorage.getItem('activeBranch');
      if (updatedBranch) {
        try {
          const branchData = JSON.parse(updatedBranch);
          const match = mockBranches.find(b => b.id === branchData.id);
          if (match) setActiveBranch(match);
        } catch (e) {}
      }
      setTimeout(() => setIsBranchLoading(false), 800);
    };

    window.addEventListener('branch-changed', syncBranch);
    return () => window.removeEventListener('branch-changed', syncBranch);
  }, []);

  useEffect(() => {
    const allGroups = [...OVERVIEW, ...MANAGEMENT, ...CONNECTIONS];
    const currentGroup = allGroups.find(group => 
      group.items?.some(sub => pathname.startsWith(sub.path))
    );
    if (currentGroup) {
      setActiveMenu([currentGroup.id]);
    }
  }, [pathname]);

  const handleMenuToggle = (menu: string) => {
    setActiveMenu((prev) => 
      prev.includes(menu) ? [] : [menu]
    );
  };

  const sortedAndFilteredBranches = useMemo(() => {
    const filtered = mockBranches.filter((branch) =>
      branch.name.toLowerCase().includes(branchSearchQuery.toLowerCase()) ||
      branch.type.toLowerCase().includes(branchSearchQuery.toLowerCase())
    );
    
    // Sort so the currently selected branch is always first
    return [...filtered].sort((a, b) => {
      if (a.id === activeBranch.id) return -1;
      if (b.id === activeBranch.id) return 1;
      return 0;
    });
  }, [branchSearchQuery, activeBranch.id]);

  const renderSidebarItem = (item: SidebarItem) => {
    const isExpanded = activeMenus.includes(item.id);
    const hasSubItems = item.items && item.items.length > 0;
    const isActiveGroup = hasSubItems && item.items.some(sub => pathname.startsWith(sub.path));

    return (
      <SidebarMenuItem key={item.id}>
        {hasSubItems ? (
          <Collapsible
            open={isExpanded}
            onOpenChange={() => handleMenuToggle(item.id)}
          >
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                isActive={isActiveGroup}
                className={cn(
                  "w-full transition-colors",
                  isActiveGroup && "bg-sidebar-primary text-primary font-semibold"
                )}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    <item.icon className={cn("h-4 w-4", isActiveGroup && "text-primary")} />
                    <span className="group-data-[collapsible=icon]:hidden">
                      {item.label}
                    </span>
                  </div>
                  <div className="h-5 w-5 border flex items-center justify-center rounded-sm bg-background/50 group-data-[collapsible=icon]:hidden">
                    {isExpanded ? (
                      <Minus className="h-3 w-3" />
                    ) : (
                      <Plus className="h-3 w-3" />
                    )}
                  </div>
                </div>
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent className="animate-collapsible">
              <SidebarMenuSub className="relative ml-6 border-l pl-0">
                {item.items?.map((subItem) => {
                  const isActive = pathname.startsWith(subItem.path);
                  return (
                    <SidebarMenuSubItem key={subItem.label} className="flex items-center">
                      <div className="relative flex items-center w-full h-9">
                        <div className={cn(
                          "absolute left-[-1.5px] top-1/2 -translate-y-1/2 w-[3px] h-3 rounded-full transition-colors",
                          isActive ? "bg-primary" : "bg-transparent"
                        )} />
                        <NextLink 
                          href={subItem.path} 
                          className={cn(
                            "flex-1 px-6 text-sm transition-colors",
                            isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {subItem.label}
                        </NextLink>
                      </div>
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <SidebarMenuButton
            asChild
            isActive={pathname === item.path}
            tooltip={item.label}
          >
            <NextLink href={item.path || '#'}>
              <item.icon />
              <span className="group-data-[collapsible=icon]:hidden">
                {item.label}
              </span>
            </NextLink>
          </SidebarMenuButton>
        )}
      </SidebarMenuItem>
    );
  };

  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 z-[45] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out pointer-events-none",
          isBranchSwitcherOpen ? "opacity-100" : "opacity-0"
        )} 
      />

      <Sidebar variant="sidebar" collapsible="icon" className="border-r">
        <SidebarHeader className="relative flex h-auto flex-col items-center justify-center gap-4 p-4 pb-2">
          <div className="flex w-full items-center justify-center">
            <div className="group-data-[collapsible=icon]:hidden">
              <EMenuIcon />
            </div>
            <div className="hidden group-data-[collapsible=icon]:block">
              <LayoutDashboard className="h-6 w-6" />
            </div>
          </div>

        </SidebarHeader>

        <SidebarContent className="p-0 pb-4">
          <SidebarGroup id="sidebar-nav">
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden uppercase tracking-wider text-[10px] font-bold">
              Overview
            </SidebarGroupLabel>
            <SidebarMenu>
              {OVERVIEW.map(renderSidebarItem)}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarSeparator className="mx-4 my-4 group-data-[collapsible=icon]:hidden opacity-50" />

          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden uppercase tracking-wider text-[10px] font-bold">
              Management
            </SidebarGroupLabel>
            <SidebarMenu>
              {MANAGEMENT.map(renderSidebarItem)}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarSeparator className="mx-4 my-4 group-data-[collapsible=icon]:hidden opacity-50" />

          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden uppercase tracking-wider text-[10px] font-bold">
              Connections
            </SidebarGroupLabel>
            <SidebarMenu>
              {CONNECTIONS.map(renderSidebarItem)}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="flex flex-col gap-2 p-4 bg-[#0a1414] rounded-tl-[24px] rounded-tr-[24px] relative z-[50]">
          <div className="group-data-[collapsible=icon]:hidden" id="branch-switcher">
            <DropdownMenu 
              open={isBranchSwitcherOpen} 
              onOpenChange={(open) => {
                setIsBranchSwitcherOpen(open);
                if (!open) {
                  setIsBranchSearching(false);
                  setBranchSearchQuery('');
                }
              }}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex h-auto w-full items-center justify-between gap-2 rounded-xl bg-[#142424] p-3 text-left text-white hover:bg-[#1a2e2e] border border-white/5 transition-all shadow-xl",
                    isBranchLoading && "animate-pulse"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <TooltipProvider>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <div className="relative shrink-0 cursor-pointer">
                            <div 
                              className="h-11 w-11 rounded-full p-[2px] flex items-center justify-center transition-transform hover:scale-105"
                              style={{ background: 'conic-gradient(from 0deg, #18B4A6, #4ade80, #facc15, #fb923c, #18B4A6)' }}
                            >
                              <div className="h-full w-full rounded-full bg-[#142424] p-[1.5px] flex items-center justify-center overflow-hidden">
                                {isBranchLoading ? (
                                  <Loader2 className="h-5 w-5 text-[#18B4A6] animate-spin" />
                                ) : (
                                  <Image
                                    src="https://picsum.photos/seed/brand/100/100"
                                    width={40}
                                    height={40}
                                    alt="Brand logo"
                                    className="rounded-full object-cover grayscale brightness-110"
                                  />
                                )}
                              </div>
                            </div>
                            <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border-2 border-[#142424]"></span>
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-[#18B4A6] text-white border-0 font-bold text-xs px-3 py-1.5 rounded-lg shadow-xl">
                          Check the live menu
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <div className="flex flex-col overflow-hidden">
                      <span className="truncate text-[11px] font-black uppercase tracking-[0.18em] text-[#18B4A6]">
                        BLOOMSBURY&apos;S
                      </span>
                      <h4 className="truncate text-[17px] font-black text-white tracking-tight leading-tight">
                        {isBranchLoading ? "Loading..." : activeBranch.name.replace("Bloomsbury's - ", "")}
                      </h4>
                    </div>
                  </div>
                  <ChevronDown className={cn("h-4 w-4 text-white/40 transition-transform duration-200", isBranchSwitcherOpen && "rotate-180")} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuPortal>
                <DropdownMenuContent
                  align="start"
                  side="top"
                  className="mb-4 w-[280px] border-gray-200 bg-white text-gray-900 p-0 overflow-hidden shadow-2xl rounded-2xl animate-in slide-in-from-bottom-2 duration-300"
                >
                  <div 
                    className="p-5 border-b bg-gray-50/50 flex items-center justify-between min-h-[73px]"
                    onMouseLeave={() => {
                      setIsBranchSearching(false);
                      setBranchSearchQuery('');
                    }}
                  >
                    {!isBranchSearching ? (
                      <>
                        <DropdownMenuLabel className="p-0 text-xl font-black tracking-tight text-gray-900">Select a Branch</DropdownMenuLabel>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full hover:bg-gray-200 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsBranchSearching(true);
                          }}
                        >
                          <Search className="h-4 w-4 text-gray-500" />
                        </Button>
                      </>
                    ) : (
                      <div className="flex items-center w-full gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
                        <Search className="h-4 w-4 text-gray-400 shrink-0" />
                        <Input
                          autoFocus
                          placeholder="Search branches..."
                          value={branchSearchQuery}
                          onChange={(e) => setBranchSearchQuery(e.target.value)}
                          className="h-9 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 text-gray-900 placeholder:text-gray-400 font-bold"
                        />
                      </div>
                    )}
                  </div>
                  
                  <ScrollArea className="h-[220px]">
                    <div className="p-2">
                      {sortedAndFilteredBranches.length > 0 ? (
                        sortedAndFilteredBranches.map((branch) => (
                          <DropdownMenuItem 
                            key={branch.id} 
                            onClick={() => {
                              if (branch.id === activeBranch.id) {
                                setIsBranchSwitcherOpen(false);
                                return;
                              }

                              toast({
                                title: "Switching Outlet",
                                description: `Accessing data for ${branch.name.replace("Bloomsbury's - ", "")}...`,
                              });

                              setActiveBranch(branch);
                              setIsBranchSwitcherOpen(false);
                              localStorage.setItem('activeBranch', JSON.stringify({
                                id: branch.id,
                                name: branch.name.replace("Bloomsbury's - ", ""),
                                type: branch.type
                              }));
                              window.dispatchEvent(new CustomEvent('branch-changed'));
                            }}
                            className={cn(
                              "cursor-pointer focus:bg-primary/5 p-3 rounded-xl flex items-center justify-between transition-all group mb-1",
                              branch.id === activeBranch.id ? "bg-primary/5 border border-primary/10" : "border border-transparent"
                            )}
                          >
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-sm text-gray-900 truncate group-hover:text-primary transition-colors">{branch.name}</span>
                              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 truncate">{branch.type}</span>
                            </div>
                            {branch.id === activeBranch.id && (
                              <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(24,180,166,0.5)]" />
                            )}
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <div className="p-8 text-center text-sm text-muted-foreground">
                          No branches found matching &quot;{branchSearchQuery}&quot;
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  <div className="p-2 bg-gray-50/80 border-t">
                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-white p-3 rounded-xl flex items-center gap-3 text-primary font-black text-sm border border-transparent hover:border-primary/20 transition-all">
                      <NextLink href="/dashboard/categories/new">
                        <PlusCircle className="h-5 w-5" />
                        <span>Add New Branch</span>
                      </NextLink>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenu>
          </div>
          <div className="hidden group-data-[collapsible=icon]:block">
            <NextLink href="#">
              <div className="relative">
                <div 
                  className="h-9 w-9 rounded-full p-[1.5px] flex items-center justify-center"
                  style={{ background: 'conic-gradient(from 0deg, #18B4A6, #4ade80, #facc15, #fb923c, #18B4A6)' }}
                >
                  <div className="h-full w-full rounded-full bg-[#142424] flex items-center justify-center overflow-hidden">
                    <Image
                      src="https://picsum.photos/seed/brand/100/100"
                      width={32}
                      height={32}
                      alt="Restaurant logo"
                      className="rounded-full object-cover"
                    />
                  </div>
                </div>
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 border border-gray-800"></span>
                </span>
              </div>
            </NextLink>
          </div>

          <div className="group-data-[collapsible=icon]:hidden mt-2 border-t border-white/5 pt-2">
            <SidebarMenu className="px-0">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Help"
                  size="sm"
                  className="h-9 justify-start text-white/70 hover:text-white hover:bg-white/5 font-medium transition-colors"
                >
                  <NextLink href="#">
                    <CircleHelp className="h-4 w-4 mr-3 !text-[#18B4A6]" />
                    <span className="group-data-[collapsible=icon]:hidden">
                      Help Center
                    </span>
                  </NextLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
