"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            {isLoading ? "Loading..." : `Hello, ${userProfile?.name || "User"}`}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={"/settings"}>Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button
              onClick={() => signOut()}
              className="font-serif text-white bg-[#eb0029] hover:bg-[#d19b6f]"
            >
              Logout
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
