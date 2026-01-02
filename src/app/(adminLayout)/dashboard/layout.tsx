import PusherProvider from "@/providers/PusherProvider";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shadcn-components/app-sidebar";
import { DashboardHeader } from "@/components/shadcn-components/dashboard-header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const restaurant = await prisma.restaurantStep1.findFirst({
    where: { userId: session?.user?.id },
    select: { id: true },
  });

  return (
    <div className="flex flex-col">
      <PusherProvider restaurantId={restaurant?.id}>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <DashboardHeader restaurantId={restaurant?.id} />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </PusherProvider>
    </div>
  );
}
