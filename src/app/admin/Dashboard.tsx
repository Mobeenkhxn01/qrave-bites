"use client";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  if (session?.user?.role === "admin") {
    return(
      <div className="w-full">
        This is admin dashboard
      </div>
    ); 
  
  }

  return <p>You are not authorized to view this page!</p>;
}
