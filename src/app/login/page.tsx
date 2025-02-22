"use client";

import { z } from "zod";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: { email: string; password: string }) {
    setLoading(true);
    setError(null);

    // Authenticate using NextAuth credentials provider
    const result = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
    }
    setLoading(false);
  }

  return (
    <section className="max-w-sm mx-auto p-4 mt-5 shadow-sm rounded-lg bg-[#f9f9f9]">
      <h1 className="text-center text-[#eb0029] text-4xl mb-4">Login</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full bg-[#eb0029]" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Submit"}
          </Button>
        </form>
      </Form>

      {/* Social Login Section */}
      <div className="my-4 text-center text-gray-500">or login with provider</div>
      <Button
        className="w-full flex flex-row gap-4"
        variant="outline"
        onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        <Image src="/google.png" alt="Google" width={24} height={24} />
        Login with Google
      </Button>

      <div className="text-center my-4 text-gray-500 border-t pt-4">
        Create new account? <Link href="/register">here &raquo;</Link>
      </div>
    </section>
  );
}
