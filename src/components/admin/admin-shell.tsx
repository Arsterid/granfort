"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";

import {
  Car,
  ChevronDown,
  ExternalLink,
  Layers,
  LayoutDashboard,
  Package,
  Tags,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { assetPath } from "@/lib/assetPath";

const catalogLinks = [
  {
    href: "/admin/vehicles/brands",
    label: "Марки",
    icon: Tags,
  },
  {
    href: "/admin/vehicles/models",
    label: "Модели",
    icon: Car,
  },
  {
    href: "/admin/vehicles/variants",
    label: "Модификации",
    icon: Layers,
  },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isOverview = pathname === "/admin";
  const isProductsRoute = pathname.startsWith("/admin/products");
  const isVehicleRoute = pathname.startsWith("/admin/vehicles");
  const isCatalogRoute = isProductsRoute || isVehicleRoute;

  const pageTitle = isVehicleRoute
    ? "Каталог автомобилей"
    : isProductsRoute
      ? "Товары и производство"
      : "Обзор";

  const sidebarTheme = {
    "--sidebar": "#1d1c20",
    "--sidebar-foreground": "#f5f3f2",
    "--sidebar-primary": "var(--brand)",
    "--sidebar-primary-foreground": "#ffffff",
    "--sidebar-accent": "rgba(255, 255, 255, 0.08)",
    "--sidebar-accent-foreground": "#ffffff",
    "--sidebar-border": "rgba(255, 255, 255, 0.1)",
    "--sidebar-ring": "var(--brand-soft)",
  } as CSSProperties;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "17rem",
          "--sidebar-width-icon": "4.25rem",
        } as CSSProperties
      }
    >
      <Sidebar collapsible="icon" style={sidebarTheme} className="border-r border-white/10">
        <SidebarHeader className="px-3 py-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                render={<Link href="/admin" />}
                className="h-14 hover:bg-white/5"
              >
                <Image
                  src={assetPath("/icon.svg")}
                  alt="GRANFORT"
                  width={64}
                  height={64}
                  unoptimized
                  loading="eager"
                  className="max-sm:w-logo-compact h-auto"
                />

                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-base font-extrabold tracking-[0.12em] text-white">
                    GRANFORT
                  </span>

                  <span className="text-[9px] font-semibold tracking-[0.16em] text-white/45">
                    ПАНЕЛЬ УПРАВЛЕНИЯ
                  </span>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="pt-2">
          <SidebarGroup className="gap-3">
            <SidebarGroupLabel className="px-3 text-[10px] font-semibold tracking-[0.18em] text-white/40">
              УПРАВЛЕНИЕ
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu className="gap-2">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={<Link href="/admin" />}
                    isActive={isOverview}
                    tooltip="Обзор"
                    className="data-[active=true]:bg-brand h-11 rounded-md text-white/70 hover:bg-white/5 hover:text-white data-[active=true]:text-white"
                  >
                    <LayoutDashboard />
                    <span>Обзор</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <Collapsible
                    key={pathname}
                    defaultOpen={isCatalogRoute}
                    className="group/collapsible"
                  >
                    <div className="flex w-full items-center gap-1">
                      <SidebarMenuButton
                        render={<Link href="/admin/products" />}
                        isActive={isCatalogRoute}
                        tooltip="Товары и производство"
                        className="data-[active=true]:bg-brand h-11 w-auto min-w-0 flex-1 rounded-md pr-2 text-white/70 hover:bg-white/5 hover:text-white data-[active=true]:text-white"
                      >
                        <Package />
                        <span className="truncate">Товары и производство</span>
                      </SidebarMenuButton>

                      <CollapsibleTrigger
                        render={
                          <button
                            type="button"
                            aria-label="Развернуть или свернуть каталог"
                            className="focus-visible:ring-brand-soft flex size-9 shrink-0 items-center justify-center rounded-md text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:outline-none"
                          />
                        }
                      >
                        <ChevronDown className="size-5 transition-transform duration-200 group-data-open/collapsible:rotate-180" />
                      </CollapsibleTrigger>
                    </div>

                    <CollapsibleContent>
                      <SidebarMenuSub className="mt-2 ml-5 flex flex-col gap-1 border-l border-white/10 pl-3">
                        {catalogLinks.map((item) => {
                          const Icon = item.icon;
                          const isActive = pathname === item.href;

                          return (
                            <SidebarMenuSubItem key={item.href}>
                              <SidebarMenuSubButton
                                render={<Link href={item.href} />}
                                isActive={isActive}
                                className="h-9 rounded-md text-white/55 hover:bg-white/5 hover:text-white data-[active=true]:bg-white/10 data-[active=true]:text-white"
                              >
                                <Icon className="size-4" />
                                <span>{item.label}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-white/10 p-3">
          <div className="flex items-center gap-2 px-2 py-2 text-xs text-white/45">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            <span>Система управления GRANFORT</span>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-background min-h-svh">
        <header className="border-border bg-card/95 sticky top-0 z-20 flex h-16 items-center gap-3 border-b px-4 backdrop-blur sm:px-6">
          <SidebarTrigger className="-ml-1" />

          <Separator orientation="vertical" className="h-5" />

          <div className="min-w-0">
            <p className="text-muted-foreground text-[10px] font-bold tracking-[0.16em]">
              GRANFORT / ADMIN
            </p>

            <p className="text-foreground truncate text-sm font-semibold">{pageTitle}</p>
          </div>

          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className={`${buttonVariants({
              variant: "outline",
              size: "sm",
            })} ml-auto shrink-0`}
          >
            <span className="hidden sm:inline">Открыть сайт</span>
            <ExternalLink />
          </Link>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
