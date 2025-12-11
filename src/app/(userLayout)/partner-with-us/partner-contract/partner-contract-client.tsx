"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import TitleHeaderPartner from "../titleheader";
import Right from "@/components/icons/Right";

const formSchema = z.object({
  agreement: z.boolean().refine((val) => val === true, {
    message: "You must accept the agreement to proceed.",
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function PartnerContractClient() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { agreement: false },
  });

  const onSubmit = async (values: FormData) => {
    const email = session?.user?.email;
    if (!email) {
      toast.error("User email not found");
      return;
    }

    try {
      toast.loading("Saving agreement...", { id: "step4" });

      const res = await axios.post("/api/restaurant/step4", {
        agreement: values.agreement,
        email,
      });

      toast.dismiss("step4");

      if (res.data.success) {
        toast.success("Agreement accepted");
        router.push("/partner-with-us/thank-you");
      } else {
        toast.error(res.data.message || "Failed to save agreement");
      }
    } catch {
      toast.dismiss("step4");
      toast.error("Something went wrong");
    }
  };

  if (status === "loading")
    return <div className="p-10 text-center">Loading...</div>;

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className="px-4 md:px-6 lg:px-8">
      <div className="block lg:hidden mb-8">
              <div className="w-full flex justify-center items-center">
                <TitleHeaderPartner activeStep={4} />
              </div>
            </div>
      
            <div className="flex flex-col lg:flex-row gap-6">
              <aside className="hidden lg:block w-1/3 p-12">
                <TitleHeaderPartner activeStep={4} />
              </aside>
      
              <section className="w-full lg:w-2/3 lg:pr-20">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6">
                  Partner Agreement
                </h1>
      
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold">
                      Agreement Terms & Policies
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-80 border p-4 rounded-lg bg-gray-50">
                      <div className="space-y-4 text-sm md:text-base text-gray-700">
                        <h3 className="font-semibold">1. Partner Agreement</h3>
                        <p>
                          By partnering with QraveBites, you agree to comply with all
                          operational guidelines, maintain quality standards, and
                          provide accurate and timely services. You will be
                          responsible for menu, pricing, and inventory management.
                          Violations may result in account suspension.
                        </p>
      
                        <h3 className="font-semibold">2. Privacy Policy</h3>
                        <p>
                          All personal and business information is securely stored and
                          used only for platform operations. It will never be shared
                          without consent except when required by law.
                        </p>
      
                        <h3 className="font-semibold">3. Terms & Conditions</h3>
                        <p>
                          1. You must provide accurate information. <br />
                          2. You must comply with all applicable laws. <br />
                          3. Policy updates will be communicated. <br />
                          4. All payments must be through approved gateways. <br />
                          5. QraveBites may suspend accounts for violations.
                        </p>
      
                        <p className="italic text-gray-600">
                          By checking the box below, you confirm that you have read
                          and agree to all the terms and policies above.
                        </p>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
      
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
                    <FormField
                      control={form.control}
                      name="agreement"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-2">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="flex flex-col">
                            <FormLabel className="text-sm md:text-base font-medium">
                              I agree to all the Terms & Conditions, Privacy Policy and Partner Agreement.
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
      
                    <div className="flex justify-end mt-4">
                      <Button
                        type="submit"
                        size="lg"
                        className="rounded-2xl bg-[#4947e0] text-white hover:bg-[#3a38b8] flex items-center"
                      >
                        Submit
                        <Right className="ml-2" />
                      </Button>
                    </div>
                  </form>
                </Form>
              </section>
            </div>
    </div>
  );
}
