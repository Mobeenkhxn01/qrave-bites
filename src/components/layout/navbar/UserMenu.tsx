"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchUserProfile = async () => {
  const response = await axios.get("/api/profile");
  return response.data;
};

export default function UserMenu() {
  const { data: session } = useSession();

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    enabled: !!session,
  });

  if (!session) {
    return (
      <Link href="/login">
        <Button className="font-serif text-white bg-[#eb0029] hover:bg-[#d19b6f]">
          Login
        </Button>
      </Link>
    );
  }

  return (
    <>
      <Link href="/profile" className="text-black font-serif">
        {isLoading ? "Loading..." : `Hello, ${userProfile?.name || "User"}`}
      </Link>
      <Button
        onClick={() => signOut()}
        className="font-serif text-white bg-[#eb0029] hover:bg-[#d19b6f]"
      >
        Logout
      </Button>
    </>
  );
}
