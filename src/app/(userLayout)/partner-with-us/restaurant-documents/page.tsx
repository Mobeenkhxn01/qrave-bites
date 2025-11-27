"use client";

import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ImageInput } from "@/components/ui/image-input";
import Right from "@/components/icons/Right";
import TitleHeaderPartner from "../titleheader";

const formSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100),
    panNumber: z
      .string()
      .length(10, "PAN number must be exactly 10 characters")
      .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/),
    restaurantAddress: z
      .string()
      .min(5)
      .max(500),
    accountNumber: z
      .string()
      .min(9)
      .max(18)
      .regex(/^\d+$/),
    confirmAccountNumber: z
      .string()
      .min(9)
      .max(18),
    ifscCode: z
      .string()
      .length(11)
      .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/),
    panImage: z.instanceof(File).optional(),
    upiId: z
      .string()
      .regex(/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,20}$/)
      .optional()
      .or(z.literal("")),
    accountType: z.enum(["SAVINGS", "CURRENT"]),
  })
  .refine((data) => data.accountNumber === data.confirmAccountNumber, {
    path: ["confirmAccountNumber"],
    message: "Account numbers do not match",
  });

type FormData = z.infer<typeof formSchema>;

export default function Step3Documents() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const userEmail = session?.user?.email || "";

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      panNumber: "",
      restaurantAddress: "",
      accountNumber: "",
      confirmAccountNumber: "",
      ifscCode: "",
      upiId: "",
      accountType: undefined,
    },
  });

  useEffect(() => {
    if (!userEmail) return;
    const load = async () => {
      try {
        const res = await axios.get(`/api/restaurant/step3?email=${userEmail}`);
        if (res.data.success) {
          const d = res.data.data;
          form.setValue("fullName", d.fullName);
          form.setValue("panNumber", d.panNumber);
          form.setValue("restaurantAddress", d.restaurantAddress);
          form.setValue("accountNumber", d.accountNumber);
          form.setValue("confirmAccountNumber", d.accountNumber);
          form.setValue("ifscCode", d.ifscCode);
          form.setValue("upiId", d.upiId || "");
          form.setValue("accountType", d.accountType);
          toast.success("Existing Step 3 data loaded");
        }
      } catch {}
    };
    if (status === "authenticated") load();
  }, [status, userEmail]);

  async function uploadImage(file: File): Promise<string | null> {
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await axios.post("/api/upload", fd);
      return res.data.url;
    } catch {
      toast.error("Image upload failed");
      return null;
    }
  }

  const onSubmit = async (values: FormData) => {
    if (!userEmail) {
      toast.error("User email not found");
      return;
    }

    let panImageUrl = null;
    if (values.panImage) {
      panImageUrl = await uploadImage(values.panImage);
      if (!panImageUrl) return;
    }

    const payload = {
      ...values,
      email: userEmail,
      panImage: panImageUrl || null,
      upiId: values.upiId || null,
    };

    startTransition(() => {
      setLoading(true);
      axios
        .post("/api/restaurant/step3", payload)
        .then((res) => {
          if (res.data.success) {
            toast.success(res.data.message || "Step 3 saved successfully");
            router.push("/partner-with-us/partner-contract");
          } else {
            toast.error(res.data.message);
          }
        })
        .catch((err) => {
          if (err.response?.data?.errors) {
            err.response.data.errors.forEach((e: any) =>
              toast.error(`${e.field}: ${e.message}`)
            );
          } else {
            toast.error("Something went wrong");
          }
        })
        .finally(() => setLoading(false));
    });
  };

  if (status === "loading")
    return <div className="flex justify-center p-10">Loading...</div>;

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className="px-4 md:px-6 lg:px-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="block lg:hidden">
            <div className="w-full p-6 flex justify-center mb-8">
              <TitleHeaderPartner activeStep={3} />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="hidden lg:block w-1/3 p-12">
              <TitleHeaderPartner activeStep={3} />
            </aside>

            <section className="w-full lg:w-2/3 lg:pr-20 space-y-6">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">Restaurant Documents</h1>

              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Owner Details</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner Full Name *</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-10 md:h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="restaurantAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Restaurant Address *</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-10 md:h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">PAN Card Details</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="panNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PAN Number *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            maxLength={10}
                            className="h-10 md:h-12 uppercase"
                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="panImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PAN Card Image *</FormLabel>
                        <FormControl>
                          <ImageInput
                            id="panImage"
                            name="panImage"
                            onChange={(file) => field.onChange(file)}
                            maxSizeMB={5}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Bank Account Details</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="accountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Type *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-10 md:h-12">
                              <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="SAVINGS">Savings</SelectItem>
                            <SelectItem value="CURRENT">Current</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number *</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-10 md:h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmAccountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Account Number *</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-10 md:h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ifscCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IFSC Code *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            maxLength={11}
                            className="h-10 md:h-12 uppercase"
                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="upiId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>UPI ID (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-10 md:h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-center md:justify-end">
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading || isPending}
                  className="rounded-2xl bg-[#4947e0] text-white hover:bg-[#3a38c7] w-full md:w-auto flex items-center justify-center"
                >
                  {loading || isPending ? "Processing..." : "Next"}
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
