"use client";
import { z } from "zod";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";

// API Endpoint Constant
const API_REGISTER_URL = "/api/register";

// Schema Validation
const formSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must include an uppercase letter" })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must include a special character",
    }),
});

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: { email: string; password: string }) {
    setIsLoading(true);

    try {
      const response = await fetch(API_REGISTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("An error occurred while registering");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      toast.success("Account created successfully");
      router.push("/login");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="max-w-sm mx-auto p-4 mt-5 shadow-xs rounded-lg bg-[#f9f9f9]">
      <h1 className="text-center text-[#eb0029] text-4xl mb-4">Register</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                    disabled={isLoading}
                  />
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
                  <Input
                    type="password"
                    placeholder="Password"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            className="w-full bg-[#eb0029] hover:bg-[#eb0029]/90"
            type="submit"
            disabled={isLoading}
            aria-live="polite"
          >
            {isLoading ? "Registering..." : "Register"}
          </Button>

          {/* Provider Login */}
          <div className="my-4 text-center text-gray-500">
            or register with provider
          </div>
          <Button
            className="w-full flex items-center gap-4"
            variant="outline"
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            disabled={isLoading}
          >
            <Image
              src="/google.png"
              alt="Google logo"
              width={24}
              height={24}
              priority={false}
            />
            Continue with Google
          </Button>

          {/* Redirect to Login */}
          <div className="text-center my-4 text-gray-500 border-t pt-4">
            Existing account?{" "}
            <Link className="underline hover:text-[#eb0029]" href="/login">
              Login here &raquo;
            </Link>
          </div>
        </form>
      </Form>
    </section>
  );
}
