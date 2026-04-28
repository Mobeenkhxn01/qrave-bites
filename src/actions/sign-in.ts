"use server";

import { signIn}  from "@/lib/auth";

export default async function userSignIn(){
  await signIn("google", { redirectTo: "/" ,redirect: true});
}