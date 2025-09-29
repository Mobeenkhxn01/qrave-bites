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
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import TitleHeaderPartner from "../titleheader";
import Right from "@/components/icons/Right";

// ✅ Zod schema for agreement checkbox
const formSchema = z.object({
  agreement: z.boolean().refine((val) => val === true, {
    message: "You must accept the agreement to proceed.",
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function RestaurantStep4() {
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
      const res = await axios.post("/api/restaurant/step4", {
        agreement: values.agreement,
        email,
      });

      if (res.data.success) {
        toast.success("Agreement accepted successfully!");
        router.push("/partner-with-us/thank-you");
      } else {
        toast.error(res.data.message || "Failed to save agreement");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while saving agreement");
    }
  };

  if (status === "loading") return <div className="p-10 text-center">Loading...</div>;
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className="px-4 md:px-6 lg:px-8">
      {/* Header for mobile */}
      <div className="block lg:hidden mb-8">
        <div className="w-full flex justify-center items-center">
          <TitleHeaderPartner activeStep={4} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar for desktop */}
        <aside className="hidden lg:block w-1/3 p-12">
          <TitleHeaderPartner activeStep={4} />
        </aside>

        {/* Main content */}
        <section className="w-full lg:w-2/3 lg:pr-20">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6">
            Partner Agreement
          </h1>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Agreement Terms & Policies</h2>
            </CardHeader>
            <CardContent>
              {/* Scrollable agreement */}
              <ScrollArea className="h-80 border p-4 rounded-lg bg-gray-50">
                <div className="space-y-4 text-sm md:text-base text-gray-700">
                  <h3 className="font-semibold">1. Partner Agreement</h3>
                  <p>
                    By partnering with QraveBites, you agree to comply with all operational guidelines, 
                    maintain quality standards, and provide accurate and timely services to customers.
                    You will be responsible for your menu, pricing, and inventory management. Any breach 
                    of agreement may result in suspension or termination of partnership.
                  </p>

                  <h3 className="font-semibold">2. Privacy Policy</h3>
                  <p>
                    We value your privacy. All personal and business information collected during the registration 
                    process will be securely stored and used solely for business operations and communication 
                    with QraveBites. We will not share your data with third parties without consent, except as 
                    required by law. You have the right to access, modify, or delete your information upon request.
                  </p>

                  <h3 className="font-semibold">3. Terms & Conditions</h3>
                  <p>
                    1. You must provide accurate information during registration. <br/>
                    2. You agree to comply with all applicable laws and regulations regarding food safety and 
                    business operations. <br/>
                    3. QraveBites may update policies and agreements from time to time. You will be notified 
                    of changes, and continued use of the platform constitutes acceptance. <br/>
                    4. All financial transactions must be conducted through approved payment gateways. <br/>
                    5. QraveBites reserves the right to suspend or terminate accounts for violations of the agreement, 
                    unethical practices, or complaints from customers.
                  </p>

                  <p className="italic text-gray-600">
                    By checking the box below, you confirm that you have read and agree to all the terms, privacy 
                    policies, and conditions outlined above.
                  </p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Form for checkbox */}
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
                      <FormLabel htmlFor="agreement" className="text-sm md:text-base font-medium">
                        I have read and agree to the Partner Agreement, Privacy Policy, and Terms & Conditions
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
