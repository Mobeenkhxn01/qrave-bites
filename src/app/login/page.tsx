"use client";

import { z } from "zod";
import React from "react";
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
import userSignIn from "@/actions/sign-in";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export default function LoginPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <section className="max-w-sm mx-auto p-4 mt-5 shadow-sm rounded-lg bg-[#f9f9f9]">
      <h1 className="text-center text-[#eb0029] text-4xl mb-4">Login</h1>
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
          <Button className="w-full bg-[#eb0029]" type="submit">
            Submit
          </Button>
        </form>
      </Form>

      {/* Separate Social Login Section */}
      <div className="my-4 text-center text-gray-500">or login with provider</div>
      <Button
        className="w-full flex flex-row gap-4"
        variant="outline"
        onClick={() => userSignIn()}
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
