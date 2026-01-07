import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function PartnerWithUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login?redirect=/partner-with-us");
  }

  return <>{children}</>;
}
