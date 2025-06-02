"use client";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { prisma } from "@/lib/prisma";

export default function Dashboard() {
  const { data: session } = useSession();

  if (session?.user?.role === "admin") {
    return(
      <div>
        This is admin dashboard
      </div>
    ); 
    
  }

  return <p>You are not authorized to view this page!</p>;
}
