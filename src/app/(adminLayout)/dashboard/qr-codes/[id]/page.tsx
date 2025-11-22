import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function QRRedirectPage({ params }: { params: { id: string } }) {
  const table = await prisma.table.findUnique({
    where: { id: params.id },
    include: { restaurant: true },
  });

  if (!table || !table.restaurant) {
    return <div>Invalid QR</div>;
  }
  await prisma.table.update({
    where: { id: params.id },
    data: { scan: { increment: 1 } },
  });
  redirect(`/${table.restaurant.city}/${table.restaurant.slug}/menu?table=${table.number}`);
}
