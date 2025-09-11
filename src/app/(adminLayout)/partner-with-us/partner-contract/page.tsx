"use client";

import { Card, CardContent } from "@/components/ui/card";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import TitleHeaderPartner from "../titleheader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Right from "@/components/icons/Right";
const formSchema = z.object({
  agreement: z.literal(true).refine(val => val === true, {
    message: "You must accept the agreement to proceed.",
  }),
});

export default function RestaurantStep4() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agreement: true,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const email = session?.user?.email;
    if (!email) {
      toast.error("User email not found");
      return;
    }

    try {
      const response = await axios.post("/api/restaurant/step4", {
        agreement: values.agreement,
        email,
      });

      if (response.data.success) {
        toast.success("Agreement accepted successfully");
        router.push("/partner-with-us/thank-you");
      } else {
        toast.error(response.data.message || "Failed to save agreement");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while saving agreement");
    }
  };

  if (status === "loading") return <div className="p-10">Loading...</div>;
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className="px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="agreement"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    id="agreement"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel htmlFor="agreement" className="text-sm font-medium">
                  I have read and agree to the Partner Agreement
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-6 flex justify-end items-center">
            <Button
              type="submit"
              size="lg"
              className="rounded-2xl bg-[#4947e0] text-white hover:bg-[#3a38b8]"
            >
              Next
              <Right className="ml-2" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
