import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session=await auth();
if(!session){
  redirect('/');
}
if(session.user.role!=='ADMIN'){
  redirect('/');
}
  return  children ;
}
