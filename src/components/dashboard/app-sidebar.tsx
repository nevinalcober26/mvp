'use client';
import {
  PieChart,
  BarChart,
  Settings,
  ClipboardList,
  LayoutDashboard,
  BookOpen,
  Briefcase,
  Plug,
  SlidersHorizontal,
  Plus,
  Minus,
  User,
  Search,
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
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback, useMemo } from 'react';
import NextLink from 'next/link';
import { cn } from '@/lib/utils';
import type { TooltipContent } from '@/components/ui/tooltip';
import { Input } from '../ui/input';

const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

export const EMenuIcon = () => (
  <svg
    width="100"
    height="24"
    viewBox="0 0 100 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18.88 0C17.1325 0 15.655 0.99 15.01 2.59L13.5625 6.42C13.235 7.23 12.445 7.74 11.59 7.74H0.58V10.33H11.59C12.445 10.33 13.235 10.84 13.5625 11.65L15.01 15.48C15.655 17.08 17.1325 18.07 18.88 18.07H28.93V15.48H18.88C18.035 15.48 17.335 14.89 17.0725 14.13L16.0325 11.23C15.8275 10.63 15.8275 9.95001 16.0325 9.35001L17.0725 6.45C17.335 5.69 18.035 5.1 18.88 5.1H28.93V2.51H18.88V0Z"
      fill="currentColor"
    />
    <path
      d="M29.542 10.33V7.74H40.232V10.33H29.542Z"
      fill="currentColor"
    />
    <path
      d="M48.2479 2.51H42.7479V21.1H45.3379V11.9L49.9179 21.1H52.4179L57.0279 11.93V21.1H59.6179V2.51H54.2079L52.4179 6.84L50.6279 2.51H48.2479Z"
      fill="currentColor"
    />
    <path
      d="M62.5936 2.51V21.1H74.4536V18.51H65.1836V12.72H73.5536V10.13H65.1836V5.1H74.4536V2.51H62.5936Z"
      fill="currentColor"
    />
    <path
      d="M87.2003 14.6C87.2003 15.48 86.4103 16.43 85.1003 17.04C83.7903 17.65 82.0703 17.99 80.0103 17.99C76.2403 17.99 74.3803 16.21 74.3803 12.83V2.51H76.9703V12.44C76.9703 14.63 78.0703 15.48 80.0103 15.48C81.4203 15.48 82.3403 15.02 82.8803 14.54C83.4203 14.06 83.7903 13.33 83.7903 12.35V2.51H86.3803L87.2003 14.6Z"
      fill="currentColor"
    />
    <path
      d="M99.4169 2.51V5.1H91.9169V10.13H98.5169V12.72H91.9169V18.51H99.4169V21.1H89.3269V2.51H99.4169Z"
      fill="currentColor"
    />
  </svg>
);

const createTooltipContent = (
  title: string,
  items: { label: string; path: string }[]
): Omit<React.ComponentProps<typeof TooltipContent>, 'key'> => ({
  className: 'bg-gray-900 text-gray-200 border-gray-700 p-0',
  children: (
    <div className="flex flex-col items-start p-1">
      <p className="font-bold px-2 py-1">{title}</p>
      <div className="flex flex-col items-start">
        {items.map((item) => (
          <NextLink
            key={item.label}
            href={item.path}
            className="w-full text-left rounded-sm px-2 py-1.5 hover:bg-gray-800"
            onClick={(e) => {
              if (item.path === '#') e.preventDefault();
            }}
          >
            {item.label}
          </NextLink>
        ))}
      </div>
    </div>
  ),
});

export function AppSidebar() {
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState('');

  const getActiveMenu = useCallback(() => {
    if (pathname === '/dashboard') {
      return null;
    }
    if (pathname.startsWith('/dashboard/reports')) {
      return 'reports';
    }
    if (
      pathname.startsWith('/dashboard/products') ||
      pathname.startsWith('/dashboard/categories')
    ) {
      return 'catalog';
    }
    if (pathname.startsWith('/dashboard/tables')) {
      return 'operations';
    }
    if (pathname.startsWith('/dashboard/orders')) {
      return 'orders';
    }
    if (pathname.startsWith('/dashboard/customer')) {
      return 'customer';
    }
    if (pathname.startsWith('/dashboard/settings')) {
      return 'settings';
    }
    if (pathname.startsWith('/dashboard/integrations')) {
      return 'integrations';
    }
    if (pathname.startsWith('/dashboard/system')) {
      return 'system';
    }
    return null;
  }, [pathname]);

  const [activeMenu, setActiveMenu] = useState<string | null>(getActiveMenu());

  useEffect(() => {
    // When search is cleared, restore the active menu based on path
    if (!searchTerm) {
      setActiveMenu(getActiveMenu());
    }
  }, [pathname, getActiveMenu, searchTerm]);

  const handleMenuToggle = (menu: string) => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  const reportsSubMenu = [
    { label: 'Payments', path: '/dashboard/reports/payments' },
    { label: 'Split Bills', path: '/dashboard/reports/split-bills' },
    { label: 'Outstanding', path: '/dashboard/reports/outstanding' },
    { label: 'Tips & Charges', path: '/dashboard/reports/tips-and-charges' },
    {
      label: 'Staff Performance',
      path: '/dashboard/reports/staff-performance',
    },
    { label: 'AI Insights', path: '/dashboard/reports/ai-insights' },
  ];
  const catalogSubMenu = [
    { label: 'Products', path: '/dashboard/products' },
    { label: 'Categories', path: '/dashboard/categories' },
    { label: 'Modifiers', path: '#' },
    { label: 'Promotions', path: '#' },
    { label: 'Coupons', path: '#' },
  ];
  const operationsSubMenu = [
    { label: 'Opening Hours', path: '#' },
    { label: 'QR Codes', path: '#' },
    { label: 'Table States', path: '/dashboard/tables' },
    { label: 'Feedback Forms', path: '#' },
  ];
  const ordersSubMenu = [
    { label: 'Order List', path: '/dashboard/orders' },
    { label: 'Status Monitor', path: '#' },
  ];
  const settingsSubMenu = [
    { label: 'Order Types', path: '#' },
    { label: 'Payment Models', path: '#' },
    { label: 'POS Mode', path: '#' },
    { label: 'Tips & Charges', path: '#' },
    { label: 'Pricing', path: '#' },
    { label: 'Taxes', path: '#' },
    { label: 'Discounts', path: '#' },
    { label: 'Rounding', path: '#' },
  ];
  const integrationsSubMenu = [
    { label: 'POS', path: '#' },
    { label: 'Gateway', path: '#' },
    { label: 'Webhooks', path: '#' },
  ];
  const systemSubMenu = [
    { label: 'Appearance', path: '#' },
    { label: 'Localization', path: '#' },
    { label: 'Roles', path: '#' },
    { label: 'Business Info', path: '#' },
  ];

  const filterMenu = (menu: { label: string; path: string }[]) =>
    menu.filter((item) =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const filteredReportsSubMenu = useMemo(() => filterMenu(reportsSubMenu), [searchTerm, reportsSubMenu]);
  const filteredCatalogSubMenu = useMemo(() => filterMenu(catalogSubMenu), [searchTerm, catalogSubMenu]);
  const filteredOperationsSubMenu = useMemo(() => filterMenu(operationsSubMenu), [searchTerm, operationsSubMenu]);
  const filteredOrdersSubMenu = useMemo(() => filterMenu(ordersSubMenu), [searchTerm, ordersSubMenu]);
  const filteredSettingsSubMenu = useMemo(() => filterMenu(settingsSubMenu), [searchTerm, settingsSubMenu]);
  const filteredIntegrationsSubMenu = useMemo(() => filterMenu(integrationsSubMenu), [searchTerm, integrationsSubMenu]);
  const filteredSystemSubMenu = useMemo(() => filterMenu(systemSubMenu), [searchTerm, systemSubMenu]);
  
  const dashboardVisible = useMemo(() => 'dashboard'.includes(searchTerm.toLowerCase()), [searchTerm]);
  const customerVisible = useMemo(() => 'customer'.includes(searchTerm.toLowerCase()), [searchTerm]);

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r">
      <SidebarHeader className="relative flex h-auto flex-col items-center justify-center gap-4 p-4">
        <div className="flex w-full items-center justify-center">
          <div className="group-data-[collapsible=icon]:hidden">
            <EMenuIcon />
          </div>
          <div className="hidden group-data-[collapsible=icon]:block">
            <LayoutDashboard className="h-6 w-6" />
          </div>
        </div>
        <div className="relative w-full group-data-[collapsible=icon]:hidden">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search menu..."
            className="h-9 w-full rounded-lg bg-secondary pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="p-0">
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            Overview
          </SidebarGroupLabel>
          <SidebarMenu>
            {(searchTerm === '' || dashboardVisible) && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/dashboard'}
                  tooltip="Dashboard"
                >
                  <NextLink href="/dashboard">
                    <PieChart />
                    <span className="group-data-[collapsible=icon]:hidden">
                      Dashboard
                    </span>
                  </NextLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            {(searchTerm === '' || filteredReportsSubMenu.length > 0) && (
              <SidebarMenuItem>
                <Collapsible
                  open={activeMenu === 'reports' || (searchTerm !== '' && filteredReportsSubMenu.length > 0)}
                  onOpenChange={() => handleMenuToggle('reports')}
                >
                  <CollapsibleTrigger asChild className="w-full">
                    <SidebarMenuButton
                      isActive={activeMenu === 'reports'}
                      tooltip={createTooltipContent('Reports', reportsSubMenu)}
                      className="w-full"
                    >
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BarChart />
                          <span className="group-data-[collapsible=icon]:hidden">
                            Reports
                          </span>
                        </div>
                        {activeMenu === 'reports' || (searchTerm !== '' && filteredReportsSubMenu.length > 0) ? (
                          <Minus className="h-4 w-4 opacity-0 transition-opacity group-data-[collapsible=icon]:hidden group-hover/menu-item:opacity-100" />
                        ) : (
                          <Plus className="h-4 w-4 opacity-0 transition-opacity group-data-[collapsible=icon]:hidden group-hover/menu-item:opacity-100" />
                        )}
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {filteredReportsSubMenu.map((item) => (
                        <SidebarMenuSubItem key={item.label}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname.startsWith(item.path)}
                            onClick={(e) => {
                              if (item.path === '#') e.preventDefault();
                            }}
                          >
                            <NextLink href={item.path}>{item.label}</NextLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroup>
        {(searchTerm === '' ||
          filteredCatalogSubMenu.length > 0 ||
          filteredOperationsSubMenu.length > 0 ||
          filteredOrdersSubMenu.length > 0 ||
          customerVisible) && (
          <SidebarSeparator className="group-data-[collapsible=icon]:hidden" />
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            Management
          </SidebarGroupLabel>
          <SidebarMenu>
            {(searchTerm === '' || filteredCatalogSubMenu.length > 0) && (
              <SidebarMenuItem>
                <Collapsible
                  open={activeMenu === 'catalog' || (searchTerm !== '' && filteredCatalogSubMenu.length > 0)}
                  onOpenChange={() => handleMenuToggle('catalog')}
                >
                  <CollapsibleTrigger asChild className="w-full">
                    <SidebarMenuButton
                      isActive={activeMenu === 'catalog'}
                      tooltip={createTooltipContent('Catalog', catalogSubMenu)}
                      className="w-full"
                    >
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen />
                          <span className="group-data-[collapsible=icon]:hidden">
                            Catalog
                          </span>
                        </div>
                        {activeMenu === 'catalog' || (searchTerm !== '' && filteredCatalogSubMenu.length > 0) ? (
                          <Minus className="h-4 w-4 opacity-0 transition-opacity group-data-[collapsible=icon]:hidden group-hover/menu-item:opacity-100" />
                        ) : (
                          <Plus className="h-4 w-4 opacity-0 transition-opacity group-data-[collapsible=icon]:hidden group-hover/menu-item:opacity-100" />
                        )}
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {filteredCatalogSubMenu.map((item) => (
                        <SidebarMenuSubItem key={item.label}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname.startsWith(item.path)}
                            onClick={(e) => {
                              if (item.path === '#') e.preventDefault();
                            }}
                          >
                            <NextLink href={item.path}>{item.label}</NextLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            )}

            {(searchTerm === '' || filteredOperationsSubMenu.length > 0) && (
              <SidebarMenuItem>
                <Collapsible
                  open={activeMenu === 'operations' || (searchTerm !== '' && filteredOperationsSubMenu.length > 0)}
                  onOpenChange={() => handleMenuToggle('operations')}
                >
                  <CollapsibleTrigger asChild className="w-full">
                    <SidebarMenuButton
                      isActive={activeMenu === 'operations'}
                      tooltip={createTooltipContent(
                        'Operations',
                        operationsSubMenu
                      )}
                      className="w-full"
                    >
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Briefcase />
                          <span className="group-data-[collapsible=icon]:hidden">
                            Operations
                          </span>
                        </div>
                        {activeMenu === 'operations' || (searchTerm !== '' && filteredOperationsSubMenu.length > 0) ? (
                          <Minus className="h-4 w-4 opacity-0 transition-opacity group-data-[collapsible=icon]:hidden group-hover/menu-item:opacity-100" />
                        ) : (
                          <Plus className="h-4 w-4 opacity-0 transition-opacity group-data-[collapsible=icon]:hidden group-hover/menu-item:opacity-100" />
                        )}
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {filteredOperationsSubMenu.map((item) => (
                        <SidebarMenuSubItem key={item.label}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname.startsWith(item.path)}
                            onClick={(e) => {
                              if (item.path === '#') e.preventDefault();
                            }}
                          >
                            <NextLink href={item.path}>{item.label}</NextLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            )}

            {(searchTerm === '' || filteredOrdersSubMenu.length > 0) && (
              <SidebarMenuItem>
                <Collapsible
                  open={activeMenu === 'orders' || (searchTerm !== '' && filteredOrdersSubMenu.length > 0)}
                  onOpenChange={() => handleMenuToggle('orders')}
                >
                  <CollapsibleTrigger asChild className="w-full">
                    <SidebarMenuButton
                      isActive={activeMenu === 'orders'}
                      tooltip={createTooltipContent('Orders', ordersSubMenu)}
                      className="w-full"
                    >
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ClipboardList />
                          <span className="group-data-[collapsible=icon]:hidden">
                            Orders
                          </span>
                        </div>
                        {activeMenu === 'orders' || (searchTerm !== '' && filteredOrdersSubMenu.length > 0) ? (
                          <Minus className="h-4 w-4 opacity-0 transition-opacity group-data-[collapsible=icon]:hidden group-hover/menu-item:opacity-100" />
                        ) : (
                          <Plus className="h-4 w-4 opacity-0 transition-opacity group-data-[collapsible=icon]:hidden group-hover/menu-item:opacity-100" />
                        )}
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {filteredOrdersSubMenu.map((item) => (
                        <SidebarMenuSubItem key={item.label}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname.startsWith(item.path)}
                            onClick={(e) => {
                              if (item.path === '#') e.preventDefault();
                            }}
                          >
                            <NextLink href={item.path}>{item.label}</NextLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            )}
            {(searchTerm === '' || customerVisible) && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/dashboard/customer')}
                  tooltip="Customer"
                >
                  <NextLink href="/dashboard/customer/list">
                    <User />
                    <span className="group-data-[collapsible=icon]:hidden">
                      Customer
                    </span>
                  </NextLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroup>
        {(searchTerm === '' ||
          filteredSettingsSubMenu.length > 0 ||
          filteredIntegrationsSubMenu.length > 0 ||
          filteredSystemSubMenu.length > 0) && (
          <SidebarSeparator className="group-data-[collapsible=icon]:hidden" />
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            Configuration
          </SidebarGroupLabel>
          <SidebarMenu>
            {(searchTerm === '' || filteredSettingsSubMenu.length > 0) && (
              <SidebarMenuItem>
                <Collapsible
                  open={activeMenu === 'settings' || (searchTerm !== '' && filteredSettingsSubMenu.length > 0)}
                  onOpenChange={() => handleMenuToggle('settings')}
                >
                  <CollapsibleTrigger asChild className="w-full">
                    <SidebarMenuButton
                      isActive={activeMenu === 'settings'}
                      tooltip={createTooltipContent(
                        'Settings',
                        settingsSubMenu
                      )}
                      className="w-full"
                    >
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Settings />
                          <span className="group-data-[collapsible=icon]:hidden">
                            Settings
                          </span>
                        </div>
                        {activeMenu === 'settings' || (searchTerm !== '' && filteredSettingsSubMenu.length > 0) ? (
                          <Minus className="h-4 w-4 opacity-0 transition-opacity group-data-[collapsible=icon]:hidden group-hover/menu-item:opacity-100" />
                        ) : (
                          <Plus className="h-4 w-4 opacity-0 transition-opacity group-data-[collapsible=icon]:hidden group-hover/menu-item:opacity-100" />
                        )}
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {filteredSettingsSubMenu.map((item) => (
                        <SidebarMenuSubItem key={item.label}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname.startsWith(item.path)}
                            onClick={(e) => {
                              if (item.path === '#') e.preventDefault();
                            }}
                          >
                            <NextLink href={item.path}>{item.label}</NextLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            )}

            {(searchTerm === '' || filteredIntegrationsSubMenu.length > 0) && (
              <SidebarMenuItem>
                <Collapsible
                  open={activeMenu === 'integrations' || (searchTerm !== '' && filteredIntegrationsSubMenu.length > 0)}
                  onOpenChange={() => handleMenuToggle('integrations')}
                >
                  <CollapsibleTrigger asChild className="w-full">
                    <SidebarMenuButton
                      isActive={activeMenu === 'integrations'}
                      tooltip={createTooltipContent(
                        'Integrations',
                        integrationsSubMenu
                      )}
                      className="w-full"
                    >
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Plug />
                          <span className="group-data-[collapsible=icon]:hidden">
                            Integrations
                          </span>
                        </div>
                        {activeMenu === 'integrations' || (searchTerm !== '' && filteredIntegrationsSubMenu.length > 0) ? (
                          <Minus className="h-4 w-4 opacity-0 transition-opacity group-data-[collapsible=icon]:hidden group-hover/menu-item:opacity-100" />
                        ) : (
                          <Plus className="h-4 w-4 opacity-0 transition-opacity group-data-[collapsible=icon]:hidden group-hover/menu-item:opacity-100" />
                        )}
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {filteredIntegrationsSubMenu.map((item) => (
                        <SidebarMenuSubItem key={item.label}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname.startsWith(item.path)}
                            onClick={(e) => {
                              if (item.path === '#') e.preventDefault();
                            }}
                          >
                            <NextLink href={item.path}>{item.label}</NextLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            )}

            {(searchTerm === '' || filteredSystemSubMenu.length > 0) && (
              <SidebarMenuItem>
                <Collapsible
                  open={activeMenu === 'system' || (searchTerm !== '' && filteredSystemSubMenu.length > 0)}
                  onOpenChange={() => handleMenuToggle('system')}
                >
                  <CollapsibleTrigger asChild className="w-full">
                    <SidebarMenuButton
                      isActive={activeMenu === 'system'}
                      tooltip={createTooltipContent('System', systemSubMenu)}
                      className="w-full"
                    >
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <SlidersHorizontal />
                          <span className="group-data-[collapsible=icon]:hidden">
                            System
                          </span>
                        </div>
                        {activeMenu === 'system' || (searchTerm !== '' && filteredSystemSubMenu.length > 0) ? (
                          <Minus className="h-4 w-4 opacity-0 transition-opacity group-data-[collapsible=icon]:hidden group-hover/menu-item:opacity-100" />
                        ) : (
                          <Plus className="h-4 w-4 opacity-0 transition-opacity group-data-[collapsible=icon]:hidden group-hover/menu-item:opacity-100" />
                        )}
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {filteredSystemSubMenu.map((item) => (
                        <SidebarMenuSubItem key={item.label}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname.startsWith(item.path)}
                            onClick={(e) => {
                              if (item.path === '#') e.preventDefault();
                            }}
                          >
                            <NextLink href={item.path}>{item.label}</NextLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <div className="group-data-[collapsible=icon]:hidden">
          <NextLink
            href="#"
            className="flex h-auto w-full items-center justify-between gap-2 rounded-md bg-sidebar-accent p-2 text-left text-sidebar-accent-foreground"
          >
            <div className="flex items-center gap-2">
              {userAvatar && (
                <Image
                  src={userAvatar.imageUrl}
                  width={32}
                  height={32}
                  alt="User avatar"
                  className="rounded-full"
                  data-ai-hint={userAvatar.imageHint}
                />
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium">Resto Name 1</span>
                <span className="text-xs text-muted-foreground">
                  john@domain.com
                </span>
              </div>
            </div>
            <Plus className="h-4 w-4" />
          </NextLink>
        </div>
        <div className="hidden group-data-[collapsible=icon]:block">
          <NextLink href="#">
            {userAvatar && (
              <Image
                src={userAvatar.imageUrl}
                width={32}
                height={32}
                alt="User avatar"
                className="rounded-full"
                data-ai-hint={userAvatar.imageHint}
              />
            )}
          </NextLink>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
