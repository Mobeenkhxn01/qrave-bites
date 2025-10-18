import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
export default async function QRRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const qr = await prisma.table.findUnique({
    where: { id: (await params).id },
  });

  if(!qr){
    return <div>Qr Code not found</div>;
  }
  await prisma.table.update({
    where:{id:(await params).id},
    data:{scan:{increment:1}},
  });
   redirect(qr.qrCodeUrl)
}
