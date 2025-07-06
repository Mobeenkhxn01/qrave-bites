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

// ✅ Step 4 Zod schema
const formSchema = z.object({
  agreement: z.literal(true, {
    errorMap: () => ({ message: "You must accept the agreement to proceed." }),
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
        router.push("/partner-with-us/thank-you"); // Replace with your next route
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
          <div className="flex justify-between items-start gap-6">
            {/* Sidebar step indicator */}
            <aside className="w-1/3 p-12 flex justify-center items-end">
              <TitleHeaderPartner activeStep={4} />
            </aside>

            {/* Main content */}
            <section className="w-2/3 pr-20">
              <h1 className="text-4xl font-semibold mb-6">
                Partner Contract and Agreement
              </h1>

              <Card className="mb-10 p-4">
                <ScrollArea className="h-[400px] w-full rounded-md overflow-y-auto">
                  <CardContent className="p-4 text-sm space-y-4">
                    <h2 className="text-xl font-bold">
                      Restaurant Partner Agreement
                    </h2>

                    <p>
                      This Restaurant Partner Agreement ("Agreement") is made
                      between you ("Partner") and QraveBites ("we", "us").
                    </p>

                    <h3 className="font-semibold">1. Partner Obligations</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>
                        Comply with all food safety and legal regulations.
                      </li>
                      <li>
                        Ensure timely fulfillment of orders with accurate menu
                        listings.
                      </li>
                      <li>
                        Provide current and valid documents (PAN, FSSAI, Bank
                        Details, etc.).
                      </li>
                    </ul>

                    <h3 className="font-semibold">2. Our Responsibilities</h3>
                    <p>
                      We will list your restaurant, process customer orders, and
                      remit payouts after deducting agreed commissions.
                    </p>

                    <h3 className="font-semibold">3. Payments & Commissions</h3>
                    <p>
                      You agree to the payout schedule and commission percentage
                      discussed during onboarding. Refunds/chargebacks are
                      adjusted in your statements.
                    </p>

                    <h3 className="font-semibold">4. Taxes</h3>
                    <p>
                      You are responsible for complying with GST, PAN, and all
                      applicable tax filings.
                    </p>

                    <h3 className="font-semibold">5. Termination</h3>
                    <p>
                      Either party may terminate this agreement with 15 days'
                      written notice. Breaches may result in immediate
                      suspension.
                    </p>

                    <h3 className="font-semibold">6. Privacy Policy</h3>
                    <p>
                      We collect your business info (contact, PAN, GST, bank
                      info, etc.) for onboarding and order fulfillment. Data is
                      stored securely and may be shared with government or third
                      parties only as required.
                    </p>

                    <h3 className="font-semibold">7. Confidentiality</h3>
                    <p>
                      You agree not to disclose any non-public information
                      including platform terms, pricing, or technology.
                    </p>

                    <h3 className="font-semibold">8. Dispute Resolution</h3>
                    <p>
                      Disputes will be resolved through arbitration in your
                      local jurisdiction. Indian law shall govern the Agreement.
                    </p>

                    <h3 className="font-semibold">9. Consent</h3>
                    <p>
                      By accepting, you confirm that you are authorized to bind
                      your business and agree to QraveBites’ terms and privacy
                      policy.
                    </p>
                  </CardContent>
                </ScrollArea>
              </Card>

              {/* Agreement Checkbox */}
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
                    <FormLabel
                      htmlFor="agreement"
                      className="text-sm font-medium"
                    >
                      I have read and agree to the Partner Agreement
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
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
            </section>
          </div>
        </form>
      </Form>
    </div>
  );
}
