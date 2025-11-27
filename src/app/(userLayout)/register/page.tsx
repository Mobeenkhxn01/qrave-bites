"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[!@#$%^&*(),.?\":{}|<>]/, "Password must include a special character")
});

export default function RegisterPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" }
  });

  const registerMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await axios.post("/api/register", values);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      router.push("/login");
    },
    onError: (err: unknown) => {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.error || "Registration failed");
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  });

  const googleSignInMutation = useMutation({
    mutationFn: async () => {
      await signIn("google", { callbackUrl: "/" });
    },
    onError: () => toast.error("Google sign-in failed")
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    registerMutation.mutate(values);
  };

  return (
    <section className="max-w-sm mx-auto p-6 mt-10 rounded-lg bg-[#f9f9f9] shadow-md">
      <h1 className="text-center text-[#eb0029] text-4xl mb-6">Register</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

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
                    disabled={registerMutation.isPending}
                  />
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
                  <Input
                    type="password"
                    placeholder="Password"
                    {...field}
                    disabled={registerMutation.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-full bg-[#eb0029] hover:bg-[#d10024]"
            type="submit"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? "Registering..." : "Register"}
          </Button>

          <div className="my-4 text-center text-gray-500">
            or continue with
          </div>

          <Button
            className="w-full flex items-center gap-4"
            variant="outline"
            type="button"
            onClick={() => googleSignInMutation.mutate()}
            disabled={googleSignInMutation.isPending}
          >
            <Image src="/google.png" alt="Google" width={24} height={24} />
            {googleSignInMutation.isPending ? "Redirecting..." : "Google"}
          </Button>

          <div className="text-center my-4 text-gray-500 border-t pt-4">
            Already have an account?{" "}
            <Link href="/login" className="underline hover:text-[#eb0029]">
              Login here »
            </Link>
          </div>
        </form>
      </Form>
    </section>
  );
}
