"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Users,
  BarChart3,
  Settings,
  CreditCard,
  type LucideIcon,
} from "lucide-react";

export default function AppSidebar({
  role,
}: {
  role: "Student" | "Instructor";
}) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-2 py-4 group-data-[collapsible=icon]:justify-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-8 h-8">
                <Image
                  src="/logo.png"
                  alt="Academos Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold truncate tracking-tight text-primary group-data-[collapsible=icon]:hidden">
                Academos
              </span>
            </Link>
          </div>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavItem
                href="/dashboard"
                icon={LayoutDashboard}
                active={pathname === "/dashboard"}
              >
                Overview
              </NavItem>

              {role === "Student" && (
                <>
                  <NavItem
                    href="/dashboard/courses"
                    icon={BookOpen}
                    active={pathname.startsWith("/dashboard/courses")}
                  >
                    My Courses
                  </NavItem>
                </>
              )}

              {role === "Instructor" && (
                <>
                  <NavItem
                    href="/dashboard/courses"
                    icon={BookOpen}
                    active={pathname.startsWith("/dashboard/courses")}
                  >
                    Courses
                  </NavItem>
                  <NavItem
                    href="/dashboard/students"
                    icon={Users}
                    active={pathname.startsWith("/dashboard/students")}
                  >
                    Students
                  </NavItem>
                  <NavItem
                    href="/dashboard/analytics"
                    icon={BarChart3}
                    active={pathname.startsWith("/dashboard/analytics")}
                  >
                    Analytics
                  </NavItem>
                </>
              )}

              <NavItem
                href="/dashboard/settings"
                icon={Settings}
                active={pathname.startsWith("/dashboard/settings")}
              >
                Settings
              </NavItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function NavItem({
  href,
  icon: Icon,
  children,
  active,
}: {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={active}
        tooltip={children as string}
        size="lg"
        className="transition-all duration-200 ease-in-out hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-zinc-200 dark:data-[active=true]:bg-zinc-700 data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-medium"
      >
        <Link
          href={href}
          className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center"
        >
          <Icon className={active ? "text-primary" : "text-muted-foreground"} />
          <span className="group-data-[collapsible=icon]:hidden">
            {children}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
