import PusherProvider from "@/providers/PusherProvider";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const restaurant = await prisma.restaurantStep1.findFirst({ where: { userId: session?.user?.id }, select: { id: true } });

  return (
      <PusherProvider restaurantId={restaurant?.id}>
        {children}
      </PusherProvider>
  );
}
