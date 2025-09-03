"use client";

import { z } from "zod";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginDialog({ open, onClose }: LoginDialogProps) {
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

    const result = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
      onClose(); // Close modal on success
    }

    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm w-full p-6 rounded-lg bg-white">
        <DialogHeader>
          <DialogTitle className="text-center text-[#eb0029] text-2xl">
            Login
          </DialogTitle>
        </DialogHeader>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            {/* Email Field */}
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

            {/* Password Field */}
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

        {/* Google Login */}
        <div className="my-4 text-center text-gray-500">or login with</div>
        <Button
          className="w-full flex flex-row gap-4"
          variant="outline"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <Image src="/google.png" alt="Google" width={24} height={24} />
          Login with Google
        </Button>

        <div className="text-center my-4 text-gray-500 border-t pt-4">
          Create new account?{" "}
          <Link href="/register" className="text-[#eb0029]">
            here &raquo;
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
