import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function QRRedirectPage({ params }: { params: { id: string } }) {
  const tableId = params.id;

  if (!tableId) {
    return <div>Invalid QR</div>;
  }

  const table = await prisma.table.findUnique({
    where: { id: tableId },
    include: { restaurant: true },
  });

  if (!table || !table.restaurant) {
    return <div>Invalid QR</div>;
  }

  await prisma.table.update({
    where: { id: tableId },
    data: { scan: { increment: 1 } },
  });

  redirect(`/city/${table.restaurant.city}/${table.restaurant.slug}?table=${table.number}`);
}
