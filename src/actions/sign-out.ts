"use server";
import { signOut } from "@/lib/auth";
export default async function userSignOut() {
    await signOut({ redirect: false });
    }