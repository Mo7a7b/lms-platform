import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { GetUserData } from "@/lib/api";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Metadata } from "next";

const AccessDenied = dynamic(() => import("@/components/AccessDenied"));
const AppSidebar = dynamic(() => import("@/components/dashboard/AppSidebar"));
const AuthProvider = dynamic(() => import("@/contexts/authProvider"));

export const metadata: Metadata = {
  title: "Academos - Dashboard",
  description: "Academos Dashboard",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return <AccessDenied />;
  }
  const { role } = (await GetUserData(token!)).user;
  const userData = (await GetUserData(token as string)).user;
  return (
    <AuthProvider value={{ user: userData, token }}>
      <SidebarProvider>
        <div className="h-screen w-full flex bg-muted overflow-hidden">
          {/* ================= Sidebar ================= */}
          <AppSidebar role={role} />
          {/* ================= Main Content ================= */}
          <SidebarInset className="flex flex-col flex-1 w-full">
            {/* Top bar */}
            <header className="h-14 flex items-center gap-4 border-b bg-background px-6">
              <SidebarTrigger />
              <h1 className="text-sm font-medium text-muted-foreground">
                Dashboard
              </h1>
            </header>

            {/* Page content */}
            <main className="flex-1 p-6 w-full overflow-y-auto">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
}
