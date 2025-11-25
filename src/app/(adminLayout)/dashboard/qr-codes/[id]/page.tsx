import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function QRRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tableId = id;

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

  // increment scan count
  await prisma.table.update({
    where: { id: tableId },
    data: { scan: { increment: 1 } },
  });

  // IMPORTANT: Correct menu redirect
  redirect(
    `/city/${table.restaurant.city}/${table.restaurant.slug}/menu?table=${table.number}`
  );
}
