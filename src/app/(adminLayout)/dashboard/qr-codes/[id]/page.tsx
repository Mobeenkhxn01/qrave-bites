import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function QRRedirectPage({
  params,
}: {
  params: { id: string };
}) {
  const table = await prisma.table.findUnique({
    where: { id: params.id },
    include: { restaurant: true },
  });

  if (!table || !table.restaurant) {
    return <div>Invalid QR</div>;
  }

  await prisma.table.update({
    where: { id: table.id },
    data: { scan: { increment: 1 } },
  });

  redirect(
    `/city/${table.restaurant.city}/${table.restaurant.slug}/menu?tableId=${table.id}`
  );
}
